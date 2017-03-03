//global var for all filters 
var filters = {
    //all initial values in this filters object should be falsy. 
    //an empty string is falsy. 
    //an empty array is not falsy, so the map sections input must be set to null when cleared. 
    
    "mapSectionsInput": null, "rockTypeInput": "", "countyInput": "", "handSampleAvailabilityInput": null, "thinSectionAvailabilityInput": null, "stateInput": null
  
    
};


require(["esri/tasks/query", "esri/tasks/QueryTask"], function(Query, QueryTask){
    
    resetFilters(Query, QueryTask);
    //call the initialize function. This sets an event listener for inputs. 
    initSearchBars(Query, QueryTask);
    removeFilters(Query, QueryTask);
}); //end require.

function resetFilters(Query, QueryTask) {
        filters.rockTypeInput = $("#rockTypeSearch").val();
        filters.countyInput = $("#countySearch").val(); 
        filters.stateInput = $("#stateSearch").val();
        filters.thinSectionAvailabilityInput =  document.getElementById("thinSectionCheckbox").checked;
        filters.handSampleAvailabilityInput = document.getElementById("handSampleCheckbox").checked;
        
        console.log("filters set:", filters);
        queryTableForFilters(Query, QueryTask);
}

//function utilizes the search bars
function initSearchBars(Query, QueryTask){
    
    
    $("#filters").on("input", "input", function(){
        resetFilters(Query, QueryTask);

    }); //close #filters.on input function
   

/*	//function called on input change
	$("#rockTypeSearch").on("input", function(){
		rockSearch = true; //indicates that there is a rock filter applicable
    	rockTypeSearchKey = $("#rockTypeSearch").val(); //pulls string from searchbar

    	//adds feedback indicator
    	$("#rockSearchOn").remove();
    	$("#filterFeedback").append($("<span id='rockSearchOn' class='feedbackBar'>rock:&nbsp" + rockTypeSearchKey + "<img src='images/close.png' style = 'height: 21px; margin-bottom: -5px;'/></span>"));
    	//$("#rockSearchOn").append($("<span>rock:&nbsp" + rockTypeSearchKey + "</span>"));
    	queryTableForFilters(Query, QueryTask, rockTypeSearchKey, countySearchKey, thinSectionChecked, handSampleChecked);
	});

	
	//function called everytime key is lifted in searchbar
	$("#countySearch").on("input", function(){
		countySearch = true; //indicates that there is a county filter applicable
    	countySearchKey = $("#countySearch").val(); //pulls string from searchbar

    	//adds feedback indicator
    	$("#countySearchOn").remove();
    	$("#filterFeedback").append($("<span id='countySearchOn' class='feedbackBar'>county:&nbsp" + countySearchKey +"<img src='images/close.png' style = 'height: 21px; margin-bottom: -5px;'/></span>"));
    	//$("#countySearchOn").append($("<span>county:&nbsp" + countySearchKey + "</span>"));
    	queryTableForFilters(Query, QueryTask, rockTypeSearchKey, countySearchKey, thinSectionChecked, handSampleChecked);
	});

	thinSectionCheckbox.onchange = function() {

		if (thinSectionChecked) { thinSectionChecked = false } else { thinSectionChecked = true };
		queryTableForFilters(Query, QueryTask, rockTypeSearchKey, countySearchKey, thinSectionChecked, handSampleChecked);
	}

	handSampleCheckbox.onchange = function() {

		if (handSampleChecked) { handSampleChecked = false } else { handSampleChecked = true };
		queryTableForFilters(Query, QueryTask, rockTypeSearchKey, countySearchKey, thinSectionChecked, handSampleChecked);
	}

	
*/

} //end initSearchBars function


    
function queryTableForFilters(Query, QueryTask){
   
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
        
        highlightMap(highlightMapSections);
    });

  // queryTask.executeForIds(query, queryCallback);

  //calls remove filters
   //	removeFilters(rockTypeSearchKey, countySearchKey, thinSectionChecked, handSampleChecked);
    } else {
        //if query.where is empty, query for everything! 
        console.log("query is empty.");
        
    }
}

function removeFilters(Query, QueryTask){
    
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
        resetFilters(Query, QueryTask);
    });
    
  
}


function filterForSections(Query, QueryTask, array){
    console.log("filter for sections.", array);
    
    filters.mapSectionsInput = array; 
    queryTableForFilters(Query, QueryTask);
}

