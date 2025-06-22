from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Project, File
from .serializers import ProjectSerializer, FileSerializer, RunSavedFileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from executor.docker_runner import run_code
from rest_framework import serializers
from drf_spectacular.utils import extend_schema

# Create your views here.

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        if hasattr(obj, 'project'):
            return obj.project.owner == request.user
        return False
    def has_permission(self, request, view):
        return True

@extend_schema(tags=["Projects"], summary="List and create projects", description="List all projects for the authenticated user or create a new project.")
class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user)
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

@extend_schema(tags=["Projects"], summary="Retrieve, update, or delete a project", description="Retrieve, update, or delete a specific project owned by the user.")
class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    queryset = Project.objects.all()
    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj

@extend_schema(tags=["Files"], summary="List and create files", description="List all files in the user's projects or create a new file.")
class FileListCreateView(generics.ListCreateAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    def get_queryset(self):
        queryset = File.objects.filter(project__owner=self.request.user)
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset
    def perform_create(self, serializer):
        # Only allow creating files for projects owned by the user
        project = serializer.validated_data['project']
        if project.owner != self.request.user:
            raise permissions.PermissionDenied('Not your project')
        serializer.save()

@extend_schema(tags=["Files"], summary="Retrieve, update, or delete a file", description="Retrieve, update, or delete a specific file in a project.")
class FileDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    queryset = File.objects.all()
    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj

@extend_schema(tags=["Code Execution"], summary="Run saved file", description="Execute the code of a saved file in a secure Docker environment.")
class RunSavedFileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RunSavedFileSerializer
    def post(self, request):
        serializer = RunSavedFileSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        file_id = serializer.validated_data['file_id']
        try:
            file = File.objects.get(pk=file_id, project__owner=request.user)
        except File.DoesNotExist:
            return Response({'error': 'File not found or forbidden'}, status=status.HTTP_404_NOT_FOUND)
        result = run_code(file.content, file.language)
        return Response(result, status=status.HTTP_200_OK)
