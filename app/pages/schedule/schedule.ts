import {Page,NavController} from 'ionic-angular';
import {JbcnService} from '../../services/jbcn.service';
import {MeetingDetail} from '../meeting-detail/meeting-detail';

@Page({
  templateUrl: 'build/pages/schedule/schedule.html',
  providers:[JbcnService]
})
export class Schedule {
    schedule = [];
    jbcnService;
    favorites;
    nav;
    tracks;
    tags;
    search;
    
    constructor(jbcnService:JbcnService, nav:NavController) {
        this.nav = nav;
        this.jbcnService = jbcnService;
        this.jbcnService.load().then(data => {
            this.schedule = data.schedule;
            this.tags = data.tags;
        });
        
        this.favorites = this.jbcnService.getFavorites();
        this.tracks="all";
        this.search = {day:'',track:-1,tag:''}
        this.applyFilters();
    }
    
    favoriteIcon(meeting) {
        if(this.jbcnService.isFavorite(meeting.id)) {
            return "star";
        } else {
            return "star-outline";
        }
    }
    
    goToMeetingDetail(meeting) {
        this.nav.push(MeetingDetail, meeting);
    }
    
    switchFavorite(meeting, evt) {
        evt.stopPropagation();
        if(this.jbcnService.isFavorite(meeting.id)) {
            this.jbcnService.removeFavorite(meeting);
        } else {
            this.jbcnService.addFavorite(meeting);
        }
        this.favorites = this.jbcnService.getFavorites();
    }
    
    clearFilters() {
        this.search = {day:'',track:-1,tag:''}
        this.applyFilters();
    }
    
    filterByTag(evt, tag) {
        evt.preventDefault();
        evt.stopPropagation();
        this.tracks = 'filter';
        this.search = {day:'',track:-1,tag:tag};
        this.applyFilters();
    }
    
    countVisibleMeetings(day) {
        let counter = 0;
        for(var j=0; j<day.meetings.length; j++) {
            if(day.meetings[j].visible) counter++;
        }
        return counter;
    }
    
    applyFilters() {
        for(var i=0; i<this.schedule.length; i++) {
            var day = this.schedule[i];
            for(var j=0; j<day.meetings.length; j++) {
                if(this.tracks == 'all') {
                    day.meetings[j].visible = true;    
                }                
                if(this.tracks == 'mytracks') {
                    day.meetings[j].visible = this.jbcnService.isFavorite(day.meetings[j].id);
                }
                if(this.tracks == 'filter') {
                    let applyDayFilter = this.search.day != '';
                    let applyTrackFilter = this.search.track >-1;
                    let applyTagFilter = this.search.tag != '';

                    day.meetings[j].visible = (
                        (!applyDayFilter || Date.parse(this.search.day)==day.date) && 
                        (!applyTrackFilter ||day.meetings[j].track == this.search.track) &&
                        (!applyTagFilter || day.meetings[j].tags.indexOf(this.search.tag)>-1)
                    );
                }
            }
        }
        if(this.tracks == 'all') {
            
        }
        if(this.tracks=='mytracks') {
           
        }
    }
}
