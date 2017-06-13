//var resultCount = document.getElementById("resultCount");
var resultsTable; 
var sample;
var resultsTableBody;

var tableAttributes = [
           //add manually before the view link.
        //{"field": "HandSampleCatalogNumber", "label": "Hand sample number"}, 
       
    
   //     {"field": "SampleId", "label": "SampleID"}, 
        {"field": "RockType", "label": "Rock type"},  
        {"field": "HandSampleCount", "label": "Hand sample available"}, 
        {"field": "ThinSectionCount", "label": "Thin sections"}, 
        {"field": "State", "label": "State / province"},
        // {"field": "County", "label": "County"},
        //  {"field": "Township", "label": "Township"},
        // {"field": "Range", "label": "Range"},
        // {"field": "Direction", "label": "Range Direction"},
        {"field": "LocNote", "label": "Location note"},
        {"field": "NotebookNum", "label": "Field notebook number"},
       // {"field": "NotebookPage", "label": "Notebook page"},
        {"field": "WgnhsId", "label": "WGNHS ID"},
        {"field": "Notes", "label": "Notes"},
        //{"field": "", "label": ""}
    ];

// //Executed on Button Click
  $(".export").on('click', function(event) {

    //not sure why, but it doesn't work without this format
    //calls function
    exportResultsToCSV.apply(this);
    //exportResultsToCSV();
  });


function initializeResultsTable(){
    //called once during the page build. 
    
    resultsTable = document.getElementById('resultsTable');
    
     
    //build the table's header row
    var headerRow = '<thead><tr><td>Hand sample number</td><td>View details</td>';
    for (attr in tableAttributes){
        headerRow += '<td>'+tableAttributes[attr].label+'</td>' ;
      
    }
    
    headerRow+= '</tr></thead>';
    $("#resultsTable").html(headerRow);
    $("#resultsTable").append("<tbody id='resultsTableBody'></tbody>");
    
   // console.log("table", resultsTable);
    resultsTableBody = resultsTable.getElementsByTagName('tbody')[0];
   // console.log('body', resultsTableBody);

  initResize();
    
}

//accepts data from the dojo query 
function listResults (dataObjects){
   // console.log("dataObjects is: ", dataObjects);
    //dataObjects is an array of objects. 
   
    //Clear the results list before re-populating. 
    resultsTableBody.innerHTML = '';
    

    var tb = '';
    for (obj in dataObjects){
       // console.log("dataObjects[obj].attributes.SampleId: ", dataObjects[obj].attributes.SampleId);
        
        var samCat = dataObjects[obj].attributes.HandSampleCatalogNumber;
        
        var tr = "";
        tr+= "<tr data-ID="+samCat+">"; 
        //add hand sample number in the first column: 
        tr+="<td>"+samCat+"</td>";
        
        //add a link to the sample's details in the second column: 
        tr+="<td class='detailsLink'><a href='hand-sample.html#"+samCat+"' target='_blank'>view</a></td>";
        
        for (attr in tableAttributes){
            
            var field = tableAttributes[attr].field;
            var val = dataObjects[obj].attributes[field];
                
            //only add the val if it's not null. if null, add an empty cell.  
            if(val === null){
                tr+= "<td></td>";
            } else {
                tr+= "<td>"+val+"</td>";
            }
            
        } //end for loop through table attributes. 
        tr+= "</tr>";
      
        //add to the table body variable. 
        tb += tr;


    }

   //this seems to be WAY faster than appending html elements within the for loop! 
     resultsTableBody.innerHTML += tb;
    

}; //end getResults function


function exportResultsToCSV() {
    
    //build a date and time stamp for the filename: 
    var date = new Date(); 
    var dateStr = date.getFullYear().toString() + "-" + ("00"+(date.getMonth()+1).toString()).slice(-2)+ "-" + ("00"+date.getDay().toString()).slice(-2) + "_" + ("00"+date.getHours().toString()).slice(-2) + ("00"+date.getMinutes().toString()).slice(-2);
   // console.log("datestr: ", dateStr);
    
    var filename = "LSLC_Results_"; //declares title for csv

    //iterates through filters object and changes CSV title to fit them
//    for (key in filters){
//      if (filters[key] != null && filters[key] != ""){
//        if (key == "handSampleAvailabilityInput"){
//          filename += "HandSample"
//        } else if (key == "thinSectionAvailabilityInput"){
//          filename += "ThinSection"
//        } else {
//          filename += filters[key]
//        }
//        filename += "-"
//      }
//    }
    
    filename += dateStr;
    filename += "_export"; //adds export.csv at end
    filename += ".csv";
    

    var csv = '' //establishes csv empty string
    var newLine = '\r\n' //establishes newline character

    //loop iterates through attributes (globalResultsArray[0])
    //used to create header
    for (key in globalResultsArray[0].attributes){
      //adds csv item, quotes and comma included
      csv += '"' + key + '",';
    }
    //takes off last comma and adds newline
    csv = csv.substr(0,csv.length-1);
    csv += newLine;

    var csvLine;

    //loop iterates through all of array; this time adds CSV body 
    for (i in globalResultsArray){
      csvLine = '';
      //pulls out and iterates through each attributes object
      for (key in globalResultsArray[i].attributes){
        //reset the value variable 
        var value = '';
          
        if (globalResultsArray[i].attributes[key]){
            //non-null value 
            
            value = (globalResultsArray[i].attributes[key]).toString();
            //if the value contains a double quote: 
            if (value.indexOf('"') >= 0){
                //all double quotes within the value must be doubled. 
                value = value.replace(/"/g, '""');
            }       
            
           // console.log("replaced", value);
        }  

        //adds csv element
        csvLine += '"' + value + '",';
        
      }
      //takes off last comma and adds newline
      csvLine = csvLine.substr(0,csvLine.length-1)
      csvLine += newLine
      csv += csvLine
    }

    //THIS SECTION CREATES TABLE -- DOWNLOADED FUNCTION

    // Deliberate 'false', see comment below
    if (false && window.navigator.msSaveBlob) {

      var blob = new Blob([decodeURIComponent(csv)], {
        type: 'text/csv;charset=utf8'
      });

      // Crashes in IE 10, IE 11 and Microsoft Edge
      // See MS Edge Issue #10396033
      // Hence, the deliberate 'false'
      // This is here just for completeness
      // Remove the 'false' at your own risk
      window.navigator.msSaveBlob(blob, filename);

    } else if (window.Blob && window.URL) {
      // HTML5 Blob        
      var blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8'
      });
      var csvUrl = URL.createObjectURL(blob);

      $(this)
        .attr({
          'download': filename,
          'href': csvUrl
        });
    } else {
      // Data URI
      var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

      $(this)
        .attr({
          'download': filename,
          'href': csvData,
          'target': '_blank'
        });
    } //end if... else if... else
}

function initResize(){
    //called once from the initializeResultsTable function. 

  var barHeight = $(".orangeBar").height()
  var legendVisibility = $(window).height() - $("#leftPanel").offset().top - ($(window).height()/4) - (16 + 55); //16 due to attribution on leaflet map
  console.log($("#leftPanel").offset().top);

  $('#resultsPanel').resizable({
      
      handles: 'n', /* only need to resize from the top edge of the div */

      minHeight: barHeight,
      maxHeight: legendVisibility,
      create: function(event, ui){
        wrapperHeight = $('#wrapAll').height();
        panelHeight = $('#resultsPanel').height();
        var mapHeight = wrapperHeight - panelHeight;
        $("#map").css("height", mapHeight + "px");
        var leftPanelHeight = mapHeight - 100;
        $("#leftPanel").css("height", leftPanelHeight + "px");
          
        $(".leaflet-top").css("top", $("#leftPanel").offset().top);
      },
      resize: function(){
        resizeAll();
      }
  });
    
    function resizeAll (){
        
        //store height of total window wrapper and results panel as variables. 
        wrapperHeight = $('#wrapAll').height();
        panelHeight = $('#resultsPanel').height();
        //change the map height to be the difference between the two. 
        var mapHeight = wrapperHeight - panelHeight;
        
        //console.log("map", mapHeight, "panel", panelHeight, "wrapper", wrapperHeight);
       
        $("#map").css("height", mapHeight + "px");
        //set the left panel to be 100 px less tall than the map. 
        var leftPanelHeight = mapHeight - 100;
        $("#leftPanel").css("height", leftPanelHeight + "px");
        
        //reposition the results panel to match the height of the map. 
        $("#resultsPanel").css("top", mapHeight+"px");
        
        $(".leaflet-top").css("top", $("#leftPanel").offset().top);
    }
    
    /* Listener for window resize */
    $(window).on("resize", function(){
        //reset the allowable min and max height for the results panel. 
        $("#resultsPanel").css("minHeight", $(".orangeBar").height());
        legendVisibility = $(window).height() - $("#leftPanel").offset().top - ($(window).height()/4) - (16 + 55); //16 due to attribution on leaflet map
        $("#resultsPanel").css("maxHeight", legendVisibility);
        
        resizeAll();
     
    });
}
