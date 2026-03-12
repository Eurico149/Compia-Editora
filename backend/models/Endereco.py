from beanie import Document, Indexed
from typing import Optional


class Endereco(Document):
    user_uuid: Indexed(str)
    rua: str
    numero: int
    bairro: str
    cidade: str
    estado: str
    cep: str
    complemento: Optional[str] = ""