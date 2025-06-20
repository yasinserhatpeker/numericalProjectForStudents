// GaussSeidel.jsx — original Matrix‑based style, crash‑free
// -----------------------------------------------------------------------------
// Dependencies:  npm i mathjs react-plotly.js plotly.js-dist-min
// Students paste a square matrix A (rows separated by semicolons, entries by
// spaces) and a right‑hand side vector b (space‑separated). The component
// performs Gauss–Seidel iterations, logs each estimate and residual norm, and
// visualises convergence in a Plotly chart.

import { useState, useMemo } from 'react';
import Menu from './Menu';
import {
  matrix,
  size,
  multiply,
  subtract,
  abs,
  norm,
  bignumber,
  number,
} from 'mathjs';
import Plot from 'react-plotly.js';
import gsLogo from '../assets/gauss-seidel.gif';

export default function GaussSeidel() {
  /* ───────────────────────────────── state ─────────────────────────── */
  const [amText, setAmText] = useState('4 1 2; 3 5 1; 1 1 3');
  const [bText, setBText]   = useState('4 7 3');
  const [tol, setTol]       = useState(0.001);
  const [maxIter, setMaxIter] = useState(25);
  const [rows, setRows]       = useState([]);          // iteration log
  const [errMsg, setErrMsg]   = useState('');
  const [goToMenu, setGoToMenu] = useState(false);

  /* ─────────────────────── helpers: parse & validate ───────────────── */
  const parsed = useMemo(() => {
    try {
      // Parse A
      const Arows = amText
        .trim()
        .split(';')
        .map(r => r.trim().split(/\s+/).map(Number));

      const A = matrix(Arows);

      // Parse b
      const bArr = bText.trim().split(/\s+/).map(Number);
      const bVec = matrix(bArr);

      // Dimensions
      const [m, n] = size(A).valueOf();  // <‑‑ safe replacement for A.size()

      if (m !== n) {
        return { error: 'Matrix A must be square.' };
      }
      if (bArr.length !== n) {
        return { error: 'Vector b length must equal A dimensions.' };
      }

      // Simple diagonal dominance hint (optional)
      for (let i = 0; i < n; i++) {
        const diag = abs(Arows[i][i]);
        const offSum = Arows[i].reduce((s, val, j) => (j === i ? s : s + abs(val)), 0);
        if (diag <= offSum) {
          return { error: 'Matrix A is not diagonally dominant; Gauss–Seidel may diverge.' };
        }
      }
      return { A, b: bVec, n };
    } catch (err) {
      return { error: 'Syntax error in matrix or vector.' };
    }
  }, [amText, bText]);

  /* ───────────────────────────── algorithm ─────────────────────────── */
  function runGS() {
    if (parsed.error) {
      setErrMsg(parsed.error);
      return;
    }
    setErrMsg('');

    const { A, b, n } = parsed;
    const x = Array(n).fill(0);               // initial guess 0
    const log = [];

    for (let k = 1; k <= maxIter; k++) {
      for (let i = 0; i < n; i++) {
        let sigma = 0;
        for (let j = 0; j < n; j++) {
          if (j !== i) sigma += A.get([i, j]) * x[j];
        }
        x[i] = (b.get([i]) - sigma) / A.get([i, i]);
      }

      // Compute residual norm
      const r = subtract(multiply(A, x), b);
      const res = norm(r, 2);
      log.push({ k, x: [...x], res: number(res) });
      if (res < tol) break;
    }
    setRows(log);
  }

  /* ────────────────────────────── plots ────────────────────────────── */
  const plotData = useMemo(() => {
    if (!rows.length) return [];
    return [
      {
        x: rows.map(r => r.k),
        y: rows.map(r => r.res),
        mode: 'lines+markers',
        name: 'Residual norm',
      },
    ];
  }, [rows]);
  if (goToMenu) return <Menu />;

  /* ──────────────────────────── render ─────────────────────────────── */
  return (
    <div id='menu'>
    <div className="menu-newton">
      <header>
        <img src={gsLogo} alt="Gauss Seidel" width={64} />
        <h3>Gauss–Seidel Method</h3>
        <p>
        The Gauss–Seidel method solves 
𝐴
𝑥
=
𝑏
Ax=b by sweeping through the unknowns one at a time: each new value 
𝑥
𝑖
x 
i
​
  is recomputed using the latest updates for 
𝑥
1
,
…
,
𝑥
𝑖
−
1
x 
1
​
 ,…,x 
i−1
​
  and the old values for 
𝑥
𝑖
+
1
,
…
,
𝑥
𝑛
x 
i+1
​
 ,…,x 
n
​
 . This “in-place” reuse often makes it converge roughly twice as fast as the Jacobi method when 
𝐴
A is diagonally dominant or symmetric positive definite, but it can diverge if those conditions fail and is harder to parallelize because each step depends on the previous updates.
        </p>
      </header>
      </div>

      <section className="inputs">
        <label>
          Matrix A (rows by ';')
          <textarea
            rows="3"
            value={amText}
            onChange={e => setAmText(e.target.value)}
          />
        </label>

        <label>
          Vector b
          <input
            value={bText}
            onChange={e => setBText(e.target.value)}
          />
        </label>

        <label>
          tolerance ε
          <input
            type="number"
            step="0.0001"
            value={tol}
            onChange={e => setTol(Number(e.target.value))}
          />
        </label>

        <label>
          max iterations
          <input
            type="number"
            value={maxIter}
            onChange={e => setMaxIter(Number(e.target.value))}
          />
        </label>

      </section>
        <button
          className="rainbow-hover"
          onClick={runGS}
          disabled={Boolean(parsed.error)}
        >
          Execute
        </button>

      {errMsg && <p className="err-msg">⚠️ {errMsg}</p>}

      {rows.length > 0 && (
        <section className="results">
          <h3>Iterations</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                {rows[0].x.map((_, i) => (
                  <th key={i}>x{i + 1}</th>
                ))}
                <th>‖Ax−b‖₂</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.k}>
                  <td>{r.k}</td>
                  {r.x.map((val, i) => (
                    <td key={i}>{val.toFixed(6)}</td>
                  ))}
                  <td>{r.res.toExponential(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Plot
            data={plotData}
            layout={{
              width: 640,
              height: 360,
              title: 'Residual vs Iteration',
              xaxis: { title: 'Iteration' },
              yaxis: { title: 'Residual (log)', type: 'log' },
            }}
          />
        </section>
      )}
      <button data-label="Register" className="rainbow-hover"  id="backButton" onClick={() => setGoToMenu(true)}>
        <span className="sp">Back to Menu</span>
      </button>
      
    </div>
    
  );
}
