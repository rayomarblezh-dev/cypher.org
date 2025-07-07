from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)
load_dotenv()

# Configuración de Supabase
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Configuración de Flask-Mail para Gmail
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.secret_key = os.getenv('FLASK_SECRET_KEY')

mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit-contact', methods=['POST'])
def submit_contact():
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')

        # Validar datos
        if not name or not email or not message:
            return jsonify({'error': 'Todos los campos son obligatorios'}), 400
        if len(message) < 10:
            return jsonify({'error': 'El mensaje debe tener al menos 10 caracteres'}), 400

        # Guardar en Supabase
        data = {'name': name, 'email': email, 'message': message}
        response = supabase.table('contact_submissions').insert(data).execute()
        
        if not response.data:
            return jsonify({'error': 'Error al guardar en la base de datos'}), 500

        # Enviar correo
        msg = Message(
            subject=f'Nuevo mensaje de contacto de {name}',
            recipients=['rayomarblezh@gmail.com'],
            body=f'Nombre: {name}\nEmail: {email}\nMensaje: {message}',
            sender=app.config['MAIL_DEFAULT_SENDER']
        )
        mail.send(msg)

        return jsonify({'message': 'Formulario enviado exitosamente'}), 200

    except Exception as e:
        return jsonify({'error': f'Error al procesar el formulario: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))