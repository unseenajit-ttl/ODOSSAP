import { Injectable, TemplateRef } from '@angular/core'

@Injectable()
export class ToasterService {
  toasts: any[] = []
  constructor() {}

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options })
  }

  remove(toast:any) {
    this.toasts = this.toasts.filter(t => t !== toast)
  }

  showStandard(message: string) {
    this.show(message)
  }

  showSuccess(message: string) {
    this.show(message, { classname: 'bg-success text-dark', delay: 5000 })
  }

  showDanger(message: string) {
    this.show(message, { classname: 'bg-danger text-dark', delay: 5000 })
  }

  showWarning(message: string) {
    this.show(message, { classname: 'bg-warning text-dark', delay: 5000 })
  }
}
