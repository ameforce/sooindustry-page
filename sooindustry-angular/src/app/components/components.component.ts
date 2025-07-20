import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

@Component({
    selector: 'app-components',
    templateUrl: './components.component.html',
    styleUrls: ['./components.component.scss'],
    standalone: false
})
export class ComponentsComponent implements OnInit {
  page: number = 4;
  page1: number = 5;
  focus: boolean = false;
  focus1: boolean = false;
  focus2: boolean = false;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}



  ngOnInit(): void {
    this.setupInputGroupFocus();
  }

  private setupInputGroupFocus(): void {
    const inputGroups = this.elementRef.nativeElement.querySelectorAll('.input-group');
    
    inputGroups.forEach((group: HTMLElement) => {
      const input = group.querySelector('input');
      if (input) {
        this.renderer.listen(input, 'focus', () => {
          this.renderer.addClass(group, 'input-group-focus');
        });
        
        this.renderer.listen(input, 'blur', () => {
          this.renderer.removeClass(group, 'input-group-focus');
        });
      }
    });
  }
}
