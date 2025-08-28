# 📝 Task Manager – Full Stack App

ASP.NET Core 9 REST API + React/TypeScript frontend for managing tasks and notes (one-to-many).  
Supports full CRUD, authentication, background jobs, notifications, and a modern UI.

---

## ⚙️ Backend (API)

**Tech Stack**
- ASP.NET Core 9 REST API  
- Entity Framework Core (SQL Server)  
- Mapster (DTO mapping)  
- Redis (caching)  
- Serilog & ILogger (logging)  
- Hangfire (background jobs)  
- MailKit (emails)  
- QuestPDF (PDF generation)  
- SignalR (real-time updates)  

**Features**
- Tasks & Notes CRUD (one-to-many)  
- User management with JWT auth  
- Controller–Service–Repository pattern  
- Global exception handling  
- Background jobs via Hangfire:  
  - Recurring job: `QueueWeeklyReports()`  
    - Fetches all users, generates PDF reports, notifies via SignalR, then sends emails  
  - Fire-and-forget jobs: welcome emails, report delivery emails  
- Email notifications (MailKit)  
- Real-time notifications (SignalR)  


---

## 🎨 Frontend (React + TypeScript)

**Tech Stack**
- React + TypeScript  
- Axios (API calls)  
- Material UI (components/icons)  
- React Router (routing & protected routes)  
- SignalR client (real-time updates)  

**Features**
- Authentication: login, register, logout  
- Protected routes (Tasks & Notes for authenticated users)  
- Server-side filtering  
- Footer widget for SignalR notifications  
- Responsive, modern UI with Material UI  

---

## 🚀 Setup & Run

**Backend**
```bash
cd api
dotnet ef database update
docker-compose up   # starts Redis
dotnet run
Default appsettings.json uses Windows Authentication.
Update DefaultConnection for SQL username/password.
```
**Frontend**

```bash
Copy code
cd front-end
npm install
npm start
