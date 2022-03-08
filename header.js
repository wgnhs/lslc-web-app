//add html content for the header (nhome link, nav bar) and the footer. 
//each html page must have a header and a footer div. 

var header = "<div id='navWrapper' role='navigation'>"

header += "<div id='logoContainer'> <a href='index.html'><img id='homeLogo' src='images/lslc-logo_v4_light-lake_smaller.png' alt='The Lake Superior Legacy Collection Logo'/></a></div>";

header+= "<label for='expand-menu-checkbox' id='expand-menu-icon' tabindex='0'><img src='images/menu-white.png' alt='menu icon'></label>    <input type='checkbox' id='expand-menu-checkbox' role='button'>";

header += "<nav>";

//header+="<a id='navHome' href='index.html' class='navMainLink'>Home</a>";

header+="<div id='navCollection' class='navMainLink dropdownContainer' aria-haspopup='true' tabindex='0'><h3>Collection</h3><div class='dropdown-content'><a id='navFilter' href='interactive-map.html'>Interactive Map</a><a id='navSample' href='hand-sample.html'>Hand Sample Details</a><a href='notebooks.html'>Field Notebooks</a><a href='thin-sections.html'>Thin Section Gallery</a><a href='downloads.html'>Data Downloads</a></div></div>";


header+="<div id='navAbout' href='#' class='navMainLink dropdownContainer' aria-haspopup='true' tabindex='0'><h3>About</h3><div class='dropdown-content'><a href='about-history.html' tabindex='0'>Lake Superior Division, 1882–1922</a><a href='about-wgnhs.html' tabindex='0'>Digitizing the collection</a><a href='about-collection.html' tabindex='0'>Items in the collection</a></div></div>";


header += "<a id='navContact' href='contact.html' class='navMainLink'><h3>Contact</h3></a>";

header+="</nav></div>"; //close nav and navWrapper 

$("#header").append(header);


var footer = "<p> Lake Superior Legacy Collection <br/> <a href='https://wgnhs.wisc.edu' target='_blank'>Wisconsin Geological and Natural History Survey</a> <br/><a href='https://uwex.edu' target='_blank'>University of Wisconsin-Extension<br><img id='extensionLogo' src='images/uwex-logo-black.png' alt='University of Wisconsin- Extension logo'></a></p>";

$("#footer").append(footer);
