// formulario.js - muestra contraseña, validación básica y manejo de cookies

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

function getCookie(name) {
  const cname = name + "=";
  const decoded = decodeURIComponent(document.cookie);
  const parts = decoded.split(';');
  for (let i = 0; i < parts.length; i++) {
    let c = parts[i].trim();
    if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
  }
  return null;
}

function eraseCookie(name){
  setCookie(name, '', -1);
}

document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const toggleBtn = document.getElementById('togglePassword');
  const submitBtn = document.getElementById('submitBtn');
  const msg = document.getElementById('form-message');

  // Prefill username desde cookie si existe
  const saved = getCookie('username');
  if (saved) {
    usernameInput.value = saved;
    msg.textContent = 'Usuario cargado desde cookies.';
  }

  // Alternar visibilidad de la contraseña
  toggleBtn.addEventListener('click', () => {
    const icon = document.getElementById('toggleIcon');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      // cambiar icono a ojo abierto (ojo0.png) si existe
      if (icon) {
        if (icon.src && icon.src.indexOf('ojo1.png') !== -1) icon.src = 'ojo0.png';
        icon.style.filter = 'brightness(0.9) drop-shadow(0 0 4px rgba(0,0,0,0.4))';
      }
      toggleBtn.setAttribute('aria-pressed', 'true');
    } else {
      passwordInput.type = 'password';
      // cambiar icono a ojo cerrado (ojo1.png)
      if (icon) {
        icon.src = 'ojo1.png';
        icon.style.filter = '';
      }
      toggleBtn.setAttribute('aria-pressed', 'false');
    }
  });

  // Enviar (simulado): validar, guardar cookie y mostrar mensaje
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    msg.style.color = '#9d0208';
    const user = usernameInput.value.trim();
    const pass = passwordInput.value.trim();
    if (!user) {
      msg.textContent = 'Por favor escribe tu nombre.';
      return;
    }
    if (!pass) {
      msg.textContent = 'Por favor escribe tu contraseña.';
      return;
    }

    // Guardar nombre en cookie por 30 días y redirigir a la página principal
    setCookie('username', user, 30);
    // limpiar contraseña del input
    passwordInput.value = '';
    // Redirigir a index.html para que `auth.js` muestre el estado de sesión
    window.location.href = 'index.html';
  });

});
