from django.urls import path
from . import views

urlpatterns = [
    path('api/ngo/<slug:slug>/', views.get_ngoeverything, name='ngo_requests'),
    path('api/ngorequestscreate/<slug:slug>', views.create_ngo_request, name='create_ngo_request'),
    path("api/ngodelivery/<slug:slug>/",views.get_delivery,name="getdelivery"),
    path("api/submitdelivery/",views.submit_delivery,name='submit_delivery')
]