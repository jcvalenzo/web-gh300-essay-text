export const EXAM_MINUTES = 100
export const EXAM_QUESTIONS = 60
// Midpoint of each domain's range in the official GH-300 study guide (skills measured as of 2026-08-07).
// They add up to 0.95, so they are used as relative weights.
export const DOMAIN_WEIGHTS = {
  'IA responsable': 0.175,
  'Funcionalidades de Copilot': 0.275,
  'Datos y arquitectura': 0.125,
  'Ingeniería de prompts y contexto': 0.125,
  'Productividad del desarrollador': 0.125,
  'Privacidad, exclusiones y salvaguardas': 0.125,
}
export const PASS_PERCENT = 70
export const REVIEW_PAGE_SIZE = 5
export const LOW_TIME_MS = 10 * 60_000
export const CRITICAL_TIME_MS = 60_000

export const SOURCES = {
  ghcertified: 'https://ghcertified.com/es/questions/copilot',
  certification: 'https://learn.microsoft.com/es-es/credentials/certifications/github-copilot/',
}
