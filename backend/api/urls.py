from django.urls import path

from .views import (
    EmployeeDetailView,
    EmployeeListCreateView,
    FinanceDetailView,
    FinanceListCreateView,
    ProjectDetailView,
    ProjectListCreateView,
    RecommendationListView,
    TaskCompletionPredictionView,
    health_check,
)

urlpatterns = [
    path('health/', health_check, name='health'),
    path('employees/', EmployeeListCreateView.as_view(), name='employee-list-create'),
    path('employees/<str:employee_id>/', EmployeeDetailView.as_view(), name='employee-detail'),
    path('projects/', ProjectListCreateView.as_view(), name='project-list-create'),
    path('projects/<str:project_id>/', ProjectDetailView.as_view(), name='project-detail'),
    path('finance/', FinanceListCreateView.as_view(), name='finance-list-create'),
    path('finance/<str:finance_id>/', FinanceDetailView.as_view(), name='finance-detail'),
    path('recommendations/', RecommendationListView.as_view(), name='recommendation-list'),
    path('ml/task-completion/', TaskCompletionPredictionView.as_view(), name='task-completion-prediction'),
]

