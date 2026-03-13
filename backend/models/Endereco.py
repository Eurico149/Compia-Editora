from typing import Optional
from pydantic import BaseModel


class Endereco(BaseModel):
    rua: str
    numero: int
    bairro: str
    cidade: str
    estado: str
    cep: str
    complemento: Optional[str] = ""
