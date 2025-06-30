from django.db import models
from django.contrib.auth.models import User

class Expense(models.Model):
    Category_choices=[
        ('UTILITIES','Utilities'),
        ('BILLS','Bills'),
        ('INSURANCE','Insurance'),
        ('TRAVEL','Travel'),
        ('HEALTH','Health'),
        ('CLOTHING','Clothing'),
        ('GIFTS','Gifts'),
        ('MISCELLANEOUS','Miscellaneous'),
    ]

    user=models.ForeignKey(User, on_delete=models.CASCADE)
    amount=models.DecimalField(max_digits=10, decimal_places=2 )
    category=models.CharField(max_length=20,choices=Category_choices)
    description=models.TextField(blank=True, null=True)
    date=models.DateField(auto_now_add=True)
    receipt=models.ImageField(upload_to='receipts/', null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}-{self.category}-Rs{self.amount}-{self.date}"
# Create your models here.
