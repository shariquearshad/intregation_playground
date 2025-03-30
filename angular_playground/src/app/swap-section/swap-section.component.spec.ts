import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapSectionComponent } from './swap-section.component';

describe('SwapSectionComponent', () => {
  let component: SwapSectionComponent;
  let fixture: ComponentFixture<SwapSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwapSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwapSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
