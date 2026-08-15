from .models import Employee, Task


def recommend_employee(task_id):
    task = Task.objects.get(id=task_id)

    employees = Employee.objects.filter(
        skills__name__iexact=task.required_skill,
        availability_status='Available'
    ).distinct()

    if not employees.exists():
        return None

    best_employee = None
    best_score = -1

    for employee in employees:

        skill_score = 50

        workload_score = 30 - (
            employee.workload_percentage * 30 / 100
        )

        experience_score = min(
            employee.experience_years * 2,
            20
        )

        total_score = (
            skill_score
            + workload_score
            + experience_score
        )

        if total_score > best_score:
            best_score = total_score
            best_employee = employee

    return best_employee