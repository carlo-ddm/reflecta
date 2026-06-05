import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EntryCard } from './entry-card.ui';

describe('EntryCard', () => {
  let component: EntryCard;
  let fixture: ComponentFixture<EntryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EntryCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('entry', {
      id: 'test-entry-id',
      authorId: '01ABCDEFGHJKMNPQRSTVWXYZ00',
      createdAt: '2025-01-01T00:00:00.000Z',
      date: '2025-01-01T00:00:00.000Z',
      title: 'Titolo di prova',
      snippet: 'Test snippet',
    });
    fixture.componentRef.setInput('link', ['/entries', 'test-entry-id']);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
