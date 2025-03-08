# Journal Calendar


## Table Of Contents

- [Journal Calendar](#journal)
  - [Table Of Contents](#table-of-contents)
  - [Description](#description)
  - [Demo](#demo)
  - [Distinctiveness and Complexity](#distinctiveness-and-complexity)
  - [Preview and Features](#preview-and-features)
  - [Files and Directories](#files-and-directories)
  - [Running the Application](#running-the-application)
  - [Languages & Tools](#languages--tools)
  - [Contact](#contact)


## Description
**Journal** is a web application with a productivity focus that aids users in creating and organizing their journal entries. It gives individuals a platform to keep a journal of their ideas and experiences, which boosts their productivity and promotes personal development.

This web application was developed  as a [final project](https://cs50.harvard.edu/web/2020/projects/final/capstone/) for [CS50's Web Programming course](https://cs50.harvard.edu/web/2020/) using Django Web Framework, JavaScript, and Bootstrap.


## Demo
https://journalcalendar.up.railway.app


## Distinctiveness and Complexity

Because of the following components, my final product passes the distinctiveness and complexity requirements:


1. As a productivity tool, this project is primarily focused on "Productivity". Users are given a dedicated platform to organize and chronicle their everyday experiences, thoughts, and ideas, which boosts productivity and well-being.
2. To encourage users to continue journaling without missing a day, the Journal App has a dynamic, interactive activity board that functions like a calendar. Users can easily browse through dates on the board and examine their journal entries for particular days.
3. Instead of using a simple text field for the content of submissions, this project uses a rich text editor that allows users to format their entries using features like bold and italic text. This improves the writing process and lets individuals express themselves better when journaling.
4. A feature of the Journal App determines and shows the user's longest run of continuous journaling days. This feature was created from the ground up to encourage users to keep up a regular journaling routine.
5. Users of the app can filter their diary entries by month and year using a feature in the app. This enables people to reflect on their prior experiences and generate new insights.
6. Journal App uses the activity board's animations to enhance the user experience and make it more visually appealing.


## Preview and Features
  - **Register Page**
    - Username, email, and password areas on the website all include validations.
    - The web browser's "strong password suggestion" is supported in the password field.
    - A new `User` instance is created in the database as soon as valid data is submitted.
  
    <br>

  - **Login Page**
    - Logs users in and redirects them to the index page

    <br>

  - **Index Page: Activity board and day's view**
    - The page features a dynamic and user-friendly activity board.
    - It sends an HTTP request to the `/entry_on/$date` route every time a user clicks on a different date on the board, retrieves the entry for that day as a response, and displays it at the bottom of the page.
    - A menu button with options for altering and deleting the entry may be found in the bottom-right corner of the entry.
  
    <br>

  - **Index Page: Creating a new entry**
    - For better formatting, the TinyMCE text editor is used. _(including bold and italic text)_
    - Allows users to add related tags to their entries.
  
    <br>

  - **All Entries Page**
    - The page has a date filter.
    - The number of entries displayed on a single page is limited by pagination.
    - Allows users to view, edit, and delete any of their entries.
  
    <br>

  - **Profile Page**
    - To motivate users, the page displays the "longest journaling streak" statistic.
    - Users can change their password via this page.
  
    <br>

## Files and Directories

File structure:

- `final_project`: Root directory.
    - `journal`: Application's main directory.
      - `static/journal`: Holds the static files
        - `css`
            - `styles.css`: Styling file; adds more responsiveness to the app.
        - `icons`: Contains icons for the app.
        - `js` 
          - `alerts.js`: Decides if an alert should disappear automatically.
          - `board.js`: Draws a calendar-like, current month's activity board on the index page.
          - `getEntries.js`: Contains the functions that retrieve journal entries from the backend and display them.
          - `monthYearFilter.js`: Creates filter elements and displays them on a page where all entries are listed.
          - `script.js`: Looks for click events, and acts accordingly.
          - `theme.js`: Sets theme according to user's choice.
      - `templates/journal`: Contains the HTML templates for rendering the web pages.
      - `admin.py`: Defines which models will be displayed in the Django Admin Panel.
      - `apps.py`
      - `forms.py`: Contains Django forms used for creating and updating entries and tags.
      - `models.py`: Defines the database models.
      - `test.py`
      - `urls.py`: Specifies the URL patterns and their corresponding views.
      - `utils.py`: Contains helper function used in the app.
      - `views.py`: Contains the view functions that handle different HTTP requests.
    - `main`: Project's main directory.
      - `asgi.py`
      - `settings.py`: project's and text editor's configuration file.
      - `urls.py`: Specifies the URL patterns and their corresponding views for the project.
      - `wsgi.py`
    - `.env`: Contains private information such as `SECRET_KEY` and `ENV_NAME`.
    - `.gitignore`: Defines the files to be ignored by Git.
    - `db.sqlite3`: Database used during the development phase.
    - `manage.py`
    - `README.md`: Contains the project's description and instructions.
    - `requirements.txt`: Lists all the Python packages that need to be installed to run the app.
  

## Running the Application
To run the **Journal** locally, follow these steps:

1. Install Python.
2. Clone the project repository.
3. Open a terminal and navigate to the project's main directory.
4. Create a file named `.env` and edit the file and enter these two lines:
    ```
    SECRET_KEY=''
    ENV_NAME=''
    ```
    _You can generate a test secret key [here](https://djecrety.ir/)._

5. Create a virtual environment (optional but recommended) and activate it.
6. Install the required Python packages by running the following command:
    ```
    pip install -r requirements.txt
    ```
7. Start the development server:
    ```
    python manage.py runserver
    ```
8. Access the app by visiting `http://localhost:8000` in a web browser of your choice.
9. Create a new account, and start using **Journal Calendar**.


## Languages & Tools

- Python (Django Framework)
- JavaScript
- Bootstrap
- HTML
- CSS
- SQLite
- TinyMCE Text Editor


## Contact
I'm [Hawshemi](https://hawshemi.com). You can reach me at rhawshemi@gmail.com

[Go Top ➚](#journal)
