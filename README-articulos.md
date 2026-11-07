# Cómo cargar contenido en "Artículos"

La sección Artículos funciona igual que Conferencias: lee su contenido
de una Google Sheet — **una pestaña por idioma**. Podés usar el mismo
archivo de Conferencias (agregando tres pestañas más) o uno nuevo.

## 1. Agregar las pestañas a la planilla

1. Abrí la planilla que ya usás para Conferencias (o creá una nueva en
   [sheets.google.com](https://sheets.google.com)).
2. Creá tres pestañas nuevas (click derecho abajo → "Insertar hoja"):
   **Articulos-ES**, **Articulos-CA**, **Articulos-EN** (el nombre de
   la pestaña es solo para identificarla, no afecta el sitio).
3. En cada pestaña, la primera fila (encabezados) va así:

   | Título | Fecha | Texto | Enlace |
   |--------|-------|-------|--------|
   | Sobre el duelo y el tiempo | 12 de octubre, 2026 | Texto completo del artículo... | https://... (opcional) |

4. A partir de la fila 2, una fila por cada artículo, ya traducido al
   idioma de esa pestaña. Las columnas:
   - **Título**: título del artículo.
   - **Fecha**: fecha de publicación. Se puede dejar vacía.
   - **Texto**: el cuerpo del artículo, pegado completo. Para un salto
     de línea dentro de la celda, usá Alt+Enter (Windows) u
     Option+Enter (Mac).
   - **Enlace** (opcional): si el artículo se publicó originalmente en
     otro lado (LinkedIn, una revista, un blog), pegá ese link acá y en
     la página va a aparecer un "Leer más →" al final del artículo. Si
     se deja vacío, no se muestra ningún enlace.
5. Las filas nuevas siempre van al final de la planilla (debajo de las
   últimas). En la página se muestran al revés, así que la última fila
   que agregaste aparece primero arriba. Las tres pestañas no
   necesitan tener la misma cantidad de filas.

## 2. Publicar cada pestaña como CSV

Repetí esto **tres veces**, una por pestaña (Articulos-ES, Articulos-CA,
Articulos-EN):

1. Archivo → Compartir → **Publicar en la Web**.
2. En "Vincular", elegí esa pestaña puntual (no "Todo el documento") y
   como formato elegí **Valores separados por comas (.csv)**.
3. Tildá **"Volver a publicar automáticamente cuando se realicen
   cambios"** — así no hay que repetir este paso cada vez que editen.
4. Click en **Publicar**, confirmá, y copiá la URL que te da (algo
   como `https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=123&single=true&output=csv`).
   Guardala identificada con su idioma — las tres URLs se van a ver
   parecidas pero con un `gid` distinto cada una.

## 3. Conectarlas al sitio

Abrí `assets/articulos.js` y reemplazá estas tres líneas:

```js
var CSV_URLS = {
  es: "REPLACE_WITH_YOUR_ES_ARTICULOS_SHEET_CSV_URL",
  ca: "REPLACE_WITH_YOUR_CA_ARTICULOS_SHEET_CSV_URL",
  en: "REPLACE_WITH_YOUR_EN_ARTICULOS_SHEET_CSV_URL"
};
```

por las tres URLs que copiaste, cada una en su idioma correspondiente.

Guardá, subí el cambio (commit + push) y listo — la próxima vez que
alguien edite cualquiera de las pestañas, esa versión del sitio se
actualiza sola (puede tardar uno o dos minutos en reflejarse por el
caché de Google).

## Notas

- Podés activar los tres idiomas de a uno: mientras una URL no esté
  configurada, o si falla la carga, esa versión sigue mostrando
  "Próximamente."/"Coming soon."/"Properament." — nunca se rompe.
- Las planillas quedan públicas (de solo lectura) al publicarlas así
  — cualquiera con el link puede ver las filas, pero no editarlas.
- Esta sección usa un mecanismo idéntico al de Conferencias (ver
  `README-conferencias.md`), solo que agrega una columna "Enlace".
