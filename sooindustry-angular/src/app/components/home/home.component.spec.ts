import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.page).toBe(4);
    expect(component.page1).toBe(5);
    expect(component.focus).toBe(false);
    expect(component.focus1).toBe(false);
    expect(component.focus2).toBe(false);
  });



  it('should display company title', () => {
    const titleElement = fixture.debugElement.query(By.css('.presentation-title'));
    expect(titleElement.nativeElement.textContent).toContain('SOOIN INDUSTRY');
  });

  it('should display company subtitle', () => {
    const subtitleElement = fixture.debugElement.query(By.css('.presentation-subtitle'));
    expect(subtitleElement.nativeElement.textContent).toContain('열처리 산업로의 합리화와 효율화');
  });

  it('should setup input group focus handlers on init', () => {
    jest.spyOn(component as any, 'setupInputGroupFocus');
    component.ngOnInit();
    expect((component as any).setupInputGroupFocus).toHaveBeenCalled();
  });

  // 아이콘 표시 테스트
  describe('주요 사업 분야 아이콘', () => {
    it('should display electric furnace icon with electric-icon class', () => {
      const electricFurnaceCard = fixture.debugElement.query(By.css('.service-card .electric-icon'));
      expect(electricFurnaceCard).toBeTruthy();
      
      const electricIcon = electricFurnaceCard.query(By.css('i.nc-icon.nc-bulb-63'));
      expect(electricIcon).toBeTruthy();
      expect(electricIcon.nativeElement.classList).toContain('nc-icon');
      expect(electricIcon.nativeElement.classList).toContain('nc-bulb-63');
    });

    it('should display secondary battery equipment icon with battery-icon class', () => {
      const batteryCard = fixture.debugElement.query(By.css('.service-card .battery-icon'));
      expect(batteryCard).toBeTruthy();
      
      const batteryIcon = batteryCard.query(By.css('i.nc-icon.nc-box-2'));
      expect(batteryIcon).toBeTruthy();
      expect(batteryIcon.nativeElement.classList).toContain('nc-icon');
      expect(batteryIcon.nativeElement.classList).toContain('nc-box-2');
    });

    it('should display correct service card titles', () => {
      const serviceCards = fixture.debugElement.queryAll(By.css('.service-card h4'));
      const cardTitles = serviceCards.map(card => card.nativeElement.textContent.trim());
      
      expect(cardTitles).toContain('전기로');
      expect(cardTitles).toContain('2차전지 설비');
    });

    it('should display correct service card descriptions', () => {
      const electricCard = fixture.debugElement.query(By.css('.electric-icon'));
      const electricCardDescription = electricCard.parent?.query(By.css('p'));
      expect(electricCardDescription?.nativeElement.textContent).toContain('전기식 열처리 설비');

      const batteryCard = fixture.debugElement.query(By.css('.battery-icon'));
      const batteryCardDescription = batteryCard.parent?.query(By.css('p'));
      expect(batteryCardDescription?.nativeElement.textContent).toContain('배터리 산업용 설비');
    });
  });
}); 