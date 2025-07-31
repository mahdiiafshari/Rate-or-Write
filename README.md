📚 Rate-or-Write
Rate-or-Write is a modern full-stack web application enabling users to rate and write reviews on various content. Built with Django REST Framework for the backend and React for the frontend, this project showcases robust software engineering practices, including API design, authentication, and modular architecture.

🚀 Features

🔐 User Authentication: Secure registration, login, and logout using JWT.
👤 Profile Management: Custom user model for personalized profiles.
📝 Content Interaction: Create, rate, like, and collect posts.
🏆 Competition Module: Gamified elements to engage users.
🧾 Admin Panel: Permission-based access control for administrators.
📦 RESTful API: Supports filtering, throttling, and pagination.


🧰 Tech Stack
Backend – Django REST Framework

Python: 3.11
Django: 5.2.4
Django REST Framework (DRF):
API views: APIView, ModelViewSet, CreateAPIView, etc.
JWT authentication via djangorestframework-simplejwt with token rotation, blacklisting, and refresh tokens.
Rate throttling with AnonRateThrottle.
Filtering using django-filter.


CORS Management: Handled by django-cors-headers.
Database: SQLite (default, easily swappable).
Containerization: Docker for reproducible deployment.
Additional Features: Modular settings, custom CustomUser model, internationalization, middleware, and admin customization.

Frontend – React

React: Utilizes Hooks (useState, useEffect, etc.).
JavaScript: ES6+ for modern, clean, and readable code.
HTTP Client: Axios or Fetch for backend communication.
JWT Storage: Managed via localStorage or secure cookies.
React Router: Enables client-side navigation.
CSS3/HTML5: Semantic and responsive layouts.


📁 Folder Structure
Rate-or-Write/
├── Backend/
│   ├── manage.py
│   ├── settings/
│   └── apps/ (users, posts, competition, etc.)
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json


⚙️ Getting Started
🔧 Prerequisites

Python: 3.11+
Node.js + npm: Required for frontend.
Docker: Optional but recommended for containerized setup.

🐳 Docker Setup (Recommended)
git clone https://github.com/mahdiiafshari/Rate-or-Write.git
cd Rate-or-Write/Backend
docker build -t rate-or-write-backend .
docker run -p 8000:8000 rate-or-write-backend

🧪 Manual Backend Setup
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


🔐 Authentication Flow

Sign-Up: Users register and receive JWT (access + refresh tokens).
Token Storage: Tokens are stored in the frontend (cookies or localStorage).
Token Refresh: On access token expiration, the refresh token renews it.
Access Control: Backend enforces DRF permissions and throttling.


🤝 Contributing
Contributions are welcome! Fork the repository, submit pull requests, or open issues for suggestions and bug reports.

🪪 License
This project is open-source and licensed under the MIT License.

👤 Author
Developed by mahdiiafshari.