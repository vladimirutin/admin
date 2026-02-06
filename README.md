# 💊 MediVend
### *Super Admin Control & Network Oversight Portal*

**MediVend** is an integrated hardware and software solution designed to bridge the gap between digital prescriptions and physical medicine distribution in the Philippines. This repository contains the **Super Admin Portal**, which serves as the central command center for monitoring system health, verifying medical practitioners, and auditing transactions.

---

### 🌟 Key Features
* **Network Health Monitoring**: Real-time status tracking (Online/Offline) for all deployed kiosk units.
* **Physician Verification**: Administrative workflow to review PRC licenses and approve doctor access.
* **Prescription Registry**: A secure, read-only ledger of all prescriptions issued across the network.
* **Remote Maintenance**: Cloud-based tools to ping hardware or trigger system reboots.
* **Security Audit Logs**: Automated tracking of all administrative actions.

---

### 🛠️ Technology Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js 19 (Vite) |
| **Styling** | Tailwind CSS v3 |
| **Icons** | Lucide React |
| **Database** | Google Firebase Firestore |
| **Authentication** | Firebase Auth (Anonymous & Admin) |
| **Deployment** | GitHub Pages |

---

### ⚙️ System Architecture & Hardware
The MediVend ecosystem is a three-tier integrated system:

1.  **Doctor Portal**: A web interface for physicians to generate secure, QR-coded prescriptions.
2.  **Super Admin (This App)**: The monitoring and verification hub.
3.  **Kiosk Unit (Hardware)**: 
    * **Computing**: Raspberry Pi 5
    * **Microcontroller**: Arduino Mega
    * **Input**: LogicOwl Desktop QR Code Scanner
    * **Output**: Thermal Receipt Printer & AZJ Vending Motors (12V)


---

### 🚀 Getting Started
1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/vladimirutin/admin.git](https://github.com/vladimirutin/admin.git)
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

---

### 🎓 Capstone Project Information
* **Developer**: Jim Vincent P. Sasam
* **Course**: Bachelor of Science in Computer Engineering
* **Year**: 4th Year (Senior Project)
