//add html content for the header (nhome link, nav bar) and the footer. 
//each html page must have a header and a footer div. 

var header = "<a href='index.html'><img src='images/LSLCLogo_v3_lightLake.png' alt='The Lake Superior Legacy Collection Logo'/></a><!--<span>geologic samples from the Lake Superior Division of the USGS, 1882-1922</span>-->";

header += "<div class='striped-1 messageBar'><span>This webpage is currently under construction. You may encounter broken hyperlinks or other errors.</span></div>";

header += "<nav><a id='navHome' href='index.html' class='navMainLink'>Home</a><div id='navCollection' href='#' class='navMainLink dropdownContainer'>Collection<div class='dropdown-content'><a id='navFilter'href='interactive-map.html'>Interactive Map</a><a id='navSample' href='hand-sample.html'>Hand Sample </a><a href='notebooks.html'>Notebooks</a><a href='thin-gallery.html'>Thin Sections Gallery</a><a href='downloads.html'>Data Downloads</a></div></div><div id='navAbout' href='#' class='navMainLink dropdownContainer'>About<div class='dropdown-content'><a href='#'>Lake Superior Division, 1882-1922</a><a href=''>Digitizing the collection</a></div></div><a id='navContact' href='contact.html' class='navMainLink'>Contact</a></nav>";


$("#header").append(header);

//may need to work on this header's responsiveness in narrow windows... figure out how to collapse to a simple list or a menu button. 

var footer = "<p> Lake Superior Legacy Collection <br/> Wisconsin Geological and Natural History Survey <br/>University of Wisconsin Extension </p>";

$("#footer").append(footer);