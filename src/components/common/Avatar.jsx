const Avatar = ({ size = 80, nama, className = '', borderColor }) => {
  const initials = nama
    ? nama.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div
      className={`rounded-full bg-cardMid flex items-center justify-center text-white font-bold ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        ...(borderColor ? { border: `3px solid ${borderColor}` } : {}),
      }}
    >
      {initials}
    </div>
  )
}

export default Avatar
