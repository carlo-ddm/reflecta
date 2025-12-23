import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EntryDetailPage } from './entry-detail.page';

describe('EntryDetailPage', () => {
  let component: EntryDetailPage;
  let fixture: ComponentFixture<EntryDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryDetailPage],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
