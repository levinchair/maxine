/* 
This program will need to be run on node js. This will take an array of geojso data and replace
an existing collection with new geojson data. 
 Usage: node updatecollection.js <location of .geojson file>
*/

var mongoose = require("mongoose"), 
    es = require('event-stream'),
    fs = require("fs"),
    JSONStream = require('JSONStream');

console.log(process.argv[2]);
var filename = process.argv[2];
if(filename === undefined) throw new Error("Please pass filepath as argument");

console.log("\n *STARTING* \n");
// Get content from file
//make connection to the data base
// local database uri: 'mongodb://localhost:27017/urbanNeighbourhood'
mongoose.connect('mongodb://peter:laptopbottlekey@52.14.228.17:27017/urbanNeighbourhood2',
{ useNewUrlParser: true }, (err, db) => {
    if(err) console.log(err);
    // console.log(db);
     console.log("connected to database");
});

//define schema and instantiate mongoose model, this is lenient
var parceldataformat = {
    "type": String,
    "properties" : Object,
    "geometry": {
        "type": String,
        "coordinates": Array
    }

}
var parceldataSchema = new mongoose.Schema(parceldataformat, {collection:'cuyahoga_full'});
var cuyahoga = mongoose.model("cuyahoga", parceldataSchema);

var getStream = function () {
    var jsonData = filename,
        stream = fs.createReadStream(jsonData, {encoding: 'utf8'}),
        parser = JSONStream.parse('*');
        return stream.pipe(parser);
};

getStream()
.pipe(es.mapSync(function (data) {
    // console.log(data);
    cuyahoga.update({"properties.PARCELPIN" : data.properties.parcelpin}, data, {upsert : true})
        .exec((err, res) => {
            if(err) console.log(err);
        });
}));


