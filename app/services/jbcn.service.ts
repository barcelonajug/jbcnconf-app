import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

var jbcnData;
var favorites;

@Injectable()
export class JbcnService {

    http: Http;
    json: string;
    schedule;
    tags;



    constructor(http: Http) {
        this.http = http;
        this.tags = [];
    }
    
    getFavorites() {
        if(favorites) {
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
        localStorage.setItem("favorites",JSON.stringify(favorites));
    }
    
    loadFavorites() {
        if(localStorage.getItem("favorites")) {
            let favoritesStr = localStorage.getItem("favorites");
            favorites = JSON.parse(favoritesStr);
        } else {
            favorites = {};
            this.saveFavorites();
        }
        return favorites;
    }
    

    processJson(json) {
        console.debug("Processing json");
        let data:any = {}
        data.speakers=[];
        data.speakersRef={};
        let meetingId = 100;
        data.schedule=[];
        let processed = {};
        let day1 = {
            "date": Date.parse("2016-06-16"),
            "meetings":[]
        };
        
        let tagArray = [];
        this.tags = [];
        for(var i=0; i<json.speakers.length; i++) {
            let speaker = json.speakers[i];
            let item = {};
            item['name'] = speaker.name;
            item['description']=speaker.description;
            item['biography']=speaker.biography;
            item['image']=speaker.image;
            item['ref']=speaker.ref;
            item['twitter']=speaker.twitter;
            data.speakers[i] = item;
            data.speakersRef[item['ref']] = item;
            
            
            let talk = speaker.talk;
            if(!processed[talk.title]) {
                let meeting = {};
                meeting['timeStart'] = Date.parse("2017-06-16 10:00");
                meeting['timeEnd'] = Date.parse("2017-06-16 11:00");
                meeting['title']=talk.title;
                meeting['about']=talk.abstract;
                meeting['location']='Location 1';
                meeting['track']=(i%4)+1;
                meeting['speakers']=[speaker.ref];
                if(speaker.cospeakerref) {
                    meeting['speakers'].push(speaker.cospeakerref);
                }
                meeting['tags']=talk.tags;
                
                for(let iTag=0; iTag<talk.tags.length; iTag++) {
                    let tag = talk.tags[iTag];
                    if(tagArray.indexOf(tag)==-1) this.tags.push(tag);
                }
                
                meeting['level']=talk.meeting;
                meeting['type']='talk';
                meeting['visible'] = true;
                meeting['id']=meetingId;
                processed[meeting['title']] = true;
                meetingId++;
                day1.meetings.push(meeting); 
                this.tags = tagArray.sort();   
            }
            
        }
        data.tags = this.tags;
        data.schedule.push(day1);
        return data;
    }

    load() {
        if (jbcnData) {
            return Promise.resolve(jbcnData);
        }

        // don't have the data yet
        return new Promise(resolve => {
            this.http.get('data/speakers.orig.json').subscribe(res => {
                jbcnData = this.processJson(res.json());
                resolve(jbcnData);
            });
        });
    }
    
    getTags() {
        return this.tags;    
    }

}