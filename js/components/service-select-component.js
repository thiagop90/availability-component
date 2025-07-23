export function createServiceSelect({ target }) {
  const STORAGE_KEY = 'selectedService'
  const PLACEHOLDER = 'Selecione um serviço'

  let savedService = JSON.parse(localStorage.getItem(STORAGE_KEY))

  const initialText = savedService ? savedService.name : PLACEHOLDER
  const placeholder = !savedService ? 'is-placeholder' : ''

  const componentHTML = `
    <div class="c-select c-select--services" data-component="service-select">
      <button class="c-select__trigger" tabindex="0">
        <span class="c-select__value ${placeholder}">${initialText}</span>
        <svg class="c-select__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <ul class="c-select__content"></ul>
    </div>
  `
  const $container = $(target)
  $container.append(componentHTML)

  const $wrapper = $container.find('[data-component="service-select"]')
  const $value = $wrapper.find('.c-select__value')
  const $content = $wrapper.find('.c-select__content')

  const closeDropdown = () => $wrapper.removeClass('is-open')

  const renderItems = (services) => {
    $content.empty()
    const currentName = savedService ? savedService.name : null

    services.forEach(service => {
      const isSelected = currentName === service.name
      const selectedClass = isSelected ? 'is-selected' : ''

      const itemHTML = `
        <li class="c-select__item ${selectedClass}" data-value="${service.id}">
          ${service.name}
        </li>
      `
      $content.append(itemHTML)
    })
  }

  const bindEvents = () => {
    $wrapper.on('click', '.c-select__trigger', (e) => {
      e.stopPropagation()
      $wrapper.toggleClass('is-open')
    })

    $wrapper.on('click', '.c-select__item', function() {
      const $item = $(this)
      
      const currentName = savedService ? savedService.name : null

      if (currentName === $item.text()) {
        closeDropdown()
        return
      }
      
      localStorage.removeItem('selectedSlot')

      const serviceToSave = {
        id: $item.data('value'),
        name: $item.text()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serviceToSave))

      savedService = serviceToSave

      $value.text(serviceToSave.name).removeClass('is-placeholder')
      $content.find('.c-select__item').removeClass('is-selected')
      $item.addClass('is-selected')
      $(document).trigger('service:selected', { service: serviceToSave })
      
      closeDropdown()
    })

    $(document).on('click', (e) => {
      if (!$wrapper.is(e.target) && $wrapper.has(e.target).length === 0) closeDropdown()
    })

    $(document).on('keydown', (e) => {
      if (e.key === "Escape") closeDropdown()
    })
  }

  $.ajax({ url: 'http://localhost:3333/api/services', method: 'GET' }).done(renderItems)
  bindEvents()
}