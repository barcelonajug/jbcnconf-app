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


  constructor() {

  }

  gotoTwitterTag(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      window.open("https://twitter.com/hashtag/jbcn17?f=tweets&vertical=default","_system");
  }

}
