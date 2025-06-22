from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import CodeExecutionSerializer
from .docker_runner import run_code
from drf_spectacular.utils import extend_schema

# Create your views here.

@extend_schema(
    tags=["Code Execution"],
    summary="Execute code in a secure Docker environment",
    description="Run code in Python, C++, JavaScript, or Java with optional input. Returns output and errors."
)
class CodeExecutionView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CodeExecutionSerializer
    
    def post(self, request):
        serializer = CodeExecutionSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            language = serializer.validated_data['language']
            input_data = serializer.validated_data.get('input', None)
            result = run_code(code, language, input_data)
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def code_runner_page(request):
    return render(request, 'code_runner.html')
