import {ElementRef, Directive} from '@angular/core';

@Directive({
  selector: '[elastic]'
})
export class Elastic {

  constructor(public element:ElementRef){
    this.element = element;
  }

  ngAfterViewInit(){
    this.element.nativeElement.querySelector("textarea").style.height = "100%";
  }

}