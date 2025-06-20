// LuDecomposition.jsx — interactive LU factorisation demo (fixed)
// -----------------------------------------------------------------------------
// Key fix: math.js exposes `lup()` not `lu()`. We now call `math.lup(A)` and
// use the returned `{L, U, p}` permutation vector. Cached solves are performed
// via forward‑ and back‑substitution on L and U after permuting b.
// -----------------------------------------------------------------------------
// Quick install (once): npm i mathjs react-plotly.js plotly.js-dist-min

import { useState } from 'react';
import * as math from 'mathjs';
import Plot from 'react-plotly.js';
import luLogo from '../assets/luDecomposition.png';
import Menu from './Menu';

export default function LuDecomposition() {
  /* ────────────────────────── state ───────────────────────────── */
  const [Atext, setAtext] = useState('4 1 2; 3 5 1; 1 1 3');
  const [btext, setBtext] = useState('4 7 3 | 2 1 5'); // two RHS vectors, pipe‑separated
  const [err, setErr]     = useState('');
  const [LU, setLU]       = useState(null);            // stores {L,U,p}
  const [solveData, setSolveData] = useState(null);    // {directMs, cachedMs, solutions}
  const [goToMenu, setGoToMenu] = useState(false);


  /* ───────────────────── helper parse routines ─────────────────── */
  function parseMatrix(str) {
    return math.matrix(
      str.split(';').map(row =>
        row.trim().split(/[,\s]+/).filter(Boolean).map(Number)
      )
    );
  }

  function parseVectorBlock(str) {
    // supports multiple RHS vectors separated by | or new line
    return str.split(/\|/).map(vstr =>
      math.matrix(
        vstr.trim().split(/[,\s]+/).filter(Boolean).map(Number)
      )
    );
  }

  /* ───────────────────── forward / back sub ────────────────────── */
  function forwardSub(L, Pb) {
    const n = L.size()[0];
    const y = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = Pb[i];
      for (let j = 0; j < i; j++) sum -= L.get([i, j]) * y[j];
      y[i] = sum / L.get([i, i]);
    }
    return y;
  }

  function backSub(U, y) {
    const n = U.size()[0];
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = y[i];
      for (let j = i + 1; j < n; j++) sum -= U.get([i, j]) * x[j];
      x[i] = sum / U.get([i, i]);
    }
    return x;
  }

  /* ───────────────────────── actions ───────────────────────────── */
  function factorize() {
    setErr('');
    try {
      const A = parseMatrix(Atext);
      const n = A.size()[0];
      if (A.size()[1] !== n) throw new Error('Matrix must be square');
      const { L, U, p } = math.lup(A); // ✅ correct API
      setLU({ A, L, U, p });
      setSolveData(null);
    } catch (e) {
      setErr(`Factorisation failed: ${e.message}`);
      setLU(null);
    }
  }

  function solve() {
    if (!LU) {
      setErr('Factorise A first');
      return;
    }
    setErr('');
    try {
      const rhsBlocks = parseVectorBlock(btext);
      const solutions = [];
      const directStart = performance.now();
      const directSolutions = rhsBlocks.map(b => math.lusolve(LU.A, b));
      const directMs = performance.now() - directStart;

      const cachedStart = performance.now();
      rhsBlocks.forEach(b => {
        // apply permutation P to b
        const Pb = LU.p.map(idx => b.get([idx]));
        const y = forwardSub(LU.L, Pb);
        const x = backSub(LU.U, y);
        solutions.push(x);
      });
      const cachedMs = performance.now() - cachedStart;

      setSolveData({ directMs, cachedMs, solutions });
    } catch (e) {
      setErr(`Solve failed: ${e.message}`);
    }
  }
  if (goToMenu) return <Menu />;

  /* ────────────────────────── render ───────────────────────────── */
  return (
    <div id='menu'>
    <div className="menu-newton">
      
        <img src={luLogo} alt="LU"  />
        <h3>LU Decomposition Method</h3>
        <p>
            LU decomposition factors a square matrix $A$ into $PA = LU$, where $P$ handles row swaps, $L$ is lower-triangular, and $U$ is upper-triangular. The one-time $O(n^{3})$ factorization then turns many tasks—like finding determinants, building inverses, or repeatedly solving linear systems—into quick $O(n^{2})$ triangular operations, saving substantial time compared with performing full Gaussian elimination on every occasion.


            </p>
      
      </div>

      <section className="inputs">
        <label>
          Matrix A (rows with ;):
          <textarea value={Atext} rows={3} onChange={e => setAtext(e.target.value)} />
        </label>
        <label>
          RHS vector(s) b (| separated):
          <textarea value={btext} rows={2} onChange={e => setBtext(e.target.value)} />
        </label>
      </section>

      
        <button className="rainbow-hover" onClick={factorize}>Factorize A</button>
       <button className="rainbow-hover" onClick={solve} disabled={!LU}>Solve</button>

      {err && <p className="err-msg">⚠️ {err}</p>}

      {solveData && (
        <section className="results">
          <h3>Performance comparison</h3>
          <Plot
            data={[
              { x: ['Direct each time'], y: [solveData.directMs], type: 'bar', name: 'Direct' },
              { x: ['Cached LU'], y: [solveData.cachedMs], type: 'bar', name: 'Cached' }
            ]}
            layout={{
              width: 480,
              height: 320,
              yaxis: { title: 'Milliseconds' },
              showlegend: true
            }}
          />

          <h3>Solutions</h3>
          <table>
            <thead>
              <tr>
                <th>RHS #</th>
                {solveData.solutions[0].map((_, idx) => (
                  <th key={idx}>x{idx + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {solveData.solutions.map((sol, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  {sol.map((v, j) => (
                    <td key={j}>{v.toFixed(4)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

<button data-label="Register" className="rainbow-hover"  id="backButton" onClick={() => setGoToMenu(true)}>
        <span className="sp">Back to Menu</span>
      </button>
    </div>
    
  );
}
