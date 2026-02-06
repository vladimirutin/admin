MediVend: Automated Prescription Medicine Dispensing System
Super Admin Control Portal
MediVend is an integrated hardware and software solution designed to automate pharmaceutical dispensing and streamline medicine distribution in the Philippines. This repository contains the Super Admin Portal, the central nervous system for monitoring and managing the entire MediVend network.

🚀 Key Features
Network Health Monitoring: Real-time connectivity tracking for all deployed Kiosk units.

Physician Verification: A dedicated workflow for Super Admins to review and approve licensed doctors.

Prescription Registry: A comprehensive, read-only log of all digital prescriptions issued across the network for compliance.

Security Auditing: Automatic logging of system-wide actions to maintain data integrity.

Remote Kiosk Management: Capability to ping or reboot hardware units directly from the cloud.

🛠️ Tech Stack
Frontend: React.js (Vite) with Tailwind CSS for responsive UI.

Backend/Database: Google Firebase (Firestore & Auth).

Icons: Lucide React.

Deployment: GitHub Pages.

📦 Installation & Setup
To run this project locally or in a Codespace:

Clone the repository:

Bash
git clone https://github.com/vladimirutin/admin.git
Install dependencies:

Bash
npm install
Setup Environment Variables:
Create a .env file and add your Firebase credentials:

Plaintext
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=medivend-a3d51
Run Development Server:

Bash
npm run dev
📐 System Architecture
MediVend operates on a three-tier architecture:

Doctor Portal: Where licensed physicians generate secure QR-coded prescriptions.

Kiosk (Hardware): Raspberry Pi 5 & Arduino Mega based unit that dispenses medicine upon QR scanning.

Super Admin (This App): Oversees all users, transactions, and hardware health.

👨‍💻 Developer
Jim Vincent P. Sasam 4th Year, Bachelor of Science in Computer Engineering ---

💡 How to use this README
Open your README.md file in your Codespace.

Delete everything currently inside it.

Paste the content above.

Commit and Push your changes to GitHub.
