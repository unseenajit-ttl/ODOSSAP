import { Component, Input, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-image-modal',
  templateUrl: './order-image-modal.component.html',
  styleUrls: ['./order-image-modal.component.css']
})
export class OrderImageModalComponent {
  @Input() public images:any;
  @Input() public StructureElement: any;
  selectedImages:any[] = [];
  selectedImage:any;
  constructor(
    public activeModal: NgbActiveModal,
    private renderer: Renderer2
  ) { }
  ngOnInit() {
    debugger;
    console.log("images=>",this.images);
  }
  imageClick(image:any){
    console.log("Image",image);
    // if(!this.selectedImage.includes(image)){
    //   this.selectedImage.push(image);
    // }else{
    //   let index = this.selectedImage.indexOf(image);
    //   console.log("Before splice",this.selectedImage);
    //   this.selectedImage.splice(index,1);
    //   console.log("After splice",this.selectedImage);
    // }
    this.selectedImage = image;
    this.passBackData();

  }
  passBackData(){
    this.activeModal.close(this.selectedImage);
  }
  toggleClass(event: any) {
    const className = "image-clicked";
    const hasClass = event.target.classList.contains(className);

    if (hasClass) {
        this.renderer.removeClass(event.target, className);
    } else {
        this.renderer.addClass(event.target, className);
  }
}
}
