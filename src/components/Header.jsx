import logoImg from '../assets/tutorial-logo.png';

export default function Header() {
  return (
    <>
     <header>
       <img src={logoImg} alt="a tutorial-app logo" />
       <h1>
        Numerical Methods Tutorial for Students
       </h1>
        <h2>
            What is Numerical Methods?
        </h2>
        <p>
        Numerical methods are a collection of algorithmic techniques used to obtain approximate solutions to mathematical problems that are difficult or impossible to solve analytically. By representing continuous quantities with discrete values and iteratively refining those approximations, numerical methods enable computers to handle tasks such as solving systems of linear and nonlinear equations, performing numerical integration and differentiation, finding eigenvalues, and simulating physical processes. They balance accuracy, efficiency, and stability, allowing engineers and scientists to model complex real‑world phenomena where exact formulas are unavailable.

        </p>
     </header>
    </>
  )
}