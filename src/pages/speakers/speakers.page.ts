import { Component } from '@angular/core';
import { NavController, ActionSheetController} from 'ionic-angular';
import {JbcnService} from '../../services/jbcn.service';
import { SpeakerDetailPage } from '../speaker-detail/speaker-detail.page';

@Component({
    templateUrl: 'speakers.page.html',
})
export class SpeakersPage {

    speakers = [];

    constructor(private jbcnService: JbcnService, private nav: NavController, public actionSheetCtrl: ActionSheetController) {
        jbcnService.load().then(data => {
            for (let speaker in data.speakers) {
                if(this.speakers.indexOf(data.speakers[speaker])==-1) {
                    this.speakers.push(data.speakers[speaker]);
                }   
            }

        });
    }

    goToSpeakerDetail(speaker) {
        this.nav.push(SpeakerDetailPage, speaker);
    }

    goToSpeakerTwitter(speaker,evt) {
        evt.preventDefault();
        evt.stopPropagation();
        window.open(speaker.twitter);
    }


    openSpeakerShare(speaker) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Share ' + speaker.name,
            buttons: [
                {
                    text: 'Copy Link',
                    handler: () => {
                       /* if (window.cordova && window.cordova.plugins.clipboard) {
                            window.cordova.plugins.clipboard.copy("https://twitter.com/" + speaker.twitter);
                        }*/
                    }
                },
                {
                    text: 'Share via ...',
                    handler: () => {
                        console.log("Share via clicked");
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log("Cancel clicked");
                    }
                },
            ]
        });
        actionSheet.present();
    }
}


