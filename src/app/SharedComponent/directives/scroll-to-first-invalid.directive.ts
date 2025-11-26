import { Directive, ElementRef, HostListener, Input } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Directive({ selector: '[cmScrollToFirstInvalid]' })
export class ScrollToFirstInvalidDirective {
  @Input() formGroup: FormGroup

  constructor(private el: ElementRef) { }

  static scrollTo(element) {
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  @HostListener('submit', ['$event'])
  onSubmit(event) {
    if (this.formGroup && !this.formGroup.valid) {
      this.formGroup.markAllAsTouched()

      const formControlInvalid = this.el.nativeElement.querySelector('.ng-invalid')
      if (formControlInvalid) {
        return ScrollToFirstInvalidDirective.scrollTo(formControlInvalid)
      } else {
        // The first element is the global form and here we are looking for the first nested form
        const formGroupInvalid = this.el.nativeElement.querySelectorAll('form .ng-invalid')
        if (formGroupInvalid && formGroupInvalid.length) {
          return ScrollToFirstInvalidDirective.scrollTo(formGroupInvalid[0])
        }
      }
    }
  }
}
