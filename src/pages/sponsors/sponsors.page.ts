import { Component } from '@angular/core';
import { sponsors } from '../../services/sponsors';


const voidSponsor = {
    'name': '',
    'href': '',
    'image': {
        'src': '',
        'alt': ''
    }
};

@Component({
    selector: 'sponsors',
    templateUrl: 'sponsors.page.html'
})
export class SponsorsPage {

    private sponsors: any;

    constructor() {
        this.sponsors = sponsors;
    }

    openSponsor(url, evt) {
        console.debug('opening sponsor');
        window.open(url);
    }

    getGoldSponsors() {
        console.log('get gold sponsors');
        let rows = [];
        console.log(this.sponsors.gold.length);
        for (let i = 0; i < this.sponsors.gold.length; i = i + 2) {
            let row = [];
            if (i + 1 < this.sponsors.gold.length) {
                row = [this.sponsors.gold[i], this.sponsors.gold[i + 1]];
            } else {
                row = [this.sponsors.gold[i], voidSponsor];
            }
            rows.push(row);
        }
        return rows;
    }

    getSilverSponsors() {
        console.log('get silver sponsors');
        let rows = [];
        for (let i = 0; i < this.sponsors.silver.length; i = i + 2) {
            let row = [];
            if (i + 1 < this.sponsors.silver.length) {
                row = [this.sponsors.silver[i], this.sponsors.silver[i + 1]];
            } else {
                row = [this.sponsors.silver[i], voidSponsor];
            }
            rows.push(row);
        }
        return rows;
    }

    getBronzeSponsors() {
        console.log('get bronze sponsors');
        let rows = [];
        for (let i = 0; i < this.sponsors.bronze.length; i = i + 3) {
            let row = [];
            if (i + 2 < this.sponsors.bronze.length) {
                row = [this.sponsors.bronze[i], this.sponsors.bronze[i + 1], this.sponsors.bronze[i + 2]];
            } else if (i + 1 < this.sponsors.bronze.length) {
                row = [this.sponsors.bronze[i], this.sponsors.bronze[i + 1], voidSponsor];
            } else {
                row = [this.sponsors.bronze[i], voidSponsor, voidSponsor];
            }
            rows.push(row);
        }
        return rows;
    }

    getSupporters() {
        console.log('get supporters');
        let rows = [];
        for (let i = 0; i < this.sponsors.supporters.length; i = i + 3) {
            let row = [];
            if (i + 2 < this.sponsors.supporters.length) {
                row = [this.sponsors.supporters[i], this.sponsors.supporters[i + 1], this.sponsors.supporters[i + 2]];
            } else if (i + 1 < this.sponsors.supporters.length) {
                row = [this.sponsors.supporters[i], this.sponsors.supporters[i + 1], voidSponsor];
            } else {
                row = [this.sponsors.supporters[i], voidSponsor, voidSponsor];
            }
            rows.push(row);
        }
        return rows;
    }

}