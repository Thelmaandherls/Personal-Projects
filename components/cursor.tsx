import { useEffect, useState } from 'react'

export default function Cursor() {
    const [position, setPosition] =useState({ x:0, y:0 })

    useEffect(() => {
        const handleMouseMove = (e : MouseEvent) => setPosition({ x: e.clientX, y: e.clientY})
        const handleMouseLeave = () => setPosition({ x: 0, y: 0 })
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseleave', handleMouseLeave)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseleave', handleMouseLeave)
            }
        }, [])

        return (
            <div 
                className='pointer-events-none fixed top-0 left-0 z-50 w-6 h-6 rounded-full bg-white/20 border border-white mix-blend-difference'
                style={{
                    transform: `translate(${position.x -12}px, ${position.y -12}px)`,
                    transition: 'transform 0.05s ease-out',
                }}
        />
    )
}