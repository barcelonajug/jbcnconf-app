import {Page} from 'ionic-angular';
<<<<<<< HEAD
import {Schedule} from '../schedule/schedule';
import {Speakers} from '../speakers/speakers';
import {About} from '../about/about';
import {Location} from '../location/location';
import {Sponsors} from '../sponsors/sponsors';
=======
import {Page1} from '../page1/page1';
import {Page2} from '../page2/page2';
import {Page3} from '../page3/page3';
>>>>>>> 5c03710b92e80f411f7a828fd0fba9dc75826b32


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
<<<<<<< HEAD
  schedule: any = Schedule;
  speakers: any = Speakers;
  about: any = About;
  location: any = Location;
  sponsors: any = Sponsors;

  gotoTwitterTag(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        window.open("https://twitter.com/hashtag/jbcn16?f=tweets&vertical=default","_system");
    }

}
=======
  tab1Root: any = Page1;
  tab2Root: any = Page2;
  tab3Root: any = Page3;
}
>>>>>>> 5c03710b92e80f411f7a828fd0fba9dc75826b32
