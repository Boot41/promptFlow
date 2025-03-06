from django.urls import path
from .views import register, login_view, logout_view, initiate_google_oauth, complete_google_oauth, manage_google_credentials, use_google_api

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),

    path('google-oauth/initiate/', initiate_google_oauth, name='initiate_google_oauth'),
    path('google-oauth/complete/', complete_google_oauth, name='complete_google_oauth'),
    path('google-credentials/', manage_google_credentials, name='manage_google_credentials'),
    path('use-google-api/', use_google_api, name='use_google_api'),
]
