import mongoose from 'mongoose'

const operatorSchema = new mongoose.Schema(
  {
    operatorId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

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

    companyName: {
      type: String,
      trim: true,
    },

    ownerName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    logo: {
      type: String,
      default: '',
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'MAINTENANCE'],
      default: 'ACTIVE',
    },

    currency: {
      type: String,
      default: 'INR',
    },

    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },

    language: {
      type: String,
      default: 'en',
    },

    apiKey: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    apiSecretPath: {
      type: String,
      required: true,
      trim: true,
    },

    enabledGames: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
      },
    ],

    commissionType: {
      type: String,
      enum: ['PERCENTAGE', 'FIXED'],
      default: 'PERCENTAGE',
    },

    commissionValue: {
      type: Number,
      default: 0,
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    sessionTimeout: {
      type: Number,
      default: 3600,
    },

    maxConcurrentPlayers: {
      type: Number,
      default: 1000,
    },

    isDemoEnabled: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      default: '',
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

const Operator = mongoose.model('Operator', operatorSchema)

export default Operator
