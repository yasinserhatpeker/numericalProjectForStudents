import mathLogo from '../assets/math-logo.jpg';
import bisectionLogo from '../assets/19.03.02-Bisection-method.png';
import newtonRaphsonLogo from '../assets/newton-raphson.webp';
import simpsonsRule from '../assets/simpsons-rule.png';
import gaussSeidel from '../assets/gauss-seidel.gif';
export default function Menu() {

    return (
        <div id='menu'>
         <img src={mathLogo} alt="" />
          <h3>Methods Section</h3>
          <div className="sections">

            <div className="section">
            <img src={bisectionLogo} alt="" />
             <h4>Bisection Method</h4>
             <button>Click for bisection</button>
             </div>
             <div className="section">
            <img src={newtonRaphsonLogo} alt="" />
             <h4>Bisection Method</h4>
             <button>Click for bisection</button>
             </div>

             <div className="section">
            <img src={simpsonsRule} alt="" />
             <h4>Bisection Method</h4>
             <button>Click for bisection</button>
             </div>

             <div className="section">
            <img src={gaussSeidel} alt="" />
             <h4>Bisection Method</h4>
             <button>Click for bisection</button>
             </div>


            </div>
        </div>
    )
}