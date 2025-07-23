export function createTabs({ target, configPath }) {
  const $targetContainer = $(target)

  $.getJSON(configPath)
    .done(function(data) {
      if (!data || !data.tabs) {
        console.error('Formato do JSON de abas inválido ou arquivo não encontrado.')
        return
      }
      
      const $tabsComponent = $('<div class="c-tabs"></div>')
      const $tabList = $('<div class="c-tabs__list" role="tablist"></div>')
      
      $.each(data.tabs, function(index, tab) {
        const isActive = tab.initial === true
        const button = $(`
          <button 
            type="button" 
            class="c-tabs__trigger" 
            role="tab" 
            data-value="${tab.value}">
            ${tab.title}
            <span class="c-badge">0</span>
          </button>
        `)

        if (isActive) {
          button.addClass('is-active').attr('aria-selected', 'true')
        } else {
          button.attr('aria-selected', 'false')
        }
        $tabList.append(button)
      })
      
      $tabsComponent.append($tabList)
      $targetContainer.prepend($tabsComponent)
      
      $tabList.on('click', '.c-tabs__trigger', function(e) {
        e.preventDefault()
        const $clickedTrigger = $(this)

        if (!$clickedTrigger.hasClass('is-active')) {
          $tabList.find('.c-tabs__trigger.is-active')
            .removeClass('is-active')
            .attr('aria-selected', 'false')
          
          $clickedTrigger.addClass('is-active').attr('aria-selected', 'true')
          
          const selectedValue = $clickedTrigger.data('value')
          $tabsComponent.trigger('change', [selectedValue])
        }
      })
      
    })
    .fail(function() {
      console.error(`Erro ao carregar o arquivo de configuração de abas de: ${configPath}`)
    })
}