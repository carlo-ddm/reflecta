import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryCardUi } from './entry-card.ui';

describe('EntryCardUi', () => {
  let component: EntryCardUi;
  let fixture: ComponentFixture<EntryCardUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryCardUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryCardUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
