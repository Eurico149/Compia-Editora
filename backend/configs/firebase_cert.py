import os


firebase_cred_dict = {
    "type": os.environ.get("COMPIA_FIREBASE_TYPE"),
    "project_id": os.environ.get("COMPIA_FIREBASE_PROJECT_ID"),
    "private_key_id": os.environ.get("COMPIA_FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.environ.get("COMPIA_FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
    "client_email": os.environ.get("COMPIA_FIREBASE_CLIENT_EMAIL"),
    "client_id": os.environ.get("COMPIA_FIREBASE_CLIENT_ID"),
    "auth_uri": os.environ.get("COMPIA_FIREBASE_AUTH_URI"),
    "token_uri": os.environ.get("COMPIA_FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.environ.get("COMPIA_FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.environ.get("COMPIA_FIREBASE_CLIENT_X509_CERT_URL"),
    "universe_domain": os.environ.get("COMPIA_FIREBASE_UNIVERSE_DOMAIN")
}
