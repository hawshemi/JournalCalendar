from django.db import models
from django.contrib.auth.models import User
# from datetime import datetime

# Create your models here.


class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["name"]


class JournalEntry(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="entries")
    # title = models.CharField(max_length=100, blank=True)
    content = models.TextField()
    tags = models.ManyToManyField(Tag, blank=True, related_name="tag_entries")
    # dates are saved in UTC as per settings.py
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    date = models.DateField()

    def __str__(self):
        return self.content[:15]

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user.id,
            "username": self.user.username,
            # "title": self.title,
            "content": self.content,
            "tags": [tag.name for tag in self.tags.all()],
            "created_at": self.created_at.strftime("%Y-%m-%dT%H:%M:%S.000Z"),
            "updated_at": self.updated_at.strftime("%Y-%m-%dT%H:%M:%S.000Z"),
            "date": self.date.strftime("%Y-%m-%d")
        }

    class Meta:
        ordering = ["-date"]
