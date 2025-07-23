export function initializeDraggableScroll($table) {
  const $draggableElement = $table.closest('.draggable')
  if ($draggableElement.length === 0) return

  let isDragging = false
  let startX
  let scrollLeft

  $draggableElement.on('mousedown', function(e) {
    const ignoredTags = /^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/i
    if (e.which !== 1 || ignoredTags.test(e.target.tagName) || $(e.target).closest('.c-select').length) {
      return
    }
    
    isDragging = true
    $draggableElement.addClass('is-grabbing')
    startX = e.pageX - $draggableElement.offset().left
    scrollLeft = $draggableElement.scrollLeft()
  })

  $draggableElement.on('mouseleave', function() {
    isDragging = false
    $draggableElement.removeClass('is-grabbing')
  })

  $draggableElement.on('mouseup', function() {
    isDragging = false
    $draggableElement.removeClass('is-grabbing')
  })

  $draggableElement.on('mousemove', function(e) {
    if (!isDragging) return
    e.preventDefault() 
    
    const x = e.pageX - $draggableElement.offset().left
    const walk = (x - startX)
    $draggableElement.scrollLeft(scrollLeft - walk)
  })
}