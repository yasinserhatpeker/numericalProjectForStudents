import { useState, useMemo, useEffect } from 'react';
import { evaluate, derivative } from 'mathjs';
import Plot from 'react-plotly.js';
import optLogo from '../assets/scalar.jpg';
import Menu from './Menu';

export default function ScalarOptimization() {
  /* ───────────────────────────── state ───────────────────────────── */
  const [mode, setMode] = useState('scalar');      // 'scalar' | 'multi'
  const [goMenu, setGoMenu] = useState(false);

  // scalar inputs (unit‑cost demo)
  const [fx, setFx] = useState('0.05*x^2 - 3*x + 200');
  const [a, setA]   = useState(0);
  const [b, setB]   = useState(60);
  const [tol, setTol] = useState(0.001);

  // multivariable inputs (energy demo)
  const [fxy, setFxy] = useState('(v-55)^2 + (m-8)^2 + 300');
  const [x0, setX0]   = useState(40);   // v
  const [y0, setY0]   = useState(5);    // m
  const [alpha, setAlpha] = useState(0.1);
  const [maxIter, setMaxIter] = useState(80);

  /* ──────────────────── scalar: golden‑section ──────────────────── */
  const scalarSteps = useMemo(() => {
    try {
      const φ  = (Math.sqrt(5) - 1) / 2;
      const f  = (x) => evaluate(fx, { x });
      let aa   = Number(a);
      let bb   = Number(b);
      if (aa >= bb) return [];
      const log = [];
      let c = bb - φ * (bb - aa);
      let d = aa + φ * (bb - aa);
      while (Math.abs(bb - aa) > tol && log.length < 120) {
        if (f(c) < f(d)) {
          bb = d;
        } else {
          aa = c;
        }
        c = bb - φ * (bb - aa);
        d = aa + φ * (bb - aa);
        log.push({ i: log.length + 1, a: aa, b: bb, len: bb - aa });
      }
      return log;
    } catch {
      return [];
    }
  }, [fx, a, b, tol]);

  /* ─────────────────── multivariable: gradient descent ───────────── */
  const multiSteps = useMemo(() => {
    try {
      const f    = (v, m) => evaluate(fxy, { v, m });
      const dfdv = derivative(fxy, 'v').compile();
      const dfdm = derivative(fxy, 'm').compile();

      let v = Number(x0);
      let m = Number(y0);
      const log = [];
      for (let k = 1; k <= maxIter; k++) {
        const gradV = dfdv.evaluate({ v, m });
        const gradM = dfdm.evaluate({ v, m });
        const vNext = v - alpha * gradV;
        const mNext = m - alpha * gradM;
        log.push({ k, v: vNext, m: mNext, f: f(vNext, mNext) });
        if (Math.hypot(vNext - v, mNext - m) < tol) break;
        v = vNext; m = mNext;
      }
      return log;
    } catch {
      return [];
    }
  }, [fxy, x0, y0, alpha, maxIter, tol]);

  /* ────────────────────────── plots data ─────────────────────────── */
  const scalarPlot = useMemo(() => {
    if (!scalarSteps.length) return [];
    const xs = scalarSteps.map(s => s.i);
    const ys = scalarSteps.map(s => s.len);
    return [{ x: xs, y: ys, mode: 'lines+markers', name: '|b‑a|' }];
  }, [scalarSteps]);

  const multiPlot = useMemo(() => {
    if (!multiSteps.length) return [];
    return [{ x: multiSteps.map(s => s.v), y: multiSteps.map(s => s.m), mode: 'lines+markers', name: 'descent' }];
  }, [multiSteps]);

  /* ────────────────────────── navigation ─────────────────────────── */
  if (goMenu) return <Menu />;

  /* ───────────────────────────── render ──────────────────────────── */
  return (
    <div id="menu">
      <div className="menu-newton">
        <img src={optLogo} alt="Optimisation" />
        <h3>Optimisation Routines & Real‑World Examples</h3>
        <p>
          Scalar and multivariable optimisation let engineers trim costs or boost
          efficiency. One‑dimensional methods like <em>Golden‑Section Search</em>
          require only function evaluations and never overshoot, but converge
          linearly. Multivariable techniques such as <em>Gradient Descent</em>
          exploit derivative information for faster (often super‑linear)
          progress, yet need a good step size and can stall on flat valleys or
          saddle points. In practice we often pre‑scan with a robust bracket
          method, then switch to gradient‑based refinement once close to the
          optimum.
        </p>
      </div>

      {/* toggle */}
      <div style={{ display: 'flex', justifyContent:"center", gap: '2.5rem', marginBottom: '2.5rem' }}>
        <button className={  'rainbow-hover'} onClick={() => setMode('scalar')}>Scalar Cost&nbsp;C(x)</button>
        <button className={'rainbow-hover'} onClick={() => setMode('multi')}>2‑D Energy&nbsp;E(v,m)</button>
      </div>

      {mode === 'scalar' ? (
        <>
          <section className="inputs">
            <label>
              C(x) =
              <input value={fx} onChange={e => setFx(e.target.value)} />
            </label>
            <label>
              a
              <input type="number" value={a} onChange={e => setA(e.target.value)} />
            </label>
            <label>
              b
              <input type="number" value={b} onChange={e => setB(e.target.value)} />
            </label>
            <label>
              tol
              <input type="number" step="0.0001" value={tol} onChange={e => setTol(e.target.value)} />
            </label>
          </section>

          {scalarSteps.length > 0 && (
            <section className="results">
              <h3>Golden‑Section Iterations</h3>
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>a</th><th>b</th><th>|b‑a|</th>
                  </tr>
                </thead>
                <tbody>
                  {scalarSteps.map(s => (
                    <tr key={s.i}>
                      <td>{s.i}</td>
                      <td>{s.a.toFixed(4)}</td>
                      <td>{s.b.toFixed(4)}</td>
                      <td>{s.len.toExponential(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Plot
                data={scalarPlot}
                layout={{ height: 360, xaxis: { title: 'Iteration' }, yaxis: { title: '|b‑a|' } }}
                config={{ responsive: true }}
              />
            </section>
          )}
        </>
      ) : (
        <>
          <section className="inputs">
            <label>
              E(v,m)=
              <input value={fxy} onChange={e => setFxy(e.target.value)} />
            </label>
            <label>
              v₀
              <input type="number" value={x0} onChange={e => setX0(e.target.value)} />
            </label>
            <label>
              m₀
              <input type="number" value={y0} onChange={e => setY0(e.target.value)} />
            </label>
            <label>
              α
              <input type="number" step="0.01" value={alpha} onChange={e => setAlpha(e.target.value)} />
            </label>
            <label>
              maxIter
              <input type="number" value={maxIter} onChange={e => setMaxIter(e.target.value)} />
            </label>
          </section>

          {multiSteps.length > 0 && (
            <section className="results">
              <h3>Gradient Descent Path</h3>
              <table>
                <thead>
                  <tr><th>#</th><th>v</th><th>m</th><th>E</th></tr>
                </thead>
                <tbody>
                  {multiSteps.map(s => (
                    <tr key={s.k}>
                      <td>{s.k}</td>
                      <td>{s.v.toFixed(3)}</td>
                      <td>{s.m.toFixed(3)}</td>
                      <td>{s.f.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Plot
                data={multiPlot}
                layout={{ height: 360, xaxis: { title: 'Speed v (km/h)' }, yaxis: { title: 'Load m (t)' } }}
                
              />
            </section>
          )}
        </>
      )}

      <button data-label="Register" className="rainbow-hover" id="backButton" onClick={() => setGoMenu(true)}>
        <span className="sp">Back to Menu</span>
      </button>
    </div>
  );
}
