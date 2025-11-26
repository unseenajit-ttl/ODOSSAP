// import { Directive, ElementRef, HostListener, Renderer2, Input, SimpleChanges } from '@angular/core'

// @Directive({
//   selector: '[cmTextCount]',
// })
// export class TextCountDirective {
//   constructor(private _el: ElementRef, private _renderer: Renderer2) {}
//   text
//   textCountWrapper: any
//   @Input() public input: any
//   ngOnInit() {
//     // Get parent of the original input element
//     var parent = this._el.nativeElement.parentNode

//     // Create a div
//     var spanWrapper = this._renderer.createElement('span')

//     // Add class "input-wrapper"
//     this._renderer.addClass(spanWrapper, 'text-count-wrapper')

//     // Add the div, just before the input
//     this._renderer.insertBefore(parent, spanWrapper, this._el.nativeElement)

//     // Remove the input
//     this._renderer.removeChild(parent, this._el.nativeElement)

//     // Re-add it inside the div
//     this._renderer.appendChild(spanWrapper, this._el.nativeElement)

//     //Take reference of wrapper
//     this.textCountWrapper = this._el.nativeElement.closest('.text-count-wrapper')

//     //Create counting element
//     let characterCounter = this._renderer.createElement('small')

//     //Create Initial text for the counting element
//     let text = this._renderer.createText(
//       String(this._el.nativeElement.maxLength) + ` characters left`
//     )

//     //Add class for styling counting element
//     this._renderer.addClass(characterCounter, 'show-remaining-count')

//     //Append the initial text character counter
//     this._renderer.appendChild(characterCounter, text)

//     //Append character counter to text count wrapper
//     this._renderer.appendChild(this.textCountWrapper, characterCounter)
//     setTimeout(() => {
//       this.getCharacterCount()
//     }, 50)
//   }
//   private getCharacterCount() {
//     let leftChars = this._el.nativeElement.maxLength - this._el.nativeElement.value.length
//     this.textCountWrapper.querySelectorAll('small')[0].innerHTML =
//       String(leftChars) + ` character${leftChars > 1 ? 's' : ''} left`
//   }
//   @HostListener('ngModelChange', ['$event']) onKeyUp(value) {
//     this.getCharacterCount()
//   }
// }
