// experimentar.js

let chartHeun = null;
let chartRK4 = null;

// Asegura que los elementos canvas y tabla de comparación estén visibles cuando se necesiten

document.getElementById("btnResolver").addEventListener("click", () => {
  const h = parseFloat(document.getElementById("inputPaso").value) || 1;
  const t0 = parseInt(document.getElementById("tInicio").value) || 0;
  const tf = parseInt(document.getElementById("tFin").value) || 30;
  if (h <= 0 || t0 >= tf) {
    alert("Por favor, asegúrate de que el paso sea mayor que cero y que el tiempo inicial sea menor que el final.");
    return;
  }

  const heun = resolverHeun(t0, tf, h);
  const rk4 = resolverRK4(t0, tf, h);

  document.getElementById("contenedorTablas").style.display = "flex";
  document.getElementById("graficarHeun").style.display = "inline-block";
  document.getElementById("graficarRK4").style.display = "inline-block";
  document.getElementById("generarComparacionPersonalizada").style.display = "inline-block";

  // Limpiar gráficas anteriores si existen
  if (chartHeun) {
    chartHeun.destroy();
    chartHeun = null;
  }
  if (chartRK4) {
    chartRK4.destroy();
    chartRK4 = null;
  }

  // Ocultar canvas hasta que se haga clic en generar
  document.getElementById("graficaHeun").style.display = "none";
  document.getElementById("graficaRK4").style.display = "none";

  // Limpiar tabla de comparación
  document.getElementById("tablaComparacionPersonalizada").innerHTML = "";

  mostrarTablaConRetraso(heun, "tablaHeun", "Heun");
  mostrarTablaConRetraso(rk4, "tablaRK4", "RK4");

  window.resultadoHeun = JSON.parse(JSON.stringify(heun));
  window.resultadoRK4 = JSON.parse(JSON.stringify(rk4));
});
  
  function f(t, A) {
    return 0.8 * A * (1 - Math.pow(A / 60, 0.25))
}
  
function resolverHeun(t0, tf, h) {
    let A = 1;
    const resultados = [];
    let t = t0;
    let i = 1;
    while (t <= tf) {
      const k1 = f(t, A);
      const A_pred = A + h * k1;
      const k2 = f(t + h, A_pred);
      const A_next = A + (h / 2) * (k1 + k2);
      resultados.push({
        iteracion: i.toFixed(0),
        t: t.toFixed(2),
        A: A.toFixed(5),
        k1: k1.toFixed(5),
        A_pred: A_pred.toFixed(5),
        k2: k2.toFixed(5),
      });
      A = A_next;
      t += h;
      i++;
    }
    return resultados;
}
  
function resolverRK4(t0, tf, h) {
    let A = 1;
    const resultados = [];
    let t = t0;
    let i = 0;
    while (t <= tf + 1e-8) {
      const k1 = f(t, A);
      const k2 = f(t + h / 2, A + h * k1 / 2);
      const k3 = f(t + h / 2, A + h * k2 / 2);
      const k4 = f(t + h, A + h * k3);
      const A_next = A + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
      resultados.push({
        iter: i.toFixed(0),
        t: t.toFixed(2),
        A: A.toFixed(5),
        k1: k1.toFixed(5),
        k2: k2.toFixed(5),
        k3: k3.toFixed(5),
        k4: k4.toFixed(5),
      });
      A = A_next;
      t += h;
      i++;
    }
    return resultados;
}
  
function mostrarTablaConRetraso(datos, contenedorId, metodo) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.innerHTML = "";
    const tabla = document.createElement("table");
    tabla.classList.add("tabla-iteraciones");
  
    const encabezados = Object.keys(datos[0]);
    const headerRow = document.createElement("tr");
    encabezados.forEach((key) => {
      const th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
    });
    tabla.appendChild(headerRow);
  
    let i = 0;
    const mostrarFila = () => {
      if (i >= datos.length) return;
      const fila = datos[i];
      const row = document.createElement("tr");
      encabezados.forEach((key) => {
        const td = document.createElement("td");
        td.textContent = fila[key];
        row.appendChild(td);
      });
      tabla.appendChild(row);
      i++;
      setTimeout(mostrarFila, 200);
    };
  
    contenedor.appendChild(tabla);
    mostrarFila();
  }
  
  function generarGrafica(canvasId, datos, chart, asignarChart) {
    const canvas = document.getElementById(canvasId);
    canvas.style.display = "block";
    const ctx = canvas.getContext("2d");
  
    const labels = datos.map(d => parseFloat(d.t));
    const valores = datos.map(d => parseFloat(d.A));
  
    let i = 0;
    const labelsAcumulados = [];
    const valoresAcumulados = [];
  
    if (chart) {
      chart.destroy();
    }
  
    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labelsAcumulados,
        datasets: [{
          label: 'A(t)',
          data: valoresAcumulados,
          borderColor: 'blue',
          fill: false
        }]
      },
      options: {
        animation: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Tiempo (t)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'A(t)'
            }
          }
        }
      }
    });
  
    asignarChart(newChart);
  
    const animar = () => {
      if (i >= labels.length) return;
      labelsAcumulados.push(labels[i]);
      valoresAcumulados.push(valores[i]);
      newChart.update();
      i++;
      setTimeout(animar, 200);
    };
  
    animar();
  }
  
  
  document.getElementById("graficarHeun").addEventListener("click", () => {
    document.getElementById("graficaHeun").style.display = "block";
    generarGrafica("graficaHeun", window.resultadoHeun, chartHeun, (nuevo) => chartHeun = nuevo);
  });
  
  document.getElementById("graficarRK4").addEventListener("click", () => {
    document.getElementById("graficaRK4").style.display = "block";
    generarGrafica("graficaRK4", window.resultadoRK4, chartRK4, (nuevo) => chartRK4 = nuevo);
  });
  
  document.getElementById("generarComparacionPersonalizada").addEventListener("click", () => {
    const tabla = document.getElementById("tablaComparacionPersonalizada");
    tabla.innerHTML = "";
  
    const valorFinalHeun = parseFloat(window.resultadoHeun.at(-1).A);
    const valorFinalRK4 = parseFloat(window.resultadoRK4.at(-1).A);
    const esperado = 60;
  
    const comparacion = [
      ["Tiempo de ejecución aproximado", "Más rápido", "Más lento"],
      ["Número de iteraciones", window.resultadoHeun.length, window.resultadoRK4.length],
      ["Valor final de A(t)", valorFinalHeun.toFixed(5), valorFinalRK4.toFixed(5)],
      ["Error relativo",
        (((esperado - valorFinalHeun) / esperado) * 100).toFixed(5) + "%",
        (((esperado - valorFinalRK4) / esperado) * 100).toFixed(5) + "%"]
    ];
  
    const tablaEl = document.createElement("table");
    const encabezado = document.createElement("tr");
    ["Criterio", "Heun", "RK4"].forEach(texto => {
      const th = document.createElement("th");
      th.textContent = texto;
      encabezado.appendChild(th);
    });
    tablaEl.appendChild(encabezado);
  
    let i = 0;
    const agregarFila = () => {
      if (i >= comparacion.length) return;
      const fila = comparacion[i];
      const row = document.createElement("tr");
      fila.forEach(valor => {
        const td = document.createElement("td");
        td.textContent = valor;
        row.appendChild(td);
      });
      tablaEl.appendChild(row);
      i++;
      setTimeout(agregarFila, 250);
    };
  
    tabla.appendChild(tablaEl);
    agregarFila();
  });
  