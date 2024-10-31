import { UserPlus, Search, History, DollarSign, Moon, Sun, BarChart } from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  darkMode: boolean
  toggleDarkMode: () => void
}

export function Sidebar ({ activeTab, setActiveTab, darkMode, toggleDarkMode }: SidebarProps) {
  const menuItems = [
    { id: 'register', icon: UserPlus, label: 'Registrar Estudiante' },
    { id: 'search', icon: Search, label: 'Buscar Estudiante' },
    { id: 'history', icon: History, label: 'Historial de Facturación' },
    { id: 'payment', icon: DollarSign, label: 'Registrar Mensualidad' },
    { id: 'analysis', icon: BarChart, label: 'Análisis' },
  ]

  return (
    <aside className="w-16 bg-gray-200 dark:bg-gray-800 flex flex-col items-center py-4 space-y-4">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`p-2 rounded-lg ${activeTab === item.id ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}
          title={item.label}
        >
          <item.icon className="w-6 h-6" />
        </button>
      ))}
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 mt-auto"
        title={darkMode ? 'Modo claro' : 'Modo oscuro'}
      >
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
    </aside>
  )
}