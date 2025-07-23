function getDayCellContent(dayData) {
  if (!dayData) {
    return '' // Retorna vazio se não houver dados
  }

  switch (dayData.status) {
    case 'active': // No seu código React, 'active' parecia ser o estado disponível.
      // Retorna a HTML para a barra de disponibilidade.
      return '<div class="c-availability-bar"></div>'
    case 'blocked':
      // Retorna a HTML para o indicador de bloqueio.
      return '<div class="c-availability-blocked"></div>'
    default:
      return ''
  }
}

export function createTableBody() {
  dayjs.locale('pt-br')

  // Dados de exemplo (substitua com seus dados reais)
  const availabilityData = [
    { date: '2025-07-21', status: 'active' },
    { date: '2025-07-22', status: 'blocked' },
    { date: '2025-08-10', status: 'active' },
  ]

  const $tbody = $('.c-table').find('tbody')
  $tbody.empty()

  const today = dayjs()
  const currentYear = today.year()
  const tableRowsHtml = []

  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const monthDate = dayjs().year(currentYear).month(monthIndex)
    const monthName = monthDate.format('MMMM')
    const daysInMonth = monthDate.daysInMonth()
    const isCurrentMonth = monthIndex === today.month()

    let rowHtml = '<tr>'

    const monthIndicatorHtml = isCurrentMonth
      ? '<div class="c-table__month-indicator"></div>'
      : ''
    rowHtml += `
        <td class="c-table__cell c-table__cell--month">
            <div class="c-table__month-content">
                <span class="c-table__month-name">${monthName}</span>
                ${monthIndicatorHtml}
            </div>
        </td>
    `

    for (let dayIndex = 0; dayIndex < 31; dayIndex++) {
      const dayNumber = dayIndex + 1
      const isToday = dayNumber === today.date()

      // Lógica para células vazias (dias que não existem no mês)
      if (dayNumber > daysInMonth) {
        rowHtml += '<td class="c-table__cell c-table__cell--day is-empty"><div></div></td>'
        continue // Pula para a próxima iteração
      }

      // Busca os dados do dia
      const dateKey = dayjs(
        `${currentYear}-${monthIndex + 1}-${dayNumber}`,
      ).format('YYYY-MM-DD')
      const dayData = availabilityData.find((d) => d.date === dateKey) || null

      // Gera o conteúdo interno da célula
      const cellInnerContent = getDayCellContent(dayData)

      // Adiciona classes condicionais ao container interno
      const contentClasses = ['c-table__day-content']
      if (dayIndex === 0) contentClasses.push('is-first-day')
      if (dayIndex === 30) contentClasses.push('is-last-day')

      // Monta a célula completa
      const todayClass = isToday ? 'is-today' : ''
      rowHtml += `
          <td class="c-table__cell c-table__cell--day ${todayClass}">
              <div class="${contentClasses.join(' ')}">
                  ${cellInnerContent}
              </div>
          </td>
      `
    }

    rowHtml += '</tr>'
    tableRowsHtml.push(rowHtml)
  }

  $tbody.html(tableRowsHtml.join(''))
}