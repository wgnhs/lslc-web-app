var resultCount = document.getElementById("resultCount");
var sample;

function getResults (){
   
    
//data/result.json originally.   replaced data.samples with data.features  
$.getJSON('data/esriSampleResult.json', function (data) {
    console.log("getJSON. data.features is: ", data.features);
    
    //data.features is an array of objects. 
    
    for (index in data.features) {
        sample = data.features[index].attributes;
        
        //create a li element 
        var listItem = $('<li>');
        //populate it with sample information. 
        $(listItem).html("<div class='resultSample'><p>hand sample #" + sample.HandSample + "</p><h3>" + sample.RockType + "</h3><img class='sampleChevron' src='images/chevron_right_gw.png' alt=''></div>");

        
        //store sample data with the element
        $(listItem).data(sample);
        
        
         //append that item to the unordered list element. 
        //this might compromise performance?? Not recommended to append DOM elements within a loop. 
        $("#resultsUL").append(listItem);

        
    } //end for...in 
    
    //set results counter statement: 
    resultCount.innerHTML = data.features.length;
    
    //WORKS
    //delegated event handler for click event on li elements in resultsUL
    $("#resultsUL").on("click", 'li', function () {
        onSampleClick(this);
       // console.log("You selected sample ",$(this).data('sampleID'),". sample data is: ",$(this).data() );
    });
    
    
}) //end getJSON
}; //end getResults function
    
function onSampleClick(item){
    //this function is called when a list item in resultsUL is clicked. 
    
    console.log("clicked on a sample in the results table");
    console.log("You selected sample ", $(item).data('SampleId'), ". sample data is: ", $(item).data());
    if ($(item).data('sampleID') === 12){
        window.open("recordView_ver2.html", "_blank");
    }
}