from django.http import JsonResponse
from .services import recommend_employee


def allocate_task(request, task_id):
    employee = recommend_employee(task_id)

    if employee is None:
        return JsonResponse({
            "message": "No suitable employee found"
        })

    return JsonResponse({
        "task_id": task_id,
        "recommended_employee": employee.name,
        "employee_id": employee.employee_id,
        "workload_percentage": employee.workload_percentage,
        "availability": employee.availability_status
    })