import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryDetailPage } from './entry-detail.page';

describe('EntryDetailPage', () => {
  let component: EntryDetailPage;
  let fixture: ComponentFixture<EntryDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryDetailPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
