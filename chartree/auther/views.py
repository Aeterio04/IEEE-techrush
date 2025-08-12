from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from django.contrib import messages
from django.contrib.auth.models import User,auth
from django.contrib.auth import authenticate,logout
from auther.models import customuser
from django.utils.text import slugify
from django.contrib.auth.hashers import check_password
from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import check_password

@api_view(['POST'])
@permission_classes([AllowAny])
def loginfunc(request):

    email = request.data.get('email')
    password = request.data.get('password')
    remember_me = request.data.get('remember_me', False)
    user=customuser.objects.filter(email=email).first()


    if not email or not password:
        return Response({'success': False, 'message': 'Email and password are required.'}, status=400)

    if user.usertype=="admin" and check_password(password,user.password):
        auth.login(request,user)
        if not remember_me:
            request.session.set_expiry(0)
        token, _ = Token.objects.get_or_create(user=user)
        print("user correct ", user.email,user.username)
        return Response({
            'success': True,
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.username,
                'slug': user.slug,
                'type': user.usertype
            }

        })
        
    if user.password==password:
        auth.login(request,user)
        if not remember_me:
            request.session.set_expiry(0)
        token, _ = Token.objects.get_or_create(user=user)
        print("user correct ", user.email,user.username)
        return Response({
            'success': True,
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.username,
                'slug': user.slug,
                'type': user.usertype
            }

        })
    else:
        return Response({'success': False, 'message': 'Invalid Credentials'}, status=400)

    
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    email = request.data.get('email')
    password = request.data.get('password')
    contact = request.data.get('phone_number')
    name=request.data.get('password')
    location = request.data.get('location')
    terms = request.data.get('terms')

    
    if terms:
        if(customuser.objects.filter(email=email)):
            return Response({
            'success': False,
            'message': 'Please enter a unique email ID'
        }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            user=customuser.objects.create(username=name,email=email,password=password,contact=contact,location=location,usertype='user')
            user.slug=slugify(name+str(user.id*1092))
            user.save()
            response_data = {
                'success': True,
                'message': 'Registration successful',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.username,
                    'contact': user.contact,
                    'location': user.location,
                    'slug': user.slug,
                    'usertype': user.usertype
                }
            }
            
            return JsonResponse(response_data, status=201)

            
    else:
        return Response({
            'success': False,
            'message': 'Please accept the terms and conditions'
        }, status=status.HTTP_401_UNAUTHORIZED)


