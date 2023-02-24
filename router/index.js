const express = require('express');
let router = express.Router();
const requests = require('./ok');
router.get('/read', async (req, res) => {
  const list = await requests(req.query);
  res.render('index.ejs', {
    list,
  });
});

module.exports = router;
