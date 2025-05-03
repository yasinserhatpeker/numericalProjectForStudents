import logoImg from '../assets/tutorial-logo.png';

export default function Header() {
  return (
    <>
     <header>
       <img src={logoImg} alt="a tutorial-app logo" />
       <h1>
        Numerical Methods Tutorial for Students
       </h1>
     </header>
    </>
  )
}