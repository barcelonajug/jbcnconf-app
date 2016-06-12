import {Page} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/sponsors/sponsors.html'
})
export class Sponsors {

  openSponsor(url) {
      window.open(url, "_system");	  
  }

}