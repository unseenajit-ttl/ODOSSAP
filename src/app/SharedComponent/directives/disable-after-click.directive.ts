import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { Subject, Subscription } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

@Directive({
  selector: '[cmSubmitClick]',
})
export class DebounceClickDirective implements OnInit, OnDestroy {
  @Input() debounceTime = 500
  @Output() submitForm = new EventEmitter()
  private clicks = new Subject()
  private subscription: Subscription

  constructor() {}

  ngOnInit() {
    this.subscription = this.clicks
      .pipe(debounceTime(this.debounceTime))
      .subscribe(e => this.submitForm.emit(e))
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  @HostListener('submit', ['$event'])
  onSubmit(event) {
    event.preventDefault()
    event.stopPropagation()
    this.clicks.next(event)
  }
}
