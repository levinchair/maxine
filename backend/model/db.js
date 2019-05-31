var mongoose = require("mongoose");
// local database uri: 'mongodb://localhost:27017/urbanNeighbourhood'
const mongo=mongoose.connect('mongodb://basic:chargerHPl1908w@52.14.228.17	:27017/urbanNeighbourhood2',{ useNewUrlParser: true }
,(err,res)=>{
if(err) throw err;
console.log("Connected to database 1");
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
