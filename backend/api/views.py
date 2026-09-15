from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Employee, Finance, Project
from .recommendation import recommend_task_from_csv
from .serializers import (
    EmployeeSerializer,
    FinanceSerializer,
    ProjectSerializer,
    TaskCompletionPredictionSerializer,
)
from .task_prediction import predict_completion_hours


DATASET_PATH = __import__('pathlib').Path(__file__).resolve().parents[2] / 'datasets' / 'cleaned' / 'Business_Operation_ml_ready.csv'


def health_check(request):
    return JsonResponse({'status': 'ok'})


class EmployeeListCreateView(generics.ListCreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class EmployeeDetailView(generics.RetrieveUpdateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    lookup_field = 'employee_id'


class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProjectDetailView(generics.RetrieveUpdateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = 'project_id'


class FinanceListCreateView(generics.ListCreateAPIView):
    serializer_class = FinanceSerializer

    def get_queryset(self):
        try:
            return Finance.objects.all()
        except Exception:
            return Finance.objects.none()


class FinanceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FinanceSerializer
    lookup_field = 'finance_id'

    def get_queryset(self):
        try:
            return Finance.objects.all()
        except Exception:
            return Finance.objects.none()


class RecommendationListView(APIView):
    def get(self, request):
        try:
            top_n = int(request.query_params.get('top_n', 5))
            task = {
                'required_skill': request.query_params.get('required_skill'),
                'department': request.query_params.get('department'),
                'task_priority': request.query_params.get('task_priority'),
            }
            recommendations = recommend_task_from_csv(DATASET_PATH, task, top_n=top_n)
        except (TypeError, ValueError) as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except FileNotFoundError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response(recommendations.to_dict(orient='records'))


class TaskCompletionPredictionView(APIView):
    def post(self, request):
        serializer = TaskCompletionPredictionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            predicted_hours = predict_completion_hours(serializer.validated_data)
        except FileNotFoundError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'predicted_hours': predicted_hours,
            'input_parameters': serializer.validated_data,
        })

