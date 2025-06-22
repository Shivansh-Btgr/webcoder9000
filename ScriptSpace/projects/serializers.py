from rest_framework import serializers
from .models import Project, File

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'owner', 'created_at']
        read_only_fields = ['id', 'owner', 'created_at']

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'project', 'filename', 'content', 'language', 'created_at', 'updated_at']
        read_only_fields = ['id', 'project', 'created_at', 'updated_at']

class RunSavedFileSerializer(serializers.Serializer):
    file_id = serializers.IntegerField()
