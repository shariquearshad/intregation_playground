import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenselectionComponent } from './tokenselection.component';

describe('TokenselectionComponent', () => {
  let component: TokenselectionComponent;
  let fixture: ComponentFixture<TokenselectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenselectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
