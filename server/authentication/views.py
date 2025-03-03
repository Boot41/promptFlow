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
