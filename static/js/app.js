function init() {
  console.log("Entering init function");

  buildMap();

}

function buildMap()  {
// provide colors depending on the earthquake magnitude
  function getColor(d)  {
    return d < 31  ? "blue"  :  
           d < 81  ? "green"  :
           d < 121 ? "yellow"  :
           d < 171 ? "orange"  :
                     "red";
  }

  function createMap(ocData)   {
    console.log("entering createMap")

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 16,
      id: "mapbox.light",
      accessToken: API_KEY
    });
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 16,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = { "Light Map": lightmap,
                    "Satellite Map": satellitemap  };
  
    // Create an overlayMaps object to hold the host cities layer
    var overlayMaps = { "Host Cities": ocData  };
  
    // Create the map object with options
    var myMap = L.map("map-id", {
      center: [21, 35],
      zoom: 2,
      layers: [lightmap, ocData]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    // L.control.layers(baseMaps, overlayMaps, {
    //   collapsed: true
    // }).addTo(myMap);

    // create a legend
    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function (myMap) {
      var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 31, 81, 121, 171],
            labels = [];
    
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
    };
    legend.addTo(myMap);
  
  }
  
  // Create the createMarkers function
  function createMarkers(oData) {
    console.log("Entering createMarkers");
    console.log(oData);

    // Initialize an array to hold host city markers
    var ocMarkers = [];
    var markerRadius = 500;
    var numNations = 0;
    var ocColor = "";
  
    // Loop backwards through the stations array
    for (var i = (oData.length-1); i >= 0; i--)  {
      numNations = oData[i].Nations; 

      markerRadius = 8000 * (numNations ** 0.7);
      ocColor = getColor(numNations);
      
      console.log(numNations, markerRadius, ocColor);
  
      var totAthletes = oData[i].Athletes_M + oData[i].Athletes_W;

      // For each olympic city, create a marker and bind a popup with the station's name
      marker = L.circle([oData[i].Lat, oData[i].Lon],  {
        color: "#707070",
        weight: 1,
        fillColor: ocColor,
        fillOpacity: 0.85,
        radius: markerRadius
      }).bindPopup("<h3>" + oData[i].Year + " - " + oData[i].City + "</h3><hr><h4>" + oData[i].Nations + " nations and " + totAthletes + " athletes participated</h4>");
   
          // Add the marker to the ocMarkers array
  
      ocMarkers.push(marker);
    }
    // Create a layer group made from the ocMarkers array, pass it into the createMap function
    var ocLayer = L.layerGroup(ocMarkers);
    createMap(ocLayer);
  }
  
  console.log ("entering buildMap");
  d3.json(`/olympiads`).then(function(olympiData) { createMarkers(olympiData); });
};


// Initialize the dashboard
init();



