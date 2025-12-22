import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntriesPage } from './entries.page';

describe('EntriesPage', () => {
  let component: EntriesPage;
  let fixture: ComponentFixture<EntriesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntriesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntriesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
