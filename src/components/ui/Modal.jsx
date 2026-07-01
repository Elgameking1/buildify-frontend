import { FiX } from 'react-icons/fi'
import Button from './Button'

function Modal({ children, isOpen, onClose, title }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-secondary/70 p-4">
      <section className="surface-panel w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-concrete p-5">
          <h2 className="text-xl font-black text-secondary">{title}</h2>
          <Button aria-label="Close modal" className="px-3" onClick={onClose} variant="ghost">
            <FiX aria-hidden="true" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </section>
    </div>
  )
}

export default Modal
