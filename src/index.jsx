import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import World from './World.jsx'
import TargetTracker from './TargetTracker.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <>
          
        <div className="container">
          <TargetTracker />
        </div>
        
    </>
)