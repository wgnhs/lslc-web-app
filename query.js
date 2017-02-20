//global vars for tracking whether there is a filter active. 
var rockSearch = false;
var countySearch = false;

require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/tasks/StatisticDefinition"], function(Query, QueryTask, StatisticDefinition){
    
    //call the initialize function. 
    initSearchBars();

//function utilizes the search bars; called from map.js
function initSearchBars(){

    //creates two booleans -- checks to see whether the boxes are checked or not 
	var thinSectionChecked = document.getElementById("thinSectionCheckbox").checked;
	var handSampleChecked = document.getElementById("handSampleCheckbox").checked;

	//declares empty strings for search keys
	var rockTypeSearchKey = ""; 
	var countySearchKey = "";

	//function called on input change
	$("#rockTypeSearch").on("input", function(){
		rockSearch = true; //indicates that there is a rock filter applicable
    	rockTypeSearchKey = $("#rockTypeSearch").val(); //pulls string from searchbar

    	//adds feedback indicator
    	$("#rockSearchOn").remove();
    	$("#filterFeedback").append($("<div id='rockSearchOn' class='feedbackBar'></div>"));
    	$("#rockSearchOn").append($("<p>" + rockTypeSearchKey + "</p>"));
    	queryTableForFilters(rockTypeSearchKey, countySearchKey, thinSectionChecked, handSampleChecked);
	});

	
	//function called everytime key is lifted in searchbar
	$("#countySearch").on("input", function(){
		countySearch = true; //indicates that there is a county filter applicable
    	countySearchKey = $("#countySearch").val(); //pulls string from searchbar

    	//adds feedback indicator
    	$("#countySearchOn").remove();
    	$("#filterFeedback").append($("<div id='countySearchOn' class='feedbackBar'></div>"));
    	$("#countySearchOn").append($("<p>" + countySearchKey + "</p>"));
    	queryTableForFilters(rockTypeSearchKey, countySearchKey, thinSectionChecked, handSampleChecked);
	});

	thinSectionCheckbox.onchange = function() {

		if (thinSectionChecked) { thinSectionChecked = false } else { thinSectionChecked = true };
		queryTableForFilters(rockTypeSearchKey, countySearchKey, thinSectionChecked, handSampleChecked);
	}

	handSampleCheckbox.onchange = function() {

		if (handSampleChecked) { handSampleChecked = false } else { handSampleChecked = true };
		queryTableForFilters(rockTypeSearchKey, countySearchKey, thinSectionChecked, handSampleChecked);
	}

	


} //end initSearchBars function


function queryTableForFilters(rockTypeSearchKey, countySearchKey, thinSectionChecked, handSampleChecked){

	//checks each possible SQL statement, creates SQL statement if applicable, or defines a blank string
	if (rockSearch) { var rockTypeString = "Upper(RockType) LIKE '%"+rockTypeSearchKey.toUpperCase()+"%'"} else { var rockTypeString = ""}
   	if (countySearch) { var countySearchString = "Upper(County) LIKE '%"+countySearchKey.toUpperCase()+"%'"} else { var countySearchString = ""}
   	if (thinSectionChecked) { var thinSectionString = "ThinsectionCount > 0"} else { var thinSectionString = ""}
   	if (handSampleChecked) { var handSampleString = "HandSampleCount > 0"} else { var handSampleString = ""}

   	//combines search strings into an array
   	var sqlArray = [rockTypeString, countySearchString, thinSectionString, handSampleString];

	
    
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

   	
   	//iterates through sqlArray
   	for (i = 0; i < sqlArray.length; i++) {
   		//testing for a value before and after, if so, adds AND in between them
   		if (query.where != "" && sqlArray[i] != "") {query.where +=  " AND " };
   		query.where += sqlArray[i]; //adds the sql query to the string 
        
   	};
    
   	//console.log("query.where is:", query.where);
    //set the sections query to the same where as the normal query. 
    sectionsQuery.where = query.where;
        
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
   	removeFilters(rockTypeSearchKey, countySearchKey, thinSectionChecked, handSampleChecked);
}

function removeFilters(rockTypeSearchKey, countySearchKey, thinSectionChecked, handSampleChecked){
    
	//onclick function called when someone clicks on a feedback div
	$("#rockSearchOn").click(function() {
        console.log("remove rockType filter.");
        
   		//removes feedback div; sets the search key to remove statement from SQL Query
   		$("#rockSearchOn").remove();
        //change global var
   		rockSearch = false ;
    	rockTypeSearchKey = "";

    	//resets the SQL Query
        //BROKEN!
    	queryTableForFilters(rockTypeSearchKey, countySearchKey, thinSectionChecked, handSampleChecked);

   	})

	//onclick function called when someone clicks on a feedback div
   	$("#countySearchOn").click(function() {
   		console.log("remove county filter.");
   		//removes feedback div; sets the search key to remove statement from SQL Query
   		$("#countySearchOn").remove();
        //change global var 
   		countySearch = false; 
        //reset query var
    	countySearchKey = ""; 

    	//re-call the SQL Query
        //BROKEN!
    	queryTableForFilters(rockTypeSearchKey, countySearchKey, thinSectionChecked, handSampleChecked);

   	});
  
}

    
}); //end require.