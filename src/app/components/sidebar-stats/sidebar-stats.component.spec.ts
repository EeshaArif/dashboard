import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarStatsComponent } from './sidebar-stats.component';

describe('SidebarStatsComponent', () => {
  let component: SidebarStatsComponent;
  let fixture: ComponentFixture<SidebarStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
