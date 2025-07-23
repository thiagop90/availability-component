import { createDaysHeader } from './table-days-header.js'
import { createTableBody } from './table-body.js'
import { initializeDraggableScroll } from './table-draggable-scroll.js'
import { initializeScrollToToday } from './table-scroll-to-today.js'

export function createTable({ target }) {
  const tableHTML = `
    <div class="draggable">
      <table class="c-table">
        <thead>
          <tr id="table-header-days">
            <th class="c-table__sticky-cell">
              <div class="c-table__sticky-cell-content">
                <div class="c-slot-manager"></div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  `

  const $targetContainer = $(target)
  $targetContainer.html(tableHTML)

  const $table = $targetContainer.find('.c-table')
  
  createDaysHeader($table)
  createTableBody($table)
  initializeDraggableScroll($table)
  initializeScrollToToday($table)
}