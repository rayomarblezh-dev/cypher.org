from flask import Flask, request, jsonify
from flask_cors import CORS
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import base64
import os

app = Flask(__name__)
CORS(app)

# Clave secreta: debe estar en variables de entorno en Railway
SECRET_KEY = os.environ.get("AES_SECRET_KEY")[:32].encode()

def pad(data):
    """Aplica padding PKCS7."""
    pad_len = 16 - (len(data) % 16)
    return data + bytes([pad_len] * pad_len)

def encrypt_message(message, key):
    """Cifra el mensaje con AES-256-CBC y devuelve base64."""
    iv = get_random_bytes(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = pad(message.encode())
    ciphertext = cipher.encrypt(padded_data)
    return base64.b64encode(iv + ciphertext).decode()

@app.route("/contact", methods=["POST"])
def contact():
    data = request.json
    name = data.get("name")
    contact_info = data.get("contact")
    message = data.get("message")

    if not all([name, contact_info, message]):
        return jsonify({"error": "Todos los campos son obligatorios."}), 400

    combined_message = f"Nombre: {name}\nContacto: {contact_info}\nMensaje: {message}"
    encrypted_message = encrypt_message(combined_message, SECRET_KEY)

    # Guardar localmente (o cambiar por guardar en DB, enviar mail, etc.)
    with open("mensajes_cifrados.txt", "a", encoding="utf-8") as f:
        f.write(encrypted_message + "\n\n")

    return jsonify({"message": "Mensaje recibido y cifrado correctamente."}), 200

# Para Railway: el puerto lo asigna la variable PORT
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
