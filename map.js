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

   	initMapButtons(e, selectionTool, Draw, Query, on, fl); //function is in map.js

   });

   
   
    
   
   // /********* POLYGON STYLES **********/
   //polygon selection style 
    var highlightSymbol = new SimpleFillSymbol({
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
   
    //don't want this symbol applied to sections when they have been selected for the map filter. 
  // fl.setSelectionSymbol(highlightSymbol); //var selectedSymbol is an object declared above 
   
    map.addLayer(fl);
    
 
//initSearchBars(Query, QueryTask);

// function initSearchBar(){
//   var rockTypeSearchBar = document.getElementById('rockTypeSearch')
//   console.log(rockTypeSearchBar.value)
//   var rockTypeSearchKey = rockTypeSearchBar.value
// }


}); //end map-constructing function beginning with require...



function initMapButtons(event, selectionTool, Draw, Query, on, fl){
    
   //selectionTool is a global variable
    selectionTool = new Draw(event.map); 
    
    
    var mapFilter = new Query();

   //when the selection tool has finished drawing a box, 
   // create a new selection in the feature layer (fl) 
    on(selectionTool, "DrawEnd", function(geometry){
    	console.log('draw end.');
        selectionTool.deactivate();
        
        mapFilter.geometry = geometry;
        
       //we will not be highlighting map sections based on geometry. We need our highlight to be based on all results from the samples table. 
       var mapSelection = fl.selectFeatures(mapFilter, fl.SELECTION_NEW);
       // console.log("map selection results", mapSelection.results[0][0]);
        var mapSelectionResults = mapSelection.results[0][0];
        
        var selectedSections= [];
        for (j in mapSelectionResults){
            //isolate the section's UID attribute and push it to the selectedSections array. 
            var selectedSectionId = mapSelectionResults[j].attributes.UID;
            selectedSections.push(selectedSectionId);
        }
        console.log("filter based on these sections:", selectedSections);
       
    });

  utilizeButtons(selectionTool, Draw, fl); //calls funtion that has jquery onclick functions
} 

/********** SELECTION/CLEAR FUNCTIONALITY **********/
function utilizeButtons(selectionTool, Draw, fl){

   $("#mapFilterButton").on( "click", function(){

       //console.log(selectionTool);
       selectionTool.activate(Draw.EXTENT);
       
   });
   
   $("#mapClearButton").on("click", function () {
       console.log("clear map sections from SQL query. (not yet implemented.)");
       // fl.clearSelection();
         
    });

} //end function utilizeButtons

function highlightMap(array){
    console.log("highlight the map sections", array);
}
        