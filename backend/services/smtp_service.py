from fastapi_mail import MessageSchema, MessageType, FastMail
from pydantic import EmailStr
from configs import smtp_conn


async def enviar_email_confirmacao(email_destino: EmailStr, pedido_uuid: str):
    html = f"""
    <h1>COMPIA-EDITORA</h1>
    <br>
    <h2>Olá, {email_destino}!</h2>
    <p>Seu pedido <strong>#{pedido_uuid}</strong> foi recebido com sucesso.</p>
    <p>Obrigado por comprar conosco!</p>
    """

    mensagem = MessageSchema(
        subject=f"Confirmação do Pedido #{pedido_uuid[:8]}",
        recipients=[email_destino],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(smtp_conn)
    await fm.send_message(mensagem)
