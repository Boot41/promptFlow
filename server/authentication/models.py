from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from encrypted_model_fields.fields import EncryptedCharField
from django.utils import timezone

# Create your models here.

class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)

    USERNAME_FIELD = 'email'  
    REQUIRED_FIELDS = ['username']  

    def __str__(self):
        return self.username
        

class UserGoogleCredentials(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='google_credentials'
    )
    
    # Use EncryptedCharField for secure storage
    access_token = EncryptedCharField(max_length=500, null=True, blank=True)
    refresh_token = EncryptedCharField(max_length=500, null=True, blank=True)
    token_expiry = models.DateTimeField(null=True, blank=True)
    google_email = models.EmailField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def is_token_valid(self):
        """Check if the current token is still valid"""
        return self.token_expiry and self.token_expiry > timezone.now()
    
    def __str__(self):
        return f"Google Credentials for {self.user.email}"