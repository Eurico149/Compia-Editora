from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import firebase_admin
import os

load_dotenv()


app = FastAPI()

cred = firebase_admin.credentials.Certificate("compia-editora-firebase-cred.json")
firebase_admin.initialize_app(cred)

origins = [os.getenv("FRONTEND_URL", "")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", status_code=200)
def health_check():
    return
