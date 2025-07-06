from flask import Flask, request, jsonify
from flask_cors import CORS
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import base64
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)

SECRET_KEY = os.environ.get("AES_SECRET_KEY", "ClaveMuySecreta12345678901234567890")[:32].encode()

EMAIL_ADDRESS = os.environ.get("EMAIL_ADDRESS")       # tu correo de envío
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD")     # contraseña de aplicación
EMAIL_RECEIVER = os.environ.get("EMAIL_RECEIVER")     # tu correo receptor

def pad(data):
    pad_len = 16 - (len(data) % 16)
    return data + bytes([pad_len] * pad_len)

def encrypt_message(message, key):
    iv = get_random_bytes(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = pad(message.encode())
    ciphertext = cipher.encrypt(padded_data)
    return base64.b64encode(iv + ciphertext).decode()

def send_email(subject, body, to_email):
    msg = MIMEMultipart()
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    # Servidor SMTP de Gmail
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)

@app.route("/contact", methods=["POST"])
def contact():
    data = request.json
    name = data.get("name")
    contact_info = data.get("contact")
    message = data.get("message")

    if not all([name, contact_info, message]):
        return jsonify({"error": "Todos los campos son obligatorios."}), 400

    combined_message = f"Nombre: {name}\nContacto: {contact_info}\nMensaje: {message}"

    # Cifrar
    encrypted_message = encrypt_message(combined_message, SECRET_KEY)

    # Enviar email
    send_email("Nuevo mensaje cifrado de Cypher", encrypted_message, EMAIL_RECEIVER)

    return jsonify({"message": "Mensaje recibido y enviado por email correctamente."}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
