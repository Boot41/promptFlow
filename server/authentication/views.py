from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from django.contrib.auth import authenticate
from .models import User

from .serializers import UserSerializer


# Generate JWT tokens for a user
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    
    if not serializer.is_valid():
        print("Validation Error:", serializer.errors)  # Debugging
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()
    tokens = get_tokens_for_user(user)

    return Response({
        "message": "User created successfully",
        "user": {"id": user.id, "username": user.username, "email": user.email},
        "tokens": tokens
    }, status=status.HTTP_201_CREATED)



@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get("email")  # Can be username or email
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email and password are required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    print(f"Login attempt for: {email}")

    # Try authenticating with username or email
    user = authenticate(username=email, password=password)

    if not user:
        print(f"Direct authentication failed for {email}. Checking if email exists in DB...")
        user = User.objects.filter(email=email).first()

        if user:
            print(f"User found for email {email}. Trying authentication with username: {user.username}")
            user = authenticate(username=user.username, password=password)

    if not user:
        print(f"Authentication failed for {email}.")
        return Response(
            {"error": "Invalid credentials. Please check your username/email and password."}, 
            status=status.HTTP_401_UNAUTHORIZED
        )

    print(f"Login successful for user: {user.username} (ID: {user.id})")

    tokens = get_tokens_for_user(user)
    return Response({
        "refresh": tokens["refresh"],
        "access": tokens["access"],
        "user": {"id": user.id, "username": user.username, "email": user.email}
    }, status=status.HTTP_200_OK)



# Logout a user
@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Require authentication
def logout_view(request):
    try:
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"message": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST)

        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)



from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

from django.conf import settings
from django.urls import reverse

from .models import UserGoogleCredentials

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def initiate_google_oauth(request):
    """
    Initiate Google OAuth flow
    Generates an authorization URL for the user to link their Google account
    """
    try:
        # Setup OAuth flow
        flow = Flow.from_client_secrets_file(
            settings.GOOGLE_OAUTH_CLIENT_SECRETS_FILE,
            scopes=[
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/userinfo.email'
            ],
            redirect_uri=request.build_absolute_uri(reverse('complete_google_oauth'))
        )
        
        # Generate authorization URL
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            prompt='consent'
        )
        
        # Store state in session for CSRF protection
        request.session['oauth_state'] = state
        
        return Response({
            'authorization_url': authorization_url
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': 'Failed to initiate Google OAuth',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_google_oauth(request):
    """
    Complete Google OAuth flow and store credentials
    """
    try:
        # Retrieve code and state from request
        code = request.data.get('code')
        state = request.data.get('state')
        
        # Verify state to prevent CSRF
        if state != request.session.get('oauth_state'):
            return Response({
                'error': 'Invalid OAuth state'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Setup flow
        flow = Flow.from_client_secrets_file(
            settings.GOOGLE_OAUTH_CLIENT_SECRETS_FILE,
            scopes=[
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/userinfo.email'
            ],
            redirect_uri=request.build_absolute_uri(reverse('complete_google_oauth'))
        )
        
        # Exchange authorization code for credentials
        flow.fetch_token(code=code)
        credentials = flow.credentials
        
        # Get user's Google email
        service = build('oauth2', 'v2', credentials=credentials)
        user_info = service.userinfo().get().execute()
        google_email = user_info.get('email')
        
        # Store or update credentials
        user_google_creds, created = UserGoogleCredentials.objects.get_or_create(
            user=request.user
        )
        
        user_google_creds.access_token = credentials.token
        user_google_creds.refresh_token = credentials.refresh_token
        user_google_creds.token_expiry = credentials.expiry
        user_google_creds.google_email = google_email
        user_google_creds.save()
        
        return Response({
            'message': 'Google account linked successfully',
            'email': google_email,
            'created': created
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': 'Failed to complete Google OAuth',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET", "DELETE"])
@permission_classes([IsAuthenticated])
def manage_google_credentials(request):
    """
    Retrieve or delete user's Google credentials
    """
    try:
        user_google_creds = UserGoogleCredentials.objects.filter(user=request.user).first()
        
        if request.method == 'GET':
            if not user_google_creds:
                return Response({
                    'message': 'No Google account linked'
                }, status=status.HTTP_404_NOT_FOUND)
            
            return Response({
                'email': user_google_creds.google_email,
                'linked_at': user_google_creds.created_at
            }, status=status.HTTP_200_OK)
        
        elif request.method == 'DELETE':
            if user_google_creds:
                user_google_creds.delete()
                return Response({
                    'message': 'Google account unlinked successfully'
                }, status=status.HTTP_200_OK)
            
            return Response({
                'message': 'No Google account linked'
            }, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({
            'error': 'Failed to manage Google credentials',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def use_google_api(request):
    """
    Example of using stored Google credentials to access an API
    """
    try:
        # Retrieve stored credentials
        user_creds = UserGoogleCredentials.objects.filter(user=request.user).first()
        
        if not user_creds:
            return Response({
                'error': 'No Google account linked'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Recreate credentials object
        credentials = Credentials(
            token=user_creds.access_token,
            refresh_token=user_creds.refresh_token,
            token_uri='https://oauth2.googleapis.com/token',
            client_id=settings.GOOGLE_CLIENT_ID,
            client_secret=settings.GOOGLE_CLIENT_SECRET
        )
        
        # Refresh token if expired
        from google.auth.transport.requests import Request
        if credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
            
            # Update stored credentials
            user_creds.access_token = credentials.token
            user_creds.token_expiry = credentials.expiry
            user_creds.save()
        
        # Build and use Google service
        calendar_service = build('calendar', 'v3', credentials=credentials)
        
        # Example: list upcoming events
        events = calendar_service.events().list(calendarId='primary', maxResults=10).execute()
        
        return Response({
            'events': events['items']
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': 'Failed to access Google API',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)