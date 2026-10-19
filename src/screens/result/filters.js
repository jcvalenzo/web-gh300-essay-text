export const REVIEW_FILTERS = [
  { key: 'all', label: 'Todas', test: () => true },
  { key: 'wrong', label: 'Incorrectas', test: (item) => !item.ok },
  { key: 'right', label: 'Correctas', test: (item) => item.ok },
]
