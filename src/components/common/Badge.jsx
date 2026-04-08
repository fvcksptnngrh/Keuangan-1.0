const variants = {
  accent: 'bg-accent text-darkest',
  dark: 'bg-sidebar text-white',
  mid: 'bg-cardMid text-white',
  red: 'bg-red-500 text-white',
  green: 'bg-green-500 text-white',
  gray: 'bg-gray-500 text-white',
}

const Badge = ({ children, variant = 'accent', className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
