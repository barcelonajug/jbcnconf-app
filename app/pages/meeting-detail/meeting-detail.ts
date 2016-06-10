import {Page,NavController, NavParams} from 'ionic-angular';

import {Inject} from '@angular/core';
import {JbcnService} from '../../services/jbcn.service';
import {SpeakerDetail} from '../speaker-detail/speaker-detail';

@Page({
    templateUrl: 'build/pages/meeting-detail/meeting-detail.html'
})
export class MeetingDetail {
    meeting;
    speakers;
    nav: NavController;
    vote;
    jbcnService: JbcnService;
    constructor(navParams:NavParams, jbcnService:JbcnService,nav: NavController) {
        this.jbcnService = jbcnService;
        this.meeting = navParams.data;
        this.nav = nav;
        let meetingVote = this.jbcnService.getMeetingVote(this.meeting.id);
        this.vote= meetingVote["vote"];
        console.debug(this.vote);
        this.jbcnService.load().then(data => {
            this.speakers = [];
            for(var i=0; i<this.meeting.speakers.length; i++) {
                let ref = this.meeting.speakers[i];
                let speaker = data.speakersRef[ref];
                this.speakers.push(speaker);
            }
        });
    }
    
     goToSpeakerDetail(speaker) {
        this.nav.push(SpeakerDetail, speaker);
    }
    
    voteMeeting(meeting,n) {
        this.vote=n;
        this.jbcnService.voteMeeting(meeting.id, n);
    }
    
    
    
    getIcon(n) {
        if(n<=this.vote) {
            return 'heart';
        } else {
            return 'heart-outline';
        }
    }
}