import json
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST, require_GET, require_http_methods
from django.contrib import messages
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
from .models import User, JournalEntry, Tag
from .forms import EntryForm, ChangePasswordCustomForm
from .utils import calculate_longest_streak


@login_required(login_url="login")
def index(request):
    return render(request, "journal/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)

            # redirect user to the original page...
            # ...they were trying to access
            next_url = request.POST.get("next")
            print(next_url)
            if next_url:
                return redirect(next_url)

            # default redirect
            return HttpResponseRedirect(reverse("index"))
        else:
            messages.info(request, "Invalid username and/or password.")
            return render(request, "journal/login.html")
    else:
        return render(request, "journal/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            messages.info(request, "Passwords must match.")
            return render(request, "journal/register.html")

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already exists!")
            return render(request, "journal/register.html", {
                "username": username,
                "email": email
            })

        try:
            validate_password(password=password)
        except ValidationError as error:
            messages.error(request, f"{' '.join(error.messages)}")
            return render(request, "journal/register.html", {
                "username": username,
                "email": email
            })
        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            messages.info(request, "Username already taken.")
            return render(request, "journal/register.html")
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "journal/register.html")


@login_required(login_url="login")
@require_http_methods(["GET", "POST"])
def change_password(request):
    if request.method == "POST":
        form = ChangePasswordCustomForm(user=request.user, data=request.POST)
        if form.is_valid():
            user = form.save()
            # Keep the user logged in
            update_session_auth_hash(request, user)
            messages.success(request, "Password updated.")
            return redirect("profile")
        else:
            messages.error(
                request, "Could not update password. Please correct the error(s).")
    else:
        form = ChangePasswordCustomForm(user=request.user)

    return render(request, "journal/change_password.html", {
        "form": form
    })


@require_http_methods(["GET", "POST"])
@login_required(login_url="login")
def create_entry(request, date_str):
    if request.method == "GET":
        form = EntryForm({"date": date_str})
        return render(request, "journal/create_entry.html", {
            "form": form,
        })
    elif request.method == "POST":
        # create instance and populate it with data from the request
        form = EntryForm(request.POST)

        # check if entry exists on given day
        requested_date = request.POST.get("date")
        try:
            entry_db = JournalEntry.objects.get(
                user=request.user, date=requested_date)
            if entry_db:
                messages.error(
                    request, f"Entry already exists on {requested_date}")
                return HttpResponseRedirect(reverse("index"))
        except JournalEntry.DoesNotExist:
            pass

        if form.is_valid():

            entry = form.save(commit=False)
            entry.user = request.user
            entry.save()

            # tags
            tag_names = form.cleaned_data["tags"]

            for tag_name in tag_names:
                # get_or_create ensures that the tag is either retrieved if it exists
                # and assigned to "tag"
                # or created if it doesn't and assigned to "created_tag"
                tag, created_tag = Tag.objects.get_or_create(
                    name=tag_name.strip())
                entry.tags.add(tag)

            messages.success(request, "Entry saved.")
            return HttpResponseRedirect(reverse("index"))
        else:
            messages.error(request, "Error occured!")
            return render("journal/create_entry.html", {
                "form": form
            })


@login_required(login_url="login")
def update_entry(request, date_str):
    # Query for requested entry
    try:
        entry = JournalEntry.objects.get(user=request.user, date=date_str)
    except JournalEntry.DoesNotExist:
        messages.error(request, "Entry not found!")
        return JsonResponse({"error": "Entry not found"}, status=404)

    if request.method == "GET":
        form = EntryForm(instance=entry)
        # Modify form's tags field
        tag_names = ", ".join(tag.name for tag in entry.tags.all())
        form.initial["tags"] = tag_names

        return render(request, "journal/update_entry.html", {
            "form": form
        })

    elif request.method == "POST":

        form = EntryForm(request.POST, instance=entry)

        if form.is_valid() and entry.user == request.user:
            updated_entry = form.save(commit=False)
            updated_entry.user = request.user

            # Clear existing tags
            entry.tags.clear()
            tag_names = form.cleaned_data["tags"]

            updated_entry.save()

            for tag_name in tag_names:
                tag, created_tag = Tag.objects.get_or_create(
                    name=tag_name.strip())
                entry.tags.add(tag)

            messages.success(request, "Entry updated.")
            return HttpResponseRedirect(reverse("index"))
        else:
            return JsonResponse({"error": "Not authorized"}, status=401)

    else:
        return JsonResponse({"error": "Only PUT method allowed"}, status=400)


@require_GET
@login_required(login_url="login")
def all_entries(request):
    # Query for entries
    try:
        entries = JournalEntry.objects.filter(
            user=request.user)

        month_filter = request.GET.get("month")
        year_filter = request.GET.get("year")
        if month_filter and year_filter:
            month_filter = int(month_filter)
            year_filter = int(year_filter)
            entries = JournalEntry.objects.filter(
                user=request.user, date__month=month_filter, date__year=year_filter)
        # 10 objects per page
        paginator = Paginator(entries, 10)
        page_number = request.GET.get("page")
        page_obj = paginator.get_page(page_number)
    except:
        messages.error(request, "Could not retrieve data.")
        return render(request, "journal/all_entries.html")

    return render(request, "journal/all_entries.html", {
        "page_entries": page_obj,
    })


@login_required(login_url="login")
def profile(request):
    try:
        entries = JournalEntry.objects.filter(
            user=request.user).order_by("date")
    except:
        messages.error(request, "Could not fetch data.")
        return render(request, "journal/profile.html")

    return render(request, "journal/profile.html", {
        "entry_count": entries.count(),
        "longest_streak": calculate_longest_streak(entries)
    })

# API


@login_required(login_url="login")
def entry(request, entry_id):
    # Query for requested entry
    try:
        entry = JournalEntry.objects.get(user=request.user, pk=entry_id)
    except JournalEntry.DoesNotExist:
        return JsonResponse({"error": "Entry not found."}, status=404)

    # Return entry content
    if request.method == "GET":
        return JsonResponse(entry.serialize())

    elif request.method == "DELETE":
        try:
            entry.delete()
        except:
            return JsonResponse({"error": "Could not delete."})

        return HttpResponse(status=204)

    # can't use delete in html
    # html form only has get n post
    elif request.method == "POST":
        try:
            entry.delete()
        except:
            messages.error(request, "Could not delete!")
            return HttpResponseRedirect(reverse("index"))

        messages.success(request, "Entry deleted.")
        return HttpResponseRedirect(reverse("all_entries"))

    else:
        return JsonResponse({"error": "GET, PUT or DELETE request required."}, status=400)


@require_GET
@login_required(login_url="login")
def entries(request):
    # Query for entries
    try:
        entries = JournalEntry.objects.filter(user=request.user)
    except:
        entries = None
        return JsonResponse({"error": "No entry found."})

    # in order to serialize non-dict objects -> safe=False
    return JsonResponse([entry.serialize() for entry in entries], safe=False)


@require_GET
@login_required(login_url="login")
def entry_on(request, date):
    # Query for the day
    try:
        entry = JournalEntry.objects.get(user=request.user, date=date)
    except JournalEntry.DoesNotExist:
        return JsonResponse({"error": "No entry on this day."})

    return JsonResponse(entry.serialize())
