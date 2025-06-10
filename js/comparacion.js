document.getElementById("generarComparacion").addEventListener("click", () => {
    const tablaContainer = document.getElementById("tablaComparacion");
    tablaContainer.style.display = "block";
  
    const comparacion = [
      {
        criterio: "Tiempo de ejecución aproximado",
        heun: "Más rápido (menos operaciones por iteración)",
        rk4: "Ligeramente más lento (más operaciones por iteración)"
      },
      {
        criterio: "Número de iteraciones necesarias",
        heun: "Más iteraciones para precisión similar",
        rk4: "Menos iteraciones para misma precisión"
      },
      {
        criterio: "Precisión",
        heun: "Menor precisión por iteración",
        rk4: "Alta precisión por iteración"
      },
      {
        criterio: "Implementación",
        heun: "Más sencilla",
        rk4: "Más compleja"
      },
      {
        criterio: "Uso recomendado",
        heun: "Problemas donde se requiere rapidez y no extrema precisión",
        rk4: "Problemas donde la precisión es más importante"
      },
      {
        criterio: "Valor final de A(t) tras 30 iteraciones",
        heun: "59.93246",
        rk4: "59.99992"
      },
      {
        criterio: "Error relativo respecto a solución esperada (aprox 60)",
        heun: "0.11%",
        rk4: "0.00013%"
      },
      {
        criterio: "Pasos utilizados (h = 1)",
        heun: "30",
        rk4: "30"
      },
      {
        criterio: "Complejidad computacional por paso",
        heun: "2 evaluaciones de f(t, y)",
        rk4: "4 evaluaciones de f(t, y)"
      }
    ];
  
    let html = "<table border='1' cellpadding='5'><tr><th>Criterio</th><th>Método de Heun</th><th>RK4</th></tr>";
    tablaContainer.innerHTML = html + "</table>";
  
    const tabla = tablaContainer.querySelector("table");
    let i = 0;
  
    const agregarFila = () => {
      if (i >= comparacion.length) {
        document.getElementById("conclusion").style.display = "block";
        return;
      }
      const fila = comparacion[i];
      const row = tabla.insertRow();
      row.innerHTML = `<td>${fila.criterio}</td><td>${fila.heun}</td><td>${fila.rk4}</td>`;
      i++;
      setTimeout(agregarFila, 300);
    };
  
    agregarFila();
  });
  