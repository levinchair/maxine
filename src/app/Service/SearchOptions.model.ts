export class SearchOptions{
  constructor(){}                //assume each value is in properties object except stated otherwise
  acres?:[Number,Number];        //total_acre:Number
  value?:[Number,Number];        //gross_ce_2:Number
  abatement?:String[];           //tax_abatem:String Array
  owner?:String[];                 //deeded_own2:String Array of trimmed, capitalized owner names
  scale_units?:[Number,Number];  //total_com_ , units2 (only for residential)
  taxLanduse?:String[];          //tax_luc_de:String Array
  //lassoArea?:[[Number,Number]];  //geometry.coordinates:[Number,Number] NOT USED, solved for parcelpins
  sitecat1?:String;              //Sitecat1:String
  sitecat2?:String;              //Sitecat2:String
  parcelpins?: String[];         //parcelpin: String Array. parcel pin arrays for selected areas
};
