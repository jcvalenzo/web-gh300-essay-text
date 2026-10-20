# Simulador GH-300 (GitHub Copilot)

App React + Vite que simula el examen de certificación GH-300: 60 preguntas aleatorias repartidas según los pesos
oficiales de cada dominio (o el banco completo de 133, a elección en la pantalla inicial), 100 minutos, 70% para
aprobar, y al final revisión con respuesta correcta, explicación y enlace a la documentación.

## Desarrollo

Requiere Node 22 (`nvm use` lee `.nvmrc`).

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # tests (ver sección Tests)
npm run lint         # ESLint (reglas recomendadas + React Hooks + React Refresh)
npm run format       # Prettier (ordena también las clases de Tailwind)
npm run check        # lint + formato + tests; ejecútalo antes de hacer commit
```

## Tests

Se usa [Vitest](https://vitest.dev/) con [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
sobre jsdom. No necesitan navegador ni servidor levantado.

### Ejecutar

```bash
npm test                                  # todos los tests una vez (lo que usa CI/Docker)
npm run test:watch                        # modo watch: re-ejecuta al guardar
npm test -- test/lib/exam.test.js         # un archivo
npm test -- test/screens                  # una carpeta
npm test -- -t "sessionReducer"           # por nombre de test o describe
npx vitest run --reporter=verbose         # lista cada test con su resultado
npm run check                             # lint + formato + tests (antes de cada commit)
```

Salida esperada de `npm test`:

```
 Test Files  11 passed (11)
      Tests  194 passed (194)
```

En Docker, los tests se ejecutan durante el build; para correr solo lint y tests sin generar la imagen final:

```bash
docker build --target build .
```

### Qué se prueba

| Archivo                                     | Tipo        | Cubre                                                                                                                                   |
| ------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `test/data/questions.test.js`               | Datos       | Cada pregunta tiene texto, dominio, explicación, enlace `https` y respuestas válidas; ids únicos                                        |
| `test/lib/exam.test.js`                     | Unitario    | Selección por pesos de dominio, mezcla sin perder la respuesta correcta, corrección, selección única/múltiple, calificación por dominio |
| `test/lib/session.test.js`                  | Unitario    | Reducer: inicio, responder, marcar, navegar, entregar una sola vez, acciones inválidas                                                  |
| `test/lib/paginate.test.js`                 | Unitario    | Páginas, última página incompleta, páginas fuera de rango, lista vacía                                                                  |
| `test/lib/format.test.js`                   | Unitario    | Formato `mm:ss` del temporizador y `cx`                                                                                                 |
| `test/hooks/useCountdown.test.js`           | Hook        | Cuenta regresiva y aviso al expirar (timers simulados)                                                                                  |
| `test/components/ui/Pagination.test.jsx`    | Componente  | Página actual, botones deshabilitados, navegación                                                                                       |
| `test/screens/exam/QuestionCard.test.jsx`   | Componente  | Radios vs checkboxes, selección, navegación, terminar en la última pregunta, marcar                                                     |
| `test/screens/exam/FinishDialog.test.jsx`   | Componente  | Resumen del modal, confirmar y cancelar                                                                                                 |
| `test/screens/result/ResultScreen.test.jsx` | Componente  | Puntaje, desglose, aviso de tiempo agotado, paginación y filtros de la revisión                                                         |
| `test/App.test.jsx`                         | Integración | Flujo completo comenzar → responder → modal → resultados → repetir; elegir 60 o todas; entrega por tiempo                               |

### Convenciones para agregar tests

- Los tests viven en `test/`, replicando la estructura de `src/`: `src/components/ui/Pagination.jsx` se prueba en
  `test/components/ui/Pagination.test.jsx` (mismo nombre con sufijo `.test.js` o `.test.jsx`).
- La lógica nueva va en `src/lib/` como función pura y se prueba sin React.
- En componentes, busca elementos como lo haría un usuario (`getByRole`, `getByText`) y simula interacciones con
  `userEvent`; evita depender de clases CSS.
- Para el tiempo usa `vi.useFakeTimers()` y `vi.advanceTimersByTime()`, nunca esperas reales.
- `test/setup.js` registra los matchers de jest-dom, limpia el DOM tras cada test y simula `<dialog>` y el
  scroll, que jsdom no implementa.

## Docker

```bash
docker build -t gh300-sim .
docker run --rm -p 8080:80 gh300-sim   # http://localhost:8080
```

## Estructura

```
src/
├── config.js            # Constantes del examen (tiempo, nº de preguntas, pesos por dominio, % aprobación, tamaño de página, fuentes)
├── data/questions.json  # Banco de preguntas
├── lib/                 # Lógica pura sin React
│   ├── exam.js          #   mezclar, corregir, calificar, resumir progreso
│   ├── session.js       #   reducer: máquina de estados start → exam → result
│   ├── paginate.js
│   └── format.js        #   formatTime, cx (unión de clases)
├── hooks/
│   ├── useExamSession.js  # Conecta el reducer con React y expone acciones
│   └── useCountdown.js    # Temporizador con callback al expirar
├── components/
│   ├── Logo.jsx
│   └── ui/              # Componentes base reutilizables: Button, Card, Badge, ProgressBar, Pagination
├── screens/             # Una carpeta por pantalla, con sus subcomponentes
│   ├── start/
│   ├── exam/            #   ExamHeader, QuestionCard, QuestionNavigator, FinishDialog
│   └── result/          #   ScoreSummary, ReviewFilters (+ filters.js), ReviewItem
├── App.jsx              # Solo decide qué pantalla mostrar según la fase
└── index.css            # Tailwind + token de color `accent`
test/                    # Tests, con la misma estructura de carpetas que src/
└── setup.js             # Setup de Vitest (jest-dom, stubs de <dialog> y scroll para jsdom)
```

## Principios aplicados

- **Separación de responsabilidades:** la lógica de negocio vive en `lib/` (funciones puras, testeables sin
  navegador); los componentes solo presentan datos y emiten eventos.
- **Reducer / máquina de estados:** todas las transiciones del examen pasan por `sessionReducer`, que ignora
  acciones inválidas (por ejemplo, responder después de entregar).
- **Custom hooks:** `useExamSession` y `useCountdown` encapsulan estado y efectos; `App` queda declarativo.
- **Componentes de presentación reutilizables (DRY):** las variantes visuales están en `components/ui`, no
  repetidas como cadenas de clases.
- **Configuración centralizada:** valores mágicos en `config.js`; el color de acento es un token en `index.css`
  (cambiarlo ahí reestiliza toda la app).
- **Accesibilidad:** inputs nativos, `<dialog>` nativo, roles `timer`, `progressbar`, `tablist` y etiquetas ARIA.

## Preguntas

`src/data/questions.json` (`answer` = índices de las opciones correctas, `docs` = enlace para repasar).

- `ghc-*`: tomadas de [ghcertified.com](https://ghcertified.com/es/questions/copilot)
  ([repo](https://github.com/v-fidelusaleksander/ghcertified), licencia GPL-3.0), con explicaciones añadidas. Se
  quitaron las que trataban la extensión `gh copilot` (retirada en octubre de 2025) y se actualizó la de Copilot
  Extensions (reemplazadas por MCP).
- `ms-*`: las 50 preguntas de la [evaluación de práctica oficial](https://learn.microsoft.com/es-es/credentials/certifications/github-copilot/?practice-assessment-type=certification)
  de Microsoft, con su explicación; las opciones incorrectas son propias, porque el informe solo muestra la correcta.
- `ext-*`: preguntas propias que cubren los temas de la
  [guía de estudio oficial](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
  (habilidades medidas desde el 7 de agosto de 2026) que faltaban en las otras fuentes.

No es material oficial de GitHub ni de Microsoft.
