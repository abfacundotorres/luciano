(function () {
  // Pega acá la URL del CSV publicado de cada Google Sheet, una por idioma
  // (ver README-conferencias.md).
  var CSV_URLS = {
    es: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSeF9M2uvEz39rAcOn2HKq27ERDnaCk8zX2jYxC-aPo4Qz9rDG4btiuaK5xDijUDrbOAEYAzfVioF_V/pub?gid=0&single=true&output=csv",
    ca: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTYa8xO7OaCv7OjFyEtWlutKwIxdCZ02VbJldtWN9dg70linx53zHVHPPBDulCP587ZjSH8IzLmkjYP/pub?output=csv",
    en: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTn1TMjqmrI5M3i9tujc4x583MkEHKiBL658JQNkarMVrbiib1Wxt4Juf7gC7S18HyZ3eo8UuMcHTHR/pub?output=csv"
  };

  var lang = document.documentElement.lang || "es";
  var CSV_URL = CSV_URLS[lang] || CSV_URLS.es;

  function parseCSV(text) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;

    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') {
            field += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          field += c;
        }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (c !== "\r") {
        field += c;
      }
    }
    if (field.length || row.length) {
      row.push(field);
      rows.push(row);
    }
    return rows;
  }

  function renderItems(rows) {
    var list = document.getElementById("conf-list");
    var lead = document.getElementById("conf-lead");
    if (!list || !rows.length) return;

    rows.forEach(function (r, idx) {
      var titulo = (r[0] || "").trim();
      var fecha = (r[1] || "").trim();
      var texto = (r[2] || "").trim();
      if (!titulo && !texto) return;

      var item = document.createElement("div");
      item.className = "conf-item";

      if (fecha) {
        var dateEl = document.createElement("p");
        dateEl.className = "conf-date";
        dateEl.textContent = fecha;
        item.appendChild(dateEl);
      }

      if (titulo) {
        var h2 = document.createElement("h2");
        h2.textContent = titulo;
        item.appendChild(h2);
      }

      if (texto) {
        var body = document.createElement("p");
        body.className = "conf-text";
        var lines = texto.split(/\n+/);
        lines.forEach(function (line, i) {
          if (i > 0) body.appendChild(document.createElement("br"));
          body.appendChild(document.createTextNode(line));
        });
        item.appendChild(body);
      }

      list.appendChild(item);
      if (idx < rows.length - 1) {
        list.appendChild(document.createElement("hr"));
      }
    });

    if (list.children.length) {
      list.hidden = false;
      if (lead) lead.hidden = true;
    }
  }

  if (!CSV_URL || CSV_URL.indexOf("REPLACE_WITH") === 0) return;

  fetch(CSV_URL, { cache: "no-store" })
    .then(function (res) {
      return res.ok ? res.text() : Promise.reject(new Error("bad response"));
    })
    .then(function (text) {
      var rows = parseCSV(text.trim());
      rows.shift(); // saca la fila de encabezados (Título, Fecha, Texto)
      rows = rows.filter(function (r) {
        return r.some(function (cell) {
          return cell.trim();
        });
      });
      renderItems(rows);
    })
    .catch(function () {
      // Sin conexión, sheet vacía o URL sin configurar: se mantiene el "Próximamente." de respaldo.
    });
})();
