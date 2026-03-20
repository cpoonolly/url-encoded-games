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
            className="border border-white/20 hover:border-white/70 transition-colors duration-150 rounded-lg px-5 py-3 bg-transparent text-inherit text-base cursor-pointer"
            style={style}
        >
            {children}
        </button>
    )
}

export default Button
