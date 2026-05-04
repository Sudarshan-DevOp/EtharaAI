from django.urls import path
from . import views

urlpatterns = [
    path('', views.projects_list, name='projects-list'),
    path('create/', views.project_create, name='project-create'),
    path('<int:pk>/', views.project_detail, name='project-detail'),
    path('<int:pk>/dashboard/', views.project_dashboard, name='project-dashboard'),
]
