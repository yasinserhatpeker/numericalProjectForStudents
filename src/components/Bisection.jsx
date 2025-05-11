import bisectionLogo from '../assets/19.03.02-Bisection-method.png';
export default function Bisection() {
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
           
            

         </div>
     )
}