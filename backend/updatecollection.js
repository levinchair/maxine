var mongoose = require("mongoose"), 
    fs = require("fs"),
    path = require('path'); //imports

console.log(process.argv[2]);
var filename = process.argv[2];
if(filename === undefined) throw new Error("Please pass filepath as argument");


filePath = path.join(__dirname, filename);
console.log(filename);

this.newGeoData = [];
//var img = fs.readFileSync(filename);
//console.log(img.length);

// Store file data chunks in this array
let chunks = [];
// We can use this variable to store the final data
// Read file into stream.Readable
let fileStream = fs.createReadStream(filename, {encoding: 'utf-8'});

// An error occurred with the stream
fileStream.once('error', (err) => {
    // Be sure to handle this properly!
    console.error(err); 
});

var fileBuffer;
// File is done being read
fileStream.once('end', () => {
    // create the final data Buffer from data chunks;
    fileBuffer = Buffer.concat(chunks);
    console.log("done reading: " + fileBuffer);
    // Of course, you can do anything else you need to here, like emit an event!
});

// Data is flushed from fileStream in chunks,
// this callback will be executed for each chunk
let  other = '';
let numChunks = 0;
fileStream.on('data', (chunk) => {
    numChunks++;
    console.log(typeof chunk);
    sepChunk = chunk.split(',{"type"');
    for(const  [i, elem]  of sepChunk.entries()){
        //console.log(elem.slice(-2) === '}}');
        if(elem.slice(-2) !== '}}') { // last element most likely
            console.log("end element found: " + elem + "|||||");
            other = '{"type"' + elem;
        }
        else if(other !== '' && i === 0){
            console.log(i);
            sepChunk[i] = other.concat(elem);
            other = '';
        }else{
            sepChunk[i] = '{"type"' + elem;
        }
        
    }
    //console.log(sepChunk);
    console.log('other: ' + other);
    chunks.push(sepChunk);
    //if( chunk[length  ])
    if(numChunks === 0)  {
        console.log(chunks);
        throw new Error();
    }
    // We can perform actions on the partial data we have so far!
});



//this.newGeoData = JSON.parse(fs.readFileSync(filename, {encoding: 'utf-8'}));
//console.log("geodata: " + JSON.stringify(this.newGeoData));
//console.log("size: " + this.newGeoData.length);
//console.log(this.newGeoData[0]);
// parse geoJsonData



//make connection to the data base
// local database uri: 'mongodb://localhost:27017/urbanNeighbourhood'
mongoose.connect('mongodb://basic:chargerHPl1908w@52.14.228.17:27017/urbanNeighbourhood2',
{ useNewUrlParser: true }, (err, db) => {
    if(err) console.log(err);
    // console.log(db);
    // console.log("connected to " +  db);
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



// update the collection 


// cuyahoga.findOne({}, 
//     (err, res) => {
//     if(err) console.log("err " + err);
//     console.log(res);
// });

// db.once('open', () => {
//     // now connected
//     //create schema of the database by import the model
//     var schema = mongoose.Schema;
//     var quotesDataSchema = new schema({},{collection:'cuyahoga_test'});
//     var data = mongoose.model('cuyahoga_test',quotesDataSchema);
//     data.find({"properties.par_city": 'CLEVELAND'}).exec(
//         (err, res)=>{
//             if(err) console.error("err " + err);
//             console.log("res: " + res);
//         }
//     );
// })


