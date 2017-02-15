import { Component } from '@angular/core';

@Component({
    selector: 'sponsors',
    templateUrl: 'sponsors.page.html'
})
export class SponsorsPage {

    constructor() {

    }

    openSponsor(url, evt) {
      console.debug("opening sponsor");
      window.open(url);	  
  }

}