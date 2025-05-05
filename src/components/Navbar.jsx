import winnerLogo from '../assets/winner.png';
export default function Navbar() {
    return (
        <div id="navbar">
            <img src={winnerLogo} alt="" />
             <span>Yasin Serhat Peker</span>
             
             <p>Welcome to my tutorial!</p>
        </div>
        
    )
}