
import { Component } from '@angular/core';
import { JbcnService } from '../../services/jbcn.service';
import { NavController, NavParams } from 'ionic-angular';
import { MeetingDetailPage } from '../meeting-detail/meeting-detail.page';
@Component({
    selector: 'speaker-detail',
    templateUrl: 'speaker-detail.page.html'
})
export class SpeakerDetailPage {
    speaker:any = {};
    talk:any = {};
    
    constructor(navParams:NavParams, jbcnService:JbcnService, private nav:NavController) {
        this.speaker = navParams.data;
        jbcnService.load().then(data => {
            let schedule = data.schedule;
            for(let iDay=0; iDay<schedule.length; iDay++) {
                let day = schedule[iDay];
                for(let iTalk=0; iTalk<day.meetings.length; iTalk++) {
                    if(day.meetings[iTalk].speakers.indexOf(this.speaker.ref)>-1) {
                        this.talk = day.meetings[iTalk];
                        break;
                    }
                }
                
                //if(this.talk) break;
            }
            
        });
    }

    goToSpeakerTwitter() {
        window.open(this.speaker.twitter,"_system");
    }

    goToMeetingDetail(meeting) {
        this.nav.push(MeetingDetailPage, meeting);
    }

    goBack() {
        this.nav.pop();
    }

}