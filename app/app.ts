<<<<<<< HEAD
import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Events, Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {JbcnService} from './services/jbcn.service';
import {TabsPage} from './pages/tabs/tabs';
import {
    FIREBASE_PROVIDERS, defaultFirebase,
    AngularFire, firebaseAuthConfig, AuthProviders,
    AuthMethods
} from 'angularfire2';

@Component({
  templateUrl: 'build/app.html'
})
class ConferenceApp {
  
  rootPage: any = TabsPage;

  constructor(
    private events: Events,
    platform: Platform
  ) {
    // Call any initial plugins when ready
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}


// Pass the main App component as the first argument
// Pass any providers for your app in the second argument
// Set any config for your app as the third argument, see the docs for
// more ways to configure your app:
// http://ionicframework.com/docs/v2/api/config/Config/
// Place the tabs on the bottom for all platforms
// See the theming docs for the default values:
// http://ionicframework.com/docs/v2/theming/platform-specific-styles/

ionicBootstrap(ConferenceApp, [JbcnService, FIREBASE_PROVIDERS,
        defaultFirebase('https://jbcnconf.firebaseio.com'),
        firebaseAuthConfig({
            provider: AuthProviders.Password,
            method: AuthMethods.Password,
            remember: 'default',
            scope: ['email']
        })], {
  tabbarPlacement: 'bottom'
});
=======
import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';


@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}
>>>>>>> 5c03710b92e80f411f7a828fd0fba9dc75826b32
