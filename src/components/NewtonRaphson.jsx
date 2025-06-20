// NewtonRaphson.jsx — interactive demo of the Newton‑Raphson method
// ------------------------------------------------------------------
// This mirrors the Bisection component but uses tangents to converge.
// Requirements:  npm i mathjs react-plotly.js plotly.js-dist-min
// Students can type any differentiable f(x), pick an initial guess x0,
// a tolerance ε, and the component will iterate, display a table of
// values and plot the path of xₙ → root on an interactive Plotly chart.

import { useState, useMemo, useEffect } from 'react';
import { compile, derivative } from 'mathjs';
import Plot from 'react-plotly.js';
import newtonLogo from '../assets/newton-raphson.webp';
import Menu from './Menu';

export default function NewtonRaphson() {
  /* ─────────────────────────── state ─────────────────────────── */
  const [fx, setFx]     = useState('x^3 - x - 2');
  const [x0, setX0]     = useState(2);
  const [tol, setTol]   = useState(0.0001);
  const [maxIter, setMaxIter] = useState(20);
  const [steps, setSteps] = useState([]);  // iteration log
  const [errMsg, setErrMsg] = useState('');
  const [goToMenu, setGoToMenu] = useState(false);

  /* ───────────────────── compile f(x) and f'(x) ─────────────────── */
  const compiledF = useMemo(() => {
    try {
      return compile(fx);
    } catch {
      return null;
    }
  }, [fx]);

  const compiledDf = useMemo(() => {
    if (!compiledF) return null;
    try {
      const diff = derivative(fx, 'x');   // symbolic derivative
      return diff.compile();
    } catch {
      return null;
    }
  }, [compiledF]);

  /* helper evaluators that never crash the component */
  const evalF  = (x) => (compiledF  ? compiledF.evaluate({ x })  : NaN);
  const evalDf = (x) => (compiledDf ? compiledDf.evaluate({ x }) : NaN);

  /* ───────────────────── live validation banner ────────────────── */
  useEffect(() => {
    if (!compiledF) {
      setErrMsg('⚠️ Syntax error in f(x)');
      return;
    }
    if (!compiledDf) {
      setErrMsg('⚠️ Could not compute derivative f\u2032(x)');
      return;
    }
    if (!Number.isFinite(Number(x0))) {
      setErrMsg('⚠️ Initial guess x₀ must be a number');
      return;
    }
    setErrMsg('');
  }, [compiledF, compiledDf, x0]);

  /* ───────────────────────── algorithm ─────────────────────────── */
  function runNewton() {
    if (errMsg) return;

    let x = Number(x0);
    const ε = Number(tol);
    const log = [];

    for (let i = 1; i <= maxIter; i++) {
      const fxVal = evalF(x);
      const dfx   = evalDf(x);
      log.push({ i, x, fx: fxVal, dfx });

      if (Math.abs(fxVal) < ε) break;        // converged on y‑axis
      if (!Number.isFinite(dfx) || dfx === 0) {
        log[log.length - 1].note = 'Derivative zero / invalid – stop';
        break;
      }

      const xNew = x - fxVal / dfx;          // Newton step
      if (Math.abs(xNew - x) < ε) {          // converged on x‑axis
        x = xNew;
        log.push({ i: i + 1, x, fx: evalF(x), dfx: evalDf(x), note: '✔ converged' });
        break;
      }
      x = xNew;
    }

    setSteps(log);
  }

  /* ───────────────────────── plot data ─────────────────────────── */
  const plotData = useMemo(() => {
    if (errMsg) return [];

    // Sample f(x) around the initial guess for context
    const span     = 5;                     // ±5 around x0
    const start    = Number(x0) - span;
    const end      = Number(x0) + span;
    const N        = 400;
    const xs       = [];
    const ys       = [];
    const step     = (end - start) / (N - 1);

    for (let i = 0; i < N; i++) {
      const x = start + i * step;
      xs.push(x);
      ys.push(evalF(x));
    }

    const iterXs = steps.map((s) => s.x);
    const iterYs = iterXs.map(evalF);

    return [
      { x: xs, y: ys, mode: 'lines', name: 'f(x)' },
      { x: iterXs, y: iterYs, mode: 'markers+lines', name: 'Newton steps' },
    ];
  }, [x0, steps, errMsg, fx]);

  /* ───────────────────────── navigation ────────────────────────── */
  if (goToMenu) return <Menu />;

  /* ─────────────────────────── render ──────────────────────────── */
  return (
    <div id="menu">
      <div className="menu-newton">
        <img src={newtonLogo} alt="Newton‑Raphson" />
        <h3>Newton‑Raphson Method</h3>
        <p>
        The Newton–Raphson method iteratively refines a root estimate 
𝑥
𝑛
x 
n
​
  of a differentiable function by following the tangent line at that point: 
𝑥
𝑛
+
1
=
𝑥
𝑛
−
𝑓
(
𝑥
𝑛
)
𝑓
′
(
𝑥
𝑛
)
x 
n+1
​
 =x 
n
​
 − 
f 
′
 (x 
n
​
 )
f(x 
n
​
 )
​
 . When the starting guess is near the true root and 
𝑓
′
(
𝑥
)
≠
0
f 
′
 (x)

=0, errors shrink quadratically, making convergence very fast—though a poor initial guess or zero derivative can cause it to fail.
        </p>
      </div>

      {/* ────────────── controls ────────────── */}
      <section className="inputs">
        <label>
          f(x)
          <input value={fx} onChange={(e) => setFx(e.target.value)} />
        </label>

        <label>
          x₀ (initial guess)
          <input
            type="number"
            value={x0}
            onChange={(e) => setX0(e.target.value)}
          />
        </label>

        <label>
          tolerance (ε)
          <input
            type="number"
            step="0.00001"
            value={tol}
            onChange={(e) => setTol(e.target.value)}
          />
        </label>

        <label>
          max iterations
          <input
            type="number"
            value={maxIter}
            onChange={(e) => setMaxIter(e.target.value)}
          />
        </label>

        {errMsg && <div className="err-msg">{errMsg}</div>}
      </section>

      {/* ────────────── buttons ────────────── */}
      <button
        className="rainbow-hover"
        onClick={runNewton}
        disabled={!!errMsg}
      >
        <span className="sp">Execute</span>
      </button>

      {/* ────────────── results ────────────── */}
      {steps.length > 0 && !errMsg && (
        <>
          <section className="results">
            <h3>Iterations</h3>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>x<sub>n</sub></th>
                  <th>f(x<sub>n</sub>)</th>
                  <th>f′(x<sub>n</sub>)</th>
                </tr>
              </thead>
              <tbody>
                {steps.map(({ i, x, fx, dfx, note }) => (
                  <tr key={i} className={note ? 'warn' : ''}>
                    <td>{i}</td>
                    <td>{x.toFixed(6)}</td>
                    <td>{fx.toExponential(3)}</td>
                    <td>{dfx.toExponential(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              Best approximation ≈{' '}
              <strong>{steps[steps.length - 1].x.toFixed(6)}</strong> (ε={tol})
            </p>
          </section>

          <div className="plot-container">
            <Plot
              data={plotData}
              layout={{
                margin: { t: 20 },
                xaxis: { title: 'x' },
                yaxis: { title: 'f(x)' },
                height: 400,
              }}
              config={{ responsive: true }}
            />
          </div>
        </>
      )}

      <button data-label="Register" className="rainbow-hover"  id="backButton" onClick={() => setGoToMenu(true)}>
        <span className="sp">Back to Menu</span>
      </button>
    </div>
  );
}
