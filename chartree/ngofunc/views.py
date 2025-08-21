from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from django.contrib import messages
from django.contrib.auth.models import User,auth
from django.contrib.auth import authenticate,logout
from auther.models import customuser,ngo
from django.utils.text import slugify
from django.contrib.auth.hashers import check_password
from datetime import datetime,date
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from userfuncs.models import donation,notification,donationmapping
from .models import ngorequests
from django.contrib.auth.decorators import login_required

@api_view(['GET'])
@permission_classes([AllowAny])
def get_ngoeverything(request, slug):
    try:

        user = customuser.objects.filter(slug=slug).first()
        Ngo=ngo.objects.filter(user=user).first()

        ngoreq=ngorequests.objects.filter(ngo=Ngo).order_by('-id')
        notis=notification.objects.filter(user=user).order_by("-id")
        
        totalReqs=ngoreq.count()
        activeReqs=ngoreq.filter(stats='pending')
        completeReqs=ngoreq.filter(stats='full')

    # {
    #   id: 1,
    #   title: "Educational Books for Children",
    #   categories: ["Books"],
    #   quantity: 50,
    #   urgency: "High",
    #   description: "We need educational books for our literacy program serving 200+ children",
    #   status: "Active",
    #   createdDate: "2024-01-10",
    #   responses: 12,
    #   fulfilled: 30
    # },
        reqlist=[]
        for d in ngoreq:
            dobject={}
            dobject['id']=d.id
            dobject['title']=d.title
            dobject['categories']=d.tag
            dobject['quantity']=d.amount
            dobject['description']=d.description
            dobject['status']=d.stats
            dobject['fulfilled']=d.recieved
            dobject['createdDate']=d.submittedon
            reqlist.append(dobject)
    # {
    #   id: 1,
    #   type: "response",
    #   title: "New Response Received! 📝",
    #   message: "Your winter clothing request received 3 new responses from donors.",
    #   
    # },
        notislist=[]
        for n in notis:
            nobject={}
            if n.type=='accepted':
                nobject['type']='completed'
            elif n.type=='info':
                nobject['type']="response"
            nobject['title']=n.title
            
            nobject['message']=n.message
            notislist.append(nobject)

#           const totalRequests = ngoRequests.length;
#   const activeRequests = ngoRequests.filter(r => r.status === 'Active').length;
#   const completedRequests = ngoRequests.filter(r => r.status === 'Completed').length;
#   const totalResponses = ngoRequests.reduce((sum, req) => sum + req.responses, 0);
#   const unreadNotifications = notifications.filter(n => !n.read).length;
        print(totalReqs,activeReqs.count(),completeReqs.count())
        return Response({
            'userslug': user.slug,
            'username': user.username,
            'totalRequests': totalReqs,
            'activeRequests' : activeReqs.count(),
            'completeRequests' :completeReqs.count(),
            'requests':reqlist,
            'notifications': notislist
            
        })
    

    except customuser.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([AllowAny])
def create_ngo_request(request,slug):
    
    
    # const newRequest = {
    #  
    #   title,
    #   categories: [selectedCategories],
    #   quantity: parseInt(quantity),
    #   description,
    #   status: 'pending',
    #   
    #   responses: 0,
    #   fulfilled: 0
    # };

    try:
        if request.method == 'POST':
            tag = request.data.get('categories')
            title = request.data.get('title')
            amount = request.data.get('quantity')
            recieved=0
            description = request.data.get('description')
            reqstatus='pending'
            print(tag[0],title,amount,description)
            ngo_user=customuser.objects.filter(slug=slug).first()

            ngo_instance = ngo.objects.get(user=ngo_user)

            new_request = ngorequests.objects.create(
                tag=tag[0],
                ngo=ngo_instance,
                title=title,
                amount=amount,
                description=description,
                stats=reqstatus,
                submittedon=date.today(),
                recieved=recieved
            )
            new_request.save()
            noti=notification.objects.create(user=ngo_user,type="info",title="Donation Request Submitted",message=f"Your Donation Request {title} has been submitted and can now be contributed to by the users!")

            return Response({'message': 'Donation submitted successfully'}, status=201)
        
    except Exception as e:
            print(e)
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

@api_view(['GET'])
@permission_classes([AllowAny])
def get_delivery(request,slug):
    ngouser=customuser.objects.filter(slug=slug).first()
    Ngo=ngo.objects.filter(user=ngouser).first()
    donmaps=donationmapping.objects.filter(ngo_user=Ngo)
    print(donmaps.count())
    dlist=[]
           
    for don in donmaps:
        if(don.donation_request.recieved=='Pending'):
            dobj={}
            dobj["id"]=don.id
            dobj["RequestName"]=don.ngo_request.title
            dobj["DonorUsername"]=don.user.username
            dobj["DonorContact"]=don.user.contact
            dobj['transactionamount']=don.amount_allocated
            dobj['Date']=don.donation_date
            dobj['Delivery_stat']=don.donation_request.recieved
            dlist.append(dobj)
    print(dlist)
    return Response({
        "donationlist": dlist
        
    },)


@api_view(['POST'])
@permission_classes([AllowAny])
def submit_delivery(request):
    try:
        reqid=request.data.get('reqid')
        action=request.data.get('action')
        donmap=donationmapping.objects.filter(id=reqid).first()
        if(action=='accept'):
            print
            donmap.donation_request.recieved='Approved'
            donmap.donation_request.save()
            noti1=notification.objects.create(user=donmap.user, type='accepted',message=f"Your delivery has been confirmed by {donmap.ngo_user.user.username}",title='Donation Confirmed')
        else:
            donmap.donation_request.recieved='Rejected'
            donmap.donation_request.save()
            noti1=notification.objects.create(user=donmap.user, type='rejected',message=f"Your delivery has been rejected by {donmap.ngo_user.user.username}",title='Donation Rejected')

        response_data = {
                                'success': True,
                                
                            }
        return JsonResponse(response_data, status=201)
    except Exception as e:
        
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
            