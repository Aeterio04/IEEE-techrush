from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from django.contrib import messages
from django.contrib.auth.models import User,auth
from django.contrib.auth import authenticate,logout
from auther.models import customuser,ngo
from userfuncs.models import donation,notification
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
def ngologinfunc(request):
    print("getting here")
    try:
        # Access form data

    #     const ngoData = {
    #   name: formData.get('ngoName'),
    #   mobile: formData.get('mobile'),
    #   email: formData.get('email'),
    #   city: formData.get('city'),
    #   address: formData.get('address'),
    #   password: formData.get('password'),
    #   ngoid: formData.get('ngoid'),
    #   status: 'pending'
    # };
        name=request.data.get("name")
        mobile=request.data.get("mobile")
        email=request.data.get("email")
        city=request.data.get("city")
        address=request.data.get("address")
        password=request.data.get("password")
        ngoid=request.data.get("ngoid")
        if not all([city, name, mobile, ngoid,email,address]):
            print("ths happen")
            print(city,name,mobile,email,address,ngoid)
            return Response(
                {'error': 'Missing required fields'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        else:
            ngouser=customuser.objects.create(username=name,email=email,password=password,contact=mobile,location=city,usertype='ngo')
            ngouser.slug=slugify(name+str(ngouser.id*1092))
            ngouser.save()
            ngoobject=ngo.objects.create(user=ngouser,ngoid=ngoid,address=address)
            response_data = {
                    'success': True,
                    'message': 'Registration successful',
                    
                }    
            return JsonResponse(response_data, status=201)

        

        # Validate required fields
        


    except Exception as e:
        print(e)
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def getreq(request):
 
    requests=donation.objects.filter(verified="Pending").order_by("-id")
    rlist=[]
    for r in requests:
        robj={}
        robj["status"]=r.verified
        robj["quantity"]=r.quantity
        robj['user']=r.user.slug
        robj['submittedon']=r.submittedon
        robj['id']=r.id
        robj['imageurl']=request.build_absolute_uri(r.image.url)
        robj['title']=r.title
        robj['description']=r.description
        rlist.append(robj)
    return Response({
        'pendingrequests': rlist 
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def getappreq(request):
    print("here")
    requests=donation.objects.filter(verified="Approved").order_by("-id")
    print(requests.first().title)
    rlist=[]
    for r in requests:
        robj={}
        robj["status"]=r.verified
        robj["quantity"]=r.quantity
        robj['user']=r.user.slug
        robj['submittedon']=r.submittedon
        robj['id']=r.id
        robj['imageurl']=request.build_absolute_uri(r.image.url)
        robj['title']=r.title
        robj['description']=r.description
        rlist.append(robj)
    return Response({
        'apprequests': rlist 
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def changereq(request):
    try:    
        print("here")
        stat=request.data.get("status")
        reqid=request.data.get("reqid")
        Donation=donation.objects.filter(id=reqid).first()
        print(Donation.user.email) #works
        
        Donation.verified=stat
        Donation.save()
        print(Donation.verified)
        if(stat=="Rejected"):
            print("here with msg")
            rejection_reason=request.data.get("rejection_reason")
            Donation.rejectionReason=rejection_reason
            Donation.save()
            message="Your Request has been rejected\n Reason: "+ rejection_reason
            print("here with msg"+ message)
            Notification=notification.objects.create(user=Donation.user,message=message,title="Request Rejected",type='rejected')
            response_data = {
                            'success': True,
                            
                        }
            return JsonResponse(response_data, status=201)
        else:
            message="Your Request has been Accepted, You can now donate :"+ Donation.title
            
            Notification=notification.objects.create(user=Donation.user,message=message,title="Request Accepted",type='accepted')
            
            
            response_data = {
                            'success': True,
                            
                        }
            return JsonResponse(response_data, status=201)
    except Exception as e:
        
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([AllowAny])
def getstats(request):
    
    return Response({

        "totalNGO" : ngo.objects.count(),
        "approvalPending" : donation.objects.filter(verified="Pending").count(),
        "approved" : donation.objects.filter(verified="Approved").count(),
        "totalreqs" : donation.objects.count()

    })

    
        

# Create your views here.
