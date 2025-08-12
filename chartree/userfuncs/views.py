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
from userfuncs.models import donation,notification,donationmapping
from datetime import date,timedelta
from ngofunc.models import ngorequests

@api_view(['GET'])
@permission_classes([AllowAny])
def get_everything(request, slug):
    try:

    #     {
    #   id: 3,
    #   categories: ["Toys", "Books"],
    #   condition: "Good",
    #   quantity: 8,
    #   description: "Children's toys and picture books",
    #   status: "Rejected",
    #   submissionDate: "2024-01-12",
    #   preferredLocation: "eastside",
    #   rejectionReason: "Items not suitable for current programs",
    #   photos: ["🧸", "📖"]
    # }
    #

        user = customuser.objects.filter(slug=slug).first()
        donations=donation.objects.filter(user=user).order_by("-id")
        pendingApproval=donation.objects.filter(user=user,verified="Pending").count()
        acceptedDonations=donation.objects.filter(user=user,verified="Approved").count()
    
        dlist=[]
        for d in donations:
            if d.quantity==0:
                continue
            dobject={}
            dobject['id']=d.id
            dobject['title']=d.title
            dobject['categories']=d.tag
            dobject['quantity']=d.quantity
            dobject['description']=d.description
            dobject['status']=d.verified
            dobject['submissionDate']=d.submittedon
          
            dlist.append(dobject)

        return Response({
            'userslug': user.slug,
            'username': user.username,
            'donations':dlist,
            'pendingApproval':pendingApproval,
            "acceptedDonations":acceptedDonations
        })
    except customuser.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['POST'])
@permission_classes([AllowAny])
def donate(request):
    try:
        # Access form data
        photos = request.FILES.get('photos')
        category = request.data.get('category')
       
        quantity = request.data.get('quantity')
        description = request.data.get('description')
        title = request.data.get('title')
        slug = request.data.get('slug')
        user=customuser.objects.filter(slug=slug).first()
        
        # Validate required fields
        if not all([photos, category, quantity, description]):
            return Response(
                {'error': 'Missing required fields'},
                status=status.HTTP_400_BAD_REQUEST
            )
        Donation=donation.objects.create(tag=category,title=title,image=photos,quantity=quantity,user=user,verified="Pending",donated=False,recieved="Pending",submittedon=date.today(),description=description)
        return Response({'message': 'Donation submitted successfully'}, status=201)


    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['GET'])
@permission_classes([AllowAny])
def getnotis(request,slug):
    
    user=customuser.objects.filter(slug=slug).first()
    
    notis=notification.objects.filter(user=user).order_by("-id")
    
    rlist=[]
    for r in notis:
        robj={}
        robj["message"]=r.message
        robj['title']=r.title
        robj['type']=r.type
        rlist.append(robj)
    return Response({
        'notilist': rlist 
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def ngoreqs(req,slug):
    # {
    #   id: 1,
    #   ngoName: "Hope Foundation",
    #   items: ["Books", "Clothes"],
    #   quantities: { "Books": 20, "Clothes": 15 },
    #   description: "Educational books for underprivileged children and winter clothes for families in need",
    #   urgency: "High",
    #   location: "Mumbai, Maharashtra",
    #   
    #   phone: "+91 98765 43210"
    # },
    try:

        ngoreqlist1=ngorequests.objects.filter(stats="pending").order_by('-id')
        ngoreqlist=[]
        
        user=customuser.objects.filter(slug=slug).first()
        for ngoreq in ngoreqlist1:
            if(ngoreq.ngo.user.location==user.location):
                ngoreqlist.append(ngoreq)
        
        nlist=[]
        for n in ngoreqlist:
            nobj={}
            nobj["ngoName"]=n.ngo.user.username
            nobj['items']=n.tag
            nobj['quantities']=n.amount
            nobj['recieved']=n.recieved
            nobj['description']=n.description
            nobj['location']=n.ngo.user.location
            nobj['id']=n.id
            nobj['phone']=n.ngo.user.contact
            
            nlist.append(nobj)
    
        return Response({
            "ngoreqs": nlist
        })
    except Exception as e:
            print(e)
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



@api_view(['GET'])
@permission_classes([AllowAny])
def getapps(request,slug):
    try:
        user=customuser.objects.filter(slug=slug).first()
        donations=donation.objects.filter(user=user)
        choices=[
            'Home Essentials',
            'Furniture',
            'Clothing & Footwear',
            'Hygiene Essentials',
            'Education Supplies',
            'Childcare and Toys',
            'Medical Supplies',
            'Bedding & Shelter'
            ]
        custobj={}
        for choice in choices:
            dset=donations.filter(tag=choice) 
            dlist=[]
            for d in dset:
                dobject={}
                dobject['id']=d.id
                dobject['title']=d.title
                dobject['categories']=d.tag
                dobject['quantity']=d.quantity
                dobject['description']=d.description
                dobject['status']=d.verified
                dobject['submissionDate']=d.submittedon
                
                dlist.append(dobject)
            
            custobj[choice]=dlist

        print(custobj)
        return Response({
                'donations':custobj
            })
    except customuser.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
@permission_classes([AllowAny])
def setdonation(request):
    try:    
        donations=request.data.get("donationID")

        slug=request.data.get("userslug")
        ngoreqID=request.data.get("ngoReq")

        user=customuser.objects.filter(slug=slug).first()
        ngoreq=ngorequests.objects.filter(id=ngoreqID).first()
        ngo=ngoreq.ngo
        print("here")

        print(donations,slug,ngoreqID)
        for donID in donations:
            currentdon=donation.objects.filter(id=donID).first()
            
            currentdon.donationdate=date.today()
            
            if((ngoreq.amount-ngoreq.recieved)>currentdon.quantity):
                noti1=notification.objects.create(user=ngo.user,type="accepted", title= "Donation Recieved",message=f"You have recieved a donation of {currentdon.quantity} {currentdon.tag} from user {user.username} on the request {ngoreq.title}, to contact the volunteer, please contact {user.contact}")
                noti2=notification.objects.create(user=user,type="accepted", title= "Donation Successful",message=f"You have donated your item request {currentdon.title} to {ngo.user.username}. These should be donated by {date.today()+timedelta(days=7)} to: \n{ngo.address} \n For more information, contact: {ngo.user.contact}")
            
                donmap=donationmapping.objects.create(donation_request=currentdon,ngo_request=ngoreq,amount_allocated=currentdon.quantity,ngo_user=ngo,user=user,donation_date=date.today())

                ngoreq.recieved+=currentdon.quantity
                currentdon.quantity=0
                currentdon.donated=True
                ngoreq.save()
                currentdon.save()
                return Response({'message': 'Donation submitted successfully'}, status=201)
                
            else:
                noti1=notification.objects.create(user=ngo.user,type="accepted", title= "Request Completed!🎉",message=f"You have recieved a donation of {currentdon.quantity} {currentdon.tag} from user {user.username} on the request {ngoreq.title}, to contact the volunteer, please contact {user.contact}\n This completes your Donation Reques {ngoreq.title}")
                noti2=notification.objects.create(user=user,type="accepted", title= "Donation Successful",message=f"You have donated your item request {currentdon.title} to {ngo.user.username}. These should be donated by {date.today()+timedelta(days=7)} to: \n{ngo.address} \n For more information, contact: {ngo.user.contact}")

                donmap=donationmapping.objects.create(donation_request=currentdon,ngo_request=ngoreq,amount_allocated=(ngoreq.amount-ngoreq.recieved),ngo_user=ngo,user=user,donation_date=date.today())
                
                currentdon.quantity-=(ngoreq.amount-ngoreq.recieved)
                ngoreq.recieved=ngoreq.amount
                ngoreq.stats="full"
                ngoreq.save()
                currentdon.save()
                return Response({'message': 'Donation submitted successfully'}, status=201)
    except Exception as e:
        print(e)
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



            


            
        






