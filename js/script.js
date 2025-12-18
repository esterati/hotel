const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const bookingForm = document.getElementById('bookingForm');

if (menuToggle && navLinks) {
    const navLinksItems = document.querySelectorAll('.nav-links a');
    
    const toggleMenu = () => {
        const isActive = navLinks.classList.toggle('active');
        menuToggle.textContent = isActive ? '✕' : '☰';
    };
    
    const closeMenu = () => {
        navLinks.classList.remove('active');
        menuToggle.textContent = '☰';
    };
    
    menuToggle.addEventListener('click', toggleMenu);
    
    navLinksItems.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = email => EMAIL_REGEX.test(email);

const ERROR_STYLES = {
    color: '#e74c3c',
    fontSize: '0.85rem',
    marginTop: '5px'
};

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');
    
    input.classList.toggle('error', !!message);
    
    if (message) {
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            Object.assign(errorElement.style, ERROR_STYLES);
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
    } else if (errorElement) {
        errorElement.remove();
    }
}

function validateInput(input) {
    const value = input.value.trim();
    const fieldName = input.name || input.id;
    const length = value.length;
    
    if (input.hasAttribute('required') && length === 0) {
        return `Пожалуйста, заполните это поле`;
    }
    
    switch(fieldName) {
        case 'name':
        case 'user_name':
            if (length > 0) {
                if (length < 2) return 'Минимум 2 символа';
                if (length > 50) return 'Максимум 50 символов';
            }
            break;
            
        case 'email':
        case 'user_email':
            if (length > 0 && !isValidEmail(value)) {
                return 'Введите корректный email (name@example.com)';
            }
            break;
            
        case 'message':
        case 'user_message':
            if (length > 0 && length < 10) {
                return 'Минимум 10 символов';
            }
            break;
            
        case 'dates':
            if (length > 0 && length < 5) {
                return 'Укажите даты подробнее';
            }
            break;
    }
    
    return '';
}

function validateForm(form) {
    let isValid = true;
    let firstErrorInput = null;
    
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        if (input.value.trim().length > 0 || input.hasAttribute('required')) {
            const error = validateInput(input);
            if (error) {
                showError(input, error);
                isValid = false;
                if (!firstErrorInput) firstErrorInput = input;
            } else {
                showError(input, '');
            }
        } else {
            showError(input, '');
        }
    });
    
    if (firstErrorInput) {
        firstErrorInput.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        firstErrorInput.focus();
    }
    
    return isValid;
}

if (bookingForm) {
    bookingForm.addEventListener('focusout', function(e) {
        if (e.target.matches('input, textarea')) {
            const error = validateInput(e.target);
            showError(e.target, error);
        }
    });
    
    bookingForm.addEventListener('input', function(e) {
        if (e.target.matches('input, textarea')) {
            if (e.target.classList.contains('error')) {
                const currentError = validateInput(e.target);
                if (!currentError) {
                    showError(e.target, '');
                }
            }
        }
    });
    
    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (!validateForm(this)) {
            return;
        }
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        Object.keys(data).forEach(key => {
            data[key] = data[key].trim();
        });
        
        alert(`Спасибо, ${data.name}!\n\nЗапрос отправлен.\nСвяжемся по адресу ${data.email} в течение 24 часов.`);
        
        this.reset();
        
        this.querySelectorAll('.error-message').forEach(el => el.remove());
        this.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    });
}

document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        const href = e.target.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerHeight = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            
            window.scrollTo({
                top: targetPosition - headerHeight,
                behavior: 'smooth'
            });
        }
    }
});
