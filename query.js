//initial comment for filter branch
var rockSearch = false
var countySearch = false

function queryCallback(queryResult){
   //console.log(queryResult);
   //var queryFeatures = queryResult.features;
   
   
   listResults(queryResult);
}

function queryTable(selectedSections, Query, QueryTask){
     
   var query = new Query(); 
   query.outFields = ["*"];
   query.returnGeometry = false;
   query.where = "SectionId IN ("+selectedSections+")"; 
       
   //url to samples table
   var queryTask = new QueryTask("http://geodata.wgnhs.uwex.edu/arcgis/rest/services/lslc/lslc/MapServer/1");
   
   queryTask.execute(
                    query, 
                     function(queryResult){
                         
                         queryCallback(queryResult);}
                    
                    );
   
  // queryTask.executeForIds(query, queryCallback);
}


function initMapButtons(event, selectionTool, Draw, Query, on, fl){
    
   //selectionTool is a global variable
    selectionTool = new Draw(event.map); 
    var mapSelection = new Query();

   //when the selection tool has finished drawing a box, 
   // create a new selection in the feature layer (fl) 
    on(selectionTool, "DrawEnd", function(geometry){
    	console.log('ran')
      selectionTool.deactivate();
       mapSelection.geometry = geometry;
       fl.selectFeatures(mapSelection, fl.SELECTION_NEW);

       
    });

  utilizeButtons(selectionTool, Draw, fl); //calls funtion that has jquery onclick functions
} 

/********** SELECTION/CLEAR FUNCTIONALITY **********/
function utilizeButtons(selectionTool, Draw, fl){

   $("#mapSelectionButton").on( "click", function(){

	
       console.log(selectionTool)
       selectionTool.activate(Draw.EXTENT);
       
   });
   
   $("#mapClearButton").on("click", function () {
       //console.log("clear map selection");
        fl.clearSelection();
       
       
       //FAKE LINK!! 
       //CLEAR THE RESULTS LIST! 
      console.log("reset list"); 
        $("#resultsUL").html('');
        $("#resultCount").html('0');
            
    });

}

//function utilizes the search bars; called from map.js
function initSearchBars(Query, QueryTask){

	//declares empty strings for search keys
	var rockTypeSearchKey = "" 
	var countySearchKey = ""

	//
	var rockTypeSearchBar = document.getElementById('rockTypeSearch') //gets search bar element
	//function called everytime key is lifted in searchbar
	rockTypeSearchBar.onkeyup = function(){
		rockSearch = true //indicates that there is a rock filter applicable
    	rockTypeSearchKey = rockTypeSearchBar.value //pulls string from searchbar

    	//adds feedback indicator
    	$("#rockSearchOn").remove();
    	$("#filterFeedback").append($("<div id='rockSearchOn' class='feedbackBar'></div>"))
    	$("#rockSearchOn").append($("<p>" + rockTypeSearchKey + "</p>"))
    	queryTableForFilters(rockTypeSearchKey, countySearchKey, Query, QueryTask)
	}

	var countySearchBar = document.getElementById('countySearch') //gets search bar element
	//function called everytime key is lifted in searchbar
	countySearchBar.onkeyup = function(){
		countySearch = true //indicates that there is a county filter applicable
    	countySearchKey = countySearchBar.value //pulls string from searchbar

    	//adds feedback indicator
    	$("#countySearchOn").remove();
    	$("#filterFeedback").append($("<div id='countySearchOn' class='feedbackBar'></div>"))
    	$("#countySearchOn").append($("<p>" + countySearchKey + "</p>"))
    	queryTableForFilters(rockTypeSearchKey, countySearchKey, Query, QueryTask)
	}

	


}


function queryTableForFilters(rockTypeSearchKey, countySearchKey, Query, QueryTask){

	//creates two booleans -- checks to see whether the boxes are checked or not 
	var thinSectionChecked = document.getElementById("thinSectionCheckbox").checked
	var handSampleChecked = document.getElementById("handSampleCheckbox").checked
    
    //same lines from QueryTable() 
   	var query = new Query(); 
   	query.outFields = ["*"];
   	query.returnGeometry = false;
   	query.where = "" // assigns empty string to where statement

   	//checks to see whether or not rock type has a filter; applies it if so
   	if (rockSearch){	
   		query.where = "RockType LIKE %"+rockTypeSearchKey+"%";
   	}

   	//checks to see whether or not county has a filter; applies it if so
   	if (countySearch){
   		//if there's an existing filter applied, adds AND to combine
   		if (query.where != ""){
   			query.where = query.where + " AND "
   		}
   		query.where = query.where + "County LIKE %"+countySearchKey+"%";
   	}

   	//checks to see whether or not thin section box is checked; applies it if so
   	if (thinSectionChecked){
   		//if there's an existing filter applied, adds AND to combine
   		if (query.where != ""){
   			query.where = query.where + " AND "
   		}
   		query.where = query.where + "ThinsectionCount > 0";
   	}

   	//checks to see whether or not thin section box is checked; applies it if so
   	if (handSampleChecked){
   		//if there's an existing filter applied, adds AND to combine
   		if (query.where != ""){
   			query.where = query.where + " AND "
   		}
   		query.where = query.where + "HandSampleCount > 0";
   	}


   	console.log(query.where) 
      
   //url to samples table
   	// var queryTask = new QueryTask("http://geodata.wgnhs.uwex.edu/arcgis/rest/services/lslc/lslc/MapServer/1");
   
   	// queryTask.execute(
    //                  query, 
    //                   function(queryResult){
                         
    //                       queryCallback(queryResult);}
                    
    //                  );
   
  // queryTask.executeForIds(query, queryCallback);
}



 













