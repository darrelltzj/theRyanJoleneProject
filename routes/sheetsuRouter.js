const express = require('express')
const router = express.Router()
const sheetsuController = require('../controllers/sheetsuController')

// ---Sheetsu attempt---
router.route('/sheetsu')
.get(sheetsuController.getSheetsu)

module.exports = router
