Task Manager – Full Stack App
ASP.NET Core 9 REST API + React/TypeScript Frontend for managing tasks and notes (one-to-many).
Includes full CRUD, authentication, background jobs, notifications, and a modern UI.
________________________________________
Backend (API)
Tech Stack
•	ASP.NET Core 9 REST API
•	Entity Framework Core (SQL Server)
•	Mapster (DTO mapping)
•	Redis (caching)
•	Serilog & ILogger (logging)
•	Hangfire (background job processing)
•	MailKit (email notifications)
•	QuestPDF (PDF generation)
•	SignalR (real-time updates)
Features
•	Tasks & Notes CRUD (one-to-many)
•	User management with JWT authentication
•	Controller–Service–Repository architecture
•	Full exception handling
•	Background jobs via Hangfire:
o	Recurring job: QueueWeeklyReports()
	Fetches all users, generates PDF reports, notifies via SignalR, then sends emails
o	Fire-and-forget jobs: welcome emails, report delivery emails
•	Email notifications (MailKit)
•	Real-time notifications (SignalR)
________________________________________
Frontend (React + TypeScript)
Tech Stack
•	React (with TypeScript)
•	Axios (API communication)
•	Material UI (components & icons)
•	React Router (routing & protected routes)
Features
•	Authentication: login, registration, logout
•	Protected routes (Tasks & Notes available only to authenticated users)
•	Server-side filtering 
•	SignalR integration:
o	Small footer widget displays real-time notifications from the API
•	Modern UI/UX:
o	Sleek, responsive design with Material UI
o	Icons and clean layout
o	Footer with live updates
________________________________________
Setup & Run
Backend
cd api
dotnet ef database update
docker-compose up   # Starts Redis
dotnet run
•	The default appsettings.json uses Windows Authentication for SQL Server.
•	To use SQL username/password, update DefaultConnection.
Frontend
cd front-end
npm install
npm start
________________________________________
Architecture Overview
•	Backend:
o	ASP.NET Core 9 REST API
o	EF Core + SQL Server
o	DTO mapping with Mapster
o	Redis caching
o	Serilog logging
o	Hangfire job scheduling
o	MailKit emails
o	QuestPDF reports
o	SignalR notifications
•	Frontend:
o	React (TypeScript)
o	Axios (API calls)
o	Material UI (design system)
o	Router (protected routes)
o	SignalR client (real-time notifications in footer)

