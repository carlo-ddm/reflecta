import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeUi } from './badge.ui';

describe('BadgeUi', () => {
  let component: BadgeUi;
  let fixture: ComponentFixture<BadgeUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadgeUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
