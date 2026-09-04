import { useState } from 'react'
import { Gamepad2 } from 'lucide-react'

function GameImage({ game, size = 'md', className = '' }) {
  const [imageError, setImageError] = useState(false)
  const imageUrl = game?.thumbnail || game?.icon || game?.banner

  const sizes = {
    sm: 'w-10 h-10 rounded-lg text-xs',
    md: 'w-12 h-12 rounded-xl text-sm',
    lg: 'w-24 h-24 rounded-2xl text-lg',
    xl: 'w-full aspect-video rounded-2xl text-xl',
  }

  const fallback = (
    <div
      className={`${sizes[size]} bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0 ${className}`}
    >
      {game?.name ? (
        <span className="text-indigo-700 font-semibold">
          {game.name.charAt(0).toUpperCase()}
        </span>
      ) : (
        <Gamepad2 className="w-5 h-5 text-indigo-600" />
      )}
    </div>
  )

  if (!imageUrl || imageError) return fallback

  return (
    <img
      src={imageUrl}
      alt={game.name}
      className={`${sizes[size]} object-cover bg-slate-100 border border-slate-200 shrink-0 ${className}`}
      onError={() => setImageError(true)}
    />
  )
}

export default GameImage
