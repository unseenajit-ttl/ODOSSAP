import { DOCUMENT } from '@angular/common'
import { Directive, ElementRef, EventEmitter, HostListener, Inject, Output } from '@angular/core'

@Directive({ selector: '[cmClickElsewhere]' })
export class ClickElsewhereDirective {
  @Output() clickElsewhere = new EventEmitter<MouseEvent>()

  constructor(private elementRef: ElementRef, @Inject(DOCUMENT) private document: Document) {}

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement

    // Check if the click was outside the element
    if (targetElement && !this.elementRef.nativeElement.contains(targetElement)) {
      this.document.body.classList.remove('show-left-menu')
      this.clickElsewhere.emit(event)
    } else {
      this.document.body.classList.add('show-left-menu')
    }
  }
}
