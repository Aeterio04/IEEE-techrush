from django.urls import re_path
from .views import ReactAppView  # adjust if views is in another app

urlpatterns = [
    re_path(r'^.*$', ReactAppView.as_view()),
]
