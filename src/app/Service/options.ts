export interface options{                 //assume feature.
  acres?:[Number,Number],        //totalAcres:Number
  value?:[Number,Number],        //gross_ce_2:Number
  abatement?:[String],           //tax_abatem:String
  owner?:String,                 //deeded_own2:String
  scale_units?:[Number,Number],  //total_com_ , units2 (only for residential)
  taxLanduse?:[String],          //tax_luc_de:String
  lassoArea?:[[Number,Number]],  //geometry.coordinates:[Number,Number]
  sitecat1?:String,              //Sitecat1:String
  sitecat2?:String               //Sitecat2:String
};
