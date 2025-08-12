from django.db import models
from auther.models import ngo,customuser  
from datetime import date
class ngorequests(models.Model):
    choices= [
        ('Home Essentials', 'Home Essentials'),
        ('Furniture', 'Furniture'),
        ('Clothing & Footwear', 'Clothing & Footwear'),
        ('Hygiene Essentials', 'Hygiene Essentials'),
        ('Education Supplies', 'Education Supplies'),
        ('Childcare and Toys', 'Childcare and Toys'),
        ('Medical Supplies', 'Medical Supplies'),
        ('Bedding & Shelter', 'Bedding & Shelter'),
    ]

    tag = models.CharField(
        max_length=100,
        choices=choices,
        default='Home Essentials',blank=False,null=False
    )
    submittedon=models.DateField(default=date.today)
    ngo = models.ForeignKey(ngo, on_delete=models.CASCADE)
    title = models.CharField(max_length=100, blank=True, null=True)
    amount = models.IntegerField(blank=True, null=True)
    recieved = models.IntegerField(blank=True, null=True)
    usersissuing = models.OneToOneField(customuser,on_delete=models.CASCADE,blank=True,null=True)
    stats=models.CharField(choices=[("full","full"),("pending","pending")],default='pending')
    description=models.CharField(blank=True,null=True)
    

   
    def __str__(self):
        return f"{self.ngo.user.email} - {self.status} - {self.request_date.strftime('%Y-%m-%d %H:%M:%S')}"
