import { Logo } from '../../components/Logo.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { EXAM_MINUTES, PASS_PERCENT, SOURCES } from '../../config.js'
import { countByDomain } from '../../lib/exam.js'

export function StartScreen({ questions, onStart }) {
  const stats = [
    [questions.length, 'preguntas'],
    [EXAM_MINUTES, 'minutos'],
    [`${PASS_PERCENT}%`, 'para aprobar'],
  ]

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:py-20">
      <Logo />
      <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-6xl">
        Simulador de examen <span className="text-accent-700 dark:text-accent-400">GitHub Copilot</span>
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-stone-600 dark:text-stone-400">
        Practica para la certificación GH-300 en condiciones reales: tiempo límite, preguntas aleatorias y una revisión
        detallada con explicaciones y enlaces para repasar cada tema.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map(([value, label]) => (
          <Card key={label} as="div" className="p-4 text-center sm:p-6">
            <div className="text-2xl font-bold sm:text-4xl">{value}</div>
            <div className="mt-1 text-xs text-stone-500 sm:text-sm dark:text-stone-400">{label}</div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-5 sm:p-6">
        <h2 className="text-sm font-semibold tracking-wider text-stone-500 uppercase dark:text-stone-400">
          Temas evaluados
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {Object.entries(countByDomain(questions)).map(([domain, count]) => (
            <li
              key={domain}
              className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-sm dark:bg-white/5"
            >
              <span>{domain}</span>
              <Badge>{count}</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Button variant="primary" size="lg" onClick={onStart}>
          Comenzar examen →
        </Button>
        <p className="text-sm text-stone-500 dark:text-stone-400">El tiempo empieza a correr al comenzar.</p>
      </div>

      <footer className="mt-12 text-xs text-stone-500">
        Preguntas basadas en{' '}
        <a className="underline hover:text-accent-500" href={SOURCES.ghcertified} target="_blank" rel="noreferrer">
          ghcertified.com
        </a>{' '}
        (GPL-3.0) y en los temas de la{' '}
        <a className="underline hover:text-accent-500" href={SOURCES.certification} target="_blank" rel="noreferrer">
          certificación oficial
        </a>
        . No es material oficial de GitHub ni de Microsoft.
      </footer>
    </main>
  )
}
