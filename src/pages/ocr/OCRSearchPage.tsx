import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, ExternalLink, FileText, Users, UserCheck } from 'lucide-react'
import { mockStudents, mockEmployees, mockDocuments } from '@/data/mockData'
import { cn, formatDate } from '@/lib/utils'

type SearchCategory = 'all' | 'students' | 'employees' | 'documents'

interface SearchResult {
  id: string
  type: 'student' | 'employee' | 'document'
  title: string
  subtitle: string
  match: string
  date: string
  link: string
}

function highlightMatch(text: string, query: string): string {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return text.slice(0, idx) + '**' + text.slice(idx, idx + query.length) + '**' + text.slice(idx + query.length)
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query) return <span>{text}</span>
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-primary/20 text-primary rounded px-0.5 not-italic">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </span>
  )
}

export function OCRSearchPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<SearchCategory>('all')
  const [searched, setSearched] = useState(false)

  const buildResults = (): SearchResult[] => {
    const q = query.toLowerCase()
    const results: SearchResult[] = []

    if (category === 'all' || category === 'students') {
      mockStudents.filter((s) =>
        s.full_name.toLowerCase().includes(q) ||
        s.student_id.toLowerCase().includes(q) ||
        s.parent_name.toLowerCase().includes(q) ||
        s.parent_email.toLowerCase().includes(q)
      ).forEach((s) => results.push({
        id: s.id, type: 'student',
        title: s.full_name, subtitle: `${s.student_id} · Grade ${s.grade}`,
        match: `Parent: ${s.parent_name} · ${s.parent_email}`,
        date: s.updated_at, link: `/students/${s.id}`,
      }))
    }

    if (category === 'all' || category === 'employees') {
      mockEmployees.filter((e) =>
        e.name.toLowerCase().includes(q) ||
        e.employee_id.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q)
      ).forEach((e) => results.push({
        id: e.id, type: 'employee',
        title: e.name, subtitle: `${e.employee_id} · ${e.position}`,
        match: `Department: ${e.department} · ${e.email}`,
        date: e.updated_at, link: `/employees/${e.id}`,
      }))
    }

    if (category === 'all' || category === 'documents') {
      mockDocuments.filter((d) =>
        d.name.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.owner_name.toLowerCase().includes(q) ||
        (d.ocr_content && d.ocr_content.toLowerCase().includes(q))
      ).forEach((d) => results.push({
        id: d.id, type: 'document',
        title: d.name, subtitle: `${d.category} · ${d.file_type}`,
        match: d.ocr_content ? d.ocr_content.slice(0, 120) + '...' : `Owner: ${d.owner_name}`,
        date: d.updated_at, link: `/documents`,
      }))
    }

    return results
  }

  const results = searched && query ? buildResults() : []

  const TYPE_ICONS = {
    student: { icon: <Users className="w-4 h-4" />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
    employee: { icon: <UserCheck className="w-4 h-4" />, color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' },
    document: { icon: <FileText className="w-4 h-4" />, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  }

  const categories: { key: SearchCategory; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'students', label: 'Students' },
    { key: 'employees', label: 'Employees' },
    { key: 'documents', label: 'Documents' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-foreground">Global OCR Search</h1>
        <p className="text-muted-foreground text-sm mt-2">Search across all students, employees, documents, and OCR-indexed content</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-2xl blur-xl opacity-60" />
        <div className="relative rounded-2xl border border-border bg-card shadow-lg p-4">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') setSearched(true) }}
              placeholder="Search by name, ID, department, or document content..."
              className="flex-1 bg-transparent text-base focus:outline-none placeholder:text-muted-foreground"
            />
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setSearched(true)}
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
            >
              Search
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
              category === cat.key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <AnimatePresence mode="popLayout">
        {searched && query && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {results.length} result{results.length !== 1 ? 's' : ''} for "<strong>{query}</strong>"
            </p>

            {results.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-20 text-center rounded-xl border border-border bg-card">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-semibold">No results found</p>
                <p className="text-sm text-muted-foreground mt-1">Try different keywords or change the category filter</p>
              </motion.div>
            ) : (
              results.map((result, i) => {
                const typeInfo = TYPE_ICONS[result.type]
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', typeInfo.color)}>
                      {typeInfo.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm">
                            <HighlightedText text={result.title} query={query} />
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{result.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={cn('badge text-[10px]',
                            result.type === 'student' ? 'badge-info' :
                            result.type === 'employee' ? 'badge-success' : 'badge-neutral'
                          )}>
                            {result.type}
                          </span>
                          <span className="text-xs text-muted-foreground">{formatDate(result.date)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                        <HighlightedText text={result.match} query={query} />
                      </p>
                    </div>
                    <button className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </motion.div>
                )
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!searched && (
        <div className="py-16 text-center text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">Start searching</p>
          <p className="text-sm mt-1">Enter a keyword and press Enter or click Search</p>
        </div>
      )}
    </div>
  )
}
