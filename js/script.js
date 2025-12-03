// Открытие/закрытие мобильного меню
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.textContent = '☰';
        });
    });
}

// Функция для проверки email с помощью регулярного выражения
function isValidEmail(email) {
    // Базовое регулярное выражение для проверки email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Функция для отображения сообщений об ошибках
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    
    // Удаляем старые сообщения об ошибках
    const oldError = formGroup.querySelector('.error-message');
    if (oldError) {
        oldError.remove();
    }
    
    // Удаляем класс ошибки с поля ввода
    input.classList.remove('error');
    
    // Если есть сообщение об ошибке, добавляем его
    if (message) {
        input.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '5px';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
    }
}

// Функция для проверки поля ввода
function validateInput(input) {
    const value = input.value.trim();
    const fieldName = input.getAttribute('name') || input.id;
    
    // Проверка для поля имени
    if (fieldName === 'name' || input.id === 'name') {
        if (value.length === 0) {
            return 'Пожалуйста, введите ваше имя';
        } else if (value.length < 2) {
            return 'Имя должно содержать минимум 2 символа';
        } else if (value.length > 50) {
            return 'Имя слишком длинное (максимум 50 символов)';
        }
        return '';
    }
    
    // Проверка для поля email
    if (fieldName === 'email' || input.id === 'email') {
        if (value.length === 0) {
            return 'Пожалуйста, введите ваш email';
        } else if (!isValidEmail(value)) {
            return 'Пожалуйста, введите корректный email (например: name@example.com)';
        }
        return '';
    }
    
    // Проверка для поля дат
    if (fieldName === 'dates' || input.id === 'dates') {
        if (value.length > 0 && value.length < 5) {
            return 'Пожалуйста, укажите даты более подробно';
        }
        return '';
    }
    
    // Проверка для поля сообщения
    if (fieldName === 'message' || input.id === 'message') {
        if (value.length > 0 && value.length < 10) {
            return 'Сообщение слишком короткое (минимум 10 символов)';
        }
        return '';
    }
    
    return '';
}

// Функция для проверки всей формы
function validateForm(form) {
    let isValid = true;
    
    // Проверяем все обязательные поля
    const requiredInputs = form.querySelectorAll('input[required], textarea[required]');
    requiredInputs.forEach(input => {
        const error = validateInput(input);
        if (error) {
            showError(input, error);
            isValid = false;
        } else {
            showError(input, '');
        }
    });
    
    // Также проверяем необязательные поля, если они заполнены
    const optionalInputs = form.querySelectorAll('input:not([required]), textarea:not([required])');
    optionalInputs.forEach(input => {
        if (input.value.trim().length > 0) {
            const error = validateInput(input);
            if (error) {
                showError(input, error);
                isValid = false;
            } else {
                showError(input, '');
            }
        } else {
            // Если поле пустое, очищаем ошибки
            showError(input, '');
        }
    });
    
    return isValid;
}

// Обработка формы бронирования
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    // Добавляем обработчики для проверки в реальном времени
    const inputs = bookingForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        // Проверка при потере фокуса
        input.addEventListener('blur', function() {
            const error = validateInput(this);
            showError(this, error);
        });
        
        // Очистка ошибки при начале ввода
        input.addEventListener('input', function() {
            // Если ошибка есть, но пользователь начал исправлять - убираем красную обводку
            if (this.classList.contains('error')) {
                const currentError = validateInput(this);
                if (!currentError) {
                    showError(this, '');
                }
            }
        });
    });
    
    // Обработка отправки формы
    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Проверяем всю форму
        if (!validateForm(this)) {
            // Прокручиваем к первой ошибке
            const firstError = this.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }
        
        // Собираем данные формы
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value.trim();
        });
        
        // Здесь обычно отправка данных на сервер
        // Для демо просто покажем сообщение
        alert(`Спасибо, ${data.name}!\n\nВаш запрос на бронирование успешно отправлен.\nМы свяжемся с вами по адресу ${data.email} в течение 24 часов.\n\nДетали запроса:\n• Даты: ${data.dates || 'не указаны'}\n• Гостей: ${data.guests || '2'}\n\nС нетерпением ждем вас в Провансе!`);
        
        // Сбрасываем форму
        this.reset();
        
        // Очищаем все сообщения об ошибках
        this.querySelectorAll('.error-message').forEach(error => error.remove());
        this.querySelectorAll('.error').forEach(input => input.classList.remove('error'));
    });
}

// Плавная прокрутка для якорей (если они появятся)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Дополнительная валидация для email при каждом изменении (более строгая)
function validateEmailOnInput(input) {
    const value = input.value.trim();
    
    // Если поле пустое, не показываем ошибку сразу
    if (value === '') return;
    
    // Проверяем наличие @
    if (!value.includes('@')) {
        showError(input, 'Email должен содержать символ @');
        return;
    }
    
    // Проверяем наличие точки после @
    const atIndex = value.indexOf('@');
    const dotIndex = value.indexOf('.', atIndex);
    if (dotIndex === -1) {
        showError(input, 'Email должен содержать точку после символа @');
        return;
    }
    
    // Проверяем длину доменной части
    const domain = value.substring(dotIndex + 1);
    if (domain.length < 2) {
        showError(input, 'Доменная часть email слишком короткая');
        return;
    }
    
    // Если все проверки пройдены, очищаем ошибку
    if (isValidEmail(value)) {
        showError(input, '');
    }
}

// Добавляем дополнительную валидацию для email, если форма существует
if (bookingForm) {
    const emailInput = bookingForm.querySelector('#email');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            validateEmailOnInput(this);
        });
    }
}