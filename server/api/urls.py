from django.urls import path
from .views import WorkflowView

urlpatterns = [
    path('run-workflow/', WorkflowView.as_view(), name='run-workflow'),
]
