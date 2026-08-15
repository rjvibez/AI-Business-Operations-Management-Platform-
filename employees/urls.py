from django.urls import path
from .views import allocate_task

urlpatterns = [
    path('allocate/<int:task_id>/', allocate_task, name='allocate_task'),
]