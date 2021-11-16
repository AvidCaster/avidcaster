import { ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nModule } from '@fullerstack/ngx-i18n';

import { OverlayComponent } from './overlay.component';

xdescribe('OverlayComponent', () => {
  let component: OverlayComponent;
  let fixture: ComponentFixture<OverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I18nModule],
      declarations: [OverlayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
