document.addEventListener('DOMContentLoaded', () => {
  // Manejo del menú hamburguesa
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
  const hamburgerSpans = mobileMenuButton?.querySelectorAll('.hamburger-icon span');

  // Verificar que los elementos existen para evitar errores
  if (mobileMenuButton && mobileMenu && mobileMenuBackdrop && hamburgerSpans.length) {
    mobileMenuButton.addEventListener('click', () => {
      const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
      mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
      mobileMenuBackdrop.classList.toggle('hidden');

      // Animar ícono hamburguesa
      hamburgerSpans.forEach((span, index) => {
        span.classList.toggle('active', !isExpanded);
      });
    });

    mobileMenuBackdrop.addEventListener('click', () => {
      mobileMenuButton.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.add('hidden');
      mobileMenuBackdrop.classList.add('hidden');

      hamburgerSpans.forEach(span => span.classList.remove('active'));
    });

    // Cerrar menú al hacer clic en un enlace
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.add('hidden');
        mobileMenuBackdrop.classList.add('hidden');

        hamburgerSpans.forEach(span => span.classList.remove('active'));
      });
    });
  } else {
    console.warn('Elementos del menú hamburguesa no encontrados');
  }

  // Manejo del formulario de contacto
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Deshabilitar botón de enviar para evitar envíos múltiples
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

        // Ocultar mensaje después de 5 segundos
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
});