import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { deleteGame, getGames } from '../api/axios'
import ConfirmDialog from '../components/ConfirmDialog'
import DataTable from '../components/DataTable'
import GameImage from '../components/GameImage'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'

function Games() {
  const navigate = useNavigate()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const fetchGames = async () => {
    try {
      const { data } = await getGames()
      setGames(data.games || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load games')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteGame(deleteTarget._id)
      setGames((prev) => prev.filter((g) => g._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete game')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (row) => <GameImage game={row} size="md" />,
    },
    {
      key: 'name',
      label: 'Game',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-400">{row.code}</p>
        </div>
      ),
    },
    { key: 'category', label: 'Category' },
    { key: 'version', label: 'Version' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'isFeatured',
      label: 'Featured',
      render: (row) => (row.isFeatured ? 'Yes' : 'No'),
    },
    {
      key: 'minBet',
      label: 'Min Bet',
      render: (row) => `₹${row.minBet}`,
    },
    {
      key: 'maxBet',
      label: 'Max Bet',
      render: (row) => `₹${row.maxBet?.toLocaleString('en-IN')}`,
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div
          className="flex items-center justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            to={`/games/${row._id}/edit`}
            title="Edit"
            className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            type="button"
            title="Delete"
            onClick={() => setDeleteTarget(row)}
            className="p-2 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  if (loading) return <LoadingSpinner />
  if (error) {
    return <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">{error}</div>
  }

  return (
    <>
      <PageHeader
        title="Games"
        description="Manage your game catalog and launch settings"
        action={
          <Link
            to="/games/add"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Game
          </Link>
        }
      />

      {deleteError && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {deleteError}
        </div>
      )}

      <DataTable
        columns={columns}
        data={games}
        emptyMessage="No games found. Add your first game."
        onRowClick={(row) => navigate(`/games/${row._id}`)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Game"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ''
        }
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteTarget(null)
          setDeleteError('')
        }}
      />
    </>
  )
}

export default Games
