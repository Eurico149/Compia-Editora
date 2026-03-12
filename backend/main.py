from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from configs import mongo_connect
from routers import admin_router, catalogo_router
import firebase_admin
import os

load_dotenv()

cred = firebase_admin.credentials.Certificate("compia-editora-firebase-cred.json")
firebase_admin.initialize_app(cred)

app = FastAPI(lifespan=mongo_connect)

app.include_router(admin_router)
app.include_router(catalogo_router)

origins = [os.getenv("FRONTEND_URL", "")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", status_code=200)
async def health_check():
    return
