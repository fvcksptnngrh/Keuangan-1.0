import { Search } from 'lucide-react'

const SearchBar = ({ value, onChange, placeholder = 'Cari...', className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-cardLight"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 bg-white border border-cardLight/30 rounded-full text-sm text-darkest placeholder:text-cardLight focus:outline-none focus:border-cardMid transition-colors"
      />
    </div>
  )
}

export default SearchBar
