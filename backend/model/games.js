import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: '',
    },

    category: {
      type: String,
      enum: [
        'CARD',
        'BOARD',
        'CASUAL',
        'SLOT',
        'LIVE',
        'TABLE',
        'OTHER',
      ],
      default: 'OTHER',
    },

    thumbnail: {
      type: String,
      default: '',
    },

    banner: {
      type: String,
      default: '',
    },

    icon: {
      type: String,
      default: '',
    },

    version: {
      type: String,
      default: '1.0.0',
    },

    launchUrl: {
      type: String,
      required: true,
    },

    demoUrl: {
      type: String,
      default: '',
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE'],
      default: 'ACTIVE',
    },

    supportedCurrencies: [
      {
        type: String,
      },
    ],

    supportedLanguages: [
      {
        type: String,
      },
    ],

    minBet: {
      type: Number,
      default: 1,
    },

    maxBet: {
      type: Number,
      default: 100000,
    },

    rtp: {
      type: Number,
      default: 0,
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    isDemoAvailable: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    tags: [
      {
        type: String,
      },
    ],

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

const Game = mongoose.model('Game', gameSchema)

export default Game
