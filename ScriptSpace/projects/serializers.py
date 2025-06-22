from rest_framework import serializers
from .models import Project, File

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'owner', 'created_at']
        read_only_fields = ['id', 'owner', 'created_at']

class FileSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(queryset=File._meta.get_field('project').related_model.objects.all(), required=False)
    class Meta:
        model = File
        fields = ['id', 'project', 'filename', 'content', 'language', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class RunSavedFileSerializer(serializers.Serializer):
    file_id = serializers.IntegerField()
