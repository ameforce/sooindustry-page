import { ViewportScroller } from "@angular/common";
import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent{
  constructor(private scroller: ViewportScroller){}
  goDown1() {
    this.scroller.scrollToAnchor("down");
  }
}
