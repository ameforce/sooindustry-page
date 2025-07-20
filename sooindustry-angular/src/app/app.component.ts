import { Component, OnInit, Inject, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'
import { DOCUMENT } from '@angular/common';
import { Location } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { filter, Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  private _router: Subscription = Subscription.EMPTY;
  @ViewChild(NavbarComponent) navbar!: NavbarComponent;

  constructor( private renderer: Renderer2, private router: Router, @Inject(DOCUMENT,) private document: any, private element : ElementRef, public location: Location) {}
  ngOnInit() {
    var navbar : HTMLElement = this.element.nativeElement.children[0].children[0];
    this._router = this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(event => {
      if (window.outerWidth > 991) {
        window.document.children[0].scrollTop = 0;
      } else {
        if (window.document.activeElement !== null) { window.document.activeElement.scrollTop = 0; }
      }
      this.navbar.sidebarClose();
    });
    this.renderer.listen('window', 'scroll', (event) => {
      const number = window.scrollY;
      if (number > 150 || window.pageYOffset > 150) {
        navbar.classList.remove('navbar-transparent');
      } else {
        navbar.classList.add('navbar-transparent');
      }
    });
    var ua = window.navigator.userAgent;
    var trident = ua.indexOf('Trident/');
    var version;
    if (trident > 0) {
      var rv = ua.indexOf('rv:');
      version = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    if (version) {
      var body = document.getElementsByTagName('body')[0];
      body.classList.add('ie-background');
    }
  }
  removeFooter() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice( 1 );
    return !(titlee === 'signup' || titlee === 'nucleoicons');
  }
  title = 'sooindustry-angular';
}
