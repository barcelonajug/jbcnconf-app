import { NavController, NavParams} from 'ionic-angular';
import { Component } from '@angular/core';
import {JbcnService} from '../../services/jbcn.service';
import { SpeakerDetailPage } from '../speaker-detail/speaker-detail.page';
//import {SpeakerDetail} from '../speaker-detail/speaker-detail';

@Component({
    selector: 'meeting-detail',
    templateUrl: 'meeting-detail.html'
})
export class MeetingDetailPage {
    meeting;
    speakers;
    nav: NavController;
    vote; Number;
    jbcnService: JbcnService;
    constructor(navParams:NavParams, jbcnService:JbcnService,nav: NavController) {
        this.jbcnService = jbcnService;
        this.meeting = navParams.data;
        this.vote = this.jbcnService.getVote(this.meeting.id);
        this.nav = nav;
        //let meetingVote = this.jbcnService.getMeetingVote(this.meeting.id);
        //this.vote= meetingVote["vote"];
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
        this.nav.push(SpeakerDetailPage, speaker);
    }
    
    voteMeeting(meeting,n) {
        this.vote=n;
        this.jbcnService.voteMeeting(meeting.id, n).then(voteMeeting => {
            this.meeting.voteMeeting = voteMeeting;
            this.jbcnService.storeVote(meeting.id, this.vote);
        });
    }

    goBack() {
        this.nav.pop();
    }
    
    getIcon(n) {
        if(n<=this.vote) {
            return 'heart';
        } else {
            return 'heart-outline';
        }
    }
}