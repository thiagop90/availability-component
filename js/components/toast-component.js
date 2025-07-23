const TOAST_CONTAINER_ID = 'c-toaster-main';
let toastContainer = null;

const icons = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

// Função privada para mostrar um toast
function _show(options) {
  const config = {
    type: 'info',
    title: '',
    description: '',
    duration: 4000,
    ...options,
  };

  const toastHTML = `
    <div class="c-toast c-toast--${config.type}">
      <div class="c-toast__icon">${icons[config.type] || ''}</div>
      <div class="c-toast__content">
        <div class="c-toast__title">${config.title}</div>
        ${config.description ? `<div class="c-toast__description">${config.description}</div>` : ''}
      </div>
    </div>
  `;
  const $toast = $(toastHTML);

  // Adiciona ao container
  toastContainer.append($toast);

  // Lógica para remover o toast
  const dismiss = () => {
    $toast.addClass('is-hiding');
    // Remove do DOM após a animação de saída terminar
    $toast.one('animationend', () => $toast.remove());
  };

  // Auto-dismiss após a duração
  const timer = setTimeout(dismiss, config.duration);

  // Permite que o usuário feche manualmente
  $toast.on('click', () => {
    clearTimeout(timer);
    dismiss();
  });
}

// Objeto público que será exportado
export const toast = {
  success: (title, description) => _show({ type: 'success', title, description }),
  error: (title, description) => _show({ type: 'error', title, description }),
};

// Função de inicialização para criar o container
export function initializeToaster() {
  if (document.getElementById(TOAST_CONTAINER_ID)) return;
  
  toastContainer = $(`<div id="${TOAST_CONTAINER_ID}" class="c-toaster"></div>`);
  $('body').append(toastContainer);
}