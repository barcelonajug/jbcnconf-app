import {Page} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/location/location.html'
})
export class Location {

  openLocation(evt) {
    console.debug("********* Launching maps");
    window.open("geo:0,0?q=UPF Campus Ciutadella, Barcelona");
  }

}