import {Page} from 'ionic-angular';
import {Schedule} from '../schedule/schedule';
import {Speakers} from '../speakers/speakers';
import {About} from '../about/about';
import {Location} from '../location/location';
import {Sponsors} from '../sponsors/sponsors';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  schedule: any = Schedule;
  speakers: any = Speakers;
  about: any = About;
  location: any = Location;
  sponsors: any = Sponsors;

  gotoTwitterTag(evt) {
        console.debug("¿Pero entrar entra?");
        evt.preventDefault();
        evt.stopPropagation();
        window.open("https://twitter.com/hashtag/jbcn16?f=tweets&vertical=default","_system");
    }

}