import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {JbcnService} from './services/jbcn.service';
import {Device} from 'ionic-native';

import {
    FIREBASE_PROVIDERS, defaultFirebase,
    AngularFire, firebaseAuthConfig, AuthProviders,
    AuthMethods
} from 'angularfire2';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers:[JbcnService, FIREBASE_PROVIDERS,
        defaultFirebase('https://jbcnconf.firebaseio.com'),
        firebaseAuthConfig({
            provider: AuthProviders.Password,
            method: AuthMethods.Password,
            remember: 'default',
            scope: ['email']
        })]
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform, jbcnService:JbcnService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      //this.registerBackButtonListener();
    });
  }

}
ionicBootstrap(MyApp)