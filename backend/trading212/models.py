from django.db import models
from django.contrib.auth.models import User
from rest_framework_simplejwt.models import TokenUser

from django.utils.translation import gettext_lazy as _

class Connection(models.Model):
    account = models.OneToOneField(User, on_delete=models.CASCADE)
    api_key = models.CharField(max_length=100)

    def __str__(self):
        return self.account.username
    
OPTIONS = [
    (1, "Buy"),
    (2, "Sell"),
]

def validateChoice(value):
    if value not in [1,2]:
        raise ValueError("Not an option")

class BuyAndSell(models.Model):
    account = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(choices=OPTIONS,
                            max_length=9,
                            default=None,
                            validators=[validateChoice])
    
    quantity = models.DecimalField(max_digits=10, decimal_places=3, default=None)
    current_price = models.DecimalField(max_digits=10, decimal_places=3, default=None)
    ticker = models.CharField(max_length=10, default=None)
    
    def __str__(self):
        return self.account.username
    
class BuyingAndSelling(models.Model):
    account = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(choices=OPTIONS,
                            max_length=9,
                            default=None,
                            validators=[validateChoice])
    
    quantity = models.DecimalField(max_digits=10, decimal_places=3, default=None)
    priceOfStock = models.DecimalField(max_digits=10, decimal_places=3, default=None)
    ticker = models.CharField(max_length=10, default=None)
    date = models.DateTimeField(auto_now_add=True, blank=True)
    
    def __str__(self):
        return self.account.username
