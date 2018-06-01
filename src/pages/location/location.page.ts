import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
@Component({
    selector: 'location',
    templateUrl: 'location.page.html'
})
export class LocationPage  {
    
    private mapUrl = '';
    
    constructor(private platform:Platform) {
      this.mapUrl = 'https://www.google.com/maps/?q=';
      if (this.platform.is('android')) {
        this.mapUrl = 'geo:?q=';
      }
      if (this.platform.is('ios')) {
        //this.mapUrl='maps:?daddr='+coords;
        this.mapUrl = 'http://maps.apple.com/?q=';
      }
    }

    openLocation(address:string) {
      window.open(this.mapUrl + address, '_system');
    }

  openAllLocationsMap(evt) {
    window.open("https://www.google.es/maps/dir/Filmax+Granvia,+C.C.+Gran+V%C3%ADa+2,+Avda.+Gran+V%C3%ADa,+75,+08908+Hospitalet+de+Llobregat,+Barcelona/Hotel+Fira+Congress+Barcelona,+Pol%C3%ADgono+Industrial+de+la+Pedrosa,+Calle+de+Jos%C3%A9+Agust%C3%ADn+Goytisolo,+9-11,+08908+L'Hospitalet+de+Llobregat,+Barcelona/Europa+%7C+Fira/@41.355354,2.1226522,16z/data=!3m1!4b1!4m20!4m19!1m5!1m1!1s0x12a498beede99cef:0x139283c13221c7be!2m2!1d2.1286963!2d41.3581589!1m5!1m1!1s0x12a498c810926477:0xd4d624a7d233c44d!2m2!1d2.1273512!2d41.3523282!1m5!1m1!1s0x12a498c74abb383f:0xbc471cbf75523773!2m2!1d2.1245712!2d41.3571862!3e2", '_system');
  }



}