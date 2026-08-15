# AI Business Operations Management Platform

## Employee Management Module

The **AI Business Operations Management Platform** is a web-based application designed to help organizations manage employees, projects, tasks, budgets, expenses, and business operations from a centralized platform.

This repository currently contains the **Employee Management Module**, one of the core modules of the complete platform.

The Employee Management module manages employee information, skills, workload, availability, and task allocation.

---

## 1. Employee Management Module

The module provides:

- Employee profile management
- Employee skills management
- Employee workload tracking
- Employee availability management
- Task management
- Task allocation
- Employee scoring
- Django Admin management
- MySQL database integration
- Task allocation API

---

## 2. Features

### Employee Profiles

The system stores:

- Employee ID
- Name
- Email
- Department
- Role
- Experience

### Skills Management

Employees can have multiple skills, such as:

- Python
- SQL
- Django
- Machine Learning
- NLP
- Computer Vision
- Data Analysis
- Deep Learning

The system uses employee skills when recommending employees for tasks.

### Workload Management

Each employee has a workload percentage.

Example:

```text
Employee: Vivek Raj
Workload: 0%
```

The allocation system prefers employees with lower workloads when multiple employees match a task.

### Employee Availability

Employees have an availability status:

```text
Available
Busy
On Leave
```

Only employees marked as `Available` are considered for task allocation.

### Task Management

Tasks contain:

- Task title
- Task description
- Required skill
- Priority

---

## 3. Task Allocation

The module recommends the most suitable employee for a task.

The process is:

```text
Task
  ↓
Required Skill
  ↓
Employee Skill Match
  ↓
Availability
  ↓
Workload
  ↓
Experience
  ↓
Employee Score
  ↓
Recommended Employee
```

The allocation logic considers:

1. Required skill
2. Availability
3. Workload
4. Experience

---

## 4. Technology Stack

### Backend

- Python
- Django 5.1.15

### Database

- MySQL 8.0
- MySQL Workbench

### Development Tools

- Visual Studio Code
- PowerShell
- Git
- GitHub

### Python Version

```text
Python 3.13.7
```

---

## 5. Project Structure

```text
employee-management/
│
├── employee_system/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── employees/
│   ├── migrations/
│   │   ├── 0001_initial.py
│   │   ├── 0002_skill.py
│   │   ├── 0003_employee_skills.py
│   │   ├── 0004_employee_active_tasks_employee_workload_percentage.py
│   │   ├── 0005_employee_availability_status_and_more.py
│   │   ├── 0006_task.py
│   │   └── __init__.py
│   │
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── services.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
│
├── .gitignore
├── manage.py
└── README.md
```

---

## 6. Database Setup

The application uses MySQL.

Database name:

```text
employee_management
```

Database configuration:

```text
Host: localhost
Port: 3306
User: root
```

Create the database in MySQL Workbench:

```sql
CREATE DATABASE employee_management;
```

The database password is stored in `.env` and is not committed to GitHub.

---

## 7. Environment Variables

Create a file named:

```text
.env
```

in the project root:

```text
employee-management/
```

Add:

```env
DB_NAME=employee_management
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_HOST=localhost
DB_PORT=3306
```

Replace `YOUR_MYSQL_PASSWORD` with your local MySQL password.

**Never commit `.env` to GitHub.**

---

## 8. Python Virtual Environment

Create the virtual environment:

```powershell
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

---

## 9. Install Dependencies

Install Django:

```powershell
pip install django
```

Install MySQL connector:

```powershell
pip install mysqlclient
```

Install environment variable support:

```powershell
pip install python-dotenv
```

---

## 10. Django Configuration

The database configuration is stored in:

```text
employee_system/settings.py
```

The application loads database credentials from `.env` using `python-dotenv`.

Example:

```python
from dotenv import load_dotenv
import os

load_dotenv()

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}
```

---

## 11. Django Migrations

Create migrations after model changes:

```powershell
python manage.py makemigrations employees
```

Apply migrations:

```powershell
python manage.py migrate
```

Check migration status:

```powershell
python manage.py showmigrations
```

Current Employee migrations:

```text
0001_initial
0002_skill
0003_employee_skills
0004_employee_active_tasks_employee_workload_percentage
0005_employee_availability_status_and_more
0006_task
```

All current migrations have been successfully applied.

---

## 12. Django Admin

Create a superuser:

```powershell
python manage.py createsuperuser
```

Start the server:

```powershell
python manage.py runserver
```

Open:

```text
http://127.0.0.1:8000/admin/
```

The admin panel provides:

- Employees
- Skills
- Tasks
- Users
- Groups

---

## 13. Current Test Data

The current database contains:

```text
5 Employees
10 Tasks
```

Employee records include:

- Employee ID
- Name
- Email
- Department
- Role
- Experience
- Skills
- Active Tasks
- Workload Percentage
- Availability Status

Tasks include:

- Title
- Description
- Required Skill
- Priority

---

## 14. Task Allocation Service

The main allocation logic is located at:

```text
employees/services.py
```

Main function:

```python
recommend_employee(task_id)
```

Example:

```python
from employees.services import recommend_employee

employee = recommend_employee(4)

print(employee)
```

Example result:

```text
EMP005 - Vivek Raj
```

---

## 15. Task Allocation API

API endpoint:

```text
GET /employees/allocate/<task_id>/
```

Example:

```text
http://127.0.0.1:8000/employees/allocate/4/
```

Example response:

```json
{
    "task_id": 4,
    "recommended_employee": "Vivek Raj",
    "employee_id": "EMP005",
    "workload_percentage": 0,
    "availability": "Available"
}
```

---

## 16. URL Configuration

Main project URL configuration:

```text
employee_system/urls.py
```

Employee URLs are included under:

```text
employees/
```

Allocation URL:

```text
employees/allocate/<task_id>/
```

---

## 17. Testing and Verification

The following tests were completed successfully.

### Django System Check

Command:

```powershell
python manage.py check
```

Result:

```text
System check identified no issues (0 silenced).
```

### Migration Check

Command:

```powershell
python manage.py showmigrations
```

All required migrations show:

```text
[X]
```

### Django Admin Test

Verified:

```text
http://127.0.0.1:8000/admin/
```

The following were available:

```text
Employees
Skills
Tasks
```

### API Test

Tested:

```text
http://127.0.0.1:8000/employees/allocate/4/
```

Successful response:

```json
{
    "task_id": 4,
    "recommended_employee": "Vivek Raj",
    "employee_id": "EMP005",
    "workload_percentage": 0,
    "availability": "Available"
}
```

### MySQL Test

Employee data was verified using:

```sql
SELECT * FROM employee_management.employees_employee;
```

Task data was verified using:

```sql
SELECT * FROM employee_management.employees_task;
```

Verified data:

```text
5 Employees
10 Tasks
```

---

## 18. Security

The following files are excluded from GitHub:

```text
.env
venv/
db.sqlite3
__pycache__/
*.pyc
*.log
.vscode/
.idea/
```

The `.gitignore` file is included in the repository.

The MySQL password must never be committed to GitHub.

---

## 19. Git Workflow

Initialize Git:

```powershell
git init
```

Check status:

```powershell
git status
```

Add files:

```powershell
git add .
```

Commit:

```powershell
git commit -m "Complete Employee Management module"
```

Connect GitHub:

```powershell
git remote add origin <GITHUB_REPOSITORY_URL>
```

Push:

```powershell
git push -u origin master
```

For future changes:

```powershell
git add .
git commit -m "Describe your changes"
git push
```

---

## 20. Team Integration

This Employee Management module is one part of the complete:

```text
AI Business Operations Management Platform
```

The final platform can combine:

```text
AI Business Operations Management Platform
│
├── Employee Management
├── Project Management
├── Finance / Budget Management
└── AI / Agentic AI
```

The Employee Management module is designed to integrate with the other modules through Django URLs/APIs and the shared project structure.

---

## 21. Future AI / Agentic AI Integration

The current module provides the foundation for intelligent employee-task allocation.

Future AI integration can use:

- Employee skills
- Employee experience
- Employee workload
- Employee availability
- Task priority
- Task requirements
- Historical task performance

The Agentic AI layer can later provide:

- Intelligent task assignment
- Employee recommendations
- Workload balancing
- Automated decision support
- Natural-language management queries
- Automated business recommendations

The Agentic AI layer will be integrated after the individual team modules are combined.

---

## 22. Current Module Status

```text
Employee Profiles        ✅
Skills Management        ✅
Workload Management      ✅
Availability Management  ✅
Task Management          ✅
Task Allocation Logic    ✅
Employee Scoring         ✅
Django API               ✅
Django Admin             ✅
MySQL Integration        ✅
Environment Variables    ✅
Git/GitHub Integration   ✅
System Check              ✅
```

---

## 23. Final Verification

Before integration with the other team modules, verify:

```powershell
python manage.py check
python manage.py showmigrations
git status
```

Expected Django result:

```text
System check identified no issues (0 silenced).
```

Expected Git result after committing:

```text
nothing to commit, working tree clean
```

---

## 24. Team Handoff

The Employee Management module is completed and pushed to GitHub.

The module is ready for:

1. Team review
2. Integration with other modules
3. Shared database/API integration
4. Final Agentic AI integration
5. End-to-end platform testing

---

## 25. Developer

**Module:** Employee Management

**Project:** AI Business Operations Management Platform

Author: Rajesh
