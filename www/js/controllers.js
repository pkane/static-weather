angular.module('staticWeather.controllers', [])

.controller('HomeCtrl', function($scope,$compile,storage,geoLocate) {

// I don't know how else to get this image in the main bar since its all weird and dyanmic
var geopin = $compile(angular.element('<img ng-click="updateCity()" class="geopin"  src="./img/geopin.png" />'))($scope);
 $('.bar-header').prepend(geopin);
 //Problem: we need to fix this with JS that places the geopin correctly 
 //based on body size and title
 $('.geopin').css({'left':'34%','right':'34%'});

//ng-click handler attached to Geo Pin image
$scope.updateCity = function(e) { 
  
  $scope.locationTitle =geoLocate.getCity();

}


//toggles side menu and creates button on bar
$scope.leftButtons = [
  {
    type: 'button-clear',
    content: '<i class="icon ion-navicon"></i>',
    tap: function(e) {
      $scope.sideMenuController.toggleLeft();
    }
  }
]

//our current saved location (city name)
var savedCity = storage.get('savedcity');

//no locally saved location - go out and get it with geoLocate
if(savedCity === null){ 
  $scope.locationTitle = geoLocate.getCity();

}

//sweet we have it saved, just use it
else {
   $scope.locationTitle = savedCity;
}


})//A Factory for 1. getting gps location from phone 2. finding cityname
.factory('geoLocate', function($state,storage) {


return {
  //public methods go here
  getCity: function(){
    //standard gps lookup in JS
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }
}

//Private methods
function onSuccess(position) {

      var geocoder = new google.maps.Geocoder();  
      var lat = parseFloat(position.coords.latitude);
      var lng = parseFloat(position.coords.longitude);
      var latlng = new google.maps.LatLng(lat, lng);
                        
      geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            var arrAddress = results[0].address_components;
            // iterate through address_component array
            angular.forEach(arrAddress, function (address_component,i) {
              if (address_component.types[0] == "locality") {
                console.log(address_component.long_name); // city
                storage.set('savedcity',address_component.long_name);


                return address_component.long_name // break
              }
            });
          } else {
            console.log("No results found");
          }
        } else {
          console.log("Geocoder failed due to: " + status);
        }
      });

};

// onError Callback receives a PositionError object
function onError(error) {
    console.log('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

})

