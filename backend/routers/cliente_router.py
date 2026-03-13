from fastapi import Depends, APIRouter
from dependencies.security import verify_access


cliente_router = APIRouter(
    prefix="/cliente",
    tags=["cliente"],
    dependencies=[Depends(verify_access(['cliente', 'admin']))]
)


