from django.urls import path
from .views import CodeExecutionView, code_runner_page

urlpatterns = [
    path('execute/', CodeExecutionView.as_view(), name='code-execute'),
    path('runner/', code_runner_page, name='code-runner-page'),
]
