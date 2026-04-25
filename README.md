# VoteWise Election Assistant

VoteWise is a Civic Tech web application designed to guide voters from registration through Election Day. It reduces voter anxiety and ensures high preparedness by offering dynamic timelines, interactive ID checklists, and a simulated voting booth experience.

## Features
- **Live Alerts Banner**: Pulls real-time/mock data for upcoming local election deadlines.
- **Smart Timeline**: A Framer Motion-powered vertical stepper tracking the election journey.
- **Interactive ID Checker**: Fulfills the "Are you ready?" requirement by checking valid document combinations.
- **Mock Voting Simulator**: A mini-component mimicking an EVM/Ballot UI.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Python, Flask
- **Deployment**: Docker, Gunicorn

## Setup Instructions

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Backend
1. `cd backend`
2. `python -m venv venv`
3. Activate virtual environment (`.\venv\Scripts\activate` on Windows, `source venv/bin/activate` on Mac/Linux)
4. `pip install -r requirements.txt`
5. `python app.py`

## Testing
- Run backend unit tests: `python tests.py` inside the `backend` directory.

## Production Build
A `docker-compose.yml` and `Dockerfile`s are provided for a production-ready setup.
Run `docker-compose up --build` to start the entire application suite.
