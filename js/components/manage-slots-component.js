export default function ManageSlotsComponent() {
  const $component = $('.c-manage-slots');
  if ($component.length === 0) return;

  const $select = $component.find('.c-select');
  const $selectTrigger = $select.find('.c-select__trigger');
  const $selectValue = $select.find('.c-select__value');
  const $selectContent = $select.find('.c-select__content');
  const $input = $select.find('.c-select__input');
  
  const $prevButton = $component.find('[data-action="prev-slot"]');
  const $nextButton = $component.find('[data-action="next-slot"]');

  const API_ENDPOINT = $component.data('api-endpoint');
  
  let slots = [];
  let currentSlotIndex = -1;

  // Atualiza a URL sem recarregar a página
  function updateURL(paramName, paramValue) {
    const url = new URL(window.location);
    if (paramValue) {
      url.searchParams.set(paramName, paramValue);
    } else {
      url.searchParams.delete(paramName);
    }
    window.history.pushState({}, '', url);
    // Dispara um evento para notificar outros componentes (ex: a tabela)
    $(window).trigger('urlchange');
  }

  // Atualiza a UI (botões de navegação e valor do seletor)
  function updateUI() {
    if (slots.length === 0) {
      $component.hide();
      return;
    }
    $component.show();

    const selectedSlot = slots[currentSlotIndex];
    if (selectedSlot) {
      $selectValue.text(selectedSlot.name).removeClass('is-placeholder');
      $input.val(selectedSlot.slug);
    }

    // Lógica para desabilitar/habilitar botões
    $prevButton.prop('disabled', currentSlotIndex <= 0);
    $nextButton.prop('disabled', currentSlotIndex >= slots.length - 1);
  }
  
  // Renderiza a lista de slots no dropdown
  function renderSlots() {
    $selectContent.find('.slot-item').remove(); // Limpa itens antigos
    
    slots.forEach(slot => {
      const $item = $(`
        <li class="c-select__item slot-item" data-value="${slot.slug}">
          ${slot.name}
        </li>
      `);
      $item.insertBefore($selectContent.find('.c-select__separator'));
    });
  }

  // Navega para um slot específico (anterior ou próximo)
  function navigate(direction) {
    const newIndex = currentSlotIndex + direction;
    if (newIndex >= 0 && newIndex < slots.length) {
      currentSlotIndex = newIndex;
      const newSlug = slots[currentSlotIndex].slug;
      updateURL($input.data('param-name'), newSlug);
      updateUI();
    }
  }

  // Busca os slots para o serviço selecionado
  async function fetchSlots(serviceId) {
    try {
      const response = await fetch(`${API_ENDPOINT}/${serviceId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      slots = await response.json();
      
      renderSlots();

      const params = new URLSearchParams(window.location.search);
      const currentSlotSlug = params.get($input.data('param-name'));
      currentSlotIndex = slots.findIndex(s => s.slug === currentSlotSlug);
      
      if (currentSlotIndex === -1 && slots.length > 0) {
        currentSlotIndex = 0;
        updateURL($input.data('param-name'), slots[0].slug);
      }
      
      updateUI();
    } catch (error) {
      console.error("Failed to fetch slots:", error);
      slots = [];
      $component.hide();
    }
  }

  // Evento para quando o serviço for alterado (disparado pelo select-component.js)
  $(document).on('serviceChanged', (e, serviceId) => {
    if (serviceId) {
      fetchSlots(serviceId);
    } else {
      slots = [];
      $component.hide();
    }
  });

  // Evento para seleção de item no dropdown
  $selectContent.on('click', '.slot-item', function() {
    const slug = $(this).data('value');
    currentSlotIndex = slots.findIndex(s => s.slug === slug);
    updateURL($input.data('param-name'), slug);
    updateUI();
    $selectContent.removeClass('is-open');
  });
  
  // Eventos para os botões de navegação
  $prevButton.on('click', () => navigate(-1));
  $nextButton.on('click', () => navigate(1));

  // Inicialização
  const initialParams = new URLSearchParams(window.location.search);
  const initialServiceId = initialParams.get('service'); // Assumindo que o select de serviço usa o param 'service'
  if (initialServiceId) {
    // É preciso garantir que o serviceId venha do slug, não do ID.
    // Isso pode exigir uma chamada extra ou uma mudança na API.
    // Por simplicidade aqui, vamos assumir que o serviceId está disponível.
    // fetchSlots(initialServiceId); // A lógica real precisa ser mais robusta
  } else {
    $component.hide();
  }
}