const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/yourDBname', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = mongoose.connection;