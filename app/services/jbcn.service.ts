import {Injectable, Inject} from '@angular/core';
import {Http} from '@angular/http';
import {Device} from 'ionic-native';
import 'rxjs/Rx';
import { FirebaseRef } from 'angularfire2';

var jbcnData;
var favorites;

const firebaseUrl ="https://jbcnconf.firebaseio.com";

var dayTimes = {
    "THU": "2016-06-16",
    "FRI": "2016-06-17",
    "SAT": "2016-06-18"
}

var seasonsTimes = {
    "THU": {
        "SE1": { "timeStart": "14:30", "timeStop": "16:30" },
        "SE2": { "timeStart": "16:45", "timeStop": "18:45" }
    },
    "FRI": {
        "SE1": { "timeStart": "11:00", "timeStop": "11:50" },
        "SE2": { "timeStart": "12:00", "timeStop": "12:50" },
        "SE3": { "timeStart": "14:00", "timeStop": "14:30" },
        "SE4": { "timeStart": "14:35", "timeStop": "15:25" },
        "SE5": { "timeStart": "15:35", "timeStop": "16:25" },
        "SE6": { "timeStart": "16:55", "timeStop": "17:45" },
        "SE7": { "timeStart": "17:55", "timeStop": "18:45" }
    },
    "SAT": {
        "SE1": { "timeStart": "9:00", "timeStop": "9:50" },
        "SE2": { "timeStart": "10:00", "timeStop": "10:50" },
        "SE3": { "timeStart": "11:20", "timeStop": "12:10" },
        "SE4": { "timeStart": "12:20", "timeStop": "13:10" },
        "SE5": { "timeStart": "14:25", "timeStop": "15:15" },
        "SE6": { "timeStart": "15:25", "timeStop": "16:15" },
        "SE7": { "timeStart": "16:45", "timeStop": "17:35" }
    }
};

@Injectable()
export class JbcnService {

    json: string;
    schedule;
    speakers;
    tags;

    constructor(private http: Http, @Inject(FirebaseRef) private ref: Firebase) {
        this.http = http;
        this.tags = [];
    }

    ngOnInit() {
        
    }

    getFavorites() {
        if (favorites) {
            return Promise.resolve(favorites);
        } else {
            return this.loadFavorites();
        }
    }
    addFavorite(meeting) {
        favorites[meeting.id] = meeting;
        this.saveFavorites();
    }
    removeFavorite(meeting) {
        delete favorites[meeting.id];
        this.saveFavorites();
    }

    isFavorite(id) {
        return favorites.hasOwnProperty(id);
    }

    saveFavorites() {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    loadFavorites() {
        if (localStorage.getItem("favorites")) {
            let favoritesStr = localStorage.getItem("favorites");
            favorites = JSON.parse(favoritesStr);
        } else {
            favorites = {};
            this.saveFavorites();
        }
        return favorites;
    }
    
    voteMeeting(meetingId, vote) {
        let voteInfo = {"meetingId":meetingId, "vote":vote, "uuid":Device.device.uuid};
        let meetingVotes = this.getMeetingVotes();
        this.pushVote(Device.device.uuid, meetingId, vote);
        meetingVotes[Device.device.uuid+"_"+meetingId]=voteInfo;
        this.saveMeetingVotes(meetingVotes);
    }
    
    getMeetingVote(meetingId) {
        let meetingVotes = this.getMeetingVotes();
        let result = 0;
        if(meetingVotes[Device.device.uuid+"_"+meetingId]) {
            result = meetingVotes[Device.device.uuid+"_"+meetingId];
        }
        return result; 
    }
    
    saveMeetingVotes(meetingVotes) {
        localStorage.setItem("meetingVotes", JSON.stringify(meetingVotes));
    }
    
    getMeetingVotes() {
        let meetingVotes = {};
        if(localStorage.getItem("meetingVotes")) {
            let meetingVotesStr = localStorage.getItem("meetingVotes");
            meetingVotes = JSON.parse(meetingVotesStr);
        } 
        return meetingVotes;
    }


    processJson(json) {
        let data: any = {}
        data.speakers = [];
        data.speakersRef = {};
        let meetingId = 100;
        data.schedule = [];
        let processed = {};
        let days = {
            "THU":{
                "date": Date.parse("2016-06-16"),
                "meetings":[]
            },
            "FRI":{
                "date": Date.parse("2016-06-17"),
                "meetings":[]
            },
            "SAT":{
                "date": Date.parse("2016-06-18"),
                "meetings":[]
            }
        };

        let tagArray = [];
        this.tags = [];
        for (var i = 0; i < json.speakers.length; i++) {
            let speaker = json.speakers[i];
            let item = {};
            item['name'] = speaker.name;
            item['description'] = speaker.description;
            item['biography'] = speaker.biography;
            item['image'] = speaker.image;
            item['ref'] = speaker.ref;
            item['twitter'] = speaker.twitter;
            data.speakers[i] = item;
            data.speakersRef[item['ref']] = item;


            let talk = speaker.talk;
            if (!processed[speaker.scheduleId]) {
                let meeting = {};
                meeting['title'] = talk.title;
                meeting['about'] = talk.abstract;
                meeting['location'] = 'Location 1';
                meeting['speakers'] = [speaker.ref];
                if (speaker.cospeakerref) {
                    meeting['speakers'].push(speaker.cospeakerref);
                }
                meeting['tags'] = talk.tags;

                for (let iTag = 0; iTag < talk.tags.length; iTag++) {
                    let tag = talk.tags[iTag];
                    if (tagArray.indexOf(tag) == -1) this.tags.push(tag);
                }
                meeting['level'] = talk.meeting;
                meeting['type'] = 'talk';
                meeting['visible'] = true;
                meeting['id'] = speaker.scheduleId;

                processed[meeting['id']] = true;
                let day = meeting['id'].substring(1, 4);
                let track = meeting['id'].substring(7, 8);
                let session = meeting['id'].substring(9, 12);
                meeting['id'] = speaker.scheduleId.substring(1);
                meeting['track'] = track;
                meeting['timeStart'] = Date.parse(dayTimes[day]+" "+seasonsTimes[day][session]["timeStart"]);
                meeting['timeEnd'] = Date.parse(dayTimes[day]+" "+seasonsTimes[day][session]["timeStop"]);
                days[day].meetings.push(meeting);
                
                this.tags = tagArray.sort();
            }
            

        }
        data.tags = this.tags;
        data.schedule.push(days["THU"]);
        data.schedule.push(days["FRI"]);
        data.schedule.push(days["SAT"]);
        
        //Reorder meetings
        
        for (let iDay = 0; iDay < data.schedule.length; iDay++) {
            let day = data.schedule[iDay];
            for (let iMeeting = 0; iMeeting < day.meetings.length; iMeeting++) {
                let meeting = day.meetings[iMeeting];
                meeting.ref = iMeeting;
                for (let iSpeaker = 0; iSpeaker < meeting.speakers.length; iSpeaker++) {
                    let meetingSpeaker = meeting.speakers[iSpeaker];
                    for (let iRealSpeaker = 0; iRealSpeaker < data.speakers.length; iRealSpeaker++) {
                        let realSpeaker = data.speakers[iRealSpeaker];
                        if (realSpeaker.ref == meetingSpeaker) {
                            realSpeaker.meetingRef = meeting.ref;
                            break;
                        }
                    }
                }
            }
            //Reorder meetings
            day.meetings.sort(function(a,b) {
                if(a.timeStart > b.timeStart) {
                    return 1;
                } 
                if(a.timeStart < b.timeStart) {
                    return -1;
                }
                if(a.timeStart == b.timeStart) {
                    if(a.track > b.track) {
                        return 1;
                    } else {
                        return -1;
                    }
                    
                }
            });
        }
        this.schedule = data.schedule;
        this.speakers = data.speakers;

        return data;
    }

    load() {
        if (jbcnData) {
            return Promise.resolve(jbcnData);
        }

        // don't have the data yet
        return new Promise(resolve => {
            this.http.get('data/speakers.json').subscribe(res => {
                jbcnData = this.processJson(res.json());
                resolve(jbcnData);
            });
        });
    }

    getTags() {
        return this.tags;
    }

    pushVote(uuid, meetingId, vote) {
        if(!uuid) {
            uuid = new Date().getTime();
        }

        let voteInfo = {"meetingId":meetingId, "vote":vote, "uuid":uuid};

        this.ref.child("/vote/"+uuid+"/"+meetingId).set(voteInfo)
        .then((data) => console.debug(JSON.stringify(data)))
        .catch((error) => console.debug(JSON.stringify(error)));

        
        //return this.http.put(firebaseUrl+"/vote/"+uuid+"/"+meetingId+"/vote.json", JSON.stringify(voteInfo))
        //.map(response => response.json);
    }

    pullVote(uuid, meetingId) {
        return this.http.get(firebaseUrl+"/vote/"+uuid+"/"+meetingId+"/vote.json")
            .map(response => response.json);
    }
}