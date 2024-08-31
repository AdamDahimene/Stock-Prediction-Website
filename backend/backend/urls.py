"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, UserDetails, ChangePasswordView, RequestPasswordReset, ResetPassword
from trading212.views import CreateConnectionView, BalanceDetails, PositionDetails, UpdateApi, CheckConnection, BuyStock, StockHistory, SellStock, Price, SpecificPositions
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api/reset/request/", RequestPasswordReset.as_view(), name="reset_password"),
    path("api/user/reset/<str:token>/", ResetPassword.as_view(), name="reset"),
    path("api/user/<str:username>/", UserDetails.as_view(), name="current_user"),
    path("trading212/register/",CreateConnectionView.as_view(), name="register_connection"),
    path("trading212/update/", UpdateApi.as_view(), name="update_api"),
    path("trading212/check/<int:account>/", CheckConnection.as_view(), name="check_api"),
    path("trading212/account/cash/<str:api_key>/", BalanceDetails.as_view(), name="balance_details"),
    path("trading212/account/position/<str:api_key>/", PositionDetails.as_view(), name="position_details"),
    path("trading212/buy/<str:api_key>/", BuyStock.as_view(), name="buy"),
    path("trading212/history/<int:user>/", StockHistory.as_view(), name="history"),
    path("trading212/sell/<str:api_key>/", SellStock.as_view(), name="sell"),
    path("trading212/prices/<str:ticker>/", Price.as_view(), name="price"),
    path("trading212/positions/<str:ticker>/<str:api_key>/", SpecificPositions.as_view(), name="positions"),
    #path("images/", ImageViewSet.as_view(), name="images"),
    path("api-auth/", include("rest_framework.urls")),
]