import { CSSProperties, ReactNode } from 'react'

interface ButtonProps {
    onClick: () => void
    children: ReactNode
    style?: CSSProperties
}

function Button({ onClick, children, style }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '0.75rem 1.25rem',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                background: 'transparent',
                color: 'inherit',
                fontSize: '1rem',
                cursor: 'pointer',
                textAlign: 'center',
                ...style,
            }}
        >
            {children}
        </button>
    )
}

export default Button
