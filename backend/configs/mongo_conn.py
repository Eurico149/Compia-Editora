from pymongo import AsyncMongoClient
from beanie import init_beanie
from contextlib import asynccontextmanager
from fastapi import FastAPI
from models import Produto, Endereco, Pedido
import os


@asynccontextmanager
async def mongo_connect(app: FastAPI):
    client = AsyncMongoClient(os.getenv("COMPIA_MONGO_URI"))
    db = client[os.getenv("COMPIA_MONGO_DB")]
    await init_beanie(database=db, document_models=[Produto, Endereco, Pedido])
    yield
