from django.core.mail import send_mail
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.models import User
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiParameter

from .serializers import (
    RegisterSerializer, CurrentUserSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    UserUpdateSerializer, ChangePasswordSerializer
)

# Create your views here.

@extend_schema(tags=["Authentication"], summary="Register a new user", description="Create a new user account.")
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

@extend_schema(tags=["Authentication"], summary="Logout user", description="Blacklist a refresh token to log out the user.")
class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = None  # No request body schema, but needed for drf-spectacular

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=["User"], summary="Get current user", description="Retrieve the currently authenticated user's details.")
class CurrentUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CurrentUserSerializer

    def get(self, request):
        serializer = CurrentUserSerializer(request.user)
        return Response(serializer.data)

@extend_schema(tags=["Password Reset"], summary="Request password reset", description="Request a password reset email for a user.")
class PasswordResetRequestView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PasswordResetRequestSerializer
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'detail': 'If the email exists, a reset link will be sent.'}, status=status.HTTP_200_OK)
            token = PasswordResetTokenGenerator().make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_link = f"http://localhost:5173/reset-password?uid={uid}&token={token}"
            send_mail(
                'Password Reset Request',
                f'Click the link to reset your password: {reset_link}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            return Response({'detail': 'If the email exists, a reset link will be sent.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=["Password Reset"], summary="Confirm password reset", description="Reset the user's password using the token sent by email.")
class PasswordResetConfirmView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PasswordResetConfirmSerializer
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            uid = serializer.validated_data['uid']
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']
            try:
                uid_int = force_str(urlsafe_base64_decode(uid))
                user = User.objects.get(pk=uid_int)
            except (User.DoesNotExist, ValueError, TypeError):
                return Response({'detail': 'Invalid link.'}, status=status.HTTP_400_BAD_REQUEST)
            if PasswordResetTokenGenerator().check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response({'detail': 'Password has been reset.'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=["User"], summary="Update current user profile", description="Update the authenticated user's profile information (username, email, first_name, last_name).")
class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

@extend_schema(tags=["Password Reset"], summary="Change password", description="Change the current user's password (JWT required)")
class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChangePasswordSerializer
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({'old_password': 'Wrong password.'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({'detail': 'Password changed successfully.'}, status=status.HTTP_200_OK)
