# Project Presentation & Setup Guide: Kaushal-Konnect

Kaushal-Konnect is a full-stack application designed to connect skilled workers with customers using a Machine Learning-driven recommendation system.

## 🚀 How to Start the Project

### 1. Frontend (React + Vite + Bun)
The frontend is built with React and TypeScript, using Vite for bundling and Bun as the package manager.

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   bun install
   # OR if you don't have bun:
   npm install
   ```
3. **Start the development server:**
   ```bash
   bun run dev
   # OR if you don't have bun:
   npm run dev
   ```
   *The app will typically be available at `http://localhost:5173`.*

---

### 2. Backend (Python + FastAPI)
The backend is a FastAPI application that manages worker data, handles bookings, and serves ML recommendations.

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Set up a virtual environment and install dependencies:**
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate

   pip install -r requirements.txt
   ```
3. **Start the server:**
   ```bash
   uvicorn main:app --reload
   ```
   *The API will be available at `http://localhost:8000`. You can access the auto-generated interactive documentation at `http://localhost:8000/docs`.*

---

## 🧠 ML Model Integration (Inculcation)

The core value of Kaushal-Konnect is its ability to intelligently match customers with the most suitable workers. This is achieved through a three-stage integration pipeline: **Develop $\rightarrow$ Persist $\rightarrow$ Deploy**.

### 1. The Development Phase (The "Brain" Creation)
Before the model exists in the backend, it is built in a research environment:
- **Tool:** Jupyter Notebook (`ml/Kaushal_Konnect.ipynb`).
- **Process:** 
    - **Data Analysis:** Analyzing worker data to find correlations between features (rating, price, distance) and successful bookings.
    - **Training:** Training a model to predict the **probability of a successful booking**.
    - **Evaluation:** Validating the model's accuracy.

### 2. The Persistence Phase (Freezing the Brain)
To use a notebook-based model in a production server, it must be "serialized" (saved to a file):
- **Tool:** `joblib` library.
- **Action:** The trained model is exported as a `.joblib` file: `backend/models/kaushal_konnect_recommendation_model.joblib`.
- **Why?** This allows the backend to load the "intelligence" instantly without retraining the model on every server restart.

### 3. The Production Phase (Deploying the "Body")
The model is integrated into the live API via `backend/recommender.py`:

- **Loading:** The system uses `joblib.load` to bring the model into memory at startup.
- **Feature Engineering:** The system extracts a specific set of **FEATURES** (rating, completed jobs, response time, etc.) from the worker data to feed into the model.
- **Inference:** For eligible workers, the model predicts the `booking_success_probability`.
- **Hybrid Scoring Logic:** To ensure fairness and prevent worker burnout, the ML prediction is combined with a **Workload Balance Score**:
   $$\text{Final Score} = (0.85 \times \text{ML Probability}) + (0.15 \times \text{Workload Balance})$$
- **Ranking:** Workers are sorted by this final score and returned to the user.

### 🔄 End-to-End Data Flow
`Frontend Request` $\rightarrow$ `FastAPI Endpoint (/recommendations)` $\rightarrow$ `Recommender Logic` $\rightarrow$ `ML Model (.joblib)` $\rightarrow$ `Ranked Result List` $\rightarrow$ `Frontend Display`

---

## 🔍 How to Access the ML Model

Depending on your goal, there are three ways to access the model's logic and predictions:

### 1. Access via the API (For Users/Frontend)
The model is served through a FastAPI endpoint. This is how the real-world application interacts with the ML "brain".
- **URL:** `http://localhost:8000/recommendations`
- **Method:** `GET`
- **Required Parameters:** `category`, `zone`, and `budget`.
- **Example Request:**
  `http://localhost:8000/recommendations?category=Plumber&zone=North&budget=500`
- **Visual Testing:** Visit `http://localhost:8000/docs` to use the interactive Swagger UI.

### 2. Access via Python Code (For Developers)
If you want to integrate the model into a custom Python script, use the `recommender` module.
```python
from recommender import get_recommendations
import pandas as pd

# Load worker data and get recommendations
worker_data = pd.read_csv("backend/data/worker_data.csv")
results = get_recommendations(category="Electrician", zone="South", budget=400, worker_data=worker_data)
print(results)
```

### 3. Access the Raw Model & Logic (For Researchers)
- **The Saved Model:** The physical model file is located at `backend/models/kaushal_konnect_recommendation_model.joblib`.
- **The Training Logic:** To see exactly how the model was built, the features used, and the training process, refer to the Jupyter Notebook: `ml/Kaushal_Konnect.ipynb`.
