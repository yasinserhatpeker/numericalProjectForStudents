// LinearSystems.jsx — direct vs iterative solver demo with error build‑up study
// ---------------------------------------------------------------------------
// Install once:  npm i mathjs react-plotly.js plotly.js-dist-min
//
// This page lets students compare a **direct LU solver** (mathjs.lusolve)
// against an **iterative Gauss–Seidel** routine on the same matrix A and a set
// of right‑hand‑side vectors {b₁, b₂, …}.  After one execution it reports:
//   • wall‑clock runtime (ms)
//   • iterations (for GS)
//   • residual ‖Ax−b‖₂  (for each RHS)
//   • cumulative floating‑point error when the same factors are reused many
//     times (shows how rounding builds up)
// A Plotly bar chart visualises total time and average residual.
// ---------------------------------------------------------------------------

import { useState } from 'react';
import { lusolve, matrix, multiply, subtract, norm } from 'mathjs';
import Plot from 'react-plotly.js';
import Menu from './Menu';
import linearLogo from '../assets/linear.png';

export default function LinearSystems() {
  /* ────────────────────────── navigation ─────────────────────────── */
  const [goMenu, setGoMenu] = useState(false);
  

  /* ──────────────────────────── state ────────────────────────────── */
  const [Atext, setAtext] = useState('4 1 2; 3 5 1; 1 1 3');
  const [Btext, setBtext] = useState('4 7 3 | 4.1 7 3');
  const [tol, setTol]   = useState(1e-6);
  const [maxIter, setMaxIter] = useState(100);
  const [results, setResults] = useState(null);
  const [errMsg, setErrMsg]   = useState('');

  /* ───────────────────── helper: parse input ─────────────────────── */
  function parseMatrix(str) {
    return str.split(';').map(row => row.trim().split(/[,\s]+/).map(Number));
  }
  function parseVectors(str) {
    return str.split('|').map(vec => vec.trim().split(/[,\s]+/).map(Number));
  }

  /* ─────────────── iterative solver (Gauss–Seidel) ──────────────── */
  function gaussSeidel(A, b, tol, maxIter) {
    const n = A.length;
    let x = new Array(n).fill(0);
    for (let k = 0; k < maxIter; k++) {
      let xOld = [...x];
      for (let i = 0; i < n; i++) {
        let sigma = 0;
        for (let j = 0; j < n; j++) {
          if (j !== i) sigma += A[i][j] * x[j];
        }
        x[i] = (b[i] - sigma) / A[i][i];
      }
      const diff = Math.max(...x.map((xi, i) => Math.abs(xi - xOld[i])));
      if (diff < tol) return { x, iterations: k + 1 };
    }
    return { x, iterations: maxIter };
  }

  /* ────────────────────── main experiment ───────────────────────── */
  function runExperiment() {
    setErrMsg('');
    let A, Bs;
    try {
      A = parseMatrix(Atext);
      Bs = parseVectors(Btext);
      const n = A.length;
      if (!A.every(r => r.length === n)) throw new Error('Matrix A must be square');
      if (!Bs.every(v => v.length === n)) throw new Error('Each RHS must match size of A');
    } catch (err) {
      setErrMsg(err.message);
      return;
    }

    /* ---- DIRECT: factor + solve each RHS anew (simulates round-off build‑up) */
    const directTimes = [];
    const directResiduals = [];
    const t0d = performance.now();
    Bs.forEach(b => {
      const start = performance.now();
      const x = lusolve(matrix(A), matrix(b)).toArray().map(v=>v[0]); // lusolve returns column‑vector matrix
      directTimes.push(performance.now() - start);
      const r = subtract(multiply(A, x), b);
      directResiduals.push(norm(r, 2));
    });
    const totalDirectTime = performance.now() - t0d;
    const avgDirectResidual = directResiduals.reduce((a, c) => a + c, 0) / directResiduals.length;

    /* ---- ITERATIVE: single GS solve per RHS */
    const gsTimes = [];
    const gsIterations = [];
    const gsResiduals = [];
    const t0g = performance.now();
    Bs.forEach(b => {
      const start = performance.now();
      const { x, iterations } = gaussSeidel(A, b, Number(tol), Number(maxIter));
      gsTimes.push(performance.now() - start);
      gsIterations.push(iterations);
      const r = subtract(multiply(A, x), b);
      gsResiduals.push(norm(r, 2));
    });
    const totalGSTime = performance.now() - t0g;
    const avgGSResidual = gsResiduals.reduce((a, c) => a + c, 0) / gsResiduals.length;
    const avgGSIter     = gsIterations.reduce((a,c)=>a+c,0)/gsIterations.length;

    setResults({
      totalDirectTime,
      avgDirectResidual,
      totalGSTime,
      avgGSResidual,
      avgGSIter,
      directTimes,
      gsTimes,
      gsIterations,
      directResiduals,
      gsResiduals
    });
  }
  if (goMenu) return <Menu/>;

  /* ────────────────────────── render ────────────────────────────── */
  return (
    <div id="menu">
      <div className="menu-newton">
        <img src={linearLogo} alt="" />
        <h3>Linear Systems  Direct vs Iterative</h3>
        <p>
            Linear-systems methods come in two flavors. Direct solvers (Gaussian elimination, LU, Cholesky for symmetric-positive-definite 
𝐴
A, and QR or SVD for ill-conditioned or rectangular cases) factor the matrix once—an 
𝑂
(
𝑛
3
)
O(n 
3
 ) cost that rewrites 
𝐴
A into triangular or orthogonal pieces—so each subsequent right-hand side is finished in two quick triangular substitutions. They are robust, predictably accurate, and great when the matrix is dense or reused many times. Iterative solvers tackle large, sparse, or variable matrices by starting with a guess and improving it: basic stationary sweeps (Jacobi, Gauss–Seidel, SOR) update entries row by row; modern Krylov-subspace algorithms (Conjugate Gradient for SPD systems, GMRES or BiCGSTAB for general ones) build successively better search directions that converge in far fewer than 
𝑛
n steps when paired with a good preconditioner. These methods need only 
𝑂
(
𝑛
)
O(n) memory, parallelize well, and avoid the fill-in that can overwhelm direct factorisations, but they can stall if 
𝐴

            </p>

        <p>Enter a square matrix <em>A</em> (rows separated by semicolons) and one or more right‑hand‑side vectors separated by "|". The experiment times <strong>direct LU</strong> and an <strong>iterative Gauss–Seidel</strong> on each RHS, then compares runtime and average residual.</p>
      </div>

      <section className="inputs">
        <label>A =
          <textarea value={Atext} onChange={e=>setAtext(e.target.value)} rows={2}/>
        </label>
        <label>b vectors =
          <textarea value={Btext} onChange={e=>setBtext(e.target.value)} rows={2}/>
        </label>
        <label>GS tolerance
          <input type="number" step="1e-6" value={tol} onChange={e=>setTol(e.target.value)}/>
        </label>
        <label>GS max iterations
          <input type="number" value={maxIter} onChange={e=>setMaxIter(e.target.value)}/>
        </label>
        {errMsg && <p className="err-msg">⚠️ {errMsg}</p>}
      </section>
        <button data-label="Register" className="rainbow-hover" onClick={runExperiment}><span className="sp">Run Experiment</span></button>

      {results && (
        <section className="results">
          <h4>Summary</h4>
          <table>
            <thead><tr><th>Method</th><th>Total time (ms)</th><th>Avg residual</th><th>Avg iterations</th></tr></thead>
            <tbody>
              <tr><td>Direct LU</td><td>{results.totalDirectTime.toFixed(2)}</td><td>{results.avgDirectResidual.toExponential(2)}</td><td>—</td></tr>
              <tr><td>Gauss–Seidel</td><td>{results.totalGSTime.toFixed(2)}</td><td>{results.avgGSResidual.toExponential(2)}</td><td>{results.avgGSIter.toFixed(1)}</td></tr>
            </tbody>
          </table>

          <Plot style={{width:'100%', height:'320px'}}
            data={[
              { x:['Direct','Gauss–Seidel'], y:[results.totalDirectTime, results.totalGSTime], type:'bar', name:'Time (ms)' },
              { x:['Direct','Gauss–Seidel'], y:[results.avgDirectResidual, results.avgGSResidual], type:'bar', name:'Avg residual', yaxis:'y2' }
            ]}
            layout={{
              barmode:'group',
              title:'Time vs Residual',
              yaxis:{ title:'ms' },
              yaxis2:{ title:'Residual', overlaying:'y', side:'right', type:'log' }
            }}
          />
        </section>
      )}

      <button data-label="Register" className="rainbow-hover" onClick={()=>setGoMenu(true)} id='backButton'>
        <span className="sp">Back to Menu</span>
      </button>
    </div>
  );
}

