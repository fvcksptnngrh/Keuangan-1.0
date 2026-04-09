import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const PageTransition = ({ children }) => {
  const location = useLocation()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [stage, setStage] = useState('enter')
  const prevPath = useRef(location.pathname)
  const childrenRef = useRef(children)

  // Always keep the latest children in a ref
  childrenRef.current = children

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname
      setStage('exit')

      const timeout = setTimeout(() => {
        setDisplayChildren(childrenRef.current)
        setStage('enter')
      }, 200)

      return () => clearTimeout(timeout)
    } else {
      setDisplayChildren(children)
    }
  }, [location.pathname]) // only re-run on actual route changes

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
