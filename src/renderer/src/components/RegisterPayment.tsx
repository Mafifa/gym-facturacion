import { DollarSign } from 'lucide-react'

interface RegisterPaymentProps {
  setShowPaymentModal: (show: boolean) => void
}

export function RegisterPayment ({ setShowPaymentModal }: RegisterPaymentProps) {

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Registrar Mensualidad</h2>
      <form onSubmit={(e) => {
        e.preventDefault()
        setShowPaymentModal(true)
      }}>
        {/* ... otros campos del formulario ... */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <DollarSign className="mr-2 h-4 w-4" /> Registrar Pago
        </button>
      </form>
    </div>
  )
}