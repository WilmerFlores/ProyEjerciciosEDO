// rk4.js

document.getElementById("resolverRK4").addEventListener("click", () => {
    const h = 1;
    const alpha = 0.8;
    const k = 60;
    const nu = 0.25;
    let t = 0;
    let A = 1;
    const t_max = 30;
  
    const resultados = [];
    let iteracion = 1;
  
    while (t < t_max) {
      const f = (A) => alpha * A * (1 - Math.pow(A / k, nu));
  
      const k1 = h * f(A);
      const k2 = h * f(A + k1 / 2);
      const k3 = h * f(A + k2 / 2);
      const k4 = h * f(A + k3);
  
      const A_next = A + (1 / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
  
      resultados.push({
        iteracion,
        t: t.toFixed(2),
        A: A.toFixed(5),
        k1: k1.toFixed(5),
        k2: k2.toFixed(5),
        k3: k3.toFixed(5),
        k4: k4.toFixed(5),
        A_next: A_next.toFixed(5)
      });
  
      t += h;
      A = A_next;
      iteracion++;
    }
  
    mostrarTablaRK4(resultados);
    document.getElementById("generarGraficaRK4").style.display = "inline-block";
  });
  
  function mostrarTablaRK4(data) {
    const contenedor = document.getElementById("tablaRK4");
    contenedor.style.display = "block";
    let html = "<table border='1' cellpadding='5'><tr><th>Iteración</th><th>t</th><th>A(t)</th><th>k1</th><th>k2</th><th>k3</th><th>k4</th><th>A_next</th></tr>";
    contenedor.innerHTML = html + "</table>";
  
    const tabla = contenedor.querySelector("table");
    let i = 0;
  
    const agregarFila = () => {
      if (i >= data.length) return;
      const fila = data[i];
      const row = tabla.insertRow();
      row.innerHTML = `<td>${fila.iteracion}</td><td>${fila.t}</td><td>${fila.A}</td><td>${fila.k1}</td><td>${fila.k2}</td><td>${fila.k3}</td><td>${fila.k4}</td><td>${fila.A_next}</td>`;
      i++;
      setTimeout(agregarFila, 200);
    };
  
    agregarFila();
  }
  
  // Gráfica
  
  document.getElementById("generarGraficaRK4").addEventListener("click", () => {
    const canvas = document.getElementById("graficaRK4");
    const ctx = canvas.getContext("2d");
    canvas.style.display = "block";
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const h = 1;
    const alpha = 0.8;
    const k = 60;
    const nu = 0.25;
    let t = 0;
    let A = 1;
    const t_max = 30;
  
    const puntos = [{ t, A }];
    while (t < t_max) {
      const f = (A) => alpha * A * (1 - Math.pow(A / k, nu));
  
      const k1 = h * f(A);
      const k2 = h * f(A + k1 / 2);
      const k3 = h * f(A + k2 / 2);
      const k4 = h * f(A + k3);
  
      const A_next = A + (1 / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
      t += h;
      A = A_next;
      puntos.push({ t, A });
    }
  
    const maxA = Math.max(...puntos.map((p) => p.A));
    const escalaX = (canvas.width - 60) / t_max;
    const escalaY = (canvas.height - 40) / maxA;
  
    // Ejes
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(40, canvas.height - 30);
    ctx.lineTo(canvas.width - 10, canvas.height - 30);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();
  
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
  
    // Eje Y
    for (let i = 0; i <= 10; i++) {
      const y_val = (maxA / 10) * i;
      const y = canvas.height - 30 - y_val * escalaY;
      ctx.fillText(y_val.toFixed(1), 5, y + 3);
      ctx.beginPath();
      ctx.moveTo(38, y);
      ctx.lineTo(42, y);
      ctx.stroke();
    }
  
    // Eje X
    for (let i = 0; i <= t_max; i += 5) {
      const x = 40 + i * escalaX;
      ctx.fillText(i.toString(), x - 5, canvas.height - 10);
      ctx.beginPath();
      ctx.moveTo(x, canvas.height - 32);
      ctx.lineTo(x, canvas.height - 28);
      ctx.stroke();
    }
  
    ctx.fillText("t (días)", canvas.width - 70, canvas.height - 10);
    ctx.fillText("A(t)", 5, 15);
  
    ctx.beginPath();
    ctx.moveTo(40 + puntos[0].t * escalaX, canvas.height - 30 - puntos[0].A * escalaY);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;
  
    let i = 1;
    const animar = () => {
      if (i >= puntos.length) return;
      const p = puntos[i];
      ctx.lineTo(40 + p.t * escalaX, canvas.height - 30 - p.A * escalaY);
      ctx.stroke();
      i++;
      setTimeout(animar, 100);
    };
    animar();
  });