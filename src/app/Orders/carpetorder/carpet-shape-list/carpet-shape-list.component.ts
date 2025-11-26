import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { OrderService } from '../../orders.service';

@Component({
  selector: 'app-carpet-shape-list',
  templateUrl: './carpet-shape-list.component.html',
  styleUrls: ['./carpet-shape-list.component.css'],
})
export class CarpetShapeListComponent implements OnInit {
  ShapeListCarpet: any[] = [];
  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService,
    private dropdown: CustomerProjectService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.LoadData();
  }

  LoadData() {
    this.orderService.GetShapeImagesByCarpet().subscribe({
      next: (response: any) => {
        this.ShapeListCarpet = response;
      },
      error: () => {},
      complete: () => {},
    });
  }

  Cancel() {
    this.modalService.dismissAll();
  }

  ImageListImageClick(pItem: any, e: any) {
    // lCell = e.parentNode;
    this.ImageListClick(pItem);
  }

  ImageListClick(pItem: any) {
    // for (let i = 0; i < this.ShapeListCarpet.length; i++) {
    //     for (var j = 0; j < lTable.rows[i].cells.length; j++) {
    //         if (lTable.rows[i].cells[j].style.backgroundColor != 'rgb(255, 255, 255)') {
    //             lTable.rows[i].cells[j].style.backgroundColor = 'rgb(255, 255, 255)';
    //         }
    //     }
    // }
    // e.style.backgroundColor = 'rgb(0, 255, 0)';
  }

  convImg(pItem: any): string {
    return '';
  }

    GetShapeImage(pItem: any) {
    if (pItem.shapeCode) {
      return 'assets/images/Shapes/' + pItem.shapeCode  + '.png';;
      // return '../../../assets/images/Shapes/F.PNG';
      // return '../../../assets/images/Shapes/N.PNG';
    }
    return '';
  }
}
