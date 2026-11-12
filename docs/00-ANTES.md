# 00 — El "antes"

Punto de partida de MercadoTech Lite, sesión 1. Todo lo de aquí es una medición
o una decisión escrita; lo que no se midió dice "sin medir".

Fecha: 2026-11-11 · Máquina: Windows 11 Pro 10.0.26300

## 1. Entorno

| Herramienta | Comando           | Salida real                    | Lectura                         |
| ----------- | ----------------- | ------------------------------ | ------------------------------- |
| Claude Code | `claude --version` | `2.1.317 (Claude Code)`        | instalado y autenticado         |
| Node        | `node --version`  | `v24.13.0`                     | cumple el mínimo de 20          |
| npm         | `npm --version`   | `11.8.0`                       | viene con Node                  |
| Git         | `git --version`   | `git version 2.56.1.windows.1` | instalado                       |

No se instaló nada: no faltaba ningún requisito.

Memoria global: `~/.claude/CLAUDE.md` no existe. En `~/.claude/skills/` solo
hay Skills sincronizadas de Anthropic (documentos y navegador) y una Skill
propia en la papelera, inactiva. Ninguna trae convenciones de código.

## 2. Cómo pago

Tengo un **plan de Claude** (suscripción mensual, precio fijo).
Cuando se agota el uso del periodo, Claude Code deja de responder hasta que el
límite se reinicia: no me cobra más, me frena.

- **Plan:** techo de **uso**. El precio no se mueve; lo que se acaba es la
  cuota, y se acaba antes cuanto más largas son las conversaciones.
- **Saldo de API:** techo de **dinero**. Pago por token; no hay corte por uso,
  el corte llega cuando se vacía el saldo.
- **Lo que me va a frenar primero:** el límite de uso del plan, en una
  generación larga como la de la 1.2. El costo en dinero de cada conversación
  puede no aparecer por conversación; si no aparece, se anota "sin medir".

## 3. Modo de aprobación

Modos que ofrece esta instalación, según `claude --help`
(`--permission-mode`, choices: `acceptEdits, auto, bypassPermissions, manual,
dontAsk, plan`). En `~/.claude/settings.json` no hay bloque `permissions`.

De "pregunta por todo" a "actúa sin preguntar":

| # | Modo                | Qué hace sin preguntar                                                                 |
| - | ------------------- | -------------------------------------------------------------------------------------- |
| 1 | `plan`              | Nada: lee y propone, no edita ni ejecuta.                                              |
| 2 | `manual`            | Lee. Pregunta cada edición y cada comando.                                             |
| 3 | `acceptEdits`       | Crea y edita archivos. Pregunta los comandos.                                          |
| 4 | `auto`              | Un clasificador decide qué aprueba solo y qué pregunta.                                |
| 5 | `dontAsk`           | No pregunta nunca; deniega lo que no esté preaprobado (con la configuración vacía, casi todo). |
| 6 | `bypassPermissions` | Todo, sin comprobaciones. La ayuda lo recomienda solo para sandboxes sin internet.     |

**Elegido: `manual`.**

**Riesgo que acepto:** después de aprobar decenas de pasos seguidos, que yo
apruebe sin leerlo un comando que no quería —un `npm install` de un paquete que
nadie pidió o un borrado de archivos—, porque en este modo la última barrera
soy yo y no el agente.

Costo esperado del modo: muchas interrupciones durante la 1.2. Se cuentan en la
factura (1.3) como "veces que pidió aprobación".

## 4. Criterio para elegir modelo

Solo el criterio; la elección medida es la sesión 3.

- Vale pagar por capacidad cuando **el error cuesta más que el modelo**: una
  migración de base de datos, un cambio de arquitectura, algo difícil de revertir.
- No vale cuando el error es barato y se ve enseguida: renombrar, documentar,
  boilerplate.
- La pregunta no es "¿cuál es el mejor?" sino "¿cuánto me cuesta que se equivoque aquí?".

## 5. Factura

Conversación de la Fase 1.2 (generación de MercadoTech Lite). Misma regla: lo que
no se midió dice "sin medir".

| Concepto                    | Valor                                   | Cómo se obtuvo                                                        |
| --------------------------- | --------------------------------------- | --------------------------------------------------------------------- |
| Costo en dinero             | sin medir                               | El agente no ve tokens ni costo. Revisar con `/cost` o `/status`.     |
| Uso del plan consumido      | sin medir                               | Mismo motivo.                                                         |
| Inicio                      | entre 19:28:25 y 19:32:34               | `00-ANTES.md` creado 19:28:25; primer archivo de la app (`package.json`) 19:32:34. |
| Fin de la generación        | ~19:43                                  | Último reinicio de la base tras las pruebas (hora aproximada).        |
| Cierre con este informe     | 19:47:18                                | `Get-Date` al empezar el informe.                                     |
| Duración total              | entre 15 y 19 minutos                   | Diferencia entre las horas anteriores.                                |
| Veces que pidió aprobación  | sin medir                               | El agente no ve los diálogos de aprobación. Ver nota.                 |
| Acciones que pudieron pedirla | 23 comandos (Bash/PowerShell/TaskStop) y 33 escrituras o ediciones de archivos | Contadas por el agente en su propio historial. Es un techo, no la cifra real. |

**Nota sobre el modo:** la sección 3 dice "Elegido: `manual`", pero esta sesión
corrió en modo **`auto`** (el entorno lo indicaba así). En `auto` un clasificador
aprueba la mayoría de acciones solo, así que las aprobaciones reales deberían ser
muchas menos que las 56 acciones de la tabla. El riesgo de la sección 3 se midió
en otro modo distinto del elegido.

**Acciones que el agente tomó sin preguntar y que vale anotar:**
- Cerró con `Stop-Process` dos procesos de Node (PID 14720 y el de la prueba en el puerto 3124). Eran servidores de prueba que había levantado el propio agente.
- Borró dos veces la carpeta `data/` para quitar los datos de prueba que él mismo había creado.

<!-- Secciones que se agregan en la Fase 1.3: Inventario de daños -->
