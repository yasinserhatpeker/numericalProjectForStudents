// Algorithms.jsx — interactive performance & convergence comparison demo
// ---------------------------------------------------------------------
// This component lets students compare **Newton–Raphson** (fast but fragile)
// with **Bisection** (slow but guaranteed) on a sample nonlinear equation and
// illustrates how robust code uses *try / catch* blocks, derivative checks and
// automatic step‑back when Newton stalls.  It logs run‑time, iteration count
// and final error, then displays everything in the same plain‑table style used
// across the project.
//
// Install deps once if missing:
//   npm i mathjs
// ---------------------------------------------------------------------

import { useState } from 'react';
import { evaluate } from 'mathjs';
import algoLogo from '../assets/algorithms.png';
import Menu from './Menu';

export default function Algorithms() {
  /* ────────────────────────── state ─────────────────────────────── */
  const [funcStr, setFuncStr] = useState('x^3 - x - 2');
  const [a, setA] = useState(0);
  const [b, setB] = useState(2);
  const [tol, setTol] = useState(1e-6);
  const [results, setResults] = useState(null);
  const [errMsg, setErrMsg] = useState('');
  const [goMenu, setGoMenu] = useState(false);

  /* ─────────────────── helper closures ─────────────────────────── */
  const f = x => evaluate(funcStr, { x });
  const df = x => {
    // cheap finite‑difference derivative
    const h = 1e-6;
    return (f(x + h) - f(x - h)) / (2 * h);
  };

  /* ─────────────────── algorithms with guards ──────────────────── */
  function newtonRaphson(x0, tol, maxIt = 100) {
    let x = x0;
    const start = performance.now();
    for (let i = 1; i <= maxIt; i++) {
      const dfx = df(x);
      if (Math.abs(dfx) < 1e-12) {
        // derivative too small – adapt: take a tiny random nudge
        x += 1e-3;
        continue; // try again (counts as an iteration)
      }
      const xNext = x - f(x) / dfx;
      if (Math.abs(xNext - x) < tol) {
        return { root: xNext, iters: i, time: performance.now() - start, err: Math.abs(f(xNext)) };
      }
      x = xNext;
    }
    // non‑convergence → signal via thrown Error
    throw new Error('Newton–Raphson failed to converge within max iterations');
  }

  function bisection(a, b, tol, maxIt = 100) {
    const start = performance.now();
    let aa = a, bb = b;
    if (f(aa) * f(bb) > 0) throw new Error('f(a) and f(b) must have opposite signs');
    let i;
    for (i = 1; i <= maxIt; i++) {
      const c = (aa + bb) / 2;
      if ((bb - aa) / 2 < tol || f(c) === 0) {
        return { root: c, iters: i, time: performance.now() - start, err: Math.abs(f(c)) };
      }
      (f(aa) * f(c) < 0) ? (bb = c) : (aa = c);
    }
    throw new Error('Bisection exceeded max iterations (should be impossible)');
  }

  /* ─────────────── main experiment orchestrator ────────────────── */
  function runComparison() {
    setErrMsg('');
    try {
      const bis = bisection(Number(a), Number(b), Number(tol));
      let newton;
      try {
        // Try Newton with midpoint as initial guess (typical practice)
        newton = newtonRaphson((Number(a) + Number(b)) / 2, Number(tol));
      } catch (e) {
        // fallback strategy: use bisection root as initial guess + damped NR
        try {
          newton = newtonRaphson(bis.root, Number(tol));
        } catch (e2) {
          newton = null; // record failure
        }
      }
      setResults({ bis, newton });
    } catch (err) {
      setErrMsg(err.message);
      setResults(null);
    }
  }

  /* ────────────────────── navigation ───────────────────────────── */
  if (goMenu) return <Menu />;

  /* ──────────────────────── render ─────────────────────────────── */
  return (
    <div id="menu">
      <div className="menu-newton">
        <img src={algoLogo} alt="Algorithms" />
        <h3>Algorithm Performance & Convergence Demo</h3>

        <p>
        Convergence tests give you a menu of “shortcuts” for deciding whether an infinite series 
∑
𝑛
=
1
∞
𝑎
𝑛
∑ 
n=1
∞
​
 a 
n
​
  sums to a finite limit. Comparison and limit-comparison pit 
𝑎
𝑛
a 
n
​
  against a benchmark like the 
𝑝
p-series 
1
/
𝑛
𝑝
1/n 
p
 ; if 
𝑎
𝑛
a 
n
​
  shrinks at least as fast as a convergent benchmark, the whole series converges. The ratio and root tests zoom in on successive terms—roughly, if 
∣
𝑎
𝑛
+
1
/
𝑎
𝑛
∣
∣a 
n+1
​
 /a 
n
​
 ∣ or 
∣
𝑎
𝑛
∣
𝑛
n
  
∣a 
n
​
 ∣
​
  stays below 1 beyond some index, geometric-style decay guarantees convergence. The integral test turns the discrete series into the area under a positive, decreasing curve to draw the same verdict, while the alternating-series (Leibniz) test shows that sign-flipping terms that diminish to zero still converge—even when their absolute values would not.
        </p>

        <p>
          We compare <strong>Newton–Raphson</strong> (quadratic convergence when it works) with
          <strong> Bisection</strong> (linear but guaranteed) for the scalar equation&nbsp;
          <code>f(x) = 0</code>.  Runtime is measured with <code>performance.now()</code>; convergence is
          declared when successive iterates differ by &lt; tol.&nbsp;Derivative blow‑ups or
          non‑convergence are trapped in <code>try&#47;catch</code>, and Newton automatically nudges the
          iterate or falls back to Bisection’s root when needed.
        </p>

        <div className="inputs">
          <label>
            f(x) =
            <input value={funcStr} onChange={e => setFuncStr(e.target.value)} />
          </label>
          <label>
            a =
            <input type="number" value={a} onChange={e => setA(e.target.value)} />
          </label>
          <label>
            b =
            <input type="number" value={b} onChange={e => setB(e.target.value)} />
          </label>
          <label>
            tol =
            <input type="number" value={tol} step="1e-7" onChange={e => setTol(e.target.value)} />
          </label>
        </div>

        {errMsg && <p className="err-msg">⚠️ {errMsg}</p>}
        <button className="rainbow-hover" onClick={runComparison}>Run Comparison</button>

        {results && (
            <div className="results">
            <table>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Root</th>
                  <th>|f(root)|</th>
                  <th>Iters</th>
                  <th>Time (ms)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Bisection</td>
                  <td>{results.bis.root.toFixed(6)}</td>
                  <td>{results.bis.err.toExponential(2)}</td>
                  <td>{results.bis.iters}</td>
                  <td>{results.bis.time.toFixed(2)}</td>
                </tr>
                {results.newton ? (
                    <tr>
                    <td>Newton–Raphson</td>
                    <td>{results.newton.root.toFixed(6)}</td>
                    <td>{results.newton.err.toExponential(2)}</td>
                    <td>{results.newton.iters}</td>
                    <td>{results.newton.time.toFixed(2)}</td>
                  </tr>
                ) : (
                  <tr>
                    <td>Newton–Raphson</td>
                    <td colSpan="4">❌ failed to converge</td>
                  </tr>
                )}
              </tbody>
            </table>

            <p>
              <em>
                Observation:</em> Newton requires far fewer iterations and usually less runtime
              <em> if</em> it converges, but its derivative sensitivity makes Bisection a safer
              fallback when robustness is critical.
            </p>
          </div>
        )}
      </div>

      <button data-label="Register" className="rainbow-hover" onClick={() => setGoMenu(true)} id='backButtonAlgo' >
        <span className="sp">Back to Menu</span>
      </button>
    </div>
  );
}

