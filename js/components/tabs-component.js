$(document).ready(function () {
  $('.c-tabs').each(function() {
    const $tabsComponent = $(this)
    const configSrc = $tabsComponent.data('config-src')

    if (!configSrc) {
      console.error('O componente Tabs precisa do atributo data-config-src para funcionar.')
      return
    }
    
    const $tabList = $tabsComponent.find('.c-tabs__list')
    
    function populateTriggers(tabsConfig) {
      $tabList.empty()

      tabsConfig.forEach(tab => {
        const isActive = tab.initial === true
        const activeClass = isActive ? 'is-active' : ''

        const buttonHtml = `
          <button class="c-tabs__trigger ${activeClass}" data-value="${tab.value}">
            ${tab.title}
            <span class="c-badge">0</span>
          </button>
        `
        $tabList.append(buttonHtml)
      })
    }

    function bindEventsAndAria() {
      const $triggers = $tabList.find('.c-tabs__trigger')

      // Define os papéis de acessibilidade ARIA
      $tabList.attr('role', 'tablist')
      $triggers.attr('role', 'tab')

      // Sincroniza o atributo aria-selected com o estado inicial
      $triggers.each(function() {
        const $trigger = $(this)
        $trigger.attr('aria-selected', $trigger.hasClass('is-active'))
      })

      // Adiciona o listener de clique
      $triggers.on('click', function(e) {
        e.preventDefault()
        const $clickedTrigger = $(this)

        if (!$clickedTrigger.hasClass('is-active')) {
          // Atualiza os estados visuais
          $triggers.removeClass('is-active').attr('aria-selected', 'false')
          $clickedTrigger.addClass('is-active').attr('aria-selected', 'true')
          
          const selectedValue = $clickedTrigger.data('value')
          $tabsComponent.trigger('change', [selectedValue])
        }
      })
    }

    function init() {
      $.getJSON(configSrc)
        .done(function(config) {
          if (config && config.tabs) {
            // 1. Gera os botões a partir do JSON
            populateTriggers(config.tabs)
            // 2. Adiciona a interatividade e acessibilidade aos botões gerados
            bindEventsAndAria()
          } else {
            console.error('Formato do JSON de configuração inválido.', configSrc)
          }
        })
        .fail(function() {
          console.error(`Não foi possível carregar o arquivo de configuração: ${configSrc}`)
        })
    }

    init()
  })
})