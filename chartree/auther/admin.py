# auther/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import customuser

class CustomUserAdmin(UserAdmin):
    model = customuser
    list_display = ('email', 'username', 'usertype', 'location', 'contact', 'is_staff')
    list_filter = ('usertype', 'location', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('email', 'username', 'slug', 'contact')
    ordering = ('email',)

    fieldsets = (
        (None, {
            'fields': ('email', 'password', 'username', 'slug')
        }),
        ('Personal Info', {
            'fields': ('usertype', 'location', 'contact')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Important Dates', {
            'fields': ('last_login', 'date_joined')
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'username', 'slug', 'usertype', 'location', 'contact', 'is_active', 'is_staff')}
        ),
    )

admin.site.register(customuser, CustomUserAdmin)
