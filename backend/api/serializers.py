import uuid
from rest_framework import serializers

from .models import Employee, Finance, Project


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            'employee_id',
            'employee_name',
            'email',
            'department',
            'job_role',
            'experience_years',
            'hire_date',
            'skills',
            'availability_status',
            'workload_percentage',
            'active_tasks',
            'performance_score',
        ]
        read_only_fields = ['employee_id']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'project_id',
            'project_name',
            'description',
            'start_date',
            'deadline',
            'status',
            'risk_level',
        ]
        read_only_fields = ['project_id']


class FinanceSerializer(serializers.ModelSerializer):
    finance_id = serializers.CharField(required=False)
    project_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Finance
        fields = [
            'finance_id',
            'project_id',
            'expense_type',
            'amount',
            'expense_date',
            'approval_status',
            'approved_by',
            'is_anomaly',
        ]

    def create(self, validated_data):
        if not validated_data.get('finance_id'):
            validated_data['finance_id'] = f"FIN{uuid.uuid4().hex[:6].upper()}"
        return super().create(validated_data)


class TaskCompletionPredictionSerializer(serializers.Serializer):
    estimated_hours = serializers.FloatField(default=10.0)
    experience_years = serializers.FloatField(default=5.0)
    allocation_score = serializers.FloatField(default=80.0)
    workload_percentage = serializers.FloatField(default=50.0)
    performance_score = serializers.FloatField(default=85.0)
    active_tasks = serializers.IntegerField(default=2)
    task_priority = serializers.CharField(default='Medium', required=False)
    duration_days = serializers.FloatField(default=14.0)

