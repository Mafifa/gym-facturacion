// import Login from "./components/Login"
import { Toaster } from 'sonner'
import Dashboard from './components/Dashboard'

function App (): JSX.Element {

  return (
    <>
      <Toaster closeButton duration={2500} richColors />
      <Dashboard />
    </>
  )
}

export default App
