export function daysHeader($table) {
  const $headerRow = $table.find('thead tr#table-header-days')
  if ($headerRow.length === 0 || $headerRow.data('days')) return

  const today = dayjs().date()
  for (let dayNumber = 1; dayNumber <= 31; dayNumber++) {
    const isToday = (dayNumber === today)
    const todayClass = isToday ? 'is-today' : ''
    const thHtml = `
      <th>
        <div class="c-table__day-header ${todayClass}">
          <span>${dayNumber}</span>
        </div>
      </th>
    `
    $headerRow.append(thHtml)
  }
  $headerRow.data('days', true)
}