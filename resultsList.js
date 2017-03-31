

//var resultCount = document.getElementById("resultCount");
var resultsTable; 
var sample;
var resultsTableBody;

var tableAttributes = [
        {"field": "OBJECTID", "label": "OBJECT ID"}, 
        
        {"field": "HandSampleCatalogNumber", "label": "Catalog Number"}, 
    
        {"field": "SampleId", "label": "SampleID"}, 
        {"field": "RockType", "label": "Field Description"},  
        {"field": "HandSampleCount", "label": "Hand Samples"}, 
        {"field": "ThinSectionCount", "label": "Thin Sections"}, 
        {"field": "State", "label": "State"},
        //  {"field": "Township", "label": "Township"},
        // {"field": "Range", "label": "Range"},
        // {"field": "Direction", "label": "Range Direction"},
       
        {"field": "NotebookNum", "label": "Notebook Number"},
        {"field": "NotebookPage", "label": "Notebook Page"},
        {"field": "WgnhsId", "label": "WGNHS ID"},
        {"field": "Notes", "label": "Notes"},
        //{"field": "", "label": ""}
    ];


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
    console.log("dataObjects is: ", dataObjects);
    //dataObjects is an array of objects. 
   
    //Clear the results list before re-populating. 
   // console.log("clear results.");

    $("#resultsCount").html('0');
    resultsTableBody.innerHTML = '';
    

    var tb = '';
    for (obj in dataObjects){
       // console.log("dataObjects[obj].attributes.SampleId: ", dataObjects[obj].attributes.SampleId);
        
        var samCat = dataObjects[obj].attributes.HandSampleCatalogNumber;
        //console.log("samId", samId);
        
        var tr = "";
        tr+= "<tr data-ID="+samCat+">"; 
        //var trHTML = '';
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