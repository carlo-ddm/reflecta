import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EntriesPage } from './entries.page';

describe('EntriesPage', () => {
  let component: EntriesPage;
  let fixture: ComponentFixture<EntriesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntriesPage],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
