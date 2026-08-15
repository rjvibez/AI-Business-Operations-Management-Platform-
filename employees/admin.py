from django.contrib import admin
from .models import Employee, Skill, Task



@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        'employee_id',
        'name',
        'department',
        'role',
        'active_tasks',
        'workload_percentage',
        'availability_status',
        'available_hours',
    )

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'required_skill',
        'priority',
    )