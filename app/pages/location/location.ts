import {Page} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/location/location.html'
})
export class Location {

  openLocation(evt) {
    window.open("geo:0,0?q=UPF Campus Ciutadella, Barcelona");
  }

  openAllLocationsMap(evt) {
    window.open("https://www.google.com/maps/d/u/0/viewer?mid=1K4r0tI0XVUXPWTKo-pFYLgHj-08");
  }

}