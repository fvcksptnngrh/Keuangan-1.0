import { useEffect } from 'react'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, children, title, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pl-[260px]">
      <div
        className="absolute inset-0 bg-darkest/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-2xl shadow-2xl p-6 ${maxWidth} w-full mx-4 border border-gray-200`}
      >
        {(title || true) && (
          <div className="flex items-center justify-between mb-4">
            {title && <h3 className="text-lg font-bold text-darkest">{title}</h3>}
            <button
              onClick={onClose}
              className="ml-auto p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-cardLight" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export default Modal
