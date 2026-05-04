from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.permissions import IsAuthenticated
from apps.core.permissions import IsProjectMember
from .models import Project
from .serializers import ProjectSerializer, ProjectCreateUpdateSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def projects_list(request):
    """Get all projects for teams the user is part of."""
    user = request.user
    projects = Project.objects.filter(
        team__owner=user
    ) | Project.objects.filter(
        team__members=user
    )
    projects = projects.distinct()
    
    # Filter by status if provided
    status = request.query_params.get('status')
    if status:
        projects = projects.filter(status=status)
    
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def project_create(request):
    """Create a new project (Admins only)."""
    if not request.user.is_admin:
        return Response(
            {'detail': 'Only administrators can create projects.'}, 
            status=403
        )
        
    serializer = ProjectCreateUpdateSerializer(
        data=request.data,
        context={'request': request}
    )
    if serializer.is_valid():
        project = serializer.save(created_by=request.user)
        return Response(
            ProjectSerializer(project).data,
            status=HTTP_201_CREATED
        )
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, IsProjectMember])
def project_detail(request, pk):
    """Get, update, or delete a project."""
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return Response({'detail': 'Project not found.'}, status=404)
    
    # Check permission
    if request.method in ['PUT', 'DELETE']:
        if project.team.owner != request.user:
            return Response(
                {'detail': 'You do not have permission to modify this project.'},
                status=403
            )
    
    if request.method == 'GET':
        serializer = ProjectSerializer(project)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = ProjectCreateUpdateSerializer(
            project,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(ProjectSerializer(project).data)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        project.delete()
        return Response({'detail': 'Project deleted successfully.'}, status=HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_dashboard(request, pk):
    """Get project dashboard statistics."""
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return Response({'detail': 'Project not found.'}, status=404)
    
    # Check permission
    if project.team.owner != request.user and request.user not in project.team.members.all():
        return Response(
            {'detail': 'You do not have permission to access this project.'},
            status=403
        )
    
    tasks = project.tasks.all()
    
    return Response({
        'total_tasks': tasks.count(),
        'completed_tasks': tasks.filter(status='completed').count(),
        'in_progress_tasks': tasks.filter(status='in_progress').count(),
        'pending_tasks': tasks.filter(status='pending').count(),
        'overdue_tasks': tasks.filter(status__in=['pending', 'in_progress'], due_date__lt=__import__('django.utils.timezone', fromlist=['now']).now().date()).count(),
    })
