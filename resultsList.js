//var resultCount = document.getElementById("resultCount");
var resultsTable; 
var sample;
var resultsTableBody;

var tableAttributes = [
     //   {"field": "OBJECTID", "label": "OBJECT ID"}, 
        
        {"field": "HandSampleCatalogNumber", "label": "Catalog Number"}, 
    
   //     {"field": "SampleId", "label": "SampleID"}, 
        {"field": "RockType", "label": "Field Description"},  
        {"field": "HandSampleCount", "label": "Hand Sample"}, 
        {"field": "ThinSectionCount", "label": "Thin Sections"}, 
        {"field": "State", "label": "State"},
        // {"field": "County", "label": "County"},
        //  {"field": "Township", "label": "Township"},
        // {"field": "Range", "label": "Range"},
        // {"field": "Direction", "label": "Range Direction"},
       
        {"field": "NotebookNum", "label": "Notebook Number"},
        {"field": "NotebookPage", "label": "Notebook Page"},
        {"field": "WgnhsId", "label": "WGNHS ID"},
        {"field": "Notes", "label": "Notes"},
        //{"field": "", "label": ""}
    ];

// //Executed on Button Click
  $(".export").on('click', function(event) {

    //not sure why, but it doesn't work without this format
    //calls function
    exportTableToCSV.apply(this);
    //exportTableToCSV();
  });


function initializeResultsTable(){
    
    resultsTable = document.getElementById('resultsTable');
    
     
    
    var headerRow = '<thead><tr>';
    for (attr in tableAttributes){
        headerRow += '<td>'+tableAttributes[attr].label+'</td>' ;
      
    }
    
    headerRow+= '</tr></thead>';
    $("#resultsTable").html(headerRow);
    $("#resultsTable").append("<tbody id='resultsTableBody'></tbody>");
    
   // console.log("table", resultsTable);
    resultsTableBody = resultsTable.getElementsByTagName('tbody')[0];
   // console.log('body', resultsTableBody);
    
    //delegated event handler for click event on tr elements in resultsTableBody
    $("#resultsTableBody").on("click", "tr", function () {
        //console.log("this is ", this);
        onSampleClick(this);
       
    });
    
}

//accepts data from the dojo query 
function listResults (dataObjects){
   // console.log("dataObjects is: ", dataObjects);
    //dataObjects is an array of objects. 
   
    //Clear the results list before re-populating. 
   // console.log("clear results.");

    //$("#resultsCount").html('0');
    resultsTableBody.innerHTML = '';
    

    var tb = '';
    for (obj in dataObjects){
       // console.log("dataObjects[obj].attributes.SampleId: ", dataObjects[obj].attributes.SampleId);
        
        var samCat = dataObjects[obj].attributes.HandSampleCatalogNumber;
        
        var tr = "";
        tr+= "<tr data-ID="+samCat+">"; 
        
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


 
    
function onSampleClick(item){
    //this function is called when any list item in resultsUL is clicked. 
    
    var clickedId = item.getAttribute('data-ID');
   //why does this sometimes console log twice?
    console.log("You selected sample ", clickedId, ". sample data is: ", $(item).data());
    

    window.open("sampleRecord.html#"+clickedId, "_blank");

}




function exportTableToCSV() {

//    var dateStr = new Date(datestring); 
//    console.log("datestr: ", dateStr);
    
    var filename = "LSLC_Results-"; //declares title for csv

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
    filename += "export"; //adds export.csv at end
    //filename += 
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
        if (globalResultsArray[i].attributes[key]){
            //non-null value 
            
            var value = (globalResultsArray[i].attributes[key]).toString();
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






