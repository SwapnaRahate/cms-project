from django.contrib import admin
from django.urls import path
from . import views 

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('read/filter', views.filterProduct),
    path('read', views.getProduct),
    path('create', views.createProd),
    path('delete', views.removeProd),
    path('update', views.updateProd),
]