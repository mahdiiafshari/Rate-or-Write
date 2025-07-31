
```markdown
# 📚 Rate-or-Write

**Rate-or-Write** is a modern full-stack web application that allows users to **rate** and **write reviews** on various content. Built using Django REST Framework on the backend and React on the frontend, this project demonstrates strong software engineering practices in API design, authentication, and modular architecture.

---

## 🚀 Features

- 🔐 User authentication with JWT (register, login, logout)
- 👤 Profile management with custom user model
- 📝 Post creation, rating, liking, and collections
- 🏆 Competition module with gamification elements
- 🧾 Admin panel with permission-based access control
- 📦 RESTful API with filtering, throttling, and pagination

---

## 🧰 Tech Stack

### Backend – Django REST Framework

- **Python 3.11**
- **Django 5.2.4**
  - Modular settings & custom `CustomUser` model
  - Internationalization, middleware, and admin customization
- **DRF (Django REST Framework)**
  - API views: `APIView`, `ModelViewSet`, `CreateAPIView`, etc.
  - JWT authentication using `djangorestframework-simplejwt`
  - Token rotation, blacklisting, and refresh tokens
  - Rate throttling (`AnonRateThrottle`)
  - Filtering with `django-filter`
- **CORS Management**: via `django-cors-headers`
- **Database**: Default `SQLite` (easily swappable)
- **Containerization**: `Dockerfile` for reproducible deployment

### Frontend – React

- **React (with Hooks)**: `useState`, `useEffect`, etc.
- **JavaScript (ES6+)**: Modern, clean, readable code
- **Axios** (or Fetch): HTTP communication with backend
- **JWT storage**: Using `localStorage` or secure cookies
- **React Router**: Client-side navigation
- **CSS3 / HTML5**: Semantic and responsive layout

---

## 📁 Folder Structure

```

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

````

---

## ⚙️ Getting Started

### 🔧 Prerequisites

- Python 3.11+
- Node.js + npm (for frontend)
- Docker (optional but recommended)

### 🐳 Docker Setup (Recommended)

```bash
git clone https://github.com/mahdiiafshari/Rate-or-Write.git
cd Rate-or-Write/Backend
docker build -t rate-or-write-backend .
docker run -p 8000:8000 rate-or-write-backend
````

### 🧪 Manual Backend Setup

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

## 🔐 Authentication Flow

* User signs up → receives JWT (access + refresh)
* Tokens are stored in frontend (via cookies or `localStorage`)
* On expiration, refresh token is used to renew access
* Backend uses DRF `permissions` and `throttling` for control

---


## 🤝 Contributing

Feel free to fork the repo and submit PRs or open issues for suggestions and bug reports.

---

## 🪪 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👤 Author

Developed by [**mahdiiafshari**](https://github.com/mahdiiafshari)


