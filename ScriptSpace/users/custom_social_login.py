from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.models import SocialAccount, SocialApp
from allauth.socialaccount.helpers import complete_social_login
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from allauth.socialaccount.providers import registry
from django.conf import settings
import requests

class AccessToken:
    def __init__(self, token):
        self.token = token

class CustomSocialLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        provider = request.data.get('provider')
        access_token = request.data.get('access_token')
        if not provider or not access_token:
            return Response({'error': 'provider and access_token required'}, status=400)
        if provider == 'google':
            adapter_class = GoogleOAuth2Adapter
            user_info_url = 'https://www.googleapis.com/oauth2/v1/userinfo'
            user_info_response = requests.get(user_info_url, headers={'Authorization': f'Bearer {access_token}'})
        elif provider == 'github':
            adapter_class = GitHubOAuth2Adapter
            user_info_url = 'https://api.github.com/user'
            user_info_response = requests.get(user_info_url, params={'access_token': access_token})
        else:
            return Response({'error': 'Unsupported provider'}, status=400)
        adapter = adapter_class(request)
        app = SocialApp.objects.get(provider=provider, sites__id=settings.SITE_ID)
        callback_url = ""  # Not needed for REST token exchange
        client = OAuth2Client(request, app.client_id, app.secret, adapter.access_token_method, adapter.access_token_url, callback_url)
        token = {'access_token': access_token}
        user_info_data = user_info_response.json()
        access_token_obj = AccessToken(access_token)
        login_token = adapter.complete_login(request, app, access_token_obj, response=user_info_data)
        login_token.token = token
        login_token.state = {}
        complete_social_login(request, login_token)
        user = login_token.user
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        })
