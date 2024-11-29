const router = require('express').Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('./thoughtRoutes');

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;