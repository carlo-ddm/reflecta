import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryCard } from './entry-card.ui';

describe('EntryCard', () => {
  let component: EntryCard;
  let fixture: ComponentFixture<EntryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(EntryCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('entry', {
      id: 'test-entry-id',
      createdAt: '2025-01-01T00:00:00.000Z',
      snippet: 'Test snippet',
      hasAnalysis: false,
    });
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
