import { CSSProperties, ReactNode, useState } from 'react'

interface ButtonProps {
    onClick: () => void
    children: ReactNode
    style?: CSSProperties
}

function Button({ onClick, children, style }: ButtonProps) {
    const [hovered, setHovered] = useState(false)

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                padding: '0.75rem 1.25rem',
                border: `1px solid ${hovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '8px',
                background: 'transparent',
                color: 'inherit',
                fontSize: '1rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'border-color 0.15s ease',
                ...style,
            }}
        >
            {children}
        </button>
    )
}

export default Button
