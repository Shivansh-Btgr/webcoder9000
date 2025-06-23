from django.db import models
from django.contrib.auth.models import User
from uuid import uuid4

class Project(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.owner.username})"

class File(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='files')
    filename = models.CharField(max_length=255)
    content = models.TextField()
    language = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    share_uuid = models.UUIDField(null=True, blank=True, unique=True, default=None)

    def generate_share_uuid(self):
        if not self.share_uuid:
            self.share_uuid = uuid4()
            self.save(update_fields=["share_uuid"])
        return self.share_uuid

    def __str__(self):
        return f"{self.filename} in {self.project.name}"
