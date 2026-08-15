from django.db import models


class Employee(models.Model):
    employee_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    experience_years = models.PositiveIntegerField(default=0)

    skills = models.ManyToManyField('Skill', blank=True)

    active_tasks = models.PositiveIntegerField(default=0)
    workload_percentage = models.PositiveIntegerField(default=0)

    availability_status = models.CharField(
        max_length=20,
        choices=[
            ('Available', 'Available'),
            ('Busy', 'Busy'),
            ('On Leave', 'On Leave'),
        ],
        default='Available'
    )

    available_hours = models.PositiveIntegerField(default=8)

    def __str__(self):
        return f"{self.employee_id} - {self.name}"


class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    required_skill = models.CharField(max_length=100)
    priority = models.CharField(
        max_length=20,
        choices=[
            ('Low', 'Low'),
            ('Medium', 'Medium'),
            ('High', 'High'),
        ],
        default='Medium'
    )

    def __str__(self):
        return self.title

    def __str__(self):
        return self.title

    