import { Component, Input, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-column-link-mesh-product-list-modal',
  templateUrl: './column-link-mesh-product-list-modal.component.html',
  styleUrls: ['./column-link-mesh-product-list-modal.component.css']
})
export class ColumnLinkMeshProductListModalComponent {
  @Input() public products:any;
  @Input() public StructureElement: any;
  selectedProductLIst:any[] = [];
  selectedProduct:any;
  constructor(
    public activeModal: NgbActiveModal,
    private renderer: Renderer2
  ) { }
  ngOnInit() {
    console.log("products=>",this.products);
  }
  productClicked(product:any){
    console.log("product",product);
    this.selectedProduct = product;
    this.passBackData();

  }
  passBackData(){
    this.activeModal.close(this.selectedProduct);
  }
  toggleClass(event: any) {
    const className = "product-clicked";
    const hasClass = event.currentTarget.classList.contains(className);
    if (hasClass) {
        this.renderer.removeClass(event.target, className);
    } else {
        this.renderer.addClass(event.target, className);
  }
}
}
