import os
from django.contrib.auth import get_user_model

User = get_user_model()

email = "admin@example.com"
password = "adminpassword"
username = "admin"

# Delete existing superuser if it exists (Optional)
User.objects.filter(email=email).delete()

# Create a new superuser
User.objects.create_superuser(email=email, username=username, password=password)
print("Superuser created successfully")
