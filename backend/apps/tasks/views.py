from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from apps.core.permissions import IsProjectMember
from apps.projects.models import Project
from .models import Task, TaskComment
from .serializers import TaskSerializer, TaskCreateUpdateSerializer, TaskCommentSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tasks_list(request):
    """Get all tasks for projects the user is part of."""
    user = request.user
    
    # Get all projects user has access to
    accessible_projects = Project.objects.filter(
        team__owner=user
    ) | Project.objects.filter(
        team__members=user
    )
    
    # Get all tasks from accessible projects
    tasks = Task.objects.filter(project__in=accessible_projects)
    
    # Filter by project if provided
    project_id = request.query_params.get('project_id')
    if project_id:
        tasks = tasks.filter(project_id=project_id)
    
    # Filter by status if provided
    status = request.query_params.get('status')
    if status:
        tasks = tasks.filter(status=status)
    
    # Filter by assigned_to if provided
    assigned_to = request.query_params.get('assigned_to')
    if assigned_to:
        if assigned_to == 'me':
            tasks = tasks.filter(assigned_to=user)
        else:
            tasks = tasks.filter(assigned_to_id=assigned_to)
    
    # Filter by priority if provided
    priority = request.query_params.get('priority')
    if priority:
        tasks = tasks.filter(priority=priority)
    
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def task_create(request):
    """Create a new task."""
    serializer = TaskCreateUpdateSerializer(data=request.data)
    
    if serializer.is_valid():
        # Verify user has access to the project
        project_id = serializer.validated_data.get('project').id
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({'detail': 'Project not found.'}, status=404)
        
        if project.team.owner != request.user and request.user not in project.team.members.all():
            return Response(
                {'detail': 'You do not have permission to create tasks in this project.'},
                status=403
            )
        
        task = serializer.save(created_by=request.user)
        return Response(
            TaskSerializer(task).data,
            status=HTTP_201_CREATED
        )
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def task_detail(request, pk):
    """Get, update, or delete a task."""
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'detail': 'Task not found.'}, status=404)
    
    # Check permission
    project = task.project
    if project.team.owner != request.user and request.user not in project.team.members.all():
        return Response(
            {'detail': 'You do not have permission to access this task.'},
            status=403
        )
    
    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Only owners and admins can modify tasks
        if project.team.owner != request.user:
            return Response(
                {'detail': 'You do not have permission to modify this task.'},
                status=403
            )
        
        serializer = TaskCreateUpdateSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(TaskSerializer(task).data)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Only owners and admins can delete tasks
        if project.team.owner != request.user:
            return Response(
                {'detail': 'You do not have permission to delete this task.'},
                status=403
            )
        
        task.delete()
        return Response({'detail': 'Task deleted successfully.'}, status=HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def task_add_comment(request, pk):
    """Add a comment to a task."""
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'detail': 'Task not found.'}, status=404)
    
    # Check permission
    project = task.project
    if project.team.owner != request.user and request.user not in project.team.members.all():
        return Response(
            {'detail': 'You do not have permission to access this task.'},
            status=403
        )
    
    content = request.data.get('content')
    if not content:
        return Response(
            {'detail': 'Content is required.'},
            status=HTTP_400_BAD_REQUEST
        )
    
    comment = TaskComment.objects.create(
        task=task,
        user=request.user,
        content=content
    )
    
    serializer = TaskCommentSerializer(comment)
    return Response(serializer.data, status=HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_overview(request):
    """Get dashboard overview for authenticated user."""
    user = request.user
    
    # Get all accessible projects
    accessible_projects = Project.objects.filter(
        team__owner=user
    ) | Project.objects.filter(
        team__members=user
    )
    
    # Get all tasks from accessible projects
    tasks = Task.objects.filter(project__in=accessible_projects)
    
    # Calculate statistics
    today = timezone.now().date()
    
    stats = {
        'total_tasks': tasks.count(),
        'completed_tasks': tasks.filter(status='completed').count(),
        'in_progress_tasks': tasks.filter(status='in_progress').count(),
        'pending_tasks': tasks.filter(status='pending').count(),
        'overdue_tasks': tasks.filter(
            status__in=['pending', 'in_progress'],
            due_date__lt=today
        ).count(),
        'tasks_due_today': tasks.filter(
            status__in=['pending', 'in_progress'],
            due_date=today
        ).count(),
        'my_tasks': tasks.filter(assigned_to=user).count(),
        'my_completed_tasks': tasks.filter(assigned_to=user, status='completed').count(),
        'my_overdue_tasks': tasks.filter(
            assigned_to=user,
            status__in=['pending', 'in_progress'],
            due_date__lt=today
        ).count(),
        'my_in_progress_tasks': tasks.filter(
            assigned_to=user,
            status='in_progress'
        ).count(),
    }
    
    # Get top overdue tasks
    overdue_tasks = tasks.filter(
        status__in=['pending', 'in_progress'],
        due_date__lt=today
    ).order_by('due_date')[:5]
    
    stats['top_overdue_tasks'] = TaskSerializer(overdue_tasks, many=True).data
    
    # Get recently assigned tasks
    recent_tasks = tasks.filter(assigned_to=user).order_by('-created_at')[:5]
    stats['recent_tasks'] = TaskSerializer(recent_tasks, many=True).data
    
    return Response(stats)
