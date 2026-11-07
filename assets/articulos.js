(function () {
  // Pega acá la URL del CSV publicado de cada pestaña de Artículos
  // (ver README-articulos.md).
  var CSV_URLS = {
    es: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9WOT025rXfwZrDJuT7kG7dtGIHsIiMcyw3xXw--oSz9ceLFStKsL6OM6_hZ_qjACPLs7BYlfkyzlV/pub?output=csv",
    ca: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSmWTwtuKEkPw_QoQUZHSxOoaLd_UDhebkC1_galc1HNNFMYOXQRt3l9DP4Q7KpYgpaVPPP6Mf2uuCm/pub?output=csv",
    en: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSniwB1FejZLGPDfADxzRvBibJYN3BkpqyEYqzbBS1SQahyVxGBxULjpDTulikIgCIa9FbRatVHb7wP/pub?output=csv"
  };

  var READ_MORE = {
    es: "Leer más",
    ca: "Llegeix més",
    en: "Read more"
  };

  var lang = document.documentElement.lang || "es";
  var CSV_URL = CSV_URLS[lang] || CSV_URLS.es;
  var CACHE_KEY = "ltmc-art-" + lang;
  var readMoreLabel = READ_MORE[lang] || READ_MORE.es;

  var list = document.getElementById("art-list");
  var lead = document.getElementById("art-lead");
  if (!list || !lead) return;

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
    list.innerHTML = "";

    rows.forEach(function (r, idx) {
      var titulo = (r[0] || "").trim();
      var fecha = (r[1] || "").trim();
      var texto = (r[2] || "").trim();
      var enlace = (r[3] || "").trim();
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

      if (enlace) {
        var link = document.createElement("a");
        link.className = "page-link";
        link.href = enlace;
        link.target = "_blank";
        link.rel = "noopener";
        var span = document.createElement("span");
        span.textContent = readMoreLabel;
        link.appendChild(span);
        var arrow = document.createElement("span");
        arrow.className = "page-link-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "→";
        link.appendChild(arrow);
        item.appendChild(link);
      }

      list.appendChild(item);
      if (idx < rows.length - 1) {
        list.appendChild(document.createElement("hr"));
      }
    });

    if (list.children.length) {
      list.hidden = false;
      lead.hidden = true;
      return true;
    }
    return false;
  }

  function cleanRows(rawText) {
    var rows = parseCSV(rawText.trim());
    rows.shift(); // saca la fila de encabezados (Título, Fecha, Texto, Enlace)
    rows = rows.filter(function (r) {
      return r.some(function (cell) {
        return cell.trim();
      });
    });
    // Se agregan filas nuevas al final de la planilla; se muestran al
    // revés para que lo más nuevo quede arriba.
    return rows.reverse();
  }

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeCache(rows) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(rows));
    } catch (e) {}
  }

  // 1. Si hay una copia guardada de una visita anterior, se muestra al
  // instante (sin esperar la red) para que nunca se vea "Próximamente"
  // de forma innecesaria.
  var cached = readCache();
  var shownFromCache = cached && cached.length ? renderItems(cached) : false;

  if (!CSV_URL || CSV_URL.indexOf("REPLACE_WITH") === 0) {
    if (!shownFromCache) lead.hidden = false;
    return;
  }

  // 2. En paralelo (o si no había nada guardado), se busca la versión
  // actual de la planilla y se actualiza si cambió algo.
  fetch(CSV_URL, { cache: "no-store" })
    .then(function (res) {
      return res.ok ? res.text() : Promise.reject(new Error("bad response"));
    })
    .then(function (text) {
      var rows = cleanRows(text);
      if (rows.length) {
        if (JSON.stringify(rows) !== JSON.stringify(cached)) {
          renderItems(rows);
        }
        writeCache(rows);
      } else if (!shownFromCache) {
        lead.hidden = false;
      }
    })
    .catch(function () {
      // Sin conexión o falla: si ya se mostró algo desde la copia
      // guardada se deja como está; si no había nada, recién ahí
      // aparece "Próximamente.".
      if (!shownFromCache) lead.hidden = false;
    });
})();
