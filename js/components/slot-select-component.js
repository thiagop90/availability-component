import { openSlotDialog } from './slot-dialog-manager.js'

export function createSlotSelect({ target }) {
  const SLOT_STORAGE_KEY = 'selectedSlot'
  const PLACEHOLDER = 'Selecione um slot'
  let currentService = null

  let savedSlot = JSON.parse(localStorage.getItem(SLOT_STORAGE_KEY))

  const initialText = savedSlot ? savedSlot.name : PLACEHOLDER
  const placeholder = !savedSlot ? 'is-placeholder' : ''

  const componentHTML = `
    <div class="c-select c-select--slots" data-component="slot-select">
      <div class="c-select__trigger" tabindex="0">
        <span class="c-select__value ${placeholder}">${initialText}</span>
        <svg class="c-select__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <ul class="c-select__content"></ul>
    </div>
  `
  const $container = $(target)
  $container.html(componentHTML)

  const $select = $container.find('[data-component="slot-select"]')
  const $value = $select.find('.c-select__value')
  const $content = $select.find('.c-select__content')

  const closeDropdown = () => $select.removeClass('is-open')
  
  const renderItems = (slots) => {
    $content.empty()
    const currentName = savedSlot ? savedSlot.name : null

    if (slots && slots.length > 0) {
      slots.forEach(slot => {
        const isSelected = currentName === slot.name
        const selectedClass = isSelected ? 'is-selected' : ''

        const itemHTML = `
          <li class="c-select__item-wrapper">
            <div class="c-select__item ${selectedClass}" data-value="${slot.slug}" data-name="${slot.name}">
              ${slot.name}
            </div>
            <div class="c-select__item-actions">
              <button class="c-btn c-btn--icon c-btn--ghost c-btn--update" title="Editar slot" data-slot-id="${slot.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
              </button>
              <div class="c-select__item-actions-separator"></div>
              <button class="c-btn c-btn--icon c-btn--ghost c-btn--delete" title="Excluir slot" data-slot-id="${slot.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </li>
        `
        $content.append(itemHTML)
      })
    } else {
      $content.html('<li class="c-select__item is-disabled">Nenhum slot encontrado.</li>')
    }

    $content.append('<div class="c-select__separator"></div>')
    $content.append('<li class="c-btn c-btn--ghost item--add-new">Adicionar Slot</li>')
  }

  const bindEvents = () => {
    $select.on('click', '.c-select__trigger', (e) => {
      if ($select.is('.is-disabled')) return
      e.stopPropagation()
      $select.toggleClass('is-open')
    })

    $select.on('click', '.c-select__item', function() {
      const $item = $(this)
      if ($item.is('.is-disabled')) return
      
      const name = $item.data('name')

      localStorage.setItem(SLOT_STORAGE_KEY, JSON.stringify({ name }))
      
      $value.text(name).removeClass('is-placeholder')
      $content.find('.c-select__item').removeClass('is-selected')
      $item.addClass('is-selected')
      closeDropdown()
    })

    $select.on('click', '.c-btn--update', function(e) {
      e.stopPropagation()
      const $item = $(this).closest('.c-select__item-wrapper').find('.c-select__item')
      openSlotDialog({
        mode: 'update',
        title: 'Atualizar slot',
        slotId: $(this).data('slot-id'),
        serviceId: currentService.id,
        slotName: $item.data('name'),
        onSuccess: () => $(document).trigger('service:selected', { service: currentService })
      })
      closeDropdown()
    })

    $select.on('click', '.c-btn--delete', function(e) {
      e.stopPropagation()
      openSlotDialog({
        mode: 'delete',
        title: 'Confirmar exclusão',
        slotId: $(this).data('slot-id'),
        onSuccess: () => $(document).trigger('service:selected', { service: currentService })
      })
      closeDropdown()
    })
    
    $select.on('click', '.item--add-new', function() {
      openSlotDialog({
        mode: 'add',
        title: 'Adicionar novo slot',
        serviceId: currentService.id,
        onSuccess: () => $(document).trigger('service:selected', { service: currentService })
      })
      closeDropdown()
    })

    $(document).on('click', (e) => {
      if (!$select.is(e.target) && $select.has(e.target).length === 0) closeDropdown()
    })

    $(document).on('keydown', (e) => {
      if (e.key === "Escape") closeDropdown()
    })

    $(document).on('service:selected', function(event, data) {
      currentService = data.service
      $select.removeClass('is-disabled')
      const savedSlot = JSON.parse(localStorage.getItem(SLOT_STORAGE_KEY))

      if (!savedSlot) {
        $value.text(PLACEHOLDER).addClass('is-placeholder')
      }

      $.ajax({
        url: `http://localhost:3333/api/slots/service/${currentService.id}`,
        method: 'GET'
      }).done(renderItems)
    })
  }
  
  bindEvents()
}