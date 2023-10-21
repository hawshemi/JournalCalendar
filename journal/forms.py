from django import forms
from .models import JournalEntry
from django.contrib.auth.forms import PasswordChangeForm
from tinymce.widgets import TinyMCE


class EntryForm(forms.ModelForm):

    # remove colon ":" suffix from labels
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.label_suffix = ""

    # Fix: M2M field "tags" yields error
    # override ManyToMany with CharField
    tags = forms.CharField(required=False, widget=forms.TextInput(attrs={
        "class": "form-control shadow-lg",
        "placeholder": "Tags",
    }))

    class Meta:
        model = JournalEntry
        fields = ["date", "content", "tags"]
        widgets = {
            "content": TinyMCE(attrs={
                "class": "form-control shadow-lg",
                "cols": 30,
                "rows": 10
            }),
            "date": forms.DateInput(attrs={
                "class": "form-control shadow-lg",
                "placeholder": "Date",
                "type": "date"
            })
        }

    # this will automatically run when form.is_valid() called
    def clean_tags(self):
        tags = self.cleaned_data.get("tags")
        if tags:
            cleaned_tags = [tag.strip() for tag in tags.split(",")]
            return cleaned_tags
        else:
            return []

class ChangePasswordCustomForm(PasswordChangeForm):
    # remove colon ":" suffix from labels
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.label_suffix = ""

    old_password = forms.CharField(widget=forms.PasswordInput(attrs={
        "class": "form-control",
        "placeholder": "Old password"
    }))

    new_password1 = forms.CharField(widget=forms.PasswordInput(attrs={
        "autocomplete": "new-password",
        "class": "form-control",
        "placeholder": "New password"
    }), label="New password")

    new_password2 = forms.CharField(widget=forms.PasswordInput(attrs={
        "autocomplete": "new-password",
        "class": "form-control",
        "placeholder": "Confirm new password"
    }), label="Confirm new password")

    class Meta:
        fields = ["old_password", "new_password1", "new_password2"]
