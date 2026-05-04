from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('users/', views.users_list, name='users-list'),
    path('teams/', views.teams_list, name='teams-list'),
    path('teams/create/', views.team_create, name='team-create'),
    path('teams/<int:pk>/', views.team_detail, name='team-detail'),
    path('teams/<int:pk>/members/add/', views.add_team_member, name='add-team-member'),
    path('teams/<int:pk>/members/remove/', views.remove_team_member, name='remove-team-member'),
]
