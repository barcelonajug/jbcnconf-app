import {Page} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/sponsors/sponsors.html'
})
export class Sponsors {

  openSponsor(url, evt) {
      console.debug("opening sponsor");
      window.open(url);	  
  }

}