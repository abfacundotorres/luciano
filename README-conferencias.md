# Cómo cargar contenido en "Conferencias"

La sección Conferencias lee su contenido de una Google Sheet. Para
activarla:

## 1. Crear la planilla

1. Andá a [sheets.google.com](https://sheets.google.com) y creá una
   planilla nueva.
2. En la primera fila (encabezados), poné exactamente:

   | Título | Fecha | Texto |
   |--------|-------|-------|
   | Jornada de Psicología Analítica | 12 de octubre, 2026 | Charla abierta sobre sueños y símbolos... |

3. A partir de la fila 2, una fila por cada charla/conferencia. Podés
   dejar "Fecha" vacía si no aplica. Para un salto de línea dentro de
   "Texto", usá Alt+Enter (Windows) o Option+Enter (Mac) dentro de la
   celda.
4. El orden de las filas es el orden en que aparecen en la página (de
   arriba hacia abajo).

## 2. Publicarla como CSV

1. Archivo → Compartir → **Publicar en la Web**.
2. En "Vincular", elegí la hoja (no "Todo el documento") y como
   formato elegí **Valores separados por comas (.csv)**.
3. Tildá **"Volver a publicar automáticamente cuando se realicen
   cambios"** — así no hay que repetir este paso cada vez que editen.
4. Click en **Publicar**, confirmá, y copiá la URL que te da (algo
   como `https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv`).

## 3. Conectarla al sitio

Abrí `assets/conferencias.js` y reemplazá esta línea:

```js
var CSV_URL = "REPLACE_WITH_YOUR_PUBLISHED_SHEET_CSV_URL";
```

por la URL que copiaste:

```js
var CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv";
```

Guardá, subí el cambio (commit + push) y listo — la próxima vez que
alguien edite la planilla, la página se actualiza sola (puede tardar
uno o dos minutos en reflejarse por el caché de Google).

## Notas

- Mientras `CSV_URL` no esté configurada, o si falla la carga, la
  página muestra "Próximamente." como hasta ahora — nunca se rompe.
- El contenido se muestra **igual en español, catalán e inglés**: no
  se traduce automáticamente. Si necesitan versiones distintas por
  idioma, avisen y lo armamos con 3 planillas (una por idioma).
- La planilla queda pública (de solo lectura) al publicarla así —
  cualquiera con el link puede ver las filas, pero no editarlas.
