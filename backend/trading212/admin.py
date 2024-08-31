from django.contrib import admin
from .models import Connection
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import BuyingAndSelling

# Register your models here.

#admin.site.register(Connection)

class AccountInline(admin.StackedInline):
    model = Connection
    can_delete = False
    verbose_name_plural = 'Account'


class CustomUserAdmin (UserAdmin):
    inlines = (AccountInline, )

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
admin.site.register(BuyingAndSelling)