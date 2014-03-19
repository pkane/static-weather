angular.module('starter.controllers', [])


// A simple controller that fetches a list of data from a service
.controller('HomeCtrl', function($scope,$compile,storage) {

//var geopin = '<img ng-click="navPlz()" class="geopin"  src="./img/geopin.png" />'
var geopin = $compile(angular.element('<img ng-click="navPlz()" class="geopin"  src="./img/geopin.png" />'))($scope);
 $scope.navPlz = function(e) {navigator.geolocation.getCurrentPosition(onSuccess, onError);}
$scope.leftButtons = [
  {
    type: 'button-clear',
    content: '<i class="icon ion-navicon"></i>',
    tap: function(e) {
      $scope.sideMenuController.toggleLeft();
    }
  }
]
var onSuccess = function(position) {

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
                storage.set('location',address_component.long_name);
                    $('.title').prepend(geopin);
                    $('.title').append(address_component.long_name);
                  $scope.$apply();

                return false // break
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

function alertDismissed() {
    // do something
}
// onError Callback receives a PositionError object
//
function onError(error) {
    console.log('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}



var location = storage.get('location');

if(location === null){
  console.log('here')
navigator.geolocation.getCurrentPosition(onSuccess, onError);

}
else {
    //$scope.locationTitle = location;
  $('.title').prepend(geopin);
  $('.title').append(location);


}



})



// A simple controller that shows a tapped item's data
.controller('PetDetailCtrl', function($scope, $stateParams, PetService) {
  // "Pets" is a service returning mock data (services.js)
  $scope.pet = PetService.get($stateParams.petId);
});
