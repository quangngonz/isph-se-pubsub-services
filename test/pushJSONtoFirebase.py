import json
import os

import dotenv
import firebase_admin
from firebase_admin import credentials, db

dotenv.load_dotenv()


def push_json_to_firebase(json_file_path, table_name, service_account):
    """
    Pushes data from a JSON file to Firebase Realtime Database.

    :param json_file_path: Path to the JSON file.
    :param table_name: Name of the Firebase table (top-level key).
    :param service_account: Firebase service account credentials.
    """
    # Initialize Firebase Admin SDK
    if not firebase_admin._apps:
        cred = credentials.Certificate(service_account)
        firebase_admin.initialize_app(cred, {
            'databaseURL': os.getenv("FIREBASE_DATABASE_URL")
        })

    # Reference to the database table
    ref = db.reference(table_name)

    # Read and process the JSON file
    with open(json_file_path, mode='r', encoding='utf-8') as json_file:
        data_to_push = json.load(json_file)

    # Push data to Firebase
    ref.set(data_to_push)

    print(f"Data from {json_file_path} successfully pushed to Firebase table '{table_name}'.")


SERVICE_ACCOUNT = {
    "type": os.getenv("FIREBASE_TYPE"),
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),  # Handle newlines
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_CERT_URL"),
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL"),
}

push_json_to_firebase(
    json_file_path='json_files/transactions.json',
    table_name='transactions',
    service_account=SERVICE_ACCOUNT
)
