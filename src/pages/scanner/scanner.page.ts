import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Contact } from '../../model/jbcn.model';
import { JbcnService } from '../../services/jbcn.service';
import { SocialSharing } from '@ionic-native/social-sharing';

/*
  Generated class for the Scanner page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner.page.html'
})
export class ScannerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner,
    private jbcnService: JbcnService,
    private socialSharing: SocialSharing) {
    this.loadContacts();

  }

  private contacts: Array<Contact>;

  launchScanner() {

    this.barcodeScanner.scan().then((barcodeData) => {
      if(barcodeData && barcodeData.text) {
        const contact = this.jbcnService.parseContact(barcodeData.text);
        this.jbcnService.addContact(contact);
        this.loadContacts();
      }
    }, (err) => {
      console.log(err);
    });

    // let data = 'Spanish,English;José Guitart Ruíz;jose.guitart@gmail.com;Freelance Full Stack Developer;Java';
    // const devContact = this.jbcnService.parseContact(data);
    // this.jbcnService.addContact(devContact);
    // this.loadContacts();
  }

  loadContacts() {
    this.contacts = this.jbcnService.getContacts();
  }

  remove(contact: Contact) {
    this.jbcnService.removeContact(contact);
    this.loadContacts();
  }

  launchShare() {
    let contactText = '';
    for(let contact of this.contacts) {

      contactText = contactText + 'Name:'+contact.name+'\r\n';
      contactText = contactText + 'Country:'+contact.country +'\r\n';
      contactText = contactText + 'City:'+contact.city +'\r\n';
      contactText = contactText + 'Company:'+contact.company +'\r\n';
      contactText = contactText + 'Level:'+contact.level +'\r\n';
      contactText = contactText + 'Program Languages:'+contact.programLanguages +'\r\n';
      contactText = contactText + 'Email:'+contact.email +'\r\n';
      contactText = contactText + '\r\n\r\n';
    }
    console.log(contactText);
    this.socialSharing.share(contactText, 'JBCNConf 2018 contacts',[],'').then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });

  }

}
