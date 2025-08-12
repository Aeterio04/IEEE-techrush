from django.db import models
from django.contrib.auth.models import AbstractUser,BaseUserManager
import datetime
from django.utils.text import slugify

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        slug=slugify(email.split('@')[0]) + '-admin'

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('usertype', 'admin')
        extra_fields.setdefault('username', 'admin')
        extra_fields.setdefault('usertype', 'admin')
        extra_fields.setdefault('slug',slug)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
   

        return self.create_user(email, password, **extra_fields)


class customuser(AbstractUser):
    
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    slug=models.SlugField(blank=False,null=True)
    usertype=models.CharField(choices=[('user','user'),('ngo','ngo'),('admin','admin')],blank=False)  
    location=models.CharField(choices=[('Pune','Pune'),('Mumbai','Mumbai'),('Delhi','Delhi'),('Bengaluru','Bengaluru'),('Hyderabad','Hyderabad')],blank=True,null=True)  
    contact=models.CharField(max_length=12,blank=True)
    objects = CustomUserManager()


class ngo(models.Model):
    user= models.OneToOneField(customuser, on_delete=models.CASCADE, primary_key=True)
    ngoid = models.CharField(max_length=100, blank=True, null=True)
    address= models.CharField(max_length=255, blank=True, null=True)


