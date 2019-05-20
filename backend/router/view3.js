var express= require('express')
var router= express.Router()
var db = require("../model/db.js");
var upperCase = require('upper-case')

var _view3={
_id: String,   
    sq_feet: Number, 
    AssessedValue: Number,
    percSq_feet : Number,
    AssessedValPerSqFeet: Number,
    CR4 : Number
}
//--------------------------------------------------view3 of land data with city -----------------------------------------------------------------
router.get("/view3/:city", async (req,res,next)=>{
    var totalSqFeet;
    var SiteCat;
    // calculate total square feet area under Commercial category
    db.aggregate( [ {"$match":{"properties.SiteCat1":"Commercial","properties.PAR_CITY":upperCase(req.params.city)}},{ "$group":{ "_id":null, "totalsqfeet": {"$sum":"$properties.TOTAL_COM_"} } },{"$project":{"_id":0,"totalsqfeet":1}} ])//,function(err,data){
    .exec()  
        
    .then((data)=>{
                console.log(JSON.stringify(data));
                totalSqFeet=data.map(function(v){
                            
                    return v.totalsqfeet;
                });
                console.log("total SquareFeet Area : "+totalSqFeet);
                //Calculate # of square feet, % of square feet, Assessed value, % assessed value
                db.aggregate([{"$match":{"properties.SiteCat1":"Commercial","properties.PAR_CITY":upperCase(req.params.city)}},{"$group":
                {"_id":"$properties.SiteCat2","sq_feet":{"$sum":"$properties.TOTAL_COM_"},
                "AssessedValue":{"$sum":"$properties.GCERT3"}}},{"$project":{"sq_feet":1,"AssessedValue":1, 
                "percSq_feet":{"$multiply":[{"$divide":["$sq_feet",Number(totalSqFeet)]},100]},
                "AssessedValPerSqFeet":{ $cond: [ { $eq: [ "$sq_feet", 0 ] }, "0",{"$divide":["$AssessedValue","$sq_feet"]} ]}} }])
                .exec()
                .then(async (result)=>{
                    _view3=result;

                        //console.log(JSON.stringify(result,undefined,2))
                        //res.json(result);
                        SiteCat=result.map(function(v){
                        
                            return v._id;
                        })
                        console.log("Site Categories : "+SiteCat);
                        //Calculate CR4 ratio

                        var totalcom_sq_feet;
                        var com_sq_feetPerCat;
                        var totalCom_sq_feetPerCat=0;
                        var cr4;
                        var cat;
    

                        for(var i in SiteCat){

                                cat=SiteCat[i];
                                console.log("I am in for "+SiteCat[i]);


                                //calculate total  # TotAL_COM_ (square feet) under each SiteCat2 Category
                                await db.aggregate([{"$match":{"properties.SiteCat1":"Commercial","properties.SiteCat2":SiteCat[i],"properties.PAR_CITY":upperCase(req.params.city)}},{"$group": {"_id":null,"com_sq_feet":{"$sum":"$properties.TOTAL_COM_"}}}])
                                .exec()
                                .then((data)=>{
                                    console.log(JSON.stringify(data));
                                    totalcom_sq_feet=data.map(function(v){
                                        
                                    return v.com_sq_feet;
                                    });
                                    console.log("Total com_sq_feet: "+totalcom_sq_feet);
                            
                                
                                })  
                                .catch((err)=>{
                                    console.log("error ocuured : "+err);  
                                })

                            
                                //Find the top 4 owner having heighest  # TotAL_COM_ (square feet) for each SiteCat2 under "Commercial category" 
                                
                                await  db.aggregate([{"$match":{"properties.SiteCat1":"Commercial","properties.SiteCat2":SiteCat[i],"properties.PAR_CITY":upperCase(req.params.city)}},{"$group":
                                {"_id":"$properties.PARCL_OWN3","com_sq_feet":{"$sum":"$properties.TOTAL_COM_"},"No_Parcels":{"$sum":1}}},{"$sort":{"com_sq_feet":-1}},
                                {"$limit":4},{"$project":{"_id":1,"com_sq_feet":1,"No_Parcels":1}}])
                                .exec()
                                .then((result)=>{
                                            console.log(JSON.stringify(result));
                                            com_sq_feetPerCat=result.map(function(v){     
                                            return v.com_sq_feet;
                                            });
                                            
                                            console.log("com_sq_feet: "+com_sq_feetPerCat+" cat= "+cat);
                                            //res.send(parcelsPerUnit);
                                
                        
                                            //Sum all  # TotAL_COM_ (square feet)
                        
                                            totalCom_sq_feetPerCat=0;
                                            for(var rs in com_sq_feetPerCat)
                                            {
                                                    totalCom_sq_feetPerCat+=com_sq_feetPerCat[rs];
                                            }
                                            console.log("total Sum of parcelsPerUnit: "+totalCom_sq_feetPerCat+" for cat "+cat);
                                            //cocentratic ratio of sum  # TotAL_COM_ (square feet)  of top 4 owners to total  # TotAL_COM_ (square feet) under Commertial categary
                                            cr4=totalCom_sq_feetPerCat/totalcom_sq_feet;
                                            if(_view3[i]._id==SiteCat[i])
                                                _view3[i].CR4=cr4;
                                            console.log("CR4 : "+cr4);
                                            console.log();
                                                //res.JSON(cr4);
                                            return result;
                                
                                })
                                .catch((err)=>{
                                            console.log("error ocuured : "+err);
                                })

                            
                        }
                    

                })
                .catch((err)=>{
                        console.log("error ocuured : "+err);
                })
                console.log("this.view2: ",JSON.stringify(_view3,undefined,2));
                  res.json(_view3);
    })
    .catch((err)=>{
        console.log("error ocuured : "+err);
    })

 
});


//--------------------------------------------------view3 of land data with city and hood-----------------------------------------------------------------
router.get("/view3/:city/:hood", async (req,res,next)=>{
        var totalSqFeet;
        var SiteCat;
        console.log("city: ",req.params.city)
        console.log("hood: ",req.params.hood)
        // calculate total square feet area under Commercial category
        db.aggregate( [ {"$match":{"properties.SiteCat1":"Commercial","properties.PAR_CITY":upperCase(req.params.city),"properties.SPA_NAME":req.params.hood}},{ "$group":{ "_id":null, "totalsqfeet": {"$sum":"$properties.TOTAL_COM_"} } },{"$project":{"_id":0,"totalsqfeet":1}} ])//,function(err,data){
        .exec()  
            
        .then((data)=>{
                    console.log(JSON.stringify(data));
                    totalSqFeet=data.map(function(v){
                                
                        return v.totalsqfeet;
                    });
                    console.log("total SquareFeet Area : "+totalSqFeet);
                    //Calculate # of square feet, % of square feet, Assessed value, % assessed value
                    db.aggregate([{"$match":{"properties.SiteCat1":"Commercial","properties.PAR_CITY":upperCase(req.params.city),"properties.SPA_NAME":req.params.hood}},{"$group":
                    {"_id":"$properties.SiteCat2","sq_feet":{"$sum":"$properties.TOTAL_COM_"},
                    "AssessedValue":{"$sum":"$properties.GCERT3"}}},{"$project":{"sq_feet":1,"AssessedValue":1, 
                    "percSq_feet":{"$multiply":[{"$divide":["$sq_feet",Number(totalSqFeet)]},100]},
                    "AssessedValPerSqFeet":{ $cond: [ { $eq: [ "$sq_feet", 0 ] }, 0,{"$divide":["$AssessedValue","$sq_feet"]} ]} }}])
                    .exec()
                    .then(async (result)=>{
                        _view3=result;
                            // console.log(JSON.stringify(result,undefined,2))
                            // res.json(result);
                            SiteCat=result.map(function(v){
                            
                                return v._id;
                            })
                            console.log("Site Categories : "+SiteCat);
                            //Calculate CR4 ratio

                            var totalcom_sq_feet;
                            var com_sq_feetPerCat;
                            var totalCom_sq_feetPerCat=0;
                            var cr4;
                            var cat;
        
 
                            for(var i in SiteCat){

                                    cat=SiteCat[i];
                                    console.log("I am in for "+SiteCat[i]);


                                    //calculate total  # TotAL_COM_ (square feet) under each SiteCat2 Category
                                    await db.aggregate([{"$match":{"properties.SiteCat1":"Commercial","properties.SiteCat2":SiteCat[i],"properties.PAR_CITY":upperCase(req.params.city),"properties.SPA_NAME":req.params.hood}},{"$group": {"_id":null,"com_sq_feet":{"$sum":"$properties.TOTAL_COM_"}}}])
                                    .exec()
                                    .then((data)=>{
                                        console.log(JSON.stringify(data));
                                        totalcom_sq_feet=data.map(function(v){
                                            
                                        return v.com_sq_feet;
                                        });
                                        console.log("Total com_sq_feet: "+totalcom_sq_feet);
                                
                                    
                                    })  
                                    .catch((err)=>{
                                        console.log("error ocuured : "+err);  
                                    })

                                
                                    //Find the top 4 owner having heighest  # TotAL_COM_ (square feet) for each SiteCat2 under "Commercial category" 
                                    
                                    await  db.aggregate([{"$match":{"properties.SiteCat1":"Commercial","properties.SiteCat2":SiteCat[i],"properties.PAR_CITY":upperCase(req.params.city),"properties.SPA_NAME":req.params.hood}},{"$group":
                                    {"_id":"$properties.PARCL_OWN3","com_sq_feet":{"$sum":"$properties.TOTAL_COM_"},"No_Parcels":{"$sum":1}}},{"$sort":{"com_sq_feet":-1}},
                                    {"$limit":4},{"$project":{"_id":1,"com_sq_feet":1,"No_Parcels":1}}])
                                    .exec()
                                    .then((result)=>{
                                                console.log(JSON.stringify(result));
                                                com_sq_feetPerCat=result.map(function(v){     
                                                return v.com_sq_feet;
                                                });
                                                
                                                console.log("com_sq_feet: "+com_sq_feetPerCat+" cat= "+cat);
                                                //res.send(parcelsPerUnit);
                                    
                            
                                                //Sum all  # TotAL_COM_ (square feet)
                            
                                                totalCom_sq_feetPerCat=0;
                                                for(var rs in com_sq_feetPerCat)
                                                {
                                                        totalCom_sq_feetPerCat+=com_sq_feetPerCat[rs];
                                                }
                                                console.log("total Sum of parcelsPerUnit: "+totalCom_sq_feetPerCat+" for cat "+cat);
                                                //cocentratic ratio of sum  # TotAL_COM_ (square feet)  of top 4 owners to total  # TotAL_COM_ (square feet) under Commertial categary
                                                cr4=totalCom_sq_feetPerCat/totalcom_sq_feet;
                                                if(_view3[i]._id==SiteCat[i])
                                                    _view3[i].CR4=cr4;
                                                console.log("CR4 : "+cr4);
                                                console.log();
                                                    //res.JSON(cr4);
                                                return result;
                                    
                                    })
                                    .catch((err)=>{
                                                console.log("error ocuured : "+err);
                                    })

                                
                            }
                        

                    })
                    .catch((err)=>{
                            console.log("error ocuured : "+err);
                    })
                    console.log("this.view3: ",JSON.stringify(_view3,undefined,2));
                    res.json(_view3);
      
                    
        })
        .catch((err)=>{
            console.log("error ocuured : "+err);
        })

       
        

});



module.exports=router;