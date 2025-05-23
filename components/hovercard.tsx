import { useState } from 'react'

interface HoverCardProps {
    title: string 
    description: string 
    children: React.ReactNode
}

export default function HoverCard({ title, description, children}: HoverCardProps) {
    const [show, setShow] = useState(false)

    return (
        <div className='relative inline-block group'
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <div className='absolute z-10 w-64 p-4 bg-white text-black rounded-lg shadow-lg top-full left-1/2 transform -translate-x-1/2 mt-2'>
                    <h3 className='text-lg font-bold'>{title}</h3>
                    <p className='text-sm'>{description}</p>
                </div>
            )}  
        </div>    
    )
}