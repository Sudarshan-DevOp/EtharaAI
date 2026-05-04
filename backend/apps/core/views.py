from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from .models import User, Team
from .serializers import UserSerializer, UserCreateSerializer, LoginSerializer, TeamSerializer, TeamCreateSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """User registration endpoint."""
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """User login endpoint."""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=HTTP_200_OK)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """User logout endpoint."""
    request.user.auth_token.delete()
    return Response({'detail': 'Logged out successfully'}, status=HTTP_200_OK)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    """Get or update user profile."""
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users_list(request):
    """Get all users for autocomplete/suggestions."""
    query = request.query_params.get('search', '')
    users = User.objects.all()
    if query:
        users = users.filter(email__icontains=query) | users.filter(username__icontains=query) | users.filter(first_name__icontains=query)
    
    # Return limited fields to avoid exposing too much
    data = [{'id': u.id, 'email': u.email, 'name': u.get_full_name() or u.username} for u in users[:20]]
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teams_list(request):
    """Get all teams for the user."""
    teams = Team.objects.filter(owner=request.user) | Team.objects.filter(members=request.user)
    teams = teams.distinct()
    serializer = TeamSerializer(teams, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def team_create(request):
    """Create a new team (Admins only)."""
    if not request.user.is_admin:
        return Response(
            {'detail': 'Only administrators can create teams.'}, 
            status=403
        )
        
    serializer = TeamCreateSerializer(data=request.data)
    if serializer.is_valid():
        team = serializer.save(owner=request.user)
        return Response(TeamSerializer(team).data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def team_detail(request, pk):
    """Get, update, or delete a team."""
    try:
        team = Team.objects.get(pk=pk)
    except Team.DoesNotExist:
        return Response({'detail': 'Team not found.'}, status=404)
    
    # Check if user is owner
    if team.owner != request.user:
        return Response({'detail': 'You do not have permission to access this team.'}, status=403)
    
    if request.method == 'GET':
        serializer = TeamSerializer(team)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = TeamCreateSerializer(team, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(TeamSerializer(team).data)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        team.delete()
        return Response({'detail': 'Team deleted successfully.'}, status=HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_team_member(request, pk):
    """Add a member to a team."""
    try:
        team = Team.objects.get(pk=pk)
    except Team.DoesNotExist:
        return Response({'detail': 'Team not found.'}, status=404)
    
    # Check if user is owner
    if team.owner != request.user:
        return Response({'detail': 'You do not have permission to modify this team.'}, status=403)
    
    user_id = request.data.get('user_id')
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=404)
    
    team.members.add(user)
    return Response(TeamSerializer(team).data, status=HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_team_member(request, pk):
    """Remove a member from a team."""
    try:
        team = Team.objects.get(pk=pk)
    except Team.DoesNotExist:
        return Response({'detail': 'Team not found.'}, status=404)
    
    # Check if user is owner
    if team.owner != request.user:
        return Response({'detail': 'You do not have permission to modify this team.'}, status=403)
    
    user_id = request.data.get('user_id')
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=404)
    
    team.members.remove(user)
    return Response(TeamSerializer(team).data, status=HTTP_200_OK)
