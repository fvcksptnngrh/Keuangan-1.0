import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const PageTransition = ({ children }) => {
  const location = useLocation()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [stage, setStage] = useState('enter') // 'enter' | 'exit'
  const prevPath = useRef(location.pathname)

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname
      setStage('exit')

      const timeout = setTimeout(() => {
        setDisplayChildren(children)
        setStage('enter')
      }, 200)

      return () => clearTimeout(timeout)
    } else {
      setDisplayChildren(children)
    }
  }, [location.pathname, children])

  return (
    <div
      className="page-transition"
      style={{
        opacity: stage === 'enter' ? 1 : 0,
        transform: stage === 'enter' ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 300ms ease, transform 300ms ease',
      }}
    >
      {displayChildren}
    </div>
  )
}

export default PageTransition
