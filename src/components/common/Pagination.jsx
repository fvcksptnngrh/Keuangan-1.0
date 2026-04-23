import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({
  mode = 'numbered',
  currentPage,
  totalPages,
  onPageChange,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}) => {
  if (mode === 'cursor') {
    const prevEnabled = hasPrev ?? currentPage > 1
    const nextEnabled = Boolean(hasNext)
    return (
      <div className="flex items-center justify-end gap-2 mt-4">
        <button
          onClick={onPrev}
          disabled={!prevEnabled}
          className="flex items-center gap-1 px-3 h-8 rounded-lg bg-white border border-cardLight/30 text-darkest text-sm font-medium hover:bg-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          Prev
        </button>
        <span className="px-3 h-8 flex items-center text-sm text-darkest/70">
          Halaman {currentPage || 1}
        </span>
        <button
          onClick={onNext}
          disabled={!nextEnabled}
          className="flex items-center gap-1 px-3 h-8 rounded-lg bg-white border border-cardLight/30 text-darkest text-sm font-medium hover:bg-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    )
  }

  if (totalPages <= 1) return null

  const getPages = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex items-center justify-end gap-1 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1.5 rounded-lg hover:bg-accent/40 text-darkest disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      {getPages().map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-cardLight">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-sidebar text-white'
                : 'hover:bg-accent/40 text-darkest'
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded-lg hover:bg-accent/40 text-darkest disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

export default Pagination
