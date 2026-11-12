# MercadoTech

Tienda web de tecnología: catálogo, detalle de producto, carrito, compra (registra el pedido y
descuenta stock, sin cobrar), registro e inicio de sesión, y una página para cargar productos.

Next.js 16 + TypeScript. Los datos se guardan en SQLite, en `data/tienda.db`, usando el SQLite
que ya trae Node: no hay que instalar ninguna base de datos ni usar servicios en la nube.

## Requisitos

- Node.js 22.13 o superior (probado con Node 24.13).

## Cómo arrancarla

```bash
npm install
npm run build
npm start          # http://localhost:3000
```

Para desarrollo: `npm run dev`.

La primera vez que arranca crea `data/tienda.db` con 12 productos de ejemplo y una cuenta de
administrador.

## Cuenta de administrador

| Correo                 | Contraseña  |
| ---------------------- | ----------- |
| admin@mercadotech.pe   | admin1234   |

Con esa cuenta aparece el enlace **Admin** en la cabecera (`/admin`), donde se cargan productos
nuevos. Las cuentas creadas desde "Regístrate" son de cliente: pueden comprar y ver sus pedidos,
pero no entrar a `/admin`.

> Es una contraseña de demo. Cámbiala (o borra la base y cambia `ADMIN_PASSWORD` en
> `lib/seed.ts`) antes de publicarla en internet.

## Mostrarla desde el celular

Con la computadora y el celular en la misma red Wi-Fi:

1. `npm run build` y `npm start`.
2. En la consola aparece `Network: http://192.168.x.x:3000`; abre esa dirección en el celular.
   Si no carga, permite Node.js en el Firewall de Windows (redes privadas).

Usa `npm start` y no `npm run dev` para la demo: es más rápido y no tiene restricciones de origen.

## Volver a empezar

```bash
npm run reset-db   # borra data/ — al arrancar se vuelven a crear los productos de ejemplo
```

Hazlo con el servidor detenido.

## Rutas

| Ruta              | Qué hace                                         |
| ----------------- | ------------------------------------------------ |
| `/`               | Catálogo con búsqueda y filtro por categoría     |
| `/producto/[id]`  | Detalle y "Agregar al carrito"                   |
| `/carrito`        | Carrito y confirmación del pedido                |
| `/pedido/[id]`    | Comprobante del pedido (solo su dueño o el admin)|
| `/mis-pedidos`    | Historial del cliente                            |
| `/ingresar`, `/registro` | Cuenta                                    |
| `/admin`          | Alta de productos y vista del stock              |

## Notas técnicas

- El carrito vive en el navegador (`localStorage`). Al confirmar, el servidor vuelve a leer
  precios y stock de la base, verifica que alcance y descuenta todo en una sola transacción:
  nunca vende más de lo que hay ni acepta precios enviados desde el navegador.
- Las contraseñas se guardan con `scrypt` y sal; la sesión es una cookie `httpOnly`.
- Si se publica con HTTPS, arranca con `COOKIE_SECURE=true` para marcar la cookie como segura.
- Sin imagen, cada producto muestra una ilustración según su categoría; en `/admin` se puede
  poner la URL de una foto.
