from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from configs import mongo_connect
from dependencies.security import get_firebase_user
from routers import admin_router, catalogo_router, editor_router, cliente_router
import firebase_admin
import os


load_dotenv()

cred = firebase_admin.credentials.Certificate("compia-editora-firebase-cred.json")
firebase_admin.initialize_app(cred)

app = FastAPI(
    lifespan=mongo_connect,
    root_path="/api"
)

app.include_router(admin_router)
app.include_router(catalogo_router)
app.include_router(editor_router)
app.include_router(cliente_router)

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

@app.get("/me")
def me(current_user: dict = Depends(get_firebase_user)):
    return current_user
