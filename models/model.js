const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
   
    userid: {
        required: true,
        type: String
    },
    text: {
        required: true,
        type: String
    },

})

module.exports = mongoose.model('Data', dataSchema)