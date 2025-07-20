import { daysHeader } from './table-days-header.js'
import { draggableScroll } from './table-draggable-scroll.js'
import { scrollToToday } from './table-scroll-to-today.js'

$(document).ready(function () {
  $('.c-table').each(function() {
    const $table = $(this)
    function init() {
      draggableScroll($table)
      daysHeader($table)
      scrollToToday($table)
    }
    init()
  })
})