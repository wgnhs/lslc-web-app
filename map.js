
require([
   //ALSO INCLUDE THESE IN THE FUNCTION PARAMETERS BELOW!
 //  "esri/tasks/Locator",
   "esri/map",
 //  "esri/views/MapView", 
//    "esri/InfoTemplate", //causes script error?
   "esri/layers/FeatureLayer",
   "esri/dijit/FeatureTable",
   "esri/symbols/SimpleFillSymbol",
//    "esri/PopupTemplate",   
//    "esri/tasks/IdentifyTask",
//   "esri/tasks/IdentifyParameters", //causes scripterror?
   "esri/tasks/query",
   "esri/tasks/QueryTask",
   "esri/toolbars/draw", 
 //  "esri/Color",
//    "esri/layers/ArcGISDynamicMapServiceLayer",
 //  "esri/layers/VectorTileLayer",
    "dojo/dom", 
   "dojo/on",
   "dojo/_base/array",
   "dojo/parser",   //I don't know what this does. 
   "dojo/domReady!" 
   
], function (Map, FeatureLayer, FeatureTable, SimpleFillSymbol, Query, QueryTask, Draw, dom, on, arrayUtil, parser, rockTypeSearchKey){
   // console.log("a: ",Map, "b: ",MapView, "c: ",FeatureLayer, "d: ",VectorTileLayer);
   parser.parse();
   
   // /********* MAP **********/   
   var map = new Map('map', {
      basemap: 'topo', 
      center: [-90, 47],
       zoom: 7, 
       sliderPosition: "top-right"
   });

   //defines selection tool as global variable
   var selectionTool;

   //pases on-load event to ananymous function
   map.on("load", function(e){

   	initMapButtons(e, selectionTool, Draw, Query, on, fl); //calls from query.js

   });

   
   
    
   
   // /********* POLYGON STYLES **********/
   //polygon selection style 
    var selectedSymbol = new SimpleFillSymbol({
            "type": 'esriSFS',
            "style":'esriSFSSolid', 
            "color": [24,132,111, 191], //rgba 0-255 //green 
            "outline": {
              "type": "esriSLS", 
              "style": "esriSLSSolid",
              "color": [24,132,111,255], //rgba 0-255 //green 
              "width": 1
            }
      });
   
   
   // /********* LAYERS **********/
   //add vector tile layer (Modern Antique)
     // var vectorTiles = new VectorTileLayer('https://www.arcgis.com/sharing/rest/content/items/996d9e7a3aac4514bb692ce7a990f1c1/resources/styles/root.json');
   
   //add map sections feature layer through Esri API. I can style. 
   var fl = new FeatureLayer('http://geodata.wgnhs.uwex.edu/arcgis/rest/services/lslc/lslc/MapServer/0', {mode: FeatureLayer.MODE_ONDEMAND, outFields: ["*"]});
   

   fl.setSelectionSymbol(selectedSymbol); //var selectedSymbol is an object declared above 
   
   
   
  
   fl.on("selection-complete", reportSelectedSections);
   map.addLayer(fl);


function reportSelectedSections(event){
       
//console.log("features", event.features);
   var selectedSections= [];
   $(event.features).each(function(ind){
       var obj = event.features[ind];
       
       //concatenation of state, township, range, and section number
//       var code = obj.attributes.State+" T"+obj.attributes.TWP+obj.attributes.TownDir+" R"+obj.attributes.RNG+obj.attributes.RangeDir+" Sec"+obj.attributes.SEC;
       var sectionId = obj.attributes.UID;
       
       //push to the array
       selectedSections.push(sectionId);
       
   }); 
   console.log("selected sections: ", selectedSections);

   queryTable(selectedSections, Query, QueryTask); //calls from query.js
   
   
} //end reportSelectedSections function


initSearchBars(Query, QueryTask);

// function initSearchBar(){
//   var rockTypeSearchBar = document.getElementById('rockTypeSearch')
//   console.log(rockTypeSearchBar.value)
//   var rockTypeSearchKey = rockTypeSearchBar.value
// }



   
   

}); //end map-constructing function beginning with require...


        