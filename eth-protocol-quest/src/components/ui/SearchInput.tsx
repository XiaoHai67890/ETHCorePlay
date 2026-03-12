import { Search } from 'lucide-react';
import { InputHTMLAttributes } from 'react';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  resultCount?: number;
}

export function SearchInput({ resultCount, className = '', ...props }: SearchInputProps) {
  return (
    <div className={className}>
      <div className="search-box">
        <Search size={20} />
        <input {...props} />
      </div>
      {resultCount !== undefined && (
        <small style={{ display: 'block', marginTop: '8px' }}>
          找到 {resultCount} 个相关章节
        </small>
      )}
    </div>
  );
}
