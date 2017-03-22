//global var for all filters

var filters = {
    //all initial values in this filters object should be falsy. 
    //an empty string is falsy. 
    //an empty array is not falsy, so the map sections input must be set to null when cleared. 
    
    "mapSectionsInput": null, "rockTypeInput": "", "countyInput": "", "handSampleAvailabilityInput": null, "thinSectionAvailabilityInput": null, "stateInput": null, "notesInput": null 
};

$(window).on("load", function(){
    
    //This sets an event listener for inputs. 
    initSearchBars();
    //initialize a listener for filter removal through a click on a filter indicator
    removeFilters();
    //initialize table
    initializeResultsTable();
    
    //call whenever the filters object has changed (EXCEPT map filter). 
    resetFilters();   

});

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

function initSearchBars(){
    //called once on load
    //event listener for a filter input 
    
    $("#filters").on("input", "input", function(){
        delay(function(){
            
            console.log('time elapsed');
            resetFilters();
        }, 1000);
        

    }); //close #filters.on input function
 
} //end initSearchBars function

function removeFilters(){
    //called once on load
	//when the user clicks on a filter indicator... 
    $("#filterFeedback").on("click", "span", function(){
      
        console.log("clear", filters[this.getAttribute('data')]);
        //reset the filters variable. 
        filters[this.getAttribute('data')] = null;
        
        //remove the indicator. 
        this.remove();
        
        if (this.getAttribute('data') == 'mapSectionsInput'){
            console.log('clear map selection via filter feedback.'); 
            leafletMap.clearMapSelection(); //this will clear map indicators and call the queryTableForFilters function. 
            
        } else {
            //reset the value in the input / searchbar
            if (this.getAttribute('data') == 'rockTypeInput'){console.log("clear rock type."); $("#rockTypeSearch").val('');};
            if (this.getAttribute('data') == 'countyInput'){console.log("clear county"); $("#countySearch").val('');};
            if (this.getAttribute('data') == 'stateInput'){console.log("clear state"); $("#stateSearch").val('');};
            if (this.getAttribute('data') == 'notesInput'){console.log("clear notes"); $("#notesSearch").val('');};
            if (this.getAttribute('data') == 'handSampleAvailabilityInput'){console.log("clear handsample"); document.getElementById("handSampleCheckbox").checked = false;};
            if (this.getAttribute('data') == 'thinSectionAvailabilityInput'){console.log("clear thin section"); $("#thinSectionNumberSearch").val('');};

            //resetFilters will call QueryTable. 
            resetFilters();
        }
    });
    
  
}
    
    
function resetFilters() {
    //reset for every filter except the map filter. 
        filters.rockTypeInput = $("#rockTypeSearch").val();
        filters.countyInput = $("#countySearch").val(); 
        filters.stateInput = $("#stateSearch").val();
        filters.notesInput = $("#notesSearch").val();
        filters.thinSectionAvailabilityInput =  $("#thinSectionNumberSearch").val();
        filters.handSampleAvailabilityInput = document.getElementById("handSampleCheckbox").checked;
        
       // console.log("filters set:", filters);
        queryTableForFilters();
}
    
    
function queryTableForFilters(){
   
    var newsqlArray = ["1=1"];
    
    //delete all filter indicators. They will be replaced. 
    $("#filterFeedback").html('');
    
    //for each truthy value in filters, build the SQL text and append a filter indicator span  
    if (filters.rockTypeInput) {
        newsqlArray.push("Upper(RockType) LIKE Upper('%"+filters.rockTypeInput+"%')");
        //adds feedback indicator
    	//$("#rockSearchOn").remove();
    	$("#filterFeedback").append($("<span id='rockSearchOn' class='feedbackBar' data='rockTypeInput'>description:&nbsp" + filters.rockTypeInput + "<img src='images/close.png'/></span>"));
        }; 
    if (filters.countyInput) {
        newsqlArray.push("Upper(County) LIKE Upper('%"+filters.countyInput+"%')");
       // $("#countySearchOn").remove();
    	$("#filterFeedback").append($("<span id='countySearchOn' class='feedbackBar' data = 'countyInput'>county:&nbsp" + filters.countyInput +"<img src='images/close.png' /></span>"));
        }; 
    if (filters.notesInput) {
        newsqlArray.push("Upper(Notes) LIKE Upper('%"+filters.notesInput+"%')");
       // $("#countySearchOn").remove();
    	$("#filterFeedback").append($("<span id='countySearchOn' class='feedbackBar' data = 'notesInput'>notes:&nbsp" + filters.notesInput +"<img src='images/close.png' /></span>"));
        }; 
    if (filters.handSampleAvailabilityInput) {
        newsqlArray.push("HandSampleCount > 0");
       // $("#handSampleOn").remove();
    	$("#filterFeedback").append($("<span id='handSampleOn' class='feedbackBar' data='handSampleAvailabilityInput'>Hand&nbspsample:&nbsp" + filters.handSampleAvailabilityInput + "<img src='images/close.png' /></span>"));
        }; 
    if (filters.thinSectionAvailabilityInput) {
        newsqlArray.push("ThinsectionCount >= "+filters.thinSectionAvailabilityInput);
        $("#filterFeedback").append($("<span id='thinSectionOn' class='feedbackBar' data='thinSectionAvailabilityInput'>Thin&nbspsections:&nbsp" + filters.thinSectionAvailabilityInput + "+ <img src='images/close.png'/></span>"));
        }; 
    if (filters.mapSectionsInput) {
        newsqlArray.push("SectionId IN ("+filters.mapSectionsInput+")"); 
        $("#filterFeedback").append($("<span id='mapOn' class='feedbackBar' data='mapSectionsInput'>intersects&nbspmap&nbsppolygon <img src='images/close.png' /></span>"));
        }; 
    if (filters.stateInput){
        newsqlArray.push("Upper(State) LIKE Upper('%"+filters.stateInput+"%')");
        $("#filterFeedback").append($("<span id='stateOn' class='feedbackBar' data='stateInput'>state:&nbsp" + filters.stateInput + "<img src='images/close.png'/></span>"));
        };
    
    //console.log ("new SQL array:", newsqlArray);
    
   
    var whereString = "";

   	//iterates through newsqlArray
    //THIS IS UNNECESSARY if we always search for everything when no filters are applied. 
    for (i = 0; i < newsqlArray.length; i++) {
   		//testing for a value before and after, if so, adds AND in between them
   		if (whereString != "" && newsqlArray[i] != "") {whereString +=  " AND " };
   		whereString += newsqlArray[i]; //adds the sql query to the string 
        
   	};
    
     var samplesQuery = L.esri.query({url:"http://geodata.wgnhs.uwex.edu/arcgis/rest/services/lslc/lslc/MapServer/1"}); //url to samples table
    samplesQuery.fields(["*"]);
    samplesQuery.returnGeometry(false);
  
    samplesQuery.where(whereString);
    
    //console.log("query where is:", samplesQuery.where);
    console.log(" where string is:", whereString);
     //set the sections query where clause to the same where as the normal query. 
   // sectionsQuery.where = samplesQuery.where;
   
   //only try to send queryTask if there is something to search on.
    if (samplesQuery.where.length > 0){
        
        if (whereString === "1=1"){ console.log("Narrow the results by applying filters above.")};

        //console.log("run the query.");

        samplesQuery.run(function(error, result, response){
          //  console.log('result', result);
          //  console.log("response", response.features);

            listResults(response);

            //iterate through and output array of sections ofr the highlight function. 
            var highlightMapSections = []; 
            //iterate through  
            for (f in response.features){
               // console.log("f attributes sectionId", response.features[f].attributes.SectionId);
                highlightMapSections.push(response.features[f].attributes.SectionId);
            }
            
            leafletMap.highlight(highlightMapSections);

        });
            
       

    } else {
        //if query.where.length is 0 or less, query for everything! 
        console.log("query is empty.");
        
    }

    
} //end queryTableForFilters
