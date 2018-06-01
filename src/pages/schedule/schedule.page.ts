import { Component } from '@angular/core';
import { JbcnService } from '../../services/jbcn.service';
import { NavController } from 'ionic-angular';
import { MeetingDetailPage } from '../meeting-detail/meeting-detail.page';

@Component({
    selector: 'page-home',
    templateUrl: 'schedule.page.html'
})
export class SchedulePage {

    tracks: any = "all";
    schedule: any = [];
    tags: any;
    search: any;

    constructor(public navCtrl: NavController, private jbcnService: JbcnService) {
        this.jbcnService.load().then(data => {
            this.schedule = data.schedule;
            this.tags = data.tags;
        });
        this.search = { day: '', track: -1, tag: '' };
        this.applyFilters();
    }

    countVisibleMeetings(day) {
        let counter = 0;
        for (var j = 0; j < day.meetings.length; j++) {
            if (day.meetings[j].visible) counter++;
        }
        return counter;
    }

    goToMeetingDetail(meeting) {
        this.navCtrl.push(MeetingDetailPage, meeting);
    }

    apply(track) {
        this.tracks = track;
        this.applyFilters();
    }

    favoriteIcon(meeting) {
        if (this.jbcnService.isFavorite(meeting.id)) {
            return "star";
        } else {
            return "star-outline";
        }
    }

    switchFavorite(meeting, $event) {
        this.jbcnService.switchFavorite(meeting);
        meeting.isFavorite = this.jbcnService.isFavorite(meeting);
    }

    applyFilters() {
        let date = new Date();
        for (var i = 0; i < this.schedule.length; i++) {
            var day = this.schedule[i];
            for (var j = 0; j < day.meetings.length; j++) {
                if (this.tracks == 'all') {
                    day.meetings[j].visible = true;
                }
                if (this.tracks == 'mytracks') {
                    day.meetings[j].visible = this.jbcnService.isFavorite(day.meetings[j].id);
                }
                if (this.tracks == 'filter') {
                    let applyDayFilter = this.search.day != '';
                    let applyTrackFilter = this.search.track > -1;
                    let applyTagFilter = this.search.tag != '';
                    day.meetings[j].visible = (
                        (!applyDayFilter || Date.parse(this.search.day) == day.date) &&
                        (!applyTrackFilter || day.meetings[j].track == this.search.track) &&
                        (!applyTagFilter || day.meetings[j].tags.indexOf(this.search.tag) > -1)
                    );
                }
            }
        }
    }

    filterByTag(evt: Event, tag) {
        evt.preventDefault();
        evt.stopPropagation();
        this.search.day = '';
        this.search.track = -1;
        this.search.tag = tag;
        this.tracks='filter';
        this.applyFilters();
    }

    filterByTrack(evt: Event, track) {
        evt.preventDefault();
        evt.stopPropagation();
        this.search.day = '';
        this.search.track = track;
        this.search.tag = '';
        this.tracks='filter';
        this.applyFilters();
    }

}
