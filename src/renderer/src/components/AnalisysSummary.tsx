// AnalysisSummary.tsx
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, DollarSign, BookOpen, Briefcase, Loader, Users } from 'lucide-react'
import { useAnalysisSummary } from '../hooks/useAnalysisSummary'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function AnalysisSummary () {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    incomeByMonth,
    studentsByCourse,
    registrationsByMonth,
    averageDollarRate,
    averageMonthlyPayment,
    mostPopularCourse,
    totalIncome,
    averageStudentsPerCourse,
    isLoading
  } = useAnalysisSummary()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Resumen de Análisis</h2>

      <div className="mb-4 flex space-x-4">
        <div>
          <label htmlFor="start-date" className="block mb-1">Fecha de inicio</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block mb-1">Fecha de fin</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <DollarSign className="mr-2" />
            Tasa de Cambio Promedio
          </h3>
          <p className="text-2xl font-bold">${averageDollarRate.toFixed(2)}</p>
        </div>
        <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <TrendingUp className="mr-2" />
            Pago Mensual Promedio
          </h3>
          <p className="text-2xl font-bold">${averageMonthlyPayment.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <BookOpen className="mr-2" />
            Curso Más Popular
          </h3>
          <p className="text-2xl font-bold">{mostPopularCourse.count}</p>
          <p className="text-sm">{mostPopularCourse.count} estudiantes</p>
        </div>
        <div className="bg-purple-100 dark:bg-purple-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <DollarSign className="mr-2" />
            Ingreso Total
          </h3>
          <p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-indigo-100 dark:bg-indigo-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Briefcase className="mr-2" />
            Promedio de Estudiantes por Curso
          </h3>
          <p className="text-2xl font-bold">{averageStudentsPerCourse.toFixed(1)}</p>
        </div>
        <div className="bg-red-100 dark:bg-red-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Users className="mr-2" />
            Total de Estudiantes
          </h3>
          <p className="text-2xl font-bold">{studentsByCourse.reduce((sum, course) => sum + course.count, 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Ingresos por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={incomeByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthYear" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="amount" stroke="#82ca9d" fill="#82ca9d" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Registros de Estudiantes por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={registrationsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthYear" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Distribución de Estudiantes por Curso</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={studentsByCourse}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {studentsByCourse.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Top 5 Cursos por Estudiantes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentsByCourse.sort((a, b) => b.count - a.count).slice(0, 5)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}