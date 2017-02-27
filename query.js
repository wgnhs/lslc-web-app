//global var for all filters 
var filters = {
    //all initial values in this filters object should be falsey. 
    //an empty string is falsey. 
    //an empty array is not falsy, so the map sections input must be set to null when cleared. 
    
    "mapSectionsInput": null, "rockTypeInput": "", "countyInput": "", "handSampleAvailabilityInput": null, "thinSectionAvailabilityInput": null
  
};


require(["esri/tasks/query", "esri/tasks/QueryTask"], function(Query, QueryTask){
    
    setFilters(Query, QueryTask);
    //call the initialize function. 
    initSearchBars(Query, QueryTask);
    removeFilters();
}); //end require.

function setFilters(Query, QueryTask) {
        filters.rockTypeInput = $("#rockTypeSearch").val();
        filters.countyInput = $("#countySearch").val(); 
        filters.thinSectionAvailabilityInput =  document.getElementById("thinSectionCheckbox").checked;
        filters.handSampleAvailabilityInput = document.getElementById("handSampleCheckbox").checked;
        
        console.log("filters set:", filters);
        queryTableForFilters(Query, QueryTask);
}

//function utilizes the search bars
function initSearchBars(Query, QueryTask){
    
    
    $("#filters").on("input", "input", function(){
        setFilters(Query, QueryTask);

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

/*	for (a in filters){
          // console.log(filters[a]);
            if(filters[a]){console.log(filters[a], " is true.");} else {console.log(filters[a], " is false.");}
    }
*/    
    var newsqlArray = [];
    
    
    if (filters.rockTypeInput) {
        newsqlArray.push("Upper(RockType) LIKE '%"+filters.rockTypeInput.toUpperCase()+"%'");
        //adds feedback indicator
    	$("#rockSearchOn").remove();
    	$("#filterFeedback").append($("<span id='rockSearchOn' class='feedbackBar' data='rockTypeInput'>rock:&nbsp" + filters.rockTypeInput + "<img src='images/close.png' style = 'height: 21px; margin-bottom: -5px;'/></span>"));
        } else {$("#rockSearchOn").remove();}; 
    if (filters.countyInput) {newsqlArray.push("Upper(County) LIKE '%"+filters.countyInput.toUpperCase()+"%'");}; 
    if (filters.handSampleAvailabilityInput) {newsqlArray.push("HandSampleCount > 0");}; 
    if (filters.thinSectionAvailabilityInput) {newsqlArray.push("ThinsectionCount > 0");}; 
    if (filters.mapSectionsInput) {newsqlArray.push("SectionId IN ("+filters.mapSectionsInput+")");}; 
    
    console.log ("new SQL array:", newsqlArray);
    
    
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
    }
}

function removeFilters(){
    
	//when the user clicks on a filter indicator... 
    $("#filterFeedback").on("click", "span", function(){
        console.log("this", this.getAttribute('data'));
        console.log("clear", filters[this.getAttribute('data')]);
        filters[this.getAttribute('data')] = null;
        
    });
    
  
}


function filterForSections(Query, QueryTask, array){
    console.log("filter for sections.", array);
    
    filters.mapSectionsInput = array; 
    queryTableForFilters(Query, QueryTask);
}