# SugarCraft V1 Walkthrough

I have successfully finished building the **SugarCraft** application. It serves as a management system for articles, factories, and shops, built with a modern **React + Vite** frontend and a robust **FastAPI + SQLAlchemy** backend.

## 🚀 How to Run

### Backend
1. Open a terminal.
2. Navigate to `backend`: `cd backend`
2.1 First time:

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt


3. Activate virtual env: `source venv/bin/activate`
4. Run the server: `fastapi dev app/main.py --port 8000`
   - API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Frontend
1. Open a new terminal.
2. Navigate to `frontend`: `cd frontend`
3. Run the dev server: `npm run dev`
   - Access App: [http://localhost:5173](http://localhost:5173)

## 🔐 Authentication
*   **Login**: The app is secured. Use **`admin`** / **`admin`** to log in.
*   **Sign Out**: Click the **Sign Out** button at the bottom of the sidebar to exit.

## 🧪 Verification Flow (E2E)

Follow this path to test the core logic of the application:

1.  **Create an Article**
    *   Go to **Articles** -> **Create New Article**.
    *   Enter "Choco Cake" and save.
    *   **Add Ingredients**: In the details view, add "Chocolate" and "Flour".

2.  **Create a Factory**
    *   Go to **Factories** -> **Create New Factory**.
    *   Enter "SweetFactory" (Local, email@test.com).
    *   **Select "Choco Cake"** from the article list (multiselect).
    *   Save and go to details.
    *   **Important**: You MUST add a **Supplier** (e.g., "CocoaSupply", "Peru") in the factory details. The system will prevent Shop creation if the factory has no suppliers.

3.  **Create a Shop**
    *   Go to **Shops** -> **Create New Shop**.
    *   Enter "Downtown Shop" (City: NY).
    *   Select "SweetFactory".
    *   Save.
    *   Verify: The Shop Details page should list "Choco Cake" as an available product.

4.  **Delete a Shop**
    *   In Shop Details, click **Delete Shop**.
    *   Confirm the dialog.
    *   You should be redirected to the Shop List, and the shop is gone.

## 🛠 Features Implemented

- **Authentication**: Simple Admin Login/Logout.
- **Full CRUD for Shops**: Create, Read, Delete.
- **Article & Factory Management**: optimized for V1 (Create/Read).
- **Relational Integrity**:
    - Factories produce specific Articles (max 2).
    - Shops are supplied by Factories.
    - Factories must have Suppliers to supply Shops.
- **Modern UI**: Clean, responsive interface using Tailwind CSS and Lucide icons.
