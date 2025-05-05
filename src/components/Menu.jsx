import mathLogo from '../assets/math-logo.jpg';
import bisectionLogo from '../assets/19.03.02-Bisection-method.png';
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
            <img src={bisectionLogo} alt="" />
             <h4>Bisection Method</h4>
             <button>Click for bisection</button>
             </div>

             <div className="section">
            <img src={bisectionLogo} alt="" />
             <h4>Bisection Method</h4>
             <button>Click for bisection</button>
             </div>

             <div className="section">
            <img src={bisectionLogo} alt="" />
             <h4>Bisection Method</h4>
             <button>Click for bisection</button>
             </div>


            </div>
        </div>
    )
}