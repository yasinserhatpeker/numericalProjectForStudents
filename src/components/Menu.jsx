import mathLogo from '../assets/math-logo.jpg';
import bisectionLogo from '../assets/19.03.02-Bisection-method.png';
import newtonRaphsonLogo from '../assets/newton-raphson.webp';
import simpsonsRule from '../assets/simpsons-rule.png';
import gaussSeidel from '../assets/gauss-seidel.gif';
import { useState } from 'react';
import Bisection from './Bisection';
import NewtonRaphson from './NewtonRaphson';
import SimpsonsRule from './SimpsonsRule';
import GaussSeidel from './GaussSeidel';
import compositionLogo from '../assets/LuDecomposition.png';
import LuDecomposition from './LuDecomposition';
import ScalarOptimization from './ScalarOptimization';
import scalarLogo from '../assets/scalar.jpg';
import ODEsComparison from './ODEsComparison';
import OdeLogo from '../assets/odeSolver.png';
import Algorithms from './Algorithms';
import AlgoLogo from '../assets/algorithms.png';
import LinearSystems from './LinearSystems';
import linearLogo from '../assets/linear.png';
import NumDiff from './NumDiff';
import NumLogo from '../assets/numDiff.png';



export default function Menu() {
const [goBisection,setGoBisection] = useState(false);
const [goNewtonRaphson,setGoNewtonRaphson]=useState(false);
const[goSimpsonsRule,setGoSimpsonsRule]=useState(false);
const[goGaussSeidel,setGoGaussSeidel]=useState(false);
const [goDecomposition,setGoDecomposition]=useState(false);
const [goScalar,setGoScalar]=useState(false);
const [goODE,setGoODE]=useState(false);
const[goAlgo,setGoAlgo]=useState(false);
const[goLinear,setGoLinear]=useState(false);
const[goNum,setGoNum]=useState(false);




  function handleBisection() {
     setGoBisection(true);
  }
  if(goBisection) {
    return <Bisection/>
  }
  function handleNewtonRaphson() {
    setGoNewtonRaphson(true);
  }
  if(goNewtonRaphson) {
    return <NewtonRaphson/>
  }
  function handleSimpsonsRule() {
    setGoSimpsonsRule(true);
  }
  if(goSimpsonsRule) {
    return <SimpsonsRule/>
  }
  function handleGaussSeidel() {
    setGoGaussSeidel(true);
  }
  if(goGaussSeidel) {
    return <GaussSeidel/>
  }
  function handleDecomposition() {
    setGoDecomposition(true);
  }
  if(goDecomposition) {
    return <LuDecomposition/>
  }

  function handleScalar() {
    setGoScalar(true);
  }
  if(goScalar) {
    return <ScalarOptimization/>
  }
  function handleODE() {
    setGoODE(true);
  }
  if(goODE) {
    return <ODEsComparison/>
  }
  function handleAlgo() {
    setGoAlgo(true);
  }
  if(goAlgo) {
    return <Algorithms/>
  }
  function handleLinear() {
    setGoLinear(true);
  }
  if(goLinear) {
    return <LinearSystems/>
  }
  function handleNum() {
    setGoNum(true);
  }
  if(goNum) {
    return <NumDiff/>
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
             <button data-label="Register" className="rainbow-hover" onClick={handleNewtonRaphson}>
              <span className="sp">Newton Raphson</span>
              </button>
             </div>

             <div className="section">
            <img src={simpsonsRule} alt="" />
             <h4>Simpson's Rule</h4>
             <button data-label="Register" className="rainbow-hover" onClick={handleSimpsonsRule}>
              <span className="sp">Simpson's Rule</span>
              </button>
             </div>

             <div className="section">
            <img src={gaussSeidel} alt="" />
             <h4>Gauss Seidel</h4>
             <button data-label="Register" className="rainbow-hover" onClick={handleGaussSeidel}>
              <span className="sp">Gauss Seidel</span>
              </button>
             </div>

             <div className="section">
            <img src={compositionLogo} alt="" />
             <h4>LU Decomposition</h4>
             <button data-label="Register" className="rainbow-hover" onClick={handleDecomposition}>
              <span className="sp">LU Decomposition</span>
              </button>
             </div>

          

            </div>
            <div className='sections'>
              
            <div className="section">
            <img src={scalarLogo} alt="" />
             <h4>Scalar and Multivariable Optimization</h4>
             <button data-label="Register" className="rainbow-hover" onClick={handleScalar}>
              <span className="sp">Scalar and Multivariable Optimization</span>
              </button>
             </div>

             <div className="section">
            <img src={OdeLogo} alt="" />
             <h4>ODE Solver Performance Comparison</h4>
             <button data-label="Register" className="rainbow-hover" onClick={handleODE}>
              <span className="sp">ODE Solver Performance Comparison</span>
              </button>
             </div>

             <div className="section">
            <img src={AlgoLogo} alt="" />
             <h4>Timing Comparison & Convergence Tests</h4>
             <button data-label="Register" className="rainbow-hover" onClick={handleAlgo}>
              <span className="sp">Timing Comparison & Convergence Tests</span>
              </button>
             </div>

           
           
            </div>
            <div className="sections">
            <div className="section">
            <img src={linearLogo} alt="" />
             <h4>Linear Systems</h4>
             <button data-label="Register" className="rainbow-hover" onClick={handleLinear}>
              <span className="sp">Linear Systems</span>
              </button>
             </div>
             <div className="section">
            <img src={NumLogo} alt="" />
             <h4>Numerical Differentiation</h4>
             <button data-label="Register" className="rainbow-hover" onClick={handleNum}>
              <span className="sp">Numerical Differentiation</span>
              </button>
             </div>
            
            
            </div>
          
        </div>
    )
}