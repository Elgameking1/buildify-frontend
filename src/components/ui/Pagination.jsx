import Button from './Button'

function Pagination({ onPageChange, page = 1, totalPages = 1 }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        variant="secondary"
      >
        Previous
      </Button>
      <span className="text-sm font-bold text-secondary">
        Page {page} of {totalPages}
      </span>
      <Button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        variant="secondary"
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination
