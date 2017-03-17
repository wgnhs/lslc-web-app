var resultCount = document.getElementById("resultCount");
var sample;

//accepts data from the dojo query 
function listResults (data){
   
    //Clear the results list before re-populating. 
   // console.log("clear results.");
    $("#resultsUL").html('');
    $("#resultsCount").html('0');
    
   // console.log("data.features is: ", data.features);
    //data.features is an array of objects. 
    
    
    
    for (index in data.features) {
        sample = data.features[index].attributes;
        
        //create a li element 
        var listItem = $('<li>');
        //populate it with sample information. 
        $(listItem).html("<div class='resultSample'><p>#" + sample.SampleId + "</p><h3>" + sample.RockType + "</h3><img class='sampleChevron' src='images/chevron_right_gw.png' alt=''></div>");

        
        //store sample data with the element
        $(listItem).data(sample);
        
        
         //append that item to the unordered list element. 
        //this might compromise performance?? Not recommended to append DOM elements within a loop. 
        $("#resultsUL").append(listItem);

        
    } //end for...in 
    
    //set results counter statement: 
    resultCount.innerHTML = data.features.length;
    
       
    
}; //end getResults function


 //delegated event handler for click event on li elements in resultsUL
    $("#resultsUL").on("click", 'li', function () {
        onSampleClick(this);
       
    });
    
function onSampleClick(item){
    //this function is called when any list item in resultsUL is clicked. 
    
    var clickedId = $(item).data('SampleId');
   //why does this sometimes console log twice?
    console.log("You selected sample ", clickedId, ". sample data is: ", $(item).data());
    
//    if ($(item).data('SampleId') === 15){
        window.open("sampleRecord.html#"+clickedId, "_blank");
   // }
    
    
    
}