import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarUi } from './snackbar.ui';

describe('SnackbarUi', () => {
  let component: SnackbarUi;
  let fixture: ComponentFixture<SnackbarUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackbarUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnackbarUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
