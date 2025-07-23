import { toast } from './toast-component.js'

const dialogModes = {
  add: {
    title: 'Adicionar novo slot',
    submitText: 'Adicionar',
    buildBodyHTML: () => `
      <div class="dialog-body">       
        <label for="slot-name-input" class="label">Nome do slot</label>    
        <input type="text" id="slot-name-input" name="name" class="input" placeholder="Ex: Cadeira 1, Sala A..." />
      </div>
    `,
    getAjaxOptions: (config) => ({
      method: 'POST',
      url: 'http://localhost:3333/api/slots',
      contentType: 'application/json',
      data: JSON.stringify({ name: $('#slot-name-input').val(), serviceId: config.serviceId }),
    }),
  },
  update: {
    title: 'Atualizar slot',
    submitText: 'Atualizar',
    buildBodyHTML: (config) => `
      <div class="dialog-body">        
        <label for="slot-name-input" class="label">Novo nome</label>       
        <input type="text" id="slot-name-input" name="name" class="input" value="${config.slotName}" placeholder="Ex: Cadeira 1, Sala A..." />
      </div>
    `,
    getAjaxOptions: (config) => ({
      method: 'PUT',
      url: `http://localhost:3333/api/slots/${config.slotId}`,
      contentType: 'application/json',
      data: JSON.stringify({ name: $('#slot-name-input').val(), serviceId: config.serviceId }),
    }),
  },
  delete: {
    title: 'Confirmar exclusão',
    submitText: 'Confirmar',
    submitClass: 'c-btn--destructive',
    buildBodyHTML: () => `
      <div class="dialog-body">
        <div class="c-alert c-alert--destructive">
          <svg class="c-alert__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <div class="c-alert__text">
            <strong>Esta ação não pode ser desfeita.</strong>
            <span>Tem certeza que deseja excluir o slot?</span>
          </div>
        </div>
      </div>
    `,
    getAjaxOptions: (config) => ({
      method: 'DELETE',
      url: `http://localhost:3333/api/slots/${config.slotId}`,
    }),
  },
}

export function openSlotDialog(options) {
  const config = { onSuccess: () => {}, ...options }
  const modeConfig = dialogModes[config.mode]

  if (!modeConfig) {
    console.error(`Modo de diálogo desconhecido: ${config.mode}`)
    return
  }

  const contentExtraClass = config.mode === 'delete' ? 'dialog-content--delete' : ''

  const dialogHTML = `
    <div class="dialog-overlay" data-component="slot-dialog-overlay">
      <div class="dialog-content ${contentExtraClass}">
        <div class="dialog-inner">
          <form id="slot-dialog-form">
            <div class="dialog-header">
              <h3 class="dialog-title">${modeConfig.title}</h3>
            </div>
            ${modeConfig.buildBodyHTML(config)}
            <div class="dialog-footer">
              <button type="button" class="c-btn c-btn--outline" data-action="close">Cancelar</button>
              <button type="submit" class="c-btn ${modeConfig.submitClass || 'c-btn--default'}">
                <span class="btn-text">${modeConfig.submitText}</span>
                <div class="btn-loader"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
  $('body').append(dialogHTML)

  const $overlay = $('[data-component="slot-dialog-overlay"]')
  const $form = $('#slot-dialog-form')
  const $submitBtn = $form.find('[type="submit"]')
  const $input = $form.find('#slot-name-input')

  // 2. Lógica para exibir e fechar o diálogo (sem alterações)
  const closeDialog = () => {
    $overlay.removeClass('show')
    $(document).off('keydown.slotDialog')
    setTimeout(() => $overlay.remove(), 200)
  }
  
  setTimeout(() => {
    $overlay.addClass('show')
    
    if ($input) {
      $input.focus()

      if ($input.length > 0) {
        $input.select()
      }
    }
  }, 0)

  $overlay.on('click', '[data-action="close"]', closeDialog);

  $overlay.on('click', function(e) {
    if (e.target === e.currentTarget) {
      closeDialog();
    }
  })
  
  $overlay.on('click', '[data-action="close"], .dialog-overlay', (e) => {
    if (e.target !== e.currentTarget && !$(e.target).is('[data-action="close"]')) return
    closeDialog()
  })

  $(document).on('keydown.slotDialog', (e) => {
    if (e.key === "Escape") {
      closeDialog();
    }
  })


  $form.on('submit', function(e) {
    e.preventDefault()
    const ajaxOptions = modeConfig.getAjaxOptions(config)

    $.ajax({
      ...ajaxOptions,
      beforeSend: () => $submitBtn.prop('disabled', true).addClass('is-loading'),
      success: (response) => {
        toast.success('Slot adicionado com sucesso!')
        config.onSuccess(response)
        closeDialog()
      },
      error: (jqXHR) => {
        const errorMsg = jqXHR.responseJSON?.message || 'Ocorreu um erro.'
        toast.error(errorMsg) 
      },
      complete: () => $submitBtn.prop('disabled', false).removeClass('is-loading'),
    })
  })
}