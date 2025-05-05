import navbarLogo from '../assets/navbar-logo.png';
export default function Navbar() {
    return (
        <div id="navbar">
            <img src={navbarLogo} alt="" />
             <span>Yasin Peker</span>
             
             <p>Welcome to my tutorial</p>
        </div>
        
    )
}