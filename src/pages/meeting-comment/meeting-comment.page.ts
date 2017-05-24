import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { JbcnService } from '../../services/jbcn.service';
@Component({
    selector: 'app-meeting-comment-page',
    templateUrl: 'meeting-comment.page.html'
})

export class MeetingCommentPage implements OnInit {

    private meeting;

    private vote = 0;
    private name = '';
    private comment = '';

    constructor(private nav: NavController, private navParams: NavParams,
        private jbcnService: JbcnService, private events: Events) { }

    ngOnInit() {
        this.meeting = this.navParams.data;
        const usercomment = this.jbcnService.getUserComment(this.meeting.id);
        if (usercomment) {
            this.vote = usercomment.vote;
            this.name = usercomment.name;
            this.comment = usercomment.comment;
        }
    }

    goBack() {
        this.nav.pop();
    }

    getIcon(n) {
        if (n <= this.vote) {
            return 'heart';
        } else {
            return 'heart-outline';
        }
    }

    setVote(vote: number) {
        this.vote = vote;
        console.log(this.vote);
    }

    save() {
        if (this.name && this.comment) {
            this.jbcnService.sendComment(this.meeting.id, this.vote, this.name, this.comment).then(response => {
                this.events.publish('reload-meeting-detail');
                this.nav.pop();
            }, error => {
                console.log(error);

            });
        }

    }
}