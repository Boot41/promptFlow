from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from unittest.mock import patch, MagicMock
import json

from .models import User

class AuthenticationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        
        # Create a test user
        self.test_user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
    
    def test_register_success(self):
        """Test successful user registration"""
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword123'
        }
        
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'newuser')
        self.assertEqual(response.data['user']['email'], 'newuser@example.com')
        
        # Verify user was created in the database
        self.assertTrue(User.objects.filter(username='newuser').exists())
    
    def test_register_invalid_data(self):
        """Test registration with invalid data"""
        # Missing required fields
        data = {
            'username': 'newuser'
            # Missing email and password
        }
        
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_register_duplicate_username(self):
        """Test registration with duplicate username"""
        data = {
            'username': 'testuser',  # Already exists
            'email': 'another@example.com',
            'password': 'newpassword123'
        }
        
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    @patch('authentication.views.User.objects.filter')
    def test_register_duplicate_email(self, mock_filter):
        """Test registration with duplicate email"""
        # Mock the filter to avoid the actual database query
        mock_filter.return_value = User.objects.none()
        
        data = {
            'username': 'anotheruser',
            'email': 'test@example.com',  # Already exists
            'password': 'newpassword123'
        }
        
        # Mock the serializer validation to fail
        with patch('authentication.serializers.UserSerializer.is_valid') as mock_is_valid:
            mock_is_valid.return_value = False
            with patch('authentication.serializers.UserSerializer.errors', 
                      {'email': ['Email already exists']}):
                response = self.client.post(self.register_url, data, format='json')
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    @patch('authentication.views.authenticate')
    def test_login_with_username_success(self, mock_authenticate):
        """Test successful login with username"""
        # Mock the authenticate function
        mock_authenticate.return_value = self.test_user
        
        data = {
            'email': 'testuser',  # Using username
            'password': 'testpassword123'
        }
        
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')
    
    @patch('authentication.views.authenticate')
    @patch('authentication.views.User.objects.filter')
    def test_login_with_email_success(self, mock_filter, mock_authenticate):
        """Test successful login with email"""
        # Mock the authenticate function
        mock_authenticate.return_value = self.test_user
        
        # Mock the filter query
        mock_filter_result = MagicMock()
        mock_filter_result.first.return_value = self.test_user
        mock_filter.return_value = mock_filter_result
        
        data = {
            'email': 'test@example.com',  # Using email
            'password': 'testpassword123'
        }
        
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], 'test@example.com')
    
    @patch('authentication.views.authenticate')
    @patch('authentication.views.User.objects.filter')
    def test_login_invalid_credentials(self, mock_filter, mock_authenticate):
        """Test login with invalid credentials"""
        # Mock the authenticate function to return None (invalid credentials)
        mock_authenticate.return_value = None
        
        # Mock the filter query to return None
        mock_filter_result = MagicMock()
        mock_filter_result.first.return_value = None
        mock_filter.return_value = mock_filter_result
        
        data = {
            'email': 'testuser',
            'password': 'wrongpassword'
        }
        
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_login_missing_fields(self):
        """Test login with missing fields"""
        data = {
            'email': 'testuser'
            # Missing password
        }
        
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    @patch('authentication.views.RefreshToken')
    def test_logout_success(self, mock_refresh_token):
        """Test successful logout"""
        # Mock the RefreshToken class
        mock_token = MagicMock()
        mock_refresh_token.return_value = mock_token
        
        # Create a mock refresh token
        refresh_token = "mock-refresh-token"
        
        # Authenticate the request
        self.client.force_authenticate(user=self.test_user)
        
        # Logout using the refresh token
        logout_data = {
            'refresh': refresh_token
        }
        response = self.client.post(self.logout_url, logout_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Logged out successfully')
    
    def test_logout_missing_token(self):
        """Test logout with missing refresh token"""
        # Authenticate the request
        self.client.force_authenticate(user=self.test_user)
        
        # Try to logout without a refresh token
        response = self.client.post(self.logout_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_logout_unauthenticated(self):
        """Test logout without authentication"""
        response = self.client.post(self.logout_url, {'refresh': 'fake-token'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
