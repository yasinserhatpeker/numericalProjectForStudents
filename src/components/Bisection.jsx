import { useState, useMemo, useEffect } from 'react';
import { compile } from 'mathjs';
import Plot from 'react-plotly.js';
import bisectionLogo from '../assets/19.03.02-Bisection-method.png';
import Menu from './Menu';

export default function Bisection() {

    


  const [fx, setFx] = useState('x^3 - x - 2');
  const [a, setA] = useState(-2);
  const [b, setB] = useState(3);
  const [tol, setTol] = useState(0.001);
  const [goToMenu,setGoToMenu]=useState(false);

  const [steps, setSteps] = useState([]);
  const [errMsg, setErrMsg] = useState('');



  const compiled = useMemo(() => {
    try {
      return compile(fx);
    } catch {
      return null;
    }
  }, [fx]);

  const evaluateF = (x) => {
    if (!compiled) return NaN;
    try {
      return compiled.evaluate({ x });
    } catch {
      return NaN;
    }
  };

  
  const [fa, fb] = useMemo(() => {
    return [evaluateF(Number(a)), evaluateF(Number(b))];
  }, [a, b, compiled]);

  
  useEffect(() => {
    if (!compiled) {
      setErrMsg('⚠️ Syntax error in f(x)');
      return;
    }
    if (!Number.isFinite(fa) || !Number.isFinite(fb)) {
      setErrMsg('⚠️ f(a) or f(b) is not a finite number');
      return;
    }
    if (fa * fb > 0) {
      setErrMsg('⚠️ f(a) and f(b) must have opposite signs');
      return;
    }
    setErrMsg('');
  }, [compiled, fa, fb]);

  const runBisection = () => {
    if (errMsg) return;
    let aa = Number(a);
    let bb = Number(b);
    const ε = Number(tol);
    const log = [];
    for (let i = 1; i <= 100 && (bb - aa) / 2 > ε; i++) {
      const c = (aa + bb) / 2;
      const fc = evaluateF(c);
      log.push({ i, a: aa, b: bb, c, fc });
      if (fc === 0) break;
      if (evaluateF(aa) * fc < 0) {
        bb = c;
      } else {
        aa = c;
      }
    }
    setSteps(log);
  };


  const plotData = useMemo(() => {
    if (errMsg) return [];
    const N = 400;
    const xs = [];
    const ys = [];
    const aa = Number(a);
    const bb = Number(b);
    const step = (bb - aa) / (N - 1);
    for (let i = 0; i < N; i++) {
      const x = aa + i * step;
      xs.push(x);
      ys.push(evaluateF(x));
    }
    const midXs = steps.map((s) => s.c);
    const midYs = midXs.map(evaluateF);
    return [
      { x: xs, y: ys, mode: 'lines', name: 'f(x)' },
      { x: midXs, y: midYs, mode: 'markers+lines', name: 'midpoints' },
    ];
  }, [a, b, steps, errMsg]);

  function handleBack() {
    setGoToMenu(true);
 }
 if(goToMenu) {
   return <Menu/>
 }

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
            
           <section className="inputs">
        <label>
          f(x)
          <input value={fx} onChange={(e) => setFx(e.target.value)} />
        </label>
        <label>
          a
          <input
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
          />
          
        </label>
        <label>
          b
          <input
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
          />
         
        </label>
        <label>
          tolerance
          <input
            type="number"
            step="0.0001"
            value={tol}
            onChange={(e) => setTol(e.target.value)}
          />
        </label>
        {errMsg && <div className="err-msg">{errMsg}</div>}
      </section>
        <button className="rainbow-hover" onClick={runBisection} disabled={!!errMsg}>
          <span className='sp'>Execute</span>
        </button>

      {steps.length > 0 && !errMsg && (
        <>
          <section className="results">
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
                    <td>{fc.toExponential(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              Approx. root ≈ <strong>{steps[steps.length - 1].c.toFixed(6)}</strong> (ε={tol})
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
     
     <button data-label="Register" className="rainbow-hover" onClick={handleBack} id='backButton'>
              <span className="sp">Back to Menu</span>
              </button>
      
          
           </div>
  )
 }