//global var for all filters

var filters = {
    //all initial values in this filters object should be falsy. 
    //an empty string is falsy. 
    //an empty array is not falsy, so the map sections input must be set to null when cleared. 
    
    "mapSectionsInput": null, "rockTypeInput": "", "countyInput": "", "handSampleAvailabilityInput": null, "thinSectionAvailabilityInput": null, "stateInput": null 
};


require([
   //ALSO INCLUDE THESE IN THE FUNCTION PARAMETERS BELOW!
 //  "esri/tasks/Locator",
   "esri/map",
 //  "esri/views/MapView", 
//    "esri/InfoTemplate", //causes script error?
   "esri/layers/FeatureLayer",
  // "esri/dijit/FeatureTable",
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
   
], function (Map, FeatureLayer, SimpleFillSymbol, Query, QueryTask, Draw, dom, on, arrayUtil, parser){
   // console.log("a: ",Map, "b: ",MapView, "c: ",FeatureLayer, "d: ",VectorTileLayer);
   parser.parse(); //I don't know what this does. 
   
   // /********* MAP **********/   
   var map = new Map('map', {
      basemap: 'topo', 
      center: [-90, 47],
       zoom: 7, 
       sliderPosition: "top-right"
   });

   //defines selection tool as global variable
   var selectionTool;

   //passes on-load event to anonymous function
   map.on("load", function(e){
        
        //event listener for map selection and clear buttons
        initMapButtons(e); 
        //This sets an event listener for inputs. 
        initSearchBars();
        //initialize a listener for filter removal through a click on a filter indicator
        removeFilters();

        resetFilters();   

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
   fl = new FeatureLayer('http://geodata.wgnhs.uwex.edu/arcgis/rest/services/lslc/lslc/MapServer/0', {mode: FeatureLayer.MODE_ONDEMAND, outFields: ["*"]});
   
    //don't want this symbol applied to sections when they have been selected for the map filter. 
   fl.setSelectionSymbol(highlightSymbol); //var selectedSymbol is an object declared above 
   
    map.addLayer(fl);
    
 
/* +++++++++++++++++ Set up event listeners (once on load) +++++++++++++++++ */
function initMapButtons(event){
    
    //selectionTool is a global variable
    selectionTool = new Draw(event.map); 
    
    //set up event listener for DrawEnd
    //when the selection tool has finished drawing a box, 
    // create a new selection in the feature layer (fl) 
    on(selectionTool, "DrawEnd", function(drawGeometry){
    	console.log('draw end.');
        selectionTool.deactivate();
        
        //construct a new query using the DrawEnd geometry. 
        var mapFilter = new Query();
        mapFilter.geometry = drawGeometry;
        
        //create a new selection using the query
        var mapSelection = fl.selectFeatures(mapFilter, fl.SELECTION_NEW);
        //console.log(mapSelection);
        //assign the selection's results array to a variable.
        var mapSelectionResults = mapSelection.results[0][0];
        
        var selectedSections= [];
        for (j in mapSelectionResults){
            //isolate the section's UID attribute and push it to the selectedSections array. 
            var selectedSectionId = mapSelectionResults[j].attributes.UID;
            selectedSections.push(selectedSectionId);
        }
        console.log("filter based on these sections:", selectedSections);
        filterForSections(selectedSections);
       
    });

  utilizeButtons(); //calls funtion that has jquery onclick functions
} 
    
function utilizeButtons(){
    // LISTENERS FOR MAP SELECTION/CLEAR FUNCTIONALITY
    
   $("#mapFilterButton").on( "click", function(){
       //console.log(selectionTool);
       selectionTool.activate(Draw.EXTENT);
       
   });
   
   $("#mapClearButton").on("click", function () {
       console.log("clear map sections from SQL query.");
       //set filter. 
       filters.mapSectionsInput = null;
       //clear map. 
        fl.clearSelection();
       resetFilters();
         
    });

} //end function utilizeButtons

function initSearchBars(){
    //event listener for a filter input 
    
    $("#filters").on("input", "input", function(){
        resetFilters();

    }); //close #filters.on input function
 
} //end initSearchBars function

function removeFilters(){
    
	//when the user clicks on a filter indicator... 
    $("#filterFeedback").on("click", "span", function(){
      
        console.log("clear", filters[this.getAttribute('data')]);
        //reset the filters variable. 
        filters[this.getAttribute('data')] = null;
        
        this.remove();
        //reset the value in the input / searchbar
        if (this.getAttribute('data') == 'rockTypeInput'){console.log("clear rock type."); $("#rockTypeSearch").val('');};
        if (this.getAttribute('data') == 'countyInput'){console.log("clear county"); $("#countySearch").val('');};
        if (this.getAttribute('data') == 'stateInput'){console.log("clear state"); $("#stateSearch").val('');};
        if (this.getAttribute('data') == 'handSampleAvailabilityInput'){console.log("clear handsample"); document.getElementById("handSampleCheckbox").checked = false;};
        if (this.getAttribute('data') == 'thinSectionAvailabilityInput'){console.log("clear thin section"); document.getElementById("thinSectionCheckbox").checked = false;};
        
        //resetFilters will call QueryTable. 
        resetFilters();
    });
    
  
}
    
 /* +++++++++++++++++ END Set up event listeners (once on load) +++++++++++++++++ */   
 
    
function resetFilters() {
        filters.rockTypeInput = $("#rockTypeSearch").val();
        filters.countyInput = $("#countySearch").val(); 
        filters.stateInput = $("#stateSearch").val();
        filters.thinSectionAvailabilityInput =  document.getElementById("thinSectionCheckbox").checked;
        filters.handSampleAvailabilityInput = document.getElementById("handSampleCheckbox").checked;
        
        console.log("filters set:", filters);
        queryTableForFilters();
}
    

function filterForSections(array){
    //this happens on draw end.  
    console.log("filter for sections.", array);
    
    filters.mapSectionsInput = array; 
    queryTableForFilters();
}
    
    
function queryTableForFilters(){
   
    var newsqlArray = ["1=1"];
    
    //delete all filter indicators. They will be replaced. 
    $("#filterFeedback").html('');
    
    if (filters.rockTypeInput) {
        newsqlArray.push("Upper(RockType) LIKE Upper('%"+filters.rockTypeInput+"%')");
        //adds feedback indicator
    	//$("#rockSearchOn").remove();
    	$("#filterFeedback").append($("<span id='rockSearchOn' class='feedbackBar' data='rockTypeInput'>rock:&nbsp" + filters.rockTypeInput + "<img src='images/close.png' style = 'height: 21px; margin-bottom: -5px;'/></span>"));
        }; 
    if (filters.countyInput) {
        newsqlArray.push("Upper(County) LIKE Upper('%"+filters.countyInput+"%')");
       // $("#countySearchOn").remove();
    	$("#filterFeedback").append($("<span id='countySearchOn' class='feedbackBar' data = 'countyInput'>county:&nbsp" + filters.countyInput +"<img src='images/close.png' style = 'height: 21px; margin-bottom: -5px;'/></span>"));
        }; 
    if (filters.handSampleAvailabilityInput) {
        newsqlArray.push("HandSampleCount > 0");
       // $("#handSampleOn").remove();
    	$("#filterFeedback").append($("<span id='handSampleOn' class='feedbackBar' data='handSampleAvailabilityInput'>Hand&nbspsample:&nbsp" + filters.handSampleAvailabilityInput + "<img src='images/close.png' style = 'height: 21px; margin-bottom: -5px;'/></span>"));
        }; 
    if (filters.thinSectionAvailabilityInput) {
        newsqlArray.push("ThinsectionCount > 0");
        $("#filterFeedback").append($("<span id='thinSectionOn' class='feedbackBar' data='thinSectionAvailabilityInput'>Thin&nbspsection:&nbsp" + filters.thinSectionAvailabilityInput + "<img src='images/close.png' style = 'height: 21px; margin-bottom: -5px;'/></span>"));
        }; 
    if (filters.mapSectionsInput) {newsqlArray.push("SectionId IN ("+filters.mapSectionsInput+")");}; 
    if (filters.stateInput){
        newsqlArray.push("Upper(State) LIKE Upper('%"+filters.stateInput+"%')");
        $("#filterFeedback").append($("<span id='stateOn' class='feedbackBar' data='stateInput'>state:&nbsp" + filters.stateInput + "<img src='images/close.png' style = 'height: 21px; margin-bottom: -5px;'/></span>"));
        };
    
    //console.log ("new SQL array:", newsqlArray);
    
    
    //same lines from QueryTable() 
   	var query = new Query(); 
   	query.outFields = ["*"];
   	query.returnGeometry = false;
   	query.where = ""; // assigns empty string to where statement
    
     //same lines from QueryTable() 
   	var sectionsQuery = new Query(); 
   	sectionsQuery.outFields = ["SectionId"];
   	sectionsQuery.returnGeometry = false;
   	sectionsQuery.where = ""; // assigns empty string to where statement

   	
   	//iterates through newsqlArray
    //THIS IS UNNECESSARY if we always search for everything when no filters are applied. 
    for (i = 0; i < newsqlArray.length; i++) {
   		//testing for a value before and after, if so, adds AND in between them
   		if (query.where != "" && newsqlArray[i] != "") {query.where +=  " AND " };
   		query.where += newsqlArray[i]; //adds the sql query to the string 
        
   	};
    
    console.log("query.where is:", query.where);
     //set the sections query where clause to the same where as the normal query. 
    sectionsQuery.where = query.where;
    
   //only try to send queryTask if there is something to search on.
    if (query.where.length > 0){
        if (query.where === "1=1"){ console.log("Narrow the results by applying filters above.");}
   	           
   //url to samples table
    var queryTask = new QueryTask("http://geodata.wgnhs.uwex.edu/arcgis/rest/services/lslc/lslc/MapServer/1");

    queryTask.execute( query, function(samplesResult){listResults(samplesResult);}  );
    queryTask.execute( sectionsQuery, function(sectionsQueryResult){
       // console.log("sections query result:", sectionqueryResult.features);
        var highlightMapSections = []; 
        //iterate through  
        for (f in sectionsQueryResult.features){
           // console.log("f attributes sectionId", sectionqueryResult.features[f].attributes.SectionId);
            highlightMapSections.push(sectionsQueryResult.features[f].attributes.SectionId);
        }
        
        highlightMap(highlightMapSections, fl);
    });

  // queryTask.executeForIds(query, queryCallback);

    } else {
        //if query.where is empty, query for everything! 
        console.log("query is empty.");
        
    }
}

    
function highlightMap(array, fl){
    console.log("highlight the map sections", array);
    //set the symbol to the variable highlightSymbol (an object defined above)

    //filters out redundant section ids 
    var sortedArray = array.sort(function(a,b){return a-b});
    var filteredSections = []

    for (i = 0; i < sortedArray.length; i++){
      if (sortedArray[i] != sortedArray[i-1]) {
        filteredSections.push(sortedArray[i])
      }
    }

    
   

        var mapHighlight = new Query();
        mapHighlight.where = ('UID IN ('+filteredSections+')');

        fl.selectFeatures(mapHighlight, fl.SELECTION_NEW); 
        //zoom to the extent of the filter results.

        //CHOROPLETH-----------------------------------------
        var choroplethStructureArray = [];
        //populates 2D array with [[sectionID, # of records in it],,]
        for (i = 0; i < sortedArray.length; i++){
          if (sortedArray[i] != sortedArray[i-1]){
            choroplethStructureArray.push([sortedArray[i], 1]);
          } else {
            choroplethStructureArray[choroplethStructureArray.length-1][1]++;
          }
        }

        //creates array with just the # of records; later used to find class breaks
        var classBreaksFinderArray = [];
        for (i = 0; i < choroplethStructureArray.length; i++){
          classBreaksFinderArray.push(choroplethStructureArray[i][1]);
        }

        //sorts the array containing # of samples; sorts and filteres ot redundant values
        //gives us unique count numbers
        var sortedClassFinderArray = classBreaksFinderArray.sort(function(a,b){return a-b});
        var filteredValuesArray = [];
        for (i = 0; i < sortedClassFinderArray.length; i++){
          if (sortedClassFinderArray[i] != sortedClassFinderArray[i-1]) {
            filteredValuesArray.push(sortedClassFinderArray[i])
          }
        }

        //sets up 4 class break values using jerry-rigged equal interval -- maybe switch and import D3?
        var break0 = filteredValuesArray[0];
        var break1 = filteredValuesArray[Math.round((filteredValuesArray.length / 4) - 1)];
        var break2 = filteredValuesArray[Math.round((filteredValuesArray.length / 2) - 1)];
        var break3 = filteredValuesArray[Math.round((filteredValuesArray.length / (4/3)) - 1)];
        var breakTop = filteredValuesArray[filteredValuesArray.length - 1];

        //defines arrays to be populated with section ids in each class
        var class1Array = [];
        var class2Array = [];
        var class3Array = [];
        var class4Array = [];

        //populates each class array by checking how many samples they each have, evaluating via breaks
        //makes use of the 2D choroplethStructureArray
        for (i = 0; i < choroplethStructureArray.length; i++){
          if (choroplethStructureArray[i][1] <= break1){
            class1Array.push(choroplethStructureArray[i][0]);
          } else if (choroplethStructureArray[i][1] <= break2) {
            class2Array.push(choroplethStructureArray[i][0]);
          } else if (choroplethStructureArray[i][1] <= break3) {
            class3Array.push(choroplethStructureArray[i][0]);
          } else {
            class4Array.push(choroplethStructureArray[i][0]);
          }; 
        } 

        //tests out how the choropleth system is working
        console.log("filtered values array -->", filteredValuesArray)
        console.log("class breaks -->", break0,break1,break2,break3,breakTop)
        console.log("class 1 array:", class1Array)
        console.log("class 2 array:", class2Array)
        console.log("class 3 array:", class3Array)
        console.log("class 4 array:", class4Array)

        //create new Feature Layer with each of these
        
 
    
}

}); //end map-constructing function beginning with require...