import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { team } from '../../services/team';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  private team = [];

  constructor(public navCtrl: NavController) {
    this.team = team;
  }

  gotoUrl(url) {
      window.open(url,"_system");
  }

}
