var mongoose = require("mongoose");
const view1Schema =mongoose.Schema({

    category: String,
    per_of_land: Number, 
    noParcels: Number,
    noSqfeet : Number,
    assessedValue : Number,
    perAssessedValue: Number
});

module.exports = mongoose.model('view1',view1Schema);