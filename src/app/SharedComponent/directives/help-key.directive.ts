import { DOCUMENT } from '@angular/common'
import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Output,
  Input,
} from '@angular/core'
import { HelpService } from 'src/app/core/help.service'

@Directive({
  selector: '[cmHelpKey]',
})
export class HelpKeyDirective {
  @Output() clickElsewhere = new EventEmitter<MouseEvent>()
  @Input() cmHelpKey: any
  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private helpService: HelpService
  ) {}

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement
    // Check if the click was not outside the element
    if (targetElement && this.elementRef.nativeElement.contains(targetElement)) {
      this.document.body.classList.add('show-guidance')
      this.helpService.helpTrigger.next(this.cmHelpKey)
    }
  }
}
