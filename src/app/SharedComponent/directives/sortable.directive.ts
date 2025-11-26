import { Directive, EventEmitter, Input, Output, HostListener, HostBinding } from '@angular/core'

export type SortColumn = ''
export type SortDirection = 'asc' | 'desc' | ''
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' }

export interface SortEvent {
  column: SortColumn
  direction: SortDirection
}

@Directive({
  selector: 'th[cmSortable]',
})
export class SortableHeaderDirective {
  @Input() cmSortable: SortColumn = ''
  @Input() direction: SortDirection = ''
  @Output() sort = new EventEmitter<SortEvent>()
  @HostBinding('class.desc') get desc() {
    return this.direction === 'desc'
  }
  @HostBinding('class.asc') get asc() {
    return this.direction === 'asc'
  }
  @HostListener('click') toggle() {
    this.rotate()
  }

  rotate() {
    this.direction = rotate[this.direction]
    this.sort.emit({ column: this.cmSortable, direction: this.direction })
  }
}
