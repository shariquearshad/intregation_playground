import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletselectComponent } from './walletselect.component';

describe('WalletselectComponent', () => {
  let component: WalletselectComponent;
  let fixture: ComponentFixture<WalletselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletselectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
