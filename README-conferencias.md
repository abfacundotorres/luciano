# Cómo cargar contenido en "Conferencias"

La sección Conferencias lee su contenido de una Google Sheet — **una
por idioma**. Podés usar tres archivos separados, o (más cómodo) un
solo archivo con tres pestañas: ES, CA, EN.

## 1. Crear la planilla

1. Andá a [sheets.google.com](https://sheets.google.com) y creá una
   planilla nueva.
2. Creá una pestaña por idioma (click derecho abajo → "Insertar
   hoja"): **ES**, **CA**, **EN**.
3. En cada pestaña, la primera fila (encabezados) va así:

   | Título | Fecha | Texto |
   |--------|-------|-------|
   | Jornada de Psicología Analítica | 12 de octubre, 2026 | Charla abierta sobre sueños y símbolos... |

4. A partir de la fila 2, una fila por cada charla/conferencia, ya
   traducida al idioma de esa pestaña. Podés dejar "Fecha" vacía si no
   aplica. Para un salto de línea dentro de "Texto", usá Alt+Enter
   (Windows) u Option+Enter (Mac) dentro de la celda.
5. El orden de las filas es el orden en que aparecen en la página (de
   arriba hacia abajo). Las tres pestañas no necesitan tener la misma
   cantidad de filas.

## 2. Publicar cada pestaña como CSV

Repetí esto **tres veces**, una por pestaña (ES, CA, EN):

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

Abrí `assets/conferencias.js` y reemplazá estas tres líneas:

```js
var CSV_URLS = {
  es: "REPLACE_WITH_YOUR_ES_SHEET_CSV_URL",
  ca: "REPLACE_WITH_YOUR_CA_SHEET_CSV_URL",
  en: "REPLACE_WITH_YOUR_EN_SHEET_CSV_URL"
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
