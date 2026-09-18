# Aires de Patagonia — web

Sitio estático (HTML + CSS + JS). No necesita build ni dependencias: se sube tal cual a cualquier hosting.

## Estructura

```
index.html          una sola página con 6 secciones + navegación
css/style.css       estilos y paleta (variables en :root)
js/main.js          todas las animaciones (GSAP 3.12 + ScrollTrigger + Observer, por CDN)
assets/img/         logos, fotos del local, fotos de producto, posters de vídeo
assets/video/       hero + 3 vídeos de proceso (H.264, sin audio, optimizados)
```

Los originales (`local 1.jpg`, `unnamed (*).webp`, `SaveClip.App_*.mp4`, `logo.jpg`) se quedan en la raíz
como material de origen; la web solo usa lo que hay en `assets/`.

## Ver en local

```bash
python -m http.server 5310
```

Y abrir `http://localhost:5310`.

## Paleta

Sacada de las fotos del local (`local 1` y `local 2`): verde petróleo de la pared, madera y mimbre,
crema del suelo y el dorado del hojaldre.

| Variable | Uso |
|---|---|
| `--teal-950 / 900 / 800` | fondos oscuros, navbar, footer |
| `--cream / --cream-2` | fondos claros |
| `--wood / --caramel / --gold` | acentos, botones, hovers |

Todo se cambia desde `:root` en `css/style.css`.

## Capa patagónica

La identidad no está solo en el color: hay una capa de decoración que recorre toda la web.

- **Cordillera en capas** (`.cordillera`) — tres siluetas de montaña generadas con aristas irregulares,
  con cumbres nevadas, que se mueven a distinta velocidad al hacer scroll. Cierra el hero y abre "Visitanos".
- **Flora** (`.flora`) — helechos y enredaderas colgando del borde superior, como las del techo del local.
  Se mecen en bucle con GSAP. Los dibujos son SVG generados por código y viven como `<symbol>` al
  principio del `body` (`assets/svg/symbols.html`). Heredan el color por `currentColor`, así que basta
  con cambiar `color` en la clase de cada planta.
- **Cóndor** — el pájaro del logo. Planea por el hero en bucle y cruza "Sobre nosotros" al hacer scroll.
- **Curvas de nivel** (`.contour`) — mapa de altura dibujado con JS que se traza solo al aparecer.
- **Franja de origen** (`.origen`) — las coordenadas del Fitz Roy y las de Alicante, unidas por una
  ruta punteada que se dibuja al entrar en pantalla.

## Secciones

1. **Hero** — vídeo a pantalla completa (amasado → medialunas doradas), plantas colgando y cordillera.
2. **Sobre nosotros** — fotos del interior con revelado por máscara, parallax y curvas de nivel.
3. **La carta** — listado por categorías. Los platos marcados con `data-img` muestran la foto siguiendo al cursor.
4. **Cómo trabajamos** — mosaico de tres tarjetas con los vídeos del obrador (alturas escalonadas
   y parallax distinto en cada una) + CTA a Instagram. En móvil se apilan.
5. **La vitrina** — carrusel 3D de producto: se arrastra, gira solo y responde a los botones.
6. **Reseñas** — opiniones reales de Google y Tripadvisor.

## Editar la carta

Cada plato es un `<li class="carta__item">` en `index.html`.
Para que aparezca la foto al pasar el ratón, añadir `data-img="assets/img/food-X.webp"`.
Si se quieren precios, basta con añadir un `<span class="carta__price">` y darle estilo.

## Pendiente

- **Precios de la carta**: no había fotos de la carta en la carpeta, así que los platos están
  descritos pero sin precio. En cuanto lleguen las fotos se transcriben y se añaden.
