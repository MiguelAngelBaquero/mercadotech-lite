# Bitácora — MercadoTech Lite

Una entrada por sesión. Hechos con su fuente; lo que no se midió dice "sin medir".

---

## Sesión 1 — 2026-11-11 · El "antes"

Detalle y evidencia en [`00-ANTES.md`](00-ANTES.md). Esto es el resumen.

### Qué se construyó

- MercadoTech Lite: catálogo, detalle, carrito, compra simulada (registra el
  pedido y descuenta stock), registro, inicio de sesión y `/admin` para cargar
  productos. Commit `ad5ea8e`.
- Stack: Next.js 16 + TypeScript. SQLite con el módulo `node:sqlite` que trae
  Node, sin dependencia de base de datos; el archivo es `data/tienda.db` y está
  fuera de git.
- `docs/00-ANTES.md`: entorno, cómo pago, modo de aprobación, criterio de
  modelo, factura e inventario de daños.

### Qué decidió el agente sin que se lo pidiera

| Decisión | Dónde se ve |
| --- | --- |
| Usar el SQLite integrado de Node y exigir Node >= 22.13 | `lib/db.ts:8`, `package.json` → `engines` |
| 5 tablas en vez de 4: añadió `sessions` y `order_items`, no creó `cart_items` | `lib/db.ts:13-54` |
| El carrito vive en el `localStorage` del navegador | `components/CartProvider.tsx:38,49` |
| Rol de administrador (`is_admin`) y un admin sembrado con contraseña fija | `lib/db.ts:18`, `lib/seed.ts:4-5` |
| Contraseñas con scrypt y sal; sesión en cookie `httpOnly` con el token guardado como hash | `lib/password.ts`, `lib/auth.ts` |
| **Filtro por categoría en la URL (`?cat=`) y buscador (`?q=`)**: nadie los pidió | `app/page.tsx:5-11,41-53` |
| Inicializó git, hizo el commit `ad5ea8e` y quedó subido a `origin/main` | `git log`, `git status -sb` |
| Escribió en `00-ANTES.md` la factura y la nota de que la 1.2 corrió en `auto` | `00-ANTES.md` §5 |
| Cerró con `Stop-Process` dos procesos de Node y borró `data/` dos veces, todo sin preguntar | `00-ANTES.md` §5 |
| En la 1.1 añadió a `00-ANTES.md` una sección 4 (criterio de modelo) que no estaba entre las tres pedidas | `00-ANTES.md` §4 |

### Qué costó

| Concepto | Valor |
| --- | --- |
| Costo en dinero | sin medir |
| Uso del plan | sin medir |
| Duración de la generación (1.2) | entre 15 y 19 min (19:28–19:47) |
| Veces que pidió aprobación | sin medir |
| Acciones que pudieron pedirla | 23 comandos + 33 escrituras de archivos (techo, no cifra real) |
| Turnos para que arrancara | sin medir |

### Qué salió mal

1. **El modo elegido no fue el que corrió.** Elegí `manual` en la 1.1 y la
   generación corrió en `auto`. El riesgo escrito en la sección 3 no se midió.
2. **Defecto 1 · la interfaz consulta la base:** dos páginas `.tsx` ejecutan
   SQL, y `app/actions.ts` mezcla SQL con stock y totales.
3. **Defecto 2 · valores incrustados:** no hay archivo de constantes; el
   mínimo de contraseña está 3 veces y el tope de 99 unidades, 5.
4. **Defecto 3 · cero pruebas:** 0 archivos de test y no existe `npm test`.
5. **Defecto 4 · seguridad abierta (a/b/c): no apareció.** El encargo no lo
   provocó en esta corrida.
6. **Contraseña del administrador en el repositorio público**: `lib/seed.ts:5`
   y `README.md:30`, ya presente en `origin/main`. Quien la lea entra a
   `/admin`.
7. **La tarea patrón ya venía hecha**: el filtro por categoría existe y vive en
   la URL. La Fase 1.4 tal como está escrita no mide nada en esta app.
8. **Fase 1.4 no se corrió**: `docs/MEDICIONES.md` no existe.
9. Faltaban `.env*` en `.gitignore`; se añadieron en el cierre.

### Pendiente para la sesión 2

- [ ] **Avisar al docente** del hallazgo 7 y decidir el enunciado de la tarea
      patrón (o revertir el filtro para tener código de partida comparable).
- [ ] Correr la 1.4 (fila "S1 · sin reglas") y crear `docs/MEDICIONES.md`.
- [ ] Decidir qué hacer con la contraseña de admin publicada. Se corrige en
      S7, pero ya está expuesta.
- [ ] Revisar con `/cost` o `/status` si se puede recuperar el costo de la
      1.2; si no, queda "sin medir".
- [ ] La próxima vez, arrancar con `claude --permission-mode manual` si ese es
      el modo elegido.
- [ ] Sesión 2: escribir el `CLAUDE.md` con las reglas que habrían evitado los
      defectos 1 y 2.
