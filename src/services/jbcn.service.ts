import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Device } from 'ionic-native';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Platform } from 'ionic-angular';
//import { data } from './data';
import { speakers, meetings } from './data'
import { Speaker, Meeting, SpeakerRaw, TalkRaw, Contact } from '../model/jbcn.model';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const config = {
    apiUrl: 'https://jbcnconf.joseguitart.pro'
    //apiUrl: 'http://localhost:8080'
};

const dayTimes = {
    'MON': '2017/06/19',
    'TUE': '2017/06/20',
    'WED': '2017/06/21'
};

const seasonsTimes = {
    'MON': {
        'SE1': { 'timeStart': '09:40', 'timeStop': '10:30' },
        'SE2': { 'timeStart': '11:10', 'timeStop': '12:00' },
        'SE3': { 'timeStart': '12:10', 'timeStop': '13:00' },
        'SE4': { 'timeStart': '14:15', 'timeStop': '15:05' },
        'SE5': { 'timeStart': '15:15', 'timeStop': '16:05' },
        'SE6': { 'timeStart': '16:45', 'timeStop': '17:35' },
        'SE7': { 'timeStart': '17:40', 'timeStop': '18:35' }
    },
    'TUE': {
        'SE1': { 'timeStart': '9:00', 'timeStop': '9:50' },
        'SE2': { 'timeStart': '10:00', 'timeStop': '10:50' },
        'SE3': { 'timeStart': '11:30', 'timeStop': '12:20' },
        'SE4': { 'timeStart': '12:30', 'timeStop': '13:20' },
        'SE5': { 'timeStart': '14:35', 'timeStop': '15:25' },
        'SE6': { 'timeStart': '15:35', 'timeStop': '16:25' },
        'SE7': { 'timeStart': '17:05', 'timeStop': '17:55' },
        'SE8': { 'timeStart': '18:00', 'timeStop': '18:30' }
    },
    'WED': {
        'SE1': { 'timeStart': '09:00', 'timeStop': '11:00' },
        'SE2': { 'timeStart': '11:30', 'timeStop': '13:30' }
    }
};

const locations = {
    'MON': {
        '1': 'Room #1',
        '2': 'Room #2',
        '3': 'Room #3',
        '4': 'Room #4'
    },
    'TUE': {
        '1': 'Room #1',
        '2': 'Room #2',
        '3': 'Room #3',
        '4': 'Room #4'
    },
    'WED': {
        '1': 'Room Paris',
        '2': 'Room Barcelona',
        '3': 'Room Amsterdam',
        '4': 'Room Londres'
    }
};

@Injectable()
export class JbcnService {

    jbcnData: any;
    schedule: any;
    speakers: any;
    tags: any;
    contacts: Array<Contact>;

    constructor(private http: Http, private platform: Platform, private localNotifications: LocalNotifications) {

    }

    processJson(speakers, talks) {
        let data: any = {}
        data.speakers = [];
        data.speakersRef = {};
        data.schedule = [];
        let processed = {};
        let days = {
            'MON': {
                'date': Date.parse('2017-06-19'),
                'meetings': []
            },
            'TUE': {
                'date': Date.parse('2017-06-20'),
                'meetings': []
            },
            'WED': {
                'date': Date.parse('2017-06-21'),
                'meetings': []
            }
        };

        let tagArray = [];
        this.tags = [];

        for (var i = 0; i < speakers.length; i++) {
            let speaker: SpeakerRaw = speakers[i];
            let item: Speaker = new Speaker();
            item.name = speaker.name;
            item.description = speaker.description;
            item.biography = speaker.biography;
            item.image = speaker.image;
            item.ref = speaker.ref;
            item.twitter = speaker.twitter;
            data.speakers[i] = item;
            data.speakersRef[item.ref] = item;
        }

        for (let i = 0; i < talks.length; i++) {
            let talk: TalkRaw = talks[i];
            let meeting: Meeting = new Meeting();
            meeting.title = talk.title;
            meeting.abstract = talk.abstract;
            meeting.type = talk.type;
            meeting.tags = talk.tags;
            meeting.level = talk.level;
            meeting.id = talk.scheduleId;
            meeting.visible = true;
            meeting.speakers = talk.speakers;

            for(let tag of talk.tags) {
                if(tagArray.indexOf(tag) == -1) this.tags.push(tag);
            }

            if (meeting.scheduleId === '#Sat-Keynote') {
                meeting.id = '#SAT-TC0-SE7';
            }

            if (meeting.scheduleId === '#Fri-Keynote') {
                meeting.id = '#FRI-TC0-SE0';
            }

            if (meeting.id && meeting.id !== '') {
                let day = this.getMeetingDay(meeting.id);
                let track = this.getMeetingTrack(meeting.id);
                let session = this.getMeetingSession(meeting.id);

                meeting.location = locations[day][track];
                meeting.session = meeting.id.substring(11, 12);
                meeting.id = meeting.id.substring(1);
                meeting.track = track;
                let timeStartStr = dayTimes[day] + ' ' + seasonsTimes[day][session]['timeStart'];
                meeting.timeStart = Date.parse(timeStartStr);
                meeting.timeEnd = Date.parse(dayTimes[day] + ' ' + seasonsTimes[day][session]['timeStop']);
                days[day].meetings.push(meeting);
                this.tags = tagArray.sort();
                processed[meeting.id] = true;
            }

        }
        data.tags = this.tags;
        data.schedule.push(days['MON']);
        data.schedule.push(days['TUE']);
        data.schedule.push(days['WED']);

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

    unfavoriteAllInSeason(id: string) {
        if(id) {
            let tokens = id.split('-');
            if(tokens && tokens.length == 3) {
                for (var i = 0; i < localStorage.length; i++) {
                    let key = localStorage.key(i);
                    if(key.startsWith(tokens[0]) && key.endsWith(tokens[2])) {
                        localStorage.setItem(key, 'false');
                        this.clearNotifications(key);
                    }
                }
            }
        }
    }    

    switchFavorite(meeting: Meeting) {
        let favoriting = localStorage.getItem(meeting.id);
        if (!favoriting || favoriting === 'false') {
            this.unfavoriteAllInSeason(meeting.id);
            favoriting = 'true';
        } else {
            favoriting = 'false';
        }
        localStorage.setItem(meeting.id, favoriting);
        if (this.platform.is('ios') || this.platform.is('android')) {
            if (favoriting === 'true') {
                let notificationId = new Date().getTime();
                this.localNotifications.schedule({
                    id: notificationId,
                    title: 'Your favorite talk will start in 10 mintues!',
                    text: meeting.title,
                    data: { 'id': meeting.id },
                    at: new Date(meeting.timeStart - (1000 * 60 * 10))
                });
            } else {
                this.clearNotifications(meeting.id);
            }
        }

    }

    clearNotifications(id: string) {
        this.localNotifications.getAll().then((notifications) => {
            for (let notification of notifications) {
                let notification_data = JSON.parse(notification.data);
                if (notification_data['id'] === id) {
                    this.localNotifications.cancel(notification.id);
                    this.localNotifications.clear(notification.id);
                    break;
                }
            }
        });
    }

    isFavorite(id: string) {
        return localStorage.getItem(id) === 'true';
    }

    private getMeetingDay(id: string): string {
        let day = id.substring(1, 4);
        return day;
    }

    private getMeetingTrack(id: string): string {
        let track = id.substring(7, 8);
        return track;
    }

    private getMeetingSession(id: string): string {
        let session = id.substring(9, 12);
        return session;
    }




    load() {
        if (this.jbcnData) {
            console.debug('Recovering from memory');
            return Promise.resolve(this.jbcnData);
        }

        /* 
        if (localStorage.getItem('localData') !== null) {
            console.debug('Recovering from localStorage');
            this.jbcnData = JSON.parse(localStorage.getItem('localData'));
            return Promise.resolve(this.jbcnData);
        }
        */

        
        this.jbcnData = this.processJson(speakers, meetings);
        //localStorage.setItem('localData', JSON.stringify(this.jbcnData));
        return Promise.resolve(this.jbcnData);

    }



    voteMeeting(id: string, vote: number) {
        return new Promise((resolve, reject) => {
            let deviceId = this.getDeviceId();

            this.http.get(`http://localhost:8080/jbcn/2017/talk/${id}/vote/${deviceId}/${vote}`, {})
                .subscribe(response => {
                    let json = response.json();
                    resolve(json['voteAverage']);
                }, error => {
                });
        });
    }

    getDeviceId() {
        let result = Device.uuid;
        if (!result) {
            if (localStorage.getItem('deviceId') !== null) {
                result = localStorage.getItem('deviceId');
            } else {
                result = 'jbcnToken' + new Date().getDate();
                localStorage.setItem('deviceId', result);
            }
        }
        return result;
    }

    registerToken() {
        return new Promise((resolve, reject) => {
            let token = 'token_' + new Date().getTime(); //TODO: Cambiar esta parte para que el token sea válido.
            let deviceId = this.getDeviceId();
            let params = { 'token': token, 'deviceId': deviceId };
            this.http.post(config.apiUrl + '/jbcn/2017/push', params).subscribe(response => {

            }, error => {

            });
        });
    }

    getVote(meetingId: string): number {
        const id = 'vote-' + meetingId;
        return parseInt(localStorage.getItem(id));
    }

    storeVote(meetingId: string, vote: number) {
        const id = 'vote-' + meetingId;
        localStorage.setItem(id, vote.toString());
    }

    getComments(meetingId: string) {
        let result = [];
        const jsonstr = localStorage.getItem('comments-'+meetingId);
        if(jsonstr) {
            result = JSON.parse(jsonstr);
        }
        return result;
    }

    loadComments(meetingId: string) {
        return new Promise((resolve, reject) => {
            this.http.get(config.apiUrl + `/jbcn/2017/talk/${meetingId}/comment`)
            .map(response => response.json())
            .subscribe(response => {
                if (response['status']) {
                    resolve(response.comments);
                } else {
                    reject(response.error);
                }
            }, error => {
                reject(error);
            });
        });
    }

    storeComments(meetingId: string, comments: Array<any>) {
        localStorage.setItem('comments-'+meetingId, JSON.stringify(comments));
    }

    storeUserComment(meetingId, vote, name, comment) {
        let userComment = {
            vote: vote,
            name: name,
            comment: comment
        };
        localStorage.setItem('user-comment-'+meetingId, JSON.stringify(userComment));
    }

    getUserComment(meetingId) {
        let result = null;
        const json = localStorage.getItem('user-comment-'+meetingId);
        if(json) {
            result = JSON.parse(json);
        }
        return result;
    }

    sendComment(meetingId: string, vote: number, name: string, comment: string) {
        const deviceId = this.getDeviceId();
        return new Promise((resolve, reject) => {
            const params = {
                talkId: meetingId,
                deviceId: deviceId,
                vote: vote,
                name: name,
                text: comment
            };
            this.http.post(config.apiUrl+'/jbcn/2017/talk/comment', params).subscribe(response => {
                if(response['status']) {
                    this.storeVote(meetingId, response.json().averageVote);
                    this.storeUserComment(meetingId, vote, name, comment);
                    resolve(response);
                } else {
                    reject(response['error']);
                }
                
            }, error => {
                reject(error);
            });
        });
    }

    addContact(contact: Contact) {
        let contacts = this.getContacts();
        let b = false;
        for(let contactStored of contacts) {
            b = contactStored.languages === contact.languages && 
                contactStored.name === contact.name &&
                contactStored.email === contact.email &&
                contactStored.position === contact.position &&
                contactStored.programLanguages === contactStored.programLanguages;
            if(b) break;
        }
        if(!b) {
            contacts.push(contact);
            this.saveContacts(contacts);
        }
    }

    getContacts() {
        if(!this.contacts) {
            let json = localStorage.getItem('contacts');
            if(!json) {
                this.contacts = [];
                this.saveContacts(this.contacts);
            } else {
                this.contacts = JSON.parse(json);
            }
        }
        return this.contacts;
    }

    saveContacts(contacts: Array<Contact>) {
        this.contacts = contacts;
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }

    removeContact(contact: Contact) {
        let contacts = this.getContacts();
        const index = contacts.indexOf(contact);
        if(index > -1) {
            contacts.splice(index,1);
        }
        this.saveContacts(contacts);
    }

    parseContact(csv: string): Contact {
        const tokens = csv.split(';');
        let contact = new Contact();
        contact.languages = tokens[0];
        contact.name = tokens[1];
        contact.email = tokens[2];
        contact.position = tokens[3];
        contact.programLanguages = tokens[4];
        return contact;
        
    }

}