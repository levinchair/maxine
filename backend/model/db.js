var mongoose = require("mongoose");
const mongo=mongoose.connect('mongodb://localhost:27017/urbanNeighbourhood',{ useNewUrlParser: true }
,(err,res)=>{
if(err) throw err;
console.log("Connected to database");
});
var schema = mongoose.Schema;
var quotesDataSchema = new schema({},{collection:'cuyahoga'});
/*
{collection:'cuyahoga'});
var quotesDataSchema = new schema({
    PAR_CITY:{type: String, required:true},
    PARCELPIN: String,
    //geometry:Object
},
{collection:'cuyahoga'});*/

 
module.exports = mongoose.model('cuyahoga',quotesDataSchema);
