from django.shortcuts import render, get_object_or_404
from rest_framework import generics, permissions
from .models import Project, File
from .serializers import ProjectSerializer, FileSerializer, RunSavedFileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from executor.docker_runner import run_code
from rest_framework import serializers
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiParameter

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
        input_data = serializer.validated_data.get('input', "")
        try:
            file = File.objects.get(pk=file_id, project__owner=request.user)
        except File.DoesNotExist:
            return Response({'error': 'File not found or forbidden'}, status=status.HTTP_404_NOT_FOUND)
        result = run_code(file.content, file.language, input_data)
        return Response(result, status=status.HTTP_200_OK)

@extend_schema(tags=["Files"], summary="Generate shareable link for a file", description="Generate or retrieve a shareable link (UUID) for a file you own.")
class FileShareLinkView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    def post(self, request, pk):
        file = get_object_or_404(File, pk=pk, project__owner=request.user)
        share_uuid = file.generate_share_uuid()
        return Response({"share_uuid": str(share_uuid)}, status=200)

@extend_schema(
    tags=["Files"],
    summary="Import a shared file by share link",
    description="Given a share_uuid and a project ID, copy the shared file into the user's project. Returns the new file info.",
    parameters=[OpenApiParameter("share_uuid", str, OpenApiParameter.QUERY, required=True), OpenApiParameter("project", int, OpenApiParameter.QUERY, required=True)]
)
class ImportSharedFileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        share_uuid = request.query_params.get("share_uuid")
        project_id = request.query_params.get("project")
        if not share_uuid or not project_id:
            return Response({"error": "share_uuid and project are required"}, status=400)
        file = get_object_or_404(File, share_uuid=share_uuid)
        project = get_object_or_404(Project, pk=project_id, owner=request.user)
        new_file = File.objects.create(
            project=project,
            filename=file.filename,
            content=file.content,
            language=file.language
        )
        serializer = FileSerializer(new_file)
        return Response(serializer.data, status=201)
