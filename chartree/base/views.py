from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from django.contrib import messages
from django.contrib.auth.models import User,auth
from django.contrib.auth import authenticate,logout
from django.contrib.auth.hashers import check_password
from datetime import datetime
from django.views.generic import View
from django.http import HttpResponse
import os

class ReactAppView(View):
    def get(self, request):
        try:
            print('hello')
            with open(os.path.join(os.path.dirname(__file__), '../4tree_build/index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse("React build not found. Please build the frontend.", status=501)

# Create your views here.
