# 📚 Rate-or-Write

**Rate-or-Write** is a modern full-stack web application enabling users to **rate** and **write reviews** on various content. Built with **Django REST Framework** for the backend and **React** for the frontend, this project showcases robust software engineering practices, including API design, authentication, and modular architecture.

---

## 🚀 Features

- 🔐 **User Authentication**: Secure registration, login, and logout using JWT.
- 👤 **Profile Management & Social Interaction**: 
    - Custom user model for personalized profiles.
    - Follow / Unfollow System: Users can follow other users to keep track of their activity.
    - User can see list of follower and following of other person
- 📝 **Content Interaction**: Create, rate, like, and collect posts collection .
- 👥 **Group Creation & Collaboration**:
  - Create and manage groups with a limit of 5 groups per user.
  - Invite members and assign roles: **Banned**, **Normal**, **Admin**, or **Owner**.
  - Role-based permissions:
    - **Owners**: Can delete groups, add/remove members, and change any member's role (including other owners).
    - **Admins**: Can add/remove members and change roles for non-owners.
    - **Normal**: Can view and share posts within the group.
    - **Banned**: Restricted from viewing or sharing posts.
  - Share posts within groups for collaborative interaction.
- 🏆 **Competition Module**: Gamified elements to engage users.
- 🧾 **Admin Panel**:
  - Permission-based access control for administrators.
  - Manage groups, memberships, and post shares.
  - Assign and modify user roles (Banned, Normal, Admin, Owner) within groups via an intuitive inline interface.
- 📦 **RESTful API**: Supports filtering, throttling, and pagination.
---

## 🧰 Tech Stack

### Backend – Django REST Framework
- **Python**: 3.11
- **Django**: 5.2.4
- **Django REST Framework (DRF)**:
  - API views: `APIView`, `ModelViewSet`, `CreateAPIView`, etc.
  - JWT authentication via `djangorestframework-simplejwt` with token rotation, blacklisting, and refresh tokens.
  - Rate throttling with `AnonRateThrottle`.
  - Filtering using `django-filter`.
- **CORS Management**: Handled by `django-cors-headers`.
- **Database**: SQLite (default, easily swappable).
- **Containerization**: Docker for reproducible deployment.
- **Additional Features**: Modular settings, custom `CustomUser` model, internationalization, middleware, and admin customization.

### Frontend – React
- **React**: Utilizes Hooks (`useState`, `useEffect`, etc.).
- **JavaScript**: ES6+ for modern, clean, and readable code.
- **HTTP Client**: Axios or Fetch for backend communication.
- **JWT Storage**: Managed via localStorage or secure cookies.
- **React Router**: Enables client-side navigation.
- **CSS3/HTML5**: Semantic and responsive layouts.

---

## 📁 Folder Structure

```
Rate-or-Write/
├── Backend/
│   ├── manage.py
│   ├── settings/
│   └── apps/ (users, posts, competition.)
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
```

---

## ⚙️ Getting Started

### 🔧 Prerequisites
- **Python**: 3.11+
- **Node.js + npm**: Required for frontend.
- **Docker**: Optional but recommended for containerized setup.

### 🐳 Docker Setup (Recommended)
```bash
git clone https://github.com/mahdiiafshari/Rate-or-Write.git
cd Rate-or-Write/Backend
docker build -t rate-or-write-backend .
docker run -p 8000:8000 rate-or-write-backend
```

### 🧪 Manual Backend Setup
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

## 🔐 Authentication Flow
1. **Sign-Up**: Users register and receive JWT (access + refresh tokens).
2. **Token Storage**: Tokens are stored in the frontend (cookies or localStorage).
3. **Token Refresh**: On access token expiration, the refresh token renews it.
4. **Access Control**: Backend enforces DRF permissions and throttling.

---

## 🤝 Contributing
Contributions are welcome! Fork the repository, submit pull requests, or open issues for suggestions and bug reports.

---

## 🪪 License
This project is open-source and licensed under the [MIT License](LICENSE).

---

## 👤 Author
Developed by [**mahdiiafshari**](https://github.com/mahdiiafshari).
```