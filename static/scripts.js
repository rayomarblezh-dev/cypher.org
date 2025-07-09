document.addEventListener('DOMContentLoaded', () => {
    // Manejo del menú lateral
    const sidebarMenuButton = document.getElementById('sidebar-menu-button');
    const sidebarMenu = document.getElementById('sidebar-menu');
    const sidebarMenuBackdrop = document.getElementById('sidebar-menu-backdrop');
    let hamburgerSpans = null;
    if (sidebarMenuButton) {
        hamburgerSpans = sidebarMenuButton.querySelectorAll('.hamburger-icon span');
    }

    if (sidebarMenuButton && sidebarMenu && sidebarMenuBackdrop && hamburgerSpans && hamburgerSpans.length) {
        sidebarMenuButton.addEventListener('click', () => {
            const isExpanded = sidebarMenuButton.getAttribute('aria-expanded') === 'true';
            sidebarMenuButton.setAttribute('aria-expanded', !isExpanded);
            sidebarMenu.classList.toggle('active');
            sidebarMenuBackdrop.classList.toggle('active');
            hamburgerSpans.forEach(span => span.classList.toggle('active', !isExpanded));
        });

        sidebarMenuBackdrop.addEventListener('click', () => {
            closeMenu();
        });

        // Cerrar menú al hacer clic en un enlace
        sidebarMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                    closeMenu();
                }
            });
        });

        // Cerrar menú con la tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebarMenuButton.getAttribute('aria-expanded') === 'true') {
                closeMenu();
            }
        });

        function closeMenu() {
            sidebarMenuButton.setAttribute('aria-expanded', 'false');
            sidebarMenu.classList.remove('active');
            sidebarMenuBackdrop.classList.remove('active');
            hamburgerSpans.forEach(span => span.classList.remove('active'));
        }
    } else {
        console.warn('No se encontraron uno o más elementos del menú lateral: botón, menú, backdrop o spans del ícono hamburguesa');
    }

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
});
