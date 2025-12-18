const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const bookingForm = document.getElementById('bookingForm');
const ERROR_STYLES = {color:'#e74c3c',fontSize:'0.85rem',marginTop:'5px'};
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(menuToggle&&navLinks){const n=document.querySelectorAll('.nav-links a');const t=()=>{const e=navLinks.classList.toggle('active');menuToggle.textContent=e?'✕':'☰'};const e=()=>{navLinks.classList.remove('active');menuToggle.textContent='☰'};menuToggle.addEventListener('click',t);n.forEach(e=>{e.addEventListener('click',e)})}

function showError(e,t){const n=e.closest('.form-group');let l=n.querySelector('.error-message');e.classList.toggle('error',!!t);if(t){if(!l){l=document.createElement('div');l.className='error-message';Object.assign(l.style,ERROR_STYLES);n.appendChild(l)}l.textContent=t}else if(l)l.remove()}

function validateInput(e){const t=e.value.trim(),n=e.name||e.id,l=t.length;if(e.hasAttribute('required')&&0===l)return"Пожалуйста, заполните это поле";switch(n){case'name':case'user_name':if(l>0){if(l<2)return'Минимум 2 символа';if(l>50)return'Максимум 50 символов'}break;case'email':case'user_email':if(l>0&&!EMAIL_REGEX.test(t))return'Введите корректный email';break;case'message':case'user_message':if(l>0&&l<10)return'Минимум 10 символов';break;case'dates':if(l>0&&l<5)return'Укажите даты подробнее'}return''}

function validateForm(e){let t=!0,n=null;const l=e.querySelectorAll('input, textarea');l.forEach(l=>{if(l.value.trim().length>0||l.hasAttribute('required')){const e=validateInput(l);e?(showError(l,e),t=!1,n||(n=l)):showError(l,'')}else showError(l,'')});n&&(n.scrollIntoView({behavior:'smooth',block:'center'}),n.focus());return t}

bookingForm&&(bookingForm.addEventListener('focusout',function(e){e.target.matches('input, textarea')&&(t=>{const n=validateInput(t);showError(t,n)})(e.target)}),bookingForm.addEventListener('input',function(e){e.target.matches('input, textarea')&&e.target.classList.contains('error')&&!validateInput(e.target)&&showError(e.target,'')}),bookingForm.addEventListener('submit',function(e){e.preventDefault();if(!validateForm(this))return;const t=new FormData(this),n=Object.fromEntries(t.entries());Object.keys(n).forEach(e=>{n[e]=n[e].trim()});alert(`Спасибо, ${n.name}!\n\nЗапрос отправлен.\nСвяжемся по адресу ${n.email} в течение 24 часов.`);this.reset();this.querySelectorAll('.error-message').forEach(e=>e.remove());this.querySelectorAll('.error').forEach(e=>e.classList.remove('error'))}));

document.addEventListener('click',function(e){e.target.matches('a[href^="#"]')&&'#'!==(t=e.target.getAttribute('href'))&&(e=>{if(e){e.preventDefault();const t=80,n=e.getBoundingClientRect().top+window.pageYOffset;window.scrollTo({top:n-t,behavior:'smooth'})}})(document.querySelector(t))});
