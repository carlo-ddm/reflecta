import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritePage } from './write.page';

describe('WritePage', () => {
  let component: WritePage;
  let fixture: ComponentFixture<WritePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WritePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WritePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
