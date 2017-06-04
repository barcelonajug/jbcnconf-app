import { NavController, NavParams, Events} from 'ionic-angular';
import { Component} from '@angular/core';
import {JbcnService} from '../../services/jbcn.service';
import { SpeakerDetailPage } from '../speaker-detail/speaker-detail.page';
import { MeetingCommentPage } from '../meeting-comment/meeting-comment.page';
//import {SpeakerDetail} from '../speaker-detail/speaker-detail';

@Component({
    selector: 'meeting-detail',
    templateUrl: 'meeting-detail.html'
})
export class MeetingDetailPage {
    meeting;
    speakers;
    vote; Number;
    comments:any = [];
    constructor(private navParams:NavParams, private jbcnService:JbcnService,private nav: NavController, private events:Events) {
        this.meeting = navParams.data;
        this.loadData();
        this.events.subscribe('reload-meeting-detail', () => {
            this.loadData();
        })
    }



    loadData() {
        this.vote = this.jbcnService.getVote(this.meeting.id);
        this.jbcnService.load().then(data => {
            this.speakers = [];
            for(var i=0; i<this.meeting.speakers.length; i++) {
                let ref = this.meeting.speakers[i];
                let speaker = data.speakersRef[ref];
                this.speakers.push(speaker);
            }
        });
        this.jbcnService.loadComments(this.meeting.id).then(comments => {
            this.comments = comments;
            this.calcAverage();
        }, error => {
            this.comments = this.jbcnService.getComments(this.meeting.id);
            this.calcAverage();
        });
    }
    
    calcAverage() {
        let sum = 0;
        for(let comment of this.comments) {
            sum += comment.vote;
        }
        this.vote = sum / this.comments.length;
    }

    goToSpeakerDetail(speaker) {
        this.nav.push(SpeakerDetailPage, speaker);
        //Try to check comments
    }
    
    voteMeeting(meeting,n) {
        this.vote=n;
        this.jbcnService.voteMeeting(meeting.id, n).then(voteMeeting => {
            this.meeting.voteMeeting = voteMeeting;
            this.jbcnService.storeVote(meeting.id, this.vote);
        });
    }

    openCommentMeetingPage() {
        this.nav.push(MeetingCommentPage, this.meeting);
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

    getIconVote(n, m) {
        if(n<=m) {
            return 'heart';
        } else {
            return 'heart-outline';
        }
    }
}