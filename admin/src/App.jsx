import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Operators from './pages/Operators'
import AddOperator from './pages/AddOperator'
import EditOperator from './pages/EditOperator'
import OperatorAdapters from './pages/OperatorAdapters'
import AddOperatorAdapter from './pages/AddOperatorAdapter'
import EditOperatorAdapter from './pages/EditOperatorAdapter'
import Games from './pages/Games'
import AddGame from './pages/AddGame'
import GameDetails from './pages/GameDetails'
import EditGame from './pages/EditGame'
import Players from './pages/Players'
import Transactions from './pages/Transactions'
import Wallet from './pages/Wallet'
import Revenue from './pages/Revenue'
import Analytics from './pages/Analytics'
import ApiLogs from './pages/ApiLogs'
import AdminUsers from './pages/AdminUsers'
import PlatformSettings from './pages/PlatformSettings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/operators" element={<Operators />} />
            <Route path="/operators/add" element={<AddOperator />} />
            <Route path="/operators/:id/edit" element={<EditOperator />} />
            <Route path="/operator-adapters" element={<OperatorAdapters />} />
            <Route path="/operator-adapters/add" element={<AddOperatorAdapter />} />
            <Route path="/operator-adapters/:operatorId/edit" element={<EditOperatorAdapter />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/add" element={<AddGame />} />
            <Route path="/games/:id/edit" element={<EditGame />} />
            <Route path="/games/:id" element={<GameDetails />} />
            <Route path="/players" element={<Players />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/revenue" element={<Revenue />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/api-logs" element={<ApiLogs />} />
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/platform-settings" element={<PlatformSettings />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
