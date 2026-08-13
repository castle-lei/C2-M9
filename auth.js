// auth.js - comprueba cookie `username` y modifica el botón de login en todas las páginas

function _getCookie(name) {
  const cname = name + "=";
  const decoded = decodeURIComponent(document.cookie || '');
  const parts = decoded.split(';');
  for (let i = 0; i < parts.length; i++) {
    let c = parts[i].trim();
    if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
  }
  return null;
}

function _eraseCookie(name){
  document.cookie = name + '=; Max-Age=0; path=/';
}

function applyAuthUI(){
  const loginBtn = document.getElementById('loginBtn');
  const username = _getCookie('username');
  if (!loginBtn) return;
  if (username) {
    // crear widget con avatar + nombre y menú desplegable
    const widget = document.createElement('div');
    widget.className = 'auth-widget position-relative';
    widget.classList.add('ms-lg-3');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'auth-trigger btn btn-sm d-flex align-items-center gap-2';
    trigger.setAttribute('aria-expanded', 'false');

    const avatar = document.createElement('img');
    // cargar avatar guardado en localStorage si existe
    const savedAvatar = localStorage.getItem('auth_avatar');
    avatar.src = savedAvatar ? savedAvatar : 'favicon.png';
    avatar.alt = 'logo';
    avatar.className = 'auth-avatar rounded-circle';
    avatar.width = 32;
    avatar.height = 32;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'auth-name';
    nameSpan.textContent = username;

    const caret = document.createElement('span');
    caret.className = 'auth-caret';
    caret.innerHTML = '&#9662;';

    trigger.appendChild(avatar);
    trigger.appendChild(nameSpan);
    trigger.appendChild(caret);

    const menu = document.createElement('div');
    menu.className = 'auth-menu card p-2 shadow';
    menu.style.display = 'none';
    menu.style.minWidth = '160px';
    menu.style.position = 'absolute';
    menu.style.right = '0';
    menu.style.top = '42px';
    menu.style.zIndex = '1050';

    const perfil = document.createElement('a');
    perfil.href = 'formulario.html';
    perfil.className = 'd-block py-1 px-2';
    perfil.textContent = 'Mi perfil';

    const changePhoto = document.createElement('button');
    changePhoto.type = 'button';
    changePhoto.className = 'd-block py-1 px-2 btn btn-sm btn-light w-100 text-start';
    changePhoto.textContent = 'Cambiar foto de perfil';

    const removePhoto = document.createElement('button');
    removePhoto.type = 'button';
    removePhoto.className = 'd-block py-1 px-2 btn btn-sm btn-outline-secondary w-100 text-start mt-1';
    removePhoto.textContent = 'Quitar foto';

    const divider = document.createElement('hr');
    divider.style.margin = '6px 0';

    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn btn-sm btn-outline-danger w-100';
    logoutBtn.textContent = 'Cerrar sesión';
    logoutBtn.addEventListener('click', () => {
      _eraseCookie('username');
      window.location.reload();
    });

    menu.appendChild(perfil);
    menu.appendChild(changePhoto);
    menu.appendChild(removePhoto);
    menu.appendChild(divider);
    menu.appendChild(logoutBtn);

    // input file oculto para seleccionar foto
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    widget.appendChild(fileInput);

    // manejar selección de imagen
    fileInput.addEventListener('change', (ev) => {
      const f = ev.target.files && ev.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const dataUrl = e.target.result;
        // guardar en localStorage y actualizar avatar
        try { localStorage.setItem('auth_avatar', dataUrl); } catch (err) {}
        avatar.src = dataUrl;
        menu.style.display = 'none';
      };
      reader.readAsDataURL(f);
    });

    changePhoto.addEventListener('click', () => {
      fileInput.click();
    });

    removePhoto.addEventListener('click', () => {
      localStorage.removeItem('auth_avatar');
      avatar.src = 'favicon.png';
      menu.style.display = 'none';
    });

    widget.appendChild(trigger);
    widget.appendChild(menu);

    // toggle menu
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const opened = menu.style.display === 'block';
      menu.style.display = opened ? 'none' : 'block';
      trigger.setAttribute('aria-expanded', opened ? 'false' : 'true');
    });

    // cerrar al hacer click fuera
    document.addEventListener('click', (ev) => {
      if (!widget.contains(ev.target)) {
        menu.style.display = 'none';
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    loginBtn.replaceWith(widget);
  } else {
    // si no hay usuario, transformar el botón en enlace al formulario
    loginBtn.addEventListener('click', () => {
      window.location.href = 'formulario.html';
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyAuthUI);
} else {
  applyAuthUI();
}
