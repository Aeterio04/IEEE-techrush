 4Tree – NGO Donation Platform

4Tree is a full-stack donation platform designed to simplify and digitize the donation process for NGOs and donors. It provides a transparent, user-friendly way for donors to contribute while enabling 
NGOs to manage and track donations effectively. The platform is built using react for the frontend and django as the backend service and relies on Django REST framework as well as CORS for communication.

The project has the following functionalities:

- Secure user authentication & profile management
- Donation tracking with real-time dashboards for user, NGO and admin.
- Detailed donor & donation history tracking using mapping.
- API-driven backend for scalability
- A clean and responsive frontend for accessibility

This project was built with the intention of simplifying the non-monetary donation process for the users in online donations.

Tech Stack:

- Backend

Django – Core backend framework
Django REST Framework (DRF)– API development
SQLite– Database (SQLite for ease of access)

-Frontend

React.js – Component-based frontend
TailwindCSS / CSS – Styling and responsive design

Features

- User Authentication – Signup/Login with unique slug & profile details, also mapping users and ngos through  cities.
- Donation Management – Track, view, and record all donations
-User (Donor) Dashboard:
View personal donation history
Track total contributions 
Get receipts and notifications for donations and updates
See recommended causes/NGOs
- NGO Dashboard
Manage donations received
Track donor details and donation amounts
Generate reports and analytics for transparency
Update ongoing campaigns and causes
-Admin Dashboard
Monitor all NGOs and donors on the platform
Verify and approve NGO registrations
Verify and approve Donor Requests
Ensure compliance and transparency of donations
Access global analytics (total donations, active users, trending causes)
- Secure Transactions – Backend validation & safe handling of donor data
- Scalable APIs – Can be integrated with multiple NGO portals
- Notifications – Updates via in-app notifications and email

Project Structure
```
ngo-donation-app/
│
├── backend/                # Django backend
│   ├── manage.py
│   ├── userfuncs/           # User Functionalities app
│   ├── ngofuncs/            # NGO functionalities app
│   ├── adminfuncs/          # Admin Functionalaties app
│   ├── auther/              # User authentication & profiles
│   └── media/                # media storage
│
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page-level views
│   │   ├── services/       # API calls
│   │   └── App.js
│   └── package.json
│
├── docs/                   # Documentation
├── .env.example            # Environment variables
└── README.md               # Project documentation


```

## ⚙️ Installation & Setup

 1. Clone the Repository

```bash
git clone https://github.com/your-username/ngo-donation-app.git
cd ngo-donation-app
```

 2. Backend Setup (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # For Linux/Mac
venv\Scripts\activate      # For Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

3. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

 4. Environment Variables

Create a `.env` file in **backend** and **frontend** with:

```env
# Backend
SECRET_KEY=your_django_secret_key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3

# Frontend
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

---

 📸 Screenshots (Optional)



https://github.com/user-attachments/assets/31bd1ec4-1580-4258-a0e8-4708dbcfd174



---

 🌍 Future Enhancements

* ✅ Online payment gateway integration (Razorpay/Stripe)
* ✅ AI-driven donor engagement insights
* ✅ Multi-NGO support with verification
* ✅ Mobile app (React Native / Flutter)

---

🤝 Contributing

Contributions are welcome! Please fork the repo and submit a pull request with clear commit messages.

---

 📜 License

This project is licensed under the **MIT License** – feel free to use and adapt it for your NGO projects.

---

Do you want me to **make it more recruiter-focused** (highlighting your technical skills for resumes) or keep it more **donor/NGO-facing** (like product documentation)?
