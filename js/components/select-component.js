$(document).ready(function () {
  $('.c-select').each(function () {
    const $select = $(this)
    
    const apiEndpoint = $select.data('api-endpoint')
    const paramName = $select.data('param-name')

    if (!apiEndpoint || !paramName) {
      return 
    }
    
    const $input = $select.find('.c-select__input')
    const $trigger = $select.find('.c-select__trigger')
    const $valueDisplay = $select.find('.c-select__value')
    const $content = $select.find('.c-select__content')

    const urlParams = new URLSearchParams(window.location.search)
    const initialValue = urlParams.get(paramName)

    $trigger.on('click', function (e) {
      e.stopPropagation()
      $('.c-select.is-open').not($select).removeClass('is-open')
      $select.toggleClass('is-open')
    })

    $(document).on('click', function (e) {
      if (!$select.is(e.target) && $select.has(e.target).length === 0) {
        $select.removeClass('is-open')
      }
    })

    $content.on('click', '.c-select__item:not(.is-disabled)', function () {
      const $item = $(this)
      const selectedText = $item.text()
      const selectedValue = $item.data('value')

      $valueDisplay.text(selectedText).removeClass('is-placeholder')
      $input.val(selectedValue)
      $select.find('.c-select__item').removeClass('is-selected')
      $item.addClass('is-selected')
      $select.removeClass('is-open')

      const newParams = new URLSearchParams(window.location.search)
      newParams.set(paramName, selectedValue)
      const newUrl = `${window.location.pathname}?${newParams.toString()}`
      history.pushState({ path: newUrl }, '', newUrl)
      
      $select.trigger('change', [selectedValue])
    })
    
    $.getJSON(apiEndpoint)
      .done(function (items) {
        $content.empty()

        if (!items || items.length === 0) {
          $content.append('<li class="c-select__item is-disabled">Nenhuma opção</li>')
          return
        }

        $.each(items, function (i, item) {
          const value = item.slug 
          const text = item.name
          const $itemHtml = $(`<li class="c-select__item" data-value="${value}">${text}</li>`)
          
          if (initialValue && value == initialValue) {
            $valueDisplay.text(text).removeClass('is-placeholder')
            $input.val(value)
            $itemHtml.addClass('is-selected')
          }

          $content.append($itemHtml)
        })
      })
      .fail(function () {
        $content.empty().append('<li class="c-select__item is-disabled">Erro ao carregar</li>')
        console.error(`Falha ao buscar dados de: ${apiEndpoint}`)
      })
  })
})