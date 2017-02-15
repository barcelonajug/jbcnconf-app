import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import { Device } from 'ionic-native';
import { data } from './data';
import 'rxjs/Rx';


const dayTimes = {
    "THU": "2016-06-16",
    "FRI": "2016-06-17",
    "SAT": "2016-06-18"
};

const seasonsTimes = {
    "THU": {
        "SE1": { "timeStart": "15:00", "timeStop": "17:00" },
        "SE2": { "timeStart": "17:00", "timeStop": "19:00" }
    },
    "FRI": {
        "SE0": { "timeStart": "9:40", "timeStop": "10:30" },
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

const locations = {
    "THU": {
        "1": "Room 20.019",
        "2": "Room 20.017",
        "3": "Room 20.023",
        "4": "Room 20.027"
    },
    "FRI": {
        "0": "Auditorium",
        "1": "Room 40.002",
        "2": "Room 40.004",
        "3": "Room 40.006",
        "4": "Room 40.008"
    },
    "SAT": {
        "0": "Auditorium",
        "1": "Room 20.019",
        "2": "Room 20.021",
        "3": "Room 20.023",
        "4": "Room 20.027"
    }
};

@Injectable()
export class JbcnService {

    jbcnData:any;
    schedule: any;
    speakers : any;
    tags: any;
    constructor(private http: Http) {

    }

    processJson(json) {
        let data: any = {}
        data.speakers = [];
        data.speakersRef = {};
        let meetingId = 100;
        data.schedule = [];
        let processed = {};
        let days = {
            "THU": {
                "date": Date.parse("2016-06-16"),
                "meetings": []
            },
            "FRI": {
                "date": Date.parse("2016-06-17"),
                "meetings": []
            },
            "SAT": {
                "date": Date.parse("2016-06-18"),
                "meetings": []
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
            
            let talk = speaker.talk;
            if (!processed[speaker.scheduleId]) {
                let meeting = {};
                meeting['title'] = talk.title;
                meeting['about'] = talk.abstract;
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

                if (speaker.scheduleId == "#Sat-Keynote") {
                    meeting['id'] = "#SAT-TC0-SE7";
                    console.debug("Cambiado");
                }

                if (speaker.scheduleId == "#Fri-Keynote") {
                    meeting['id'] = "#FRI-TC0-SE0";
                    console.debug("Cambiado");
                }


                processed[meeting['id']] = true;
                let day = meeting['id'].substring(1, 4);
                let track = meeting['id'].substring(7, 8);
                let session = meeting['id'].substring(9, 12);
                meeting['location'] = locations[day][track];
                meeting['session'] = meeting['id'].substring(11, 12);
                meeting['id'] = speaker.scheduleId.substring(1);
                meeting['track'] = track;
                meeting['timeStart'] = Date.parse(dayTimes[day] + " " + seasonsTimes[day][session]["timeStart"]);
                meeting['timeEnd'] = Date.parse(dayTimes[day] + " " + seasonsTimes[day][session]["timeStop"]);
                item['meetingRef']=meeting['id'];
                days[day].meetings.push(meeting);
                this.tags = tagArray.sort();

            }
            
            data.speakers[i] = item;
            data.speakersRef[item['ref']] = item;
            processed[speaker.scheduleId]=true;


        }
        data.tags = this.tags;
        data.schedule.push(days["THU"]);
        data.schedule.push(days["FRI"]);
        data.schedule.push(days["SAT"]);

        //Reorder meetings

        for (let iDay = 0; iDay < data.schedule.length; iDay++) {
            let day = data.schedule[iDay];
            //Reorder meetings
            day.meetings.sort(function (a, b) {
                if (a.timeStart > b.timeStart) {
                    return 1;
                }
                if (a.timeStart < b.timeStart) {
                    return -1;
                }
                if (a.timeStart == b.timeStart) {
                    if (a.track > b.track) {
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
        if (this.jbcnData) {
            console.debug("Recovering from memory");
            return Promise.resolve(this.jbcnData);
        }

        if (localStorage.getItem("localData") !== null) {
            console.debug("Recovering from localStorage");
            this.jbcnData = JSON.parse(localStorage.getItem("localData"));
            return Promise.resolve(this.jbcnData);
        }

        // don't have the data yet
        /* return new Promise(resolve => {
            this.http.get('http://www.jbcnconf.com/2016/assets/json/speakers.json').subscribe(
                res => {
                    console.debug("Recovering from remote json");
                    this.jbcnData = this.processJson(res.json());
                    localStorage.setItem("localData", JSON.stringify(this.jbcnData));
                    resolve(this.jbcnData);
                }, error => {
                    this.http.get("data/speakers.json").subscribe(res => {
                        console.debug("Recovering from local json");
                        this.jbcnData = this.processJson(res.json());
                        localStorage.setItem("localData", JSON.stringify(this.jbcnData));
                        resolve(this.jbcnData);
                    })
                });
        }); */
        console.log("Data from import ts:",data);
        this.jbcnData = this.processJson(data);
        console.log("DAta processed:",this.jbcnData);
        //localStorage.setItem("localData", JSON.stringify(this.jbcnData));
        return Promise.resolve(this.jbcnData);
        
    }

}