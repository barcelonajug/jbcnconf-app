import { Component } from '@angular/core';
import { SchedulePage } from '../schedule/schedule.page';
import { SpeakersPage } from '../speakers/speakers.page';
import { AboutPage } from '../about/about';
import { SponsorsPage } from '../sponsors/sponsors.page';
import { LocationPage } from '../location/location.page';
import { ScannerPage } from '../scanner/scanner.page';

@Component({
  templateUrl: 'main.page.html'
})
export class MainPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  schedule: any = SchedulePage;
  speakers: any = SpeakersPage;
  location: any = LocationPage;
  sponsors: any = SponsorsPage;
  scanner: any = ScannerPage;
  about: any= AboutPage;
  gdprAccepted = false;
  acceptedConditions = false;
  showError=false;


  constructor() {

    this.gdprAccepted = localStorage.getItem('gdprAccepted') === 'true';

  }

  gotoTwitterTag(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      window.open("https://twitter.com/hashtag/jbcn18?src=hash","_system");
  }

  acceptConditions() {
    this.showError = !this.acceptedConditions;
    if(this.acceptedConditions) {
      localStorage.setItem('gdprAccepted', 'true');
      this.gdprAccepted = true;
    }
  }

}
