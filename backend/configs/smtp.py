from fastapi_mail import ConnectionConfig
import os


smtp_conn = ConnectionConfig(
    MAIL_USERNAME=os.getenv("COMPIA_MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("COMPIA_SMTP_PASS"),
    MAIL_FROM=os.getenv("COMPIA_MAIL_FROM", "nao-responda@suaapi.com"),
    MAIL_PORT=int(os.getenv("COMPIA_MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("COMPIA_MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)
