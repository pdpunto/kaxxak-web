'use strict';
// La báscula de la portada: pesa, se estabiliza, vuelve a cero y otra vez (como en web/animaciones.js).
(() => {
  const cifra = document.querySelector('[data-lectura]');
  const estado = document.querySelector('[data-estado]');
  if (!cifra || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const coma = (n) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  const pintar = (g, estable) => {
    cifra.textContent = coma(g);
    estado.textContent = estable ? 'Peso estable' : g === 0 ? 'A cero' : 'Pesando…';
    estado.classList.toggle('estable', estable);
  };
  const pesos = [2.98, 5.0, 1.5, 3.47];
  let vuelta = 0;
  (async function bucle() {
    await espera(2400);
    for (;;) {
      const objetivo = pesos[vuelta++ % pesos.length];
      pintar(0, false);
      await espera(900);
      const inicio = performance.now(), dura = 1500;
      await new Promise((fin) => {
        const paso = (t) => {
          const k = Math.min(1, (t - inicio) / dura);
          const ruido = k < 1 ? (Math.random() - 0.5) * 0.4 * (1 - k) : 0;
          pintar(Math.max(0, objetivo * (1 - Math.pow(1 - k, 3)) + ruido), false);
          if (k < 1) requestAnimationFrame(paso); else fin();
        };
        requestAnimationFrame(paso);
      });
      await espera(350);
      pintar(objetivo, true);
      await espera(3200);
    }
  })();
})();
