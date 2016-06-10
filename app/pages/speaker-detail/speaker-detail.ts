import {Page, NavParams,NavController} from 'ionic-angular';

import {Inject} from '@angular/core';
import {JbcnService} from '../../services/jbcn.service';
import {MeetingDetail} from '../meeting-detail/meeting-detail';

@Page({
    templateUrl: 'build/pages/speaker-detail/speaker-detail.html'
})
export class SpeakerDetail {
    speaker;
    talk;
    nav;
    constructor(navParams:NavParams, jbcnService:JbcnService, nav:NavController) {
        this.nav=nav;
        this.speaker = navParams.data;
        jbcnService.load().then(data => {
            let schedule = data.schedule;
            for(let iDay=0; iDay<schedule.length; iDay++) {
                let day = schedule[iDay];
                for(let iTalk=0; iTalk<day.meetings.length; iTalk++) {
                    if(day.meetings[iTalk].ref == this.speaker.meetingRef) {
                        this.talk = day.meetings[iTalk];
                        break;
                    }
                }
                if(this.talk) break;
            }
            
        });
        
    }
    
    goToMeetingDetail(meeting) {
        this.nav.push(MeetingDetail, meeting);
    }
    
    goToSpeakerTwitter(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        window.open(this.speaker.twitter);
    }
}