import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import './app.css'

export function App() {
    //   const [count, setCount] = useState(0)

    return (
        <>
            <div className="bg-red-300">
                <img src={viteLogo} class="logo" alt="Vite logo" />
                <img src={preactLogo} class="logo preact" alt="Preact logo" />
            </div>

            <p className="font-bold text-7xl text-red-500">It has worked</p>
        </>
    )
} 
