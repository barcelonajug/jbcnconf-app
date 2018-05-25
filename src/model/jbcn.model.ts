export class Speaker {
    name: string;
    description: string;
    biography: string;
    image: string;
    ref: string;
    twitter: string;
    meetingRef: string;
    isFavorite: boolean;
}

export class Meeting {
    id: string;
    title: string;
    about: string;
    speakers: Array<string>;
    abstract: string;
    tags: Array<string>;
    level: string;
    type: string;
    visible: boolean;
    location: string;
    session: string;
    track: string;
    timeStart: number;
    timeEnd: number;
    isFavorite:boolean;
    scheduleId: string;
    vote: number;
}

export class SpeakerRaw {
     enabled: number;
      name: string;
      description: string;
      biography: string;
      image: string;
      ref: string;
      url: string;
      twitter: string;
      homepage: string;
}

export class TalkRaw {
    type: string;
    title: string;
    abstract: string;
    tags: Array<string>;
    level: string;
    video: string;
    scheduleId: string;
    speakers: Array<string>;
}

//  0 Name:Jonathan_Vila;
//  1 Country:Spain;
//  2 City:Barcelona;
//  3 Company:Ocado;
//  4 Level:Senior;
//  5 Languages:Java;
//  6 Email:jonathan@barcelonajug.org
export class Contact {
    name: string;
    country: string;
    city: string;
    company: string;
    level: string;
    programLanguages: string;
    email: string;
}