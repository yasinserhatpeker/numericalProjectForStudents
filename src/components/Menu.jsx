import mathLogo from '../assets/math-logo.jpg';
import bisectionLogo from '../assets/19.03.02-Bisection-method.png';
import newtonRaphsonLogo from '../assets/newton-raphson.webp';
import simpsonsRule from '../assets/simpsons-rule.png';
import gaussSeidel from '../assets/gauss-seidel.gif';
import { useState } from 'react';
import Bisection from './Bisection';
export default function Menu() {
const [goBisection,setGoBisection] = useState(false);


  function handleBisection() {
     setGoBisection(true);
  }
  if(goBisection) {
    return <Bisection/>
  }

    return (
        <div id='menu'>
         <img src={mathLogo} alt="" />
          <h3>Methods Section</h3>
          <div className="sections">

            <div className="section">
            <img src={bisectionLogo} alt="" />
             <h4>Bisection</h4>
             <button data-label="Register" className="rainbow-hover" onClick={handleBisection}>
              <span className="sp">Bisection</span>
              </button>
             </div>
             <div className="section">
            <img src={newtonRaphsonLogo} alt="" />
             <h4>Newton Raphson</h4>
             <button data-label="Register" className="rainbow-hover">
              <span className="sp">Newton Raphson</span>
              </button>
             </div>

             <div className="section">
            <img src={simpsonsRule} alt="" />
             <h4>Simpson's Rule</h4>
             <button data-label="Register" className="rainbow-hover">
              <span className="sp">Simpson's Rule</span>
              </button>
             </div>

             <div className="section">
            <img src={gaussSeidel} alt="" />
             <h4>Gauss Seidel</h4>
             <button data-label="Register" className="rainbow-hover">
              <span className="sp">Gauss Seidel</span>
              </button>
             </div>


            </div>
        </div>
    )
}