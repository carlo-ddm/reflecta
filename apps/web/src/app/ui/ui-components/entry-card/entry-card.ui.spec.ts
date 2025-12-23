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
      id: '01HZY9YJ1PZ8K7M6J5N4V3C2B1',
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
