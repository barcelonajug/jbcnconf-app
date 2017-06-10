import { Component } from '@angular/core';

@Component({
    selector: 'location',
    templateUrl: 'location.page.html'
})
export class LocationPage  {
    
    constructor() {

    }

    openLocation(evt) {
    window.open("geo:0,0?q=UPF Campus Ciutadella, Barcelona");
  }

  openAllLocationsMap(evt) {
    window.open("https://www.google.com/maps/d/u/0/viewer?mid=1K4r0tI0XVUXPWTKo-pFYLgHj-08");
  }

}