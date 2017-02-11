function queryCallback(queryResult){
   console.log(queryResult);
   var queryFeatures = queryResult.features;
   
   
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













