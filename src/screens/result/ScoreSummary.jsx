import { Badge } from '../../components/ui/Badge.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'
import { PASS_PERCENT } from '../../config.js'
import { toPercent } from '../../lib/exam.js'
import { cx } from '../../lib/format.js'

const domainBarTone = (p) => (p >= PASS_PERCENT ? 'bg-emerald-500' : p >= 50 ? 'bg-orange-500' : 'bg-red-500')

export function ScoreSummary({ result, timedOut, onRestart }) {
  const { passed, percent, correct, total, byDomain } = result

  return (
    <Card className="mt-6 overflow-hidden">
      <div className={cx('h-1.5', passed ? 'bg-emerald-600' : 'bg-red-600')} />
      <div className="grid gap-8 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
        <ScoreRing percent={percent} correct={correct} total={total} passed={passed} />
        <div>
          {timedOut && (
            <p className="mb-3 rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-800 dark:bg-orange-500/10 dark:text-orange-300">
              Se acabó el tiempo. El examen se entregó automáticamente.
            </p>
          )}
          <Badge tone={passed ? 'success' : 'danger'} className="px-3 py-1 text-sm">
            {passed ? '✓ Aprobado' : '✕ No aprobado'}
          </Badge>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
            {passed ? '¡Buen trabajo! Estás listo para el GH-300.' : 'Sigue practicando, ya casi.'}
          </h1>
          <p className="mt-1 text-stone-500 dark:text-stone-400">Mínimo para aprobar: {PASS_PERCENT}%</p>

          <ul className="mt-6 space-y-3">
            {Object.entries(byDomain).map(([domain, d]) => {
              const p = toPercent(d.correct, d.total)
              return (
                <li key={domain}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{domain}</span>
                    <span className="text-stone-500 tabular-nums dark:text-stone-400">
                      {d.correct}/{d.total} · {p}%
                    </span>
                  </div>
                  <ProgressBar value={p} label={domain} barClassName={domainBarTone(p)} />
                </li>
              )
            })}
          </ul>
          <Button variant="primary" className="mt-6" onClick={onRestart}>
            Repetir examen
          </Button>
        </div>
      </div>
    </Card>
  )
}

function ScoreRing({ percent, correct, total, passed }) {
  const color = passed ? 'var(--color-emerald-600)' : 'var(--color-red-600)'
  return (
    <div
      role="img"
      aria-label={`Puntaje ${percent}%`}
      className="mx-auto grid size-40 place-items-center rounded-full"
      style={{ background: `conic-gradient(${color} ${percent * 3.6}deg, rgb(148 163 184 / 0.2) 0)` }}
    >
      <div className="grid size-32 place-items-center rounded-full bg-white text-center dark:bg-stone-900">
        <div>
          <div className="text-4xl font-bold">{percent}%</div>
          <div className="text-xs text-stone-500 dark:text-stone-400">
            {correct}/{total}
          </div>
        </div>
      </div>
    </div>
  )
}
