from django.urls import path
from . import views

urlpatterns = [
    path('', views.tasks_list, name='tasks-list'),
    path('create/', views.task_create, name='task-create'),
    path('<int:pk>/', views.task_detail, name='task-detail'),
    path('<int:pk>/comments/', views.task_add_comment, name='task-add-comment'),
    path('dashboard/', views.dashboard_overview, name='dashboard-overview'),
]
