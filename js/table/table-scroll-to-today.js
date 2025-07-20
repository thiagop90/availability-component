export function scrollToToday($table) {
  const $scrollContainer = $table.closest('.draggable')
  const $todayCell = $table.find('.c-table__day-header.is-today')
  const $stickyCell = $table.find('.c-table__sticky-cell')

  if ($todayCell.length === 0 || $scrollContainer.length === 0) {
    return
  }

  const containerWidth = $scrollContainer.width()
  const stickyCellWidth = $stickyCell.outerWidth()
  const todayCellWidth = $todayCell.outerWidth()
  const todayPositionLeft = $todayCell.parent().position().left

  const scrollableAreaCenter = stickyCellWidth + ((containerWidth - stickyCellWidth) / 2)
  const todayCellCenter = todayPositionLeft + todayCellWidth
  const targetScrollLeft = todayCellCenter - scrollableAreaCenter

  $scrollContainer.animate({
    scrollLeft: targetScrollLeft
  }, 500)
}