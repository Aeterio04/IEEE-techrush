from django.contrib import admin
from django.urls import path,include
from . import views



urlpatterns = [
    path("api/auth/ngologin/",views.ngologinfunc,name="ngologin"),
    path("api/getrequests/",views.getreq,name="ngologin"),
    path("api/changerequests/",views.changereq,name="changereq"),
    path("api/getapprovedrequests/",views.getappreq,name="ngologin"),
    path("api/stats/",views.getstats,name="stats"),

]