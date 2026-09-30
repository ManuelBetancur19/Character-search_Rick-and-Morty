
async function obtenerPersonajes() {
  const respuesta = await fetch("https://rickandmortyapi.com/api/character");
  const datos = await respuesta.json();
  return datos.results;
}

function filtrarPorEstado(personajes, estado) {
  return personajes.filter(function (personaje) {
    return estado === "" || personaje.status.toLowerCase() === estado.toLowerCase();
  });
}

function filtrarPorEspecie(personajes, especie) {
  return personajes.filter(function (personaje) {
    return especie === "" || personaje.species === especie;
  });
}

/* // map: obtener solo los nombres
function obtenerNombres(personajes) {
  return personajes.map(function (personaje) {
    return personaje.name;
  });
}
*
// buscar personaje por nombre exacto
function buscarPorNombre(personajes, nombre) {
  return personajes.find(function (personaje) {
    return personaje.name === nombre;
  });
}
*/
// comprobar si hay personajes muertos
function hayPersonajesMuertos(personajes) {
  return personajes.some(function (personaje) {
    return personaje.status === "Dead";
  });
}
/*
// comprueba si todos estan vivos
function todosVivos(personajes) {
  return personajes.every(function (personaje) {
    return personaje.status === "Alive";
  });
}
*/
// ordenar alfabeticamente por nombre
function ordenarPorNombre(personajes) {
  return [...personajes].sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
}

// muestra los primeros personajes
function primeros(personajes, cantidad) {
  return personajes.slice(0, cantidad);
}
/*
// posicion del nombre
function posicionDeNombre(nombres, nombre) {
  return nombres.indexOf(nombre);
}
*/
// contar cuantas personas estan vivas
function contarVivos(personajes) {
  return personajes.reduce(function (total, personaje) {
    return personaje.status === "Alive" ? total + 1 : total;;
  }, 0);
}

let personajes = [];
let ordenarAZ = false;

function aplicarFiltros() {
  const nombre = document.querySelector("#filtro-nombre").value.trim().toLowerCase();
  const estado = document.querySelector("#filtro-estado").value;
  const especie = document.querySelector("#filtro-especie").value;

  let filtrados = filtrarPorEstado(personajes, estado);
  filtrados = filtrarPorEspecie(filtrados, especie);
  filtrados = filtrados.filter(function (personaje) {
    return personaje.name.toLowerCase().includes(nombre);
  });
  if (ordenarAZ) {
    filtrados = ordenarPorNombre(filtrados);
  }
  if (document.querySelector("#chk-diez").checked) {
    filtrados = primeros(filtrados, 10);
  }

  pintarResultados(filtrados);
}

function pintarResultados(lista) {
  const contenedor = document.querySelector("#resultados");
  document.querySelector("#contador").textContent = lista.length + " personajes encontrados";
  document.querySelector("#aviso-muertos").hidden = !hayPersonajesMuertos(lista);

  const vivos = contarVivos(lista);
  const muertos = lista.filter(function (p) { return p.status === "Dead"; }).length;
  const desconocidos = lista.filter(function (p) { return p.status === "unknown"; }).length;

  document.querySelector("#resumen").textContent = vivos + " vivos · " + muertos + " muertos · " + desconocidos + " desconocidos";

  contenedor.innerHTML = lista
    .map(function (personaje, i) {
      return (
        '<article class="personaje-card">' +
        '<span class="numero">#' + (i + 1) + "</span>" +
        '<img src="' + personaje.image + '" alt="' + personaje.name + '" />' +
        "<h3>" + personaje.name + "</h3>" +
        "<p>" + personaje.status + " · " + personaje.species + "</p>" +
        "</article>"
      );
    })
    .join("");
}

document.querySelector("#filtro-nombre").addEventListener("input", aplicarFiltros);
document.querySelector("#filtro-estado").addEventListener("change", aplicarFiltros);
document.querySelector("#filtro-especie").addEventListener("change", aplicarFiltros);
document.querySelector("#chk-diez").addEventListener("change", aplicarFiltros);

document.querySelector("#btn-limpiar").addEventListener("click", function () {
  document.querySelector("#filtro-nombre").value = "";
  document.querySelector("#filtro-estado").value = "";
  document.querySelector("#filtro-especie").value = "";
  ordenarAZ = false;
  document.querySelector("#btn-ordenar").textContent = "Ordenar A-Z";
  document.querySelector("#chk-diez").checked = false;
  aplicarFiltros();
});

document.querySelector("#btn-ordenar").addEventListener("click", function () {
  ordenarAZ = !ordenarAZ;
  this.textContent = ordenarAZ ? "Quitar orden" : "Ordenar A-Z";
  aplicarFiltros();
});

obtenerPersonajes().then(function (datos) {
  personajes = datos;
  aplicarFiltros();
});
