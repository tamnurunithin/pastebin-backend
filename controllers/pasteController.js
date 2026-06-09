const Paste = require("../models/Paste");
const { nanoid } = require("nanoid");

// Create Paste
const createPaste = async (req, res) => {
  try {
    const { content, expireMinutes, maxViews } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    let expiresAt = null;

    if (expireMinutes) {
      expiresAt = new Date(
        Date.now() + expireMinutes * 60 * 1000
      );
    }

    const paste = await Paste.create({
      pasteId: nanoid(8),
      content,
      expiresAt,
      maxViews: maxViews || null,
    });

    res.status(201).json({
      success: true,
      pasteId: paste.pasteId,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Paste
const getPaste = async (req, res) => {
  try {
    const { id } = req.params;

    const paste = await Paste.findOne({
      pasteId: id,
    });

    if (!paste) {
      return res.status(404).json({
        success: false,
        message: "Paste not found",
      });
    }

    // Check time expiration
    if (paste.expiresAt && new Date() > paste.expiresAt) {
      return res.status(410).json({
        success: false,
        message: "Paste has expired",
      });
    }

    // Check view limit
    if (
      paste.maxViews !== null &&
      paste.currentViews >= paste.maxViews
    ) {
      return res.status(410).json({
        success: false,
        message: "Paste has expired",
      });
    }

    // Increment view count
    paste.currentViews += 1;

    await paste.save();

    return res.status(200).json({
      success: true,
      content: paste.content,
      views: paste.currentViews,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPaste,
  getPaste,
};