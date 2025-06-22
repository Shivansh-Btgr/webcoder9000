from django.urls import path
from .views import (
    ProjectListCreateView, ProjectDetailView,
    FileListCreateView, FileDetailView,
    RunSavedFileView
)

urlpatterns = [
    path('projects/', ProjectListCreateView.as_view(), name='project-list-create'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('files/', FileListCreateView.as_view(), name='file-list-create'),
    path('files/<int:pk>/', FileDetailView.as_view(), name='file-detail'),
    path('run-file/', RunSavedFileView.as_view(), name='run-saved-file'),
]
