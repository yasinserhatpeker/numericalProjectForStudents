import { useState, useMemo, useEffect } from 'react';
import { compile } from 'mathjs';
import Plot from 'react-plotly.js';
import bisectionLogo from '../assets/19.03.02-Bisection-method.png';

export default function Bisection() {
  
  const [fx, setFx]   = useState('x^3 - x - 2');
  const [a, setA]     = useState(-2);
  const [b, setB]     = useState( 3);
  const [tol, setTol] = useState(0.001);

  const [steps, setSteps] = useState([]);   
  const [errMsg, setErrMsg] = useState(''); 

  
  const compiled = useMemo(() => {
    try {
      return compile(fx);
    } catch {
      return null; 
    }
  }, [fx]);

  
  useEffect(() => {
    if (fx.trim() === '') {
      setErrMsg('Enter a function definition.');
    } else if (!compiled) {
      setErrMsg('⚠️ Syntax error in f(x)');
    } else {
      setErrMsg('');
    }
  }, [fx, compiled]);

 
  const f = x => {
    if (!compiled) return NaN;
    try {
      return compiled.evaluate({ x });
    } catch {
      return NaN;
    }
  };

  
  function runBisection() {
    if (errMsg || !compiled) return;   

    let aa = Number(a);
    let bb = Number(b);
    if (aa === bb) {
      alert('a and b must be different.');
      return;
    }
    if (aa > bb) [aa, bb] = [bb, aa]; 

    const fa = f(aa);
    const fb = f(bb);
    if (!Number.isFinite(fa) || !Number.isFinite(fb)) {
      alert('f(a) or f(b) is not a real number.');
      return;
    }
    if (fa * fb > 0) {
      alert('f(a) and f(b) must have opposite signs.');
      return;
    }

    const ε = Number(tol);
    const log = [];
    let i = 1;
    let mid, fmid;

    while ((bb - aa) / 2 > ε && i <= 100) {
      mid  = (aa + bb) / 2;
      fmid = f(mid);
      log.push({ i, a: aa, b: bb, c: mid, fc: fmid });

      if (fmid === 0) break;          
      (fa * fmid < 0) ? (bb = mid) : (aa = mid);
      i += 1;
    }

    setSteps(log);
  }

  
  const plotData = useMemo(() => {
    if (!compiled) return [];

    const N = 250;
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    const xs = Array.from({ length: N }, (_, k) => min + (k * (max - min)) / (N - 1));
    const ys = xs.map(x => f(x));

    const lineTrace = {
      x: xs,
      y: ys,
      mode: 'lines',
      name: 'f(x)',
    };

    if (steps.length === 0) return [lineTrace];
    const mids  = steps.map(s => s.c);
    const fMids = mids.map(m => f(m));

    const midTrace = {
      x: mids,
      y: fMids,
      mode: 'markers+lines',
      marker: { size: 8 },
      name: 'midpoints',
    };

    return [lineTrace, midTrace];
  }, [compiled, a, b, steps]);

  return (
     <div id="menu">
        <div className="menu-bisection">
            <img src={bisectionLogo} alt="" />
           <h3>Bisection Method</h3>
           <p>
           The bisection method finds a root of a continuous function 
𝑓
(
𝑥
)
f(x) by repeatedly halving an interval 
[
𝑎
,
𝑏
]
[a,b] where 
𝑓
(
𝑎
)
f(a) and 
𝑓
(
𝑏
)
f(b) have opposite signs. At each step, it takes the midpoint 
𝑐
=
(
𝑎
+
𝑏
)
/
2
c=(a+b)/2; if 
𝑓
(
𝑐
)
f(c) is zero, 
𝑐
c is the root, otherwise the half-interval where the sign change persists becomes the new 
[
𝑎
,
𝑏
]
[a,b]. This guaranteed, slow-but-steady process narrows the root’s location with each iteration without needing derivatives or complex algebra.
           </p>
           </div>
           <section className='inputs'>
        <label>
          f(x)
          <input
            value={fx}
            onChange={e => setFx(e.target.value)}
            aria-label='function definition'
          />
        </label>

        <label>
          a
          <input type='number' value={a} onChange={e => setA(e.target.value)} />
        </label>

        <label>
          b
          <input type='number' value={b} onChange={e => setB(e.target.value)} />
        </label>

        <label>
          tolerance
          <input
            type='number'
            step='0.0001'
            value={tol}
            onChange={e => setTol(e.target.value)}
          />
        </label>

      </section>
        <button className='rainbow-hover' onClick={runBisection} disabled={!!errMsg}>
         <span className='sp'>Execute the function</span>
        </button>

      
      {errMsg && <p style={{ color: '#ff7373', marginTop: '-0.5rem' }}>{errMsg}</p>}

     
      {steps.length > 0 && (
        <section className='results'>
          <h3>Iterations</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>a</th>
                <th>b</th>
                <th>c</th>
                <th>f(c)</th>
              </tr>
            </thead>
            <tbody>
              {steps.map(({ i, a, b, c, fc }) => (
                <tr key={i}>
                  <td>{i}</td>
                  <td>{a.toFixed(6)}</td>
                  <td>{b.toFixed(6)}</td>
                  <td>{c.toFixed(6)}</td>
                  <td>{Number.isFinite(fc) ? fc.toExponential(3) : 'NaN'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      
      {plotData.length > 0 && (
        <div className='plotly-wrapper'>
          <Plot
            data={plotData}
            layout={{
              margin: { t: 20, r: 20, l: 40, b: 40 },
              xaxis: { title: 'x' },
              yaxis: { title: 'f(x)' },
              height: 400,
            }}
            config={{ responsive: true }}
          />
        </div>
      )}

  </div>
  )
 }