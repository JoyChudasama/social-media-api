const router = require('express').Router();

router.get('/all', (req, res) => {
    res.send('API ALL USERS')
})

module.exports = router;