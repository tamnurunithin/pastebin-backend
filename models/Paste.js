const mongoose = require("mongoose");

const pasteSchema = new mongoose.Schema(
  {
    pasteId: {
      type: String,
      required: true,
      unique: true,
    },

    content: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    maxViews: {
      type: Number,
      default: null,
    },

    currentViews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Paste", pasteSchema);