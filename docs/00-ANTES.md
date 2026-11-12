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

## 6. Inventario de daños

Fase 1.3, 2026-11-11. Se anota y no se arregla: en esta fase no se modificó
ningún archivo de la app. Los comandos se corrieron en Git Bash, desde
`C:\mercadotech`, sobre el commit `ad5ea8e`. Criterio: `ENCARGO_LITE_v2.md` §3,
"qué hay que probar".

Contexto del stack: Next.js 16 + TypeScript, SQLite con el módulo `node:sqlite`
que trae Node (no hay dependencia de base de datos en `package.json`). El
acceso a datos vive en `lib/db.ts`, `lib/catalog.ts`, `lib/auth.ts` y
`app/actions.ts`.

| # · Defecto | Comando → salida real (recortada) | ¿Apareció? | Se cierra en |
| --- | --- | --- | --- |
| 1 · La interfaz consulta la base directamente | `grep -rlE "getDb\|node:sqlite\|\.prepare\(" app components --include=*.tsx` → `app/mis-pedidos/page.tsx`, `app/pedido/[id]/page.tsx`. `grep -nE "getDb\|prepare" "app/pedido/[id]/page.tsx"` → `5: import { getDb } from "@/lib/db"`, `22: db.prepare("SELECT id, user_id, total_cents, created_at FROM orders WHERE id = ?")`, `29: .prepare("SELECT … FROM order_items WHERE order_id = ?")`. Un piso más arriba: `grep -cE "\.prepare\(" app/actions.ts` → `7`; en ese mismo archivo, `132: if (p.stock < qty)`, `142: const total = lines.reduce(…)`, `146: db.prepare("UPDATE products SET stock = stock - ? …")`: SQL, stock y totales juntos. | **Sí.** Dos páginas consultan SQL directamente, y `app/actions.ts` mezcla SQL con las reglas de negocio. El catálogo y el detalle sí pasan por `lib/catalog.ts`: no hay una regla, cada archivo hace lo suyo. | S2 y S5 |
| 2 · Valores ajustables incrustados | `ls -d lib/constants* config*` → `No such file or directory`; `find . … -iname "*constant*"` → solo `./next.config.ts`. Límite repetido: `grep -rnE "\b8\b" app/actions.ts components/AuthForms.tsx \| grep -iE "length\|minLength\|caracteres"` → `app/actions.ts:38: password.length < 8`, `components/AuthForms.tsx:59: minLength={8}`, `:60: Mínimo 8 caracteres.` Tope de unidades: `grep -rnE "\b(99\|50\|100)\b" …` → `app/actions.ts:119: total > 99`, `app/producto/[id]/AddToCart.tsx:10: Math.min(stock, 99)`, `components/CartProvider.tsx:58` y `:70: … 99`, `components/CartLink.tsx:22: count > 99`; `app/actions.ts:109: items.length > 50`, `:84: .slice(0, 100)`. | **Sí.** No hay archivo de constantes. El mínimo de contraseña (8) está escrito 3 veces y el tope de 99 unidades, 5 veces en 4 archivos. La moneda sí está en un solo sitio (`lib/format.ts:1`, `es-PE`/`PEN`). | S2 y S5 |
| 3 · Cero pruebas | `find . -path ./node_modules -prune -o \( -name "*.test.*" -o -name "*.spec.*" \) -print \| wc -l` → `0`. `npm test` → `npm error Missing script: "test"`. `grep -nE "jest\|vitest\|mocha\|playwright\|testing-library\|\"test\"" package.json` → sin coincidencias. | **Sí.** El único chequeo que trae es `"typecheck": "tsc --noEmit"`, y no es una prueba. | S6 |
| 4 · Seguridad abierta (basta una de a/b/c) | (a) `sed -n 168,170p app/actions.ts` → `createProductAction … const user = await getCurrentUser(); if (!user?.isAdmin) return { error: "Necesitas una cuenta de administrador." }`; `app/admin/page.tsx:13-14` → `if (!user) redirect("/ingresar?next=/admin"); if (!user.isAdmin) {…}`; `lib/db.ts:18` → `is_admin INTEGER NOT NULL DEFAULT 0`. (b) `grep -rniE "bcrypt\|argon\|scrypt\|hash" package.json app lib \| grep -c .` → `24`; entre ellas `app/actions.ts:46: .run(name, email, hashPassword(password))` y `lib/password.ts:5: const hash = scryptSync(password, salt, 64)`, sobre la columna `password_hash`. (c) `grep -rn "localStorage\|sessionStorage" app components lib` → solo `components/CartProvider.tsx:38` y `:49`, que guardan el **carrito**. La sesión es una cookie `httpOnly` (`lib/auth.ts:38-39`) con un token aleatorio guardado como hash en la tabla `sessions` (`lib/auth.ts:33`). | **No, en ninguna de sus tres formas.** (a) La acción y la página comprueban sesión y rol de administrador. (b) Contraseñas con scrypt y sal. (c) La sesión se decide en el servidor. **No lo evitó ninguna decisión tuya**: el encargo dice "no te compliques con los permisos" y el agente se complicó por su cuenta. La frase del encargo no provocó el defecto en esta corrida. Ojo: la seguridad sí quedó abierta por otro lado, ver fila 5. | S6 y S7 |
| 5 · Contraseña de administrador escrita en el repositorio público *(no estaba en la lista)* | `git grep -nE "ADMIN_PASSWORD\|<valor>" -- . ':!package-lock.json'` → `lib/seed.ts:5: export const ADMIN_PASSWORD = "<VALOR OCULTO>"`, `README.md:30: \| admin@mercadotech.pe \| <VALOR OCULTO> \|`. `git status -sb` → `## main...origin/main` (sin diferencias: ya está subido). `git remote -v` → `origin https://github.com/<usuario>/mercadotech-lite.git`. | **Sí.** La contraseña del único usuario administrador está en texto plano en `lib/seed.ts:5` y en `README.md:30`, y ya está en GitHub en un repositorio público. Quien la lea entra a `/admin` y crea productos: el hueco que la fila 4 no tenía llega por aquí. El valor no se copia en este documento. | S7 (secretos) |
| 6 · La tarea patrón ya viene hecha *(no estaba en la lista)* | `sed -n 5,11p app/page.tsx` → `searchParams: Promise<{ cat?: string; q?: string }>`, `const category = isCategory(params.cat) ? params.cat : undefined`, `listProducts({ category, q })`; `:41-53` → `<nav className="chips" aria-label="Categorías">` con un enlace por categoría (`hrefFor(c.slug)` → `/?cat=…`). | **Sí.** El catálogo ya filtra por categoría y el estado vive en la URL (`?cat=`), así que sobrevive al F5 y a otra pestaña. También trae un buscador (`?q=`), que el encargo no pedía. Es justo lo que `ENCARGO_LITE_v2.md` §5.3 y la verificación 5 de la Fase 1.2 dicen que hay que avisar: la Fase 1.4 cambia de enunciado. **Avisar al docente antes de la 1.4.** | — (decide el docente) |

### Desvíos del alcance cerrado (`ENCARGO_LITE_v2.md` §2), sin evidencia de daño

- Hay 5 tablas en vez de las 4 previstas: `users`, `sessions`, `products`,
  `orders` y `order_items` (`lib/db.ts:13-54`). **No existe `cart_items`**: el
  carrito vive en el `localStorage` del navegador (`components/CartProvider.tsx:38,49`).
  El checkout vuelve a leer precio y stock de la base (`app/actions.ts:128`),
  así que editar el carrito en el navegador no cambia lo que se cobra.
- Hay columnas distintas de las previstas: `name` en vez de `title` y
  `price_cents` en vez de `price` (`lib/db.ts:30,33`). Las categorías están
  fijas en código (`lib/catalog.ts:3-11`), no se derivan de la columna.

### Resumen

| Defecto | Resultado |
| --- | --- |
| 1 · Interfaz con SQL | apareció |
| 2 · Valores incrustados | apareció |
| 3 · Cero pruebas | apareció |
| 4 · Seguridad abierta (a/b/c) | **no apareció** |
| 5 · Contraseña de admin en el repo público | apareció (extra) |
| 6 · Filtro por categoría ya implementado | apareció (extra, bloquea la 1.4 tal cual) |
