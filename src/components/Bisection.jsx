import bisectionLogo from '../assets/19.03.02-Bisection-method.png';
import { useState } from 'react';
import { evaluate } from 'mathjs';
import Plot from 'react-plotly.js'; 
import { useMemo } from 'react';

export default function Bisection() {

const [fx,setFx]=useState('x^3 - x -2');
const [a,setA]=useState(-2);
const [b,setB]=useState( 3);
const [tol,setTol]=useState(0.001);
const [steps,setSteps]=useState([]);

const f=x => evaluate(fx,{x});

 function runBisection()
 {
    let aa = Number(a);
    let bb = Number(b);
    const ε = Number(tol);
    const log = [];

    if (f(aa) * f(bb) > 0) {
        alert('f(a) and f(b) must have opposite signs!');
        return;
      }

      let i = 1;
      while ((bb - aa) / 2 > ε && i < 100) {
        const c  = (aa + bb) / 2;
        const fc = f(c);
        log.push({ i, a: aa, b: bb, c, fc });

        if (fc === 0) break;         
      (f(aa) * fc < 0) ? (bb = c) : (aa = c);
      i += 1;
    }
    setSteps(log);
} 

const plotData = useMemo(() =>  {
    const xs = [];
    const ys = [];
    const step = (b - a) / 200; 
    for (let x = Number(a); x <= Number(b); x += step) {
        xs.push(x);
        ys.push(f(x));
      }
      const midXs = steps.map(s => s.c);
      const midYs = steps.map(s => f(s.c));

      return [
        {
          x: xs,
          y: ys,
          type: 'scatter',
          mode: 'lines',
          name: 'f(x)'
        },
        {
          x: midXs,
          y: midYs,
          type: 'scatter',
          mode: 'markers+lines',
          marker: { size: 6 },
          name: 'Midpoints'
        }
      ];

 },[steps, fx, a, b]);

 

     return (
         <div id="menu">
            <div className="menu-bisection">
             <img src={bisectionLogo} alt="" />
            <h3>Bisection Method</h3>
              <p>The bisection method finds a root of a continuous function 
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
[a,b]. This guaranteed, slow-but-steady process narrows the root’s location with each iteration without needing derivatives or complex algebra.</p>

            
            </div>
            <section className="inputs">
            <label>
            f(x)=
           <input value={fx} onChange={e => setFx(e.target.value)} />
           </label>  
             
             </section>

           
            

         </div>
     )
}
 