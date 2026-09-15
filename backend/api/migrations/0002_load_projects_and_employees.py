import csv
import logging
from pathlib import Path
from django.db import migrations

logger = logging.getLogger(__name__)


def load_projects_and_employees(apps, schema_editor):
    Project = apps.get_model('api', 'Project')
    Employee = apps.get_model('api', 'Employee')

    # Locate the project root where datasets/ directory lives
    possible_roots = [
        Path(__file__).resolve().parents[2],
        Path(__file__).resolve().parents[3],
        Path.cwd(),
        Path.cwd().parent,
    ]

    root_dir = None
    for r in possible_roots:
        if (r / 'datasets' / 'Projects_FINAL.csv').exists():
            root_dir = r
            break

    if not root_dir:
        logger.warning("Datasets directory could not be located. Data migration skipped.")
        return

    # 1. Load Projects (Target: exactly 10,000 records from datasets/Projects_FINAL.csv)
    if Project.objects.count() < 10000:
        projects_csv = root_dir / 'datasets' / 'Projects_FINAL.csv'
        if projects_csv.exists():
            projects_to_create = []
            with open(projects_csv, mode='r', encoding='utf-8', errors='ignore') as f:
                reader = csv.DictReader(f)
                for count, row in enumerate(reader):
                    if count >= 10000:
                        break

                    pid = (row.get('project_id') or f"P{count+1:05d}").strip()
                    name = (row.get('project_name') or '').strip()[:150]
                    desc = (row.get('description') or '').strip()
                    start = (row.get('start_date') or '').strip() or None
                    deadline = (row.get('deadline') or '').strip() or None
                    status = (row.get('status') or '').strip()[:20]
                    risk = (row.get('risk_level') or '').strip()[:20]

                    projects_to_create.append(
                        Project(
                            project_id=pid,
                            project_name=name,
                            description=desc,
                            start_date=start,
                            deadline=deadline,
                            status=status,
                            risk_level=risk,
                        )
                    )

                    if len(projects_to_create) >= 2000:
                        Project.objects.bulk_create(projects_to_create, ignore_conflicts=True)
                        projects_to_create = []

            if projects_to_create:
                Project.objects.bulk_create(projects_to_create, ignore_conflicts=True)
            logger.info(f"Loaded {Project.objects.count()} projects into database.")

    # 2. Load Employees (Target: exactly 4,999 records from datasets/Employees_FINAL.csv)
    if Employee.objects.count() < 4999:
        employees_csv = root_dir / 'datasets' / 'Employees_FINAL.csv'
        if employees_csv.exists():
            employees_to_create = []
            with open(employees_csv, mode='r', encoding='utf-8', errors='ignore') as f:
                reader = csv.DictReader(f)
                for count, row in enumerate(reader):
                    if count >= 4999:
                        break

                    eid = (row.get('employee_id') or f"EMP{count+1:04d}").strip()
                    name = (row.get('employee_name') or '').strip()[:100]
                    email = (row.get('email') or '').strip()[:150]
                    dept = (row.get('department') or '').strip()[:50]
                    role = (row.get('job_role') or '').strip()[:50]

                    try:
                        exp = float(row.get('experience_years') or 0)
                    except Exception:
                        exp = 0.0

                    hire = (row.get('hire_date') or '').strip() or None
                    skills = (row.get('skills') or '').strip()
                    avail = (row.get('availability_status') or '').strip()[:20]

                    try:
                        workload = float(row.get('workload_percentage') or 0)
                    except Exception:
                        workload = 0.0

                    try:
                        tasks = int(float(row.get('active_tasks') or 0))
                    except Exception:
                        tasks = 0

                    try:
                        perf = float(row.get('performance_score') or 0)
                    except Exception:
                        perf = 0.0

                    employees_to_create.append(
                        Employee(
                            employee_id=eid,
                            employee_name=name,
                            email=email,
                            department=dept,
                            job_role=role,
                            experience_years=exp,
                            hire_date=hire,
                            skills=skills,
                            availability_status=avail,
                            workload_percentage=workload,
                            active_tasks=tasks,
                            performance_score=perf,
                        )
                    )

                    if len(employees_to_create) >= 2000:
                        Employee.objects.bulk_create(employees_to_create, ignore_conflicts=True)
                        employees_to_create = []

            if employees_to_create:
                Employee.objects.bulk_create(employees_to_create, ignore_conflicts=True)
            logger.info(f"Loaded {Employee.objects.count()} employees into database.")


def unload_projects_and_employees(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(load_projects_and_employees, reverse_code=unload_projects_and_employees),
    ]
