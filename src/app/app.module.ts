import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { SpeakersPage } from '../pages/speakers/speakers.page';
import { SchedulePage } from '../pages/schedule/schedule.page';
import { SponsorsPage } from '../pages/sponsors/sponsors.page';
import { MeetingDetailPage } from '../pages/meeting-detail/meeting-detail.page';
import { MeetingCommentPage } from '../pages/meeting-comment/meeting-comment.page';
import { SpeakerDetailPage } from '../pages/speaker-detail/speaker-detail.page';
import { LocationPage } from '../pages/location/location.page';
import { MainPage } from '../pages/main/main.page';
import { JbcnService } from '../services/jbcn.service';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ScannerPage } from '../pages/scanner/scanner.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    SchedulePage,
    MainPage,
    MeetingDetailPage,
    SpeakersPage,
    LocationPage,
    SponsorsPage,
    SpeakerDetailPage,
    MeetingCommentPage,
    ScannerPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    SchedulePage,
    MainPage,
    MeetingDetailPage,
    SpeakersPage,
    LocationPage,
    SponsorsPage,
    SpeakerDetailPage,
    MeetingCommentPage,
    ScannerPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, JbcnService, LocalNotifications, BarcodeScanner]
})
export class AppModule {}
