import { Component, OnInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: false
})
export class NavbarComponent implements OnInit {
  private toggleButton: HTMLElement | null = null;
  private sidebarVisible: boolean = false;

  constructor(public location: Location, private element: ElementRef) {
    this.sidebarVisible = false;
  }

  ngOnInit(): void {
    const navbar: HTMLElement = this.element.nativeElement;
    const toggleElements = navbar.getElementsByClassName('navbar-toggler');
    this.toggleButton = toggleElements.length > 0 ? toggleElements[0] as HTMLElement : null;
  }

  sidebarOpen(): void {
    if (!this.toggleButton) return;
    
    const html = document.getElementsByTagName('html')[0];
    
    setTimeout(() => {
      this.toggleButton?.classList.add('toggled');
    }, 500);
    
    html.classList.add('nav-open');
    this.sidebarVisible = true;
  }

  sidebarClose(): void {
    if (!this.toggleButton) return;
    
    const html = document.getElementsByTagName('html')[0];
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  }

  sidebarToggle(): void {
    if (this.sidebarVisible) {
      this.sidebarClose();
    } else {
      this.sidebarOpen();
    }
  }
  isHome(): boolean {
    let path = this.location.prepareExternalUrl(this.location.path());
    if (path.charAt(0) === '#') {
      path = path.slice(1);
    }
    return path === '/home';
  }
}
