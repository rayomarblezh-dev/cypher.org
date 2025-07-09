  // Manejo del formulario de contacto
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitButton = contactForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;

      const formData = new FormData(contactForm);
      try {
        const response = await fetch('/submit-contact', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        formMessage.classList.remove('hidden', 'success', 'error');
        if (response.ok) {
          formMessage.classList.add('success');
          formMessage.textContent = result.message;
          contactForm.reset();
        } else {
          formMessage.classList.add('error');
          formMessage.textContent = result.error;
        }

        setTimeout(() => {
          formMessage.classList.add('hidden');
          formMessage.textContent = '';
        }, 5000);
      } catch (error) {
        formMessage.classList.remove('hidden');
        formMessage.classList.add('error');
        formMessage.textContent = 'Error al enviar el formulario. Por favor, intenta de nuevo.';
        console.error('Error en el envío del formulario:', error);

        setTimeout(() => {
          formMessage.classList.add('hidden');
          formMessage.textContent = '';
        }, 5000);
      } finally {
        submitButton.disabled = false;
      }
    });
  } else {
    console.warn('Elementos del formulario no encontrados');
  }
