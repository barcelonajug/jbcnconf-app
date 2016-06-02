import {Page, NavController, ActionSheet} from 'ionic-angular';
import {JbcnService} from '../../services/jbcn.service';
import {SpeakerDetail} from '../speaker-detail/speaker-detail';

@Page({
    templateUrl: 'build/pages/speakers/speakers.html',
})
export class Speakers {

    speakers = [];
    nav: NavController;

    constructor(jbcnService: JbcnService, nav: NavController) {
        this.nav = nav;
        jbcnService.load().then(data => {
            for (let speaker in data.speakers) {
                this.speakers.push(data.speakers[speaker]);
            }

        });
    }

    goToSpeakerDetail(speaker) {
        this.nav.push(SpeakerDetail, speaker);
    }

    goToSpeakerTwitter(speaker,evt) {
        evt.preventDefault();
        evt.stopPropagation();
        window.open(speaker.twitter);
    }


    openSpeakerShare(speaker) {
        let actionSheet = ActionSheet.create({
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

        this.nav.present(actionSheet);
    }
}


