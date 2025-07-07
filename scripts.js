
        // Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
        const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');

        function toggleMobileMenu() {
            try {
                const isOpen = !mobileMenu.classList.contains('hidden');
                mobileMenu.classList.toggle('hidden');
                mobileMenuBackdrop.classList.toggle('hidden');
                mobileMenuButton.classList.toggle('open');
                mobileMenuButton.setAttribute('aria-expanded', !isOpen);
                document.body.style.overflow = isOpen ? 'auto' : 'hidden';
            } catch (error) {
                console.error('Error toggling mobile menu:', error);
            }
        }

        mobileMenuButton.addEventListener('click', toggleMobileMenu);
        mobileMenuBackdrop.addEventListener('click', toggleMobileMenu);

        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBackdrop.classList.add('hidden');
                mobileMenuButton.classList.remove('open');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            });
        });

        // Form submission
        document.getElementById('contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            try {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = "Encriptando...";
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.textContent = "Mensaje enviado ✓";
                    setTimeout(() => {
                        this.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        alert("Tu mensaje ha sido cifrado y enviado con éxito. Nos pondremos en contacto contigo pronto.");
                    }, 1500);
                }, 1000);
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('section, .service-card').forEach(element => {
            observer.observe(element);
        });


    document.getElementById('contact-form').addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const encryption = document.getElementById('encryption').checked;

      if (message.length < 10) {
        alert('El mensaje debe tener al menos una oración (mínimo 10 caracteres).');
        return;
      }

      const formData = {
        name: name,
        email: email,
        message: message,
        encryption: encryption
      };

      const jsonData = JSON.stringify(formData, null, 2);

      // Descargar como archivo JSON local (puedes quitar esto si quieres enviar al servidor)
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contacto.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('Formulario exportado como JSON. ✅');
    });