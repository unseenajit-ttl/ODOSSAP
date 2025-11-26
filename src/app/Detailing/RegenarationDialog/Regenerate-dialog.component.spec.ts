import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { RegenerateDialogComponent } from './Regenerate-dialog.component'

describe('RegenerateDialogComponent', () => {
  let component: RegenerateDialogComponent
  let fixture: ComponentFixture<RegenerateDialogComponent>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RegenerateDialogComponent],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(RegenerateDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
