// NumDiff.jsx — interactive finite‑difference derivative estimator (fixed Run button)
// -----------------------------------------------------------------------------
// Install once: npm i mathjs react-plotly.js plotly.js-dist-min
//
// Students can enter any differentiable scalar function f(x) and a point x₀.
// The component computes forward, backward, and central difference
// approximations over log‑spaced h values (1e‑1 … 1e‑6), then shows the
// absolute error versus the analytic derivative obtained via mathjs.
// A log‑log Plotly chart reveals truncation vs round‑off behaviour.
//
// Fixes in this version:
//   • Use math.compile() + compiled.evaluate() to avoid runtime error that
//     prevented the **Run** button from functioning.
//   • Derivative node is compiled before evaluation (math.derivative(...).compile()).
//   • Input parsing coerces numeric x₀ to Number to prevent string coercion.
// -----------------------------------------------------------------------------

import { useState, useMemo } from 'react';
import { compile, derivative as mathDeriv } from 'mathjs';
import Plot from 'react-plotly.js';
import Menu from './Menu';
import numLogo from '../assets/numDiff.png';

export default function NumDiff() {
  /* -------------------- state -------------------- */
  const [fx, setFx] = useState('sin(x)');
  const [x0, setX0] = useState(1);
  const [errMsg, setErrMsg] = useState('');
  const [results, setResults] = useState([]);
  const [goMenu, setGoMenu] = useState(false);

  /* ------------------ compile f & f' --------------- */
  const compiled = useMemo(() => {
    try {
      // compile f(x)
      const fCompiled = compile(fx);
      const f = (x) => fCompiled.evaluate({ x });

      // compile f'(x)
      const dCompiled = mathDeriv(fx, 'x').compile();
      const df = (x) => dCompiled.evaluate({ x });

      setErrMsg('');
      return { f, df };
    } catch (err) {
      setErrMsg('⚠️ Invalid function');
      return null;
    }
  }, [fx]);

  /* ---------------- handle Run --------------------- */
  function handleRun() {
    if (!compiled) return;
    const { f, df } = compiled;
    const xNum = Number(x0);
    const exact = df(xNum);
    const hs = [1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6];

    const rows = hs.map((h) => {
      const fwd = (f(xNum + h) - f(xNum)) / h;
      const back = (f(xNum) - f(xNum - h)) / h;
      const ctr = (f(xNum + h) - f(xNum - h)) / (2 * h);
      return {
        h,
        fwd,
        back,
        ctr,
        efwd: Math.abs(fwd - exact),
        eback: Math.abs(back - exact),
        ectr: Math.abs(ctr - exact),
      };
    });
    setResults(rows);
  }

  /* ------------------- UI helpers ------------------ */
  const table = results.length > 0 && (
    <div className="results">

      <h3>Finite‑Difference Estimates at x₀ = {x0}</h3>
      <table>
        <thead>
          <tr>
            <th>h</th>
            <th>Forward</th>
            <th>|Err|</th>
            <th>Backward</th>
            <th>|Err|</th>
            <th>Central</th>
            <th>|Err|</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.h}>
              <td>{r.h}</td>
              <td>{r.fwd.toExponential(3)}</td>
              <td>{r.efwd.toExponential(2)}</td>
              <td>{r.back.toExponential(3)}</td>
              <td>{r.eback.toExponential(2)}</td>
              <td>{r.ctr.toExponential(3)}</td>
              <td>{r.ectr.toExponential(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const plot = results.length > 0 && (
    <Plot
      className="plot-container"
      data={['efwd', 'eback', 'ectr'].map((key, i) => ({
        x: results.map((r) => r.h),
        y: results.map((r) => r[key]),
        name: ['Forward', 'Backward', 'Central'][i],
        mode: 'lines+markers',
        line: { dash: i === 2 ? 'solid' : i === 0 ? 'dash' : 'dot' },
        marker: { symbol: i },
      }))}
      layout={{
        xaxis: { title: 'Step size h', type: 'log' },
        yaxis: { title: 'Absolute error', type: 'log' },
        legend: { orientation: 'h' },
        height: 400,
        title: 'Error vs Step Size',
        margin: { t: 40, l: 60, r: 10, b: 50 },
      }}
     
    />
  );

  /* --------------------- render -------------------- */
  if (goMenu) return <Menu />;
  return (
    <div id="menu">
      <div className="menu-newton">
        <img src={numLogo} alt="" />
        <h3>Numerical Differentiation</h3>
        <p>
            Numerical differentiation estimates derivatives from discrete samples using finite‐difference formulas whose accuracy hinges on the step size 
ℎ
h. A forward difference, 
[
𝑓
(
𝑥
+
ℎ
)
−
𝑓
(
𝑥
)
]
/
ℎ
[f(x+h)−f(x)]/h, is first‐order accurate, while a central difference, 
[
𝑓
(
𝑥
+
ℎ
)
−
𝑓
(
𝑥
−
ℎ
)
]
/
(
2
ℎ
)
[f(x+h)−f(x−h)]/(2h), is second‐order and cuts error roughly by 
ℎ
2
h 
2
 . By combining five or more points with carefully tuned weights, one can reach fourth- or even eighth-order accuracy, yet every extra order narrows the “sweet-spot” choice of 
ℎ
h. Total error is the sum of truncation (falls with smaller 
ℎ
h) and round-off (grows when 
ℎ
h is too small because nearly equal numbers must be subtracted); the optimal 
ℎ
h typically scales like 
𝜀
 
∣
𝑓
∣
/
∣
𝑓
′
′
∣
ε
​
 ∣f∣/∣f 
′′
 ∣ for central differences, where 
𝜀
ε is machine precision. Practical codes therefore adjust 
ℎ
h adaptively or use Richardson extrapolation to cancel leading error terms automatically. For smooth real-valued functions, the complex-step method—compute 
𝑓
(
𝑥
+
𝑖
ℎ
)
f(x+ih) and divide the imaginary part by 
ℎ
h—yields derivative estimates accurate to machine precision without subtraction, provided 
𝑓
f handles complex inputs. 
            </p>
            
        <p>
          Explore forward, backward, and central finite‑difference formulas and
          see how truncation and round‑off errors interact as the step size
          changes.
        </p>
        <div className="inputs">
          <label>
            f(x) ={' '}
            <input value={fx} onChange={(e) => setFx(e.target.value)} />
          </label>
          <label>
            x₀ ={' '}
            <input
              type="number"
              value={x0}
              onChange={(e) => setX0(Number(e.target.value))}
            />
          </label>
          {errMsg && <p className="err-msg">{errMsg}</p>}
        </div>
        {table}
        {plot}
      </div>
          <button
            data-label="Register"
            className="rainbow-hover"
            onClick={handleRun}
            disabled={!!errMsg}
          >
            <span className="sp">Run</span>
          </button>
      <button
        data-label="Register"
        className="rainbow-hover"
        onClick={() => setGoMenu(true)}
        id='backButton'
      >
        <span className="sp">Back to Menu</span>
      </button>
    </div>
  );
}
