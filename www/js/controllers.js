angular.module('staticWeather.controllers', [])

.controller('AppCtrl', function($scope,$compile,storage) {



//ng-click handler attached to Geo Pin image
  $scope.updateCity = function(e){
    $scope.geoUpdating = true;
    getCity();

  }


//our current saved location (city name)
var savedCity = storage.get('savedcity');

//no locally saved location - go out and get it with geoLocate
if(savedCity === null){ 
   getCity();

}

//sweet we have it saved, just use it
else {
   $scope.locationTitle = savedCity;
}



function getCity(){
  $('.loader').show();
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
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
                $scope.geoUpdating = false;
                $scope.$apply();
                  $scope.locationTitle =address_component.long_name;

                return false// break
              }
            });
          } else {
            $scope.geoUpdating = false;
            scope.$apply();
            console.log("No results found");
          }
        } else {
          $scope.geoUpdating = false;
          scope.$apply();
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
