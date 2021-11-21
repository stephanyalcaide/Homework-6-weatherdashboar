
// dia spanish for day
function Formatdia (date){
    var date = new Date();
    console.log(date);
    var month = date.getMonth()+1;
    var dia  = date.getDate();
    
    var diaOutput = date.getFullYear() + '/' +
        (month<10 ? '0' : '') + month + '/' +
        (dia <10 ? '0' : '') + dia ;
    return diaOutput;
}

var townList =$("#town-list");
var cities = [];
var key = "fc8bffadcdca6a94d021c093eac22797";




//Calling function init();
init();

//Function init();
function init(){
    //Get stored cities from localStorage
    //Parsing the JSON string to an object
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    // If cities were retrieved from localStorage, update the cities array to it
    if (storedCities !== null) {
        cities = storedCities;
      }
    // Render cities to the DOM
    renderCities();
    // console.log(cities);
}

//Function StoreCities()
function storeCities(){
   // Stringify and set "cities" key in localStorage to cities array
  localStorage.setItem("cities", JSON.stringify(cities));
  console.log(localStorage);
}

//Function renderCities()
function renderCities() {
    // Clear townList element
    // townList.text = "";
    // townList.HTML = "";
    townList.empty();
    
    // Render a new li for each town
    for (var i = 0; i < cities.length; i++) {
      var town = cities[i];
      
      var li = $("<li>").text(town);
      li.attr("id","listC");
      li.attr("data-town", town);
      li.attr("class", "list-group-item");
      console.log(li);
      townList.prepend(li);
    }
    //Get Response weather for the first town only
    if (!town){
        return
    } 
    else{
        getResponseWeather(town)
    };
}   

  //When form is submitted...
  $("#add-town").on("click", function(event){
      event.preventDefault();

    // This line will grab the town from the input box
    var town = $("#town-input").val().trim();
    
    // Return from function early if submitted town is blank
    if (town === "") {
        return;
    }
    //Adding town-input to the town array
    cities.push(town);
    // Store updated cities in localStorage, re-render the list
  storeCities();
  renderCities();
  });

  //Function get Response Weather 
  
  function getResponseWeather(townName){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +townName+ "&appid=" + key; 

    //Clear content of todia -weather
    $("#todia -weather").empty();
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        
      // Create a new table row element
      townTitle = $("<h3>").text(response.name + " "+ Formatdia ());
      $("#todia -weather").append(townTitle);
      var TempetureToNum = parseInt((response.main.temp)* 9/5 - 459);
      var townTemperature = $("<p>").text("Tempeture: "+ TempetureToNum + " °F");
      $("#todia -weather").append(townTemperature);
      var townHumidity = $("<p>").text("Humidity: "+ response.main.humidity + " %");
      $("#todia -weather").append(townHumidity);
      var townWindSpeed = $("<p>").text("Wind Speed: "+ response.wind.speed + " MPH");
      $("#todia -weather").append(townWindSpeed);
      var CoordLon = response.coord.lon;
      var CoordLat = response.coord.lat;
    
        //Api to get UV index
        var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid="+ key+ "&lat=" + CoordLat +"&lon=" + CoordLon;
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function(responseuv) {
            var townUV = $("<span>").text(responseuv.value);
            var townUVp = $("<p>").text("UV Index: ");
            townUVp.append(townUV);
            $("#todia -weather").append(townUVp);
            console.log(typeof responseuv.value);
            if(responseuv.value > 0 && responseuv.value <=2){
                townUV.attr("class","green")
            }
            else if (responseuv.value > 2 && responseuv.value <= 5){
                townUV.attr("class","yellow")
            }
            else if (responseuv.value >5 && responseuv.value <= 7){
                townUV.attr("class","orange")
            }
            else if (responseuv.value >7 && responseuv.value <= 10){
                townUV.attr("class","red")
            }
            else{
                townUV.attr("class","purple")
            }
        });
    
        //Api to get 5-dia  forecast  
        var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + townName + "&appid=" + key;
            $.ajax({
            url: queryURL3,
            method: "GET"
        }).then(function(response5dia ) { 
            $("#boxes").empty();
            console.log(response5dia );
            for(var i=0, j=0; j<=5; i=i+6){
                var read_date = response5dia .list[i].dt;
                if(response5dia .list[i].dt != response5dia .list[i+1].dt){
                    var FivediaDiv = $("<div>");
                    FivediaDiv.attr("class","col-3 m-2 bg-primary")
                    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                    d.setUTCSeconds(read_date);
                    var date = d;
                    console.log(date);
                    var month = date.getMonth()+1;
                    var dia  = date.getDate();
                    var diaOutput = date.getFullYear() + '/' +
                    (month<10 ? '0' : '') + month + '/' +
                    (dia <10 ? '0' : '') + dia ;
                    var Fivediah4 = $("<h6>").text(diaOutput);
                    //Set src to the imags
                    var imgtag = $("<img>");
                    var skyconditions = response5dia .list[i].weather[0].main;
                    if(skyconditions==="Clouds"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/cloud.png")
                    } else if(skyconditions==="Clear"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/summer.png")
                    }else if(skyconditions==="Rain"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/rain.png")
                    }

                    var pTemperatureK = response5dia .list[i].main.temp;
                    console.log(skyconditions);
                    var TempetureToNum = parseInt((pTemperatureK)* 9/5 - 459);
                    var pTemperature = $("<p>").text("Tempeture: "+ TempetureToNum + " °F");
                    var pHumidity = $("<p>").text("Humidity: "+ response5dia .list[i].main.humidity + " %");
                    FivediaDiv.append(Fivediah4);
                    FivediaDiv.append(imgtag);
                    FivediaDiv.append(pTemperature);
                    FivediaDiv.append(pHumidity);
                    $("#boxes").append(FivediaDiv);
                    console.log(response5dia );
                    j++;
                }
            
        }
      
    });
      

    });
    
  }

  //Click function to each Li 
  $(document).on("click", "#listC", function() {
    var thistown = $(this).attr("data-town");
    getResponseWeather(thistown);
  });
