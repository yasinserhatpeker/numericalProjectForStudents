// SimpsonsRule.jsx — interactive demo of Simpson’s Rule for numerical integration
// -----------------------------------------------------------------------------
// Dependencies:  npm i mathjs react-plotly.js plotly.js-dist-min
// Students enter any smooth f(x), choose [a,b] and an even sub‑interval count n.
// The component returns the Simpson approximation, shows a table of sample
// points, and visualises the integrand + sample points on an interactive plot.

import { useState, useMemo, useEffect } from 'react';
import { compile } from 'mathjs';
import Plot from 'react-plotly.js';
import simpsonLogo from '../assets/simpsons-rule.png';
import Menu from './Menu';

export default function SimpsonsRule() {
  /* ─────────────────────────── state ─────────────────────────── */
  const [fx, setFx] = useState('sin(x)');
  const [a, setA]   = useState(0);
  const [b, setB]   = useState(Math.PI);
  const [n, setN]   = useState(10);            // must be even

  const [errMsg, setErrMsg] = useState('');
  const [result, setResult] = useState(null);  // { integral, rows: [{i, x, fx}...] }
  const [goToMenu, setGoToMenu] = useState(false);

  /* ───────── compile f(x) once per change ───────── */
  const compiled = useMemo(() => {
    try {
      return compile(fx);
    } catch {
      return null;
    }
  }, [fx]);

  const evalF = (x) => (compiled ? compiled.evaluate({ x }) : NaN);

  /* ─────────────── live validation ─────────────── */
  useEffect(() => {
    if (!compiled) {
      setErrMsg('⚠️ Syntax error in f(x)');
      return;
    }
    const aa = Number(a);
    const bb = Number(b);
    const nn = Number(n);
    if (!Number.isFinite(aa) || !Number.isFinite(bb) || aa >= bb) {
      setErrMsg('⚠️ a and b must be finite with a < b');
      return;
    }
    if (!Number.isInteger(nn) || nn <= 0 || nn % 2 !== 0) {
      setErrMsg('⚠️ n must be a positive even integer');
      return;
    }
    setErrMsg('');
  }, [compiled, a, b, n]);

  /* ─────────────── algorithm ─────────────── */
  function runSimpson() {
    if (errMsg) return;

    const aa = Number(a);
    const bb = Number(b);
    const nn = Number(n);
    const h  = (bb - aa) / nn;

    let sum = evalF(aa) + evalF(bb);
    const rows = [{ i: 0, x: aa, fx: evalF(aa) }];

    for (let i = 1; i < nn; i++) {
      const x = aa + i * h;
      const fxVal = evalF(x);
      const weight = i % 2 === 0 ? 2 : 4;
      sum += weight * fxVal;
      rows.push({ i, x, fx: fxVal, weight });
    }
    rows.push({ i: nn, x: bb, fx: evalF(bb) });

    const integral = (h / 3) * sum;
    setResult({ integral, rows, h });
  }

  /* ─────────────── plot data ─────────────── */
  const plotData = useMemo(() => {
    if (errMsg) return [];
    const aa = Number(a);
    const bb = Number(b);

    // dense sampling for the curve
    const N = 400;
    const xs = [];
    const ys = [];
    const step = (bb - aa) / (N - 1);
    for (let i = 0; i < N; i++) {
      const x = aa + i * step;
      xs.push(x);
      ys.push(evalF(x));
    }

    // sample points used by Simpson
    const sampleXs = result?.rows?.map((r) => r.x) || [];
    const sampleYs = sampleXs.map(evalF);

    return [
      { x: xs, y: ys, mode: 'lines', name: 'f(x)' },
      { x: sampleXs, y: sampleYs, mode: 'markers', name: 'Sample points' },
    ];
  }, [a, b, fx, result, errMsg]);

  /* ─────────────── navigation ─────────────── */
  if (goToMenu) return <Menu />;

  /* ─────────────── render ─────────────── */
  return (
    <div id="menu">
      <div className="menu-newton">
        <img src={simpsonLogo} alt="Simpson's Rule" />
        <h3>Simpson's Rule</h3>
        <p>
        Simpson’s Rule estimates 
∫
𝑎
𝑏
𝑓
(
𝑥
)
 
𝑑
𝑥
∫ 
a
b
​
 f(x)dx by slicing the interval into an even number of equal-width segments and, over each pair of segments, fitting a parabola through the two endpoints and midpoint. Summing the exact areas under these parabolas gives

∫
𝑎
𝑏
𝑓
(
𝑥
)
 
𝑑
𝑥
≈
ℎ
3
[
𝑓
(
𝑥
0
)
+
4
𝑓
(
𝑥
1
)
+
2
𝑓
(
𝑥
2
)
+
⋯
+
4
𝑓
(
𝑥
𝑛
−
1
)
+
𝑓
(
𝑥
𝑛
)
]
,
∫ 
a
b
​
 f(x)dx≈ 
3
h
​
 [f(x 
0
​
 )+4f(x 
1
​
 )+2f(x 
2
​
 )+⋯+4f(x 
n−1
​
 )+f(x 
n
​
 )],
where 
ℎ
h is the segment width. This method is simple, fast, and much more accurate than the trapezoidal rule because its error shrinks proportionally to 
ℎ
4
h 
4
  for smooth functions.
        </p>
      </div>

      <section className="inputs">
        <label>
          f(x)
          <input value={fx} onChange={(e) => setFx(e.target.value)} />
        </label>

        <label>
          a (lower limit)
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} />
        </label>

        <label>
          b (upper limit)
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} />
        </label>

        <label>
          n (even sub‑intervals)
          <input type="number" value={n} onChange={(e) => setN(e.target.value)} />
        </label>

        {errMsg && <div className="err-msg">{errMsg}</div>}
      </section>

      <button className="rainbow-hover" onClick={runSimpson} disabled={!!errMsg}>
        <span className="sp">Execute</span>
      </button>

      {result && !errMsg && (
        <>
          <section className="results">
            <h3>Sample Points</h3>
            <table>
              <thead>
                <tr>
                  <th>i</th>
                  <th>x<sub>i</sub></th>
                  <th>f(x<sub>i</sub>)</th>
                  <th>weight</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map(({ i, x, fx, weight }) => (
                  <tr key={i}>
                    <td>{i}</td>
                    <td>{x.toFixed(6)}</td>
                    <td>{fx.toExponential(3)}</td>
                    <td>{weight ?? (i === 0 || i === Number(n) ? 1 : '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              Simpson approximation ≈ <strong>{result.integral.toFixed(8)}</strong>
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

      <button
        data-label="Register"
        className="rainbow-hover"
        id="backButton"
        onClick={() => setGoToMenu(true)}
      >
        <span className="sp">Back to Menu</span>
      </button>
    </div>
  );
}

