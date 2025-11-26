import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/Orders/orders.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
// import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-list-of-shapes-esplice',
  templateUrl: './list-of-shapes-esplice.component.html',
  styleUrls: ['./list-of-shapes-esplice.component.css'],
})
export class ListOfShapesESpliceComponent {
  labelMap: any = {
    J: 'J : COUPLER + STANDARD THREAD',
    K: 'K : STANDARD THREAD',
    H: 'H : POSITION COUPLER + EXTENDED THREAD',
    I: 'I : EXTENDED THREAD',
  };

  @Input() CustomerCode: any;
  @Input() ProjectCode: any;
  @Input() CouplerType: any;
  @Input() ShapeCategory: any = 'E-Splice Coupler';

  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();
  ShapeCatList: any[] = [];
  groupedShapes: any[] = [];
  OrderdetailsLoading: boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService,
    private dropdown: CustomerProjectService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.GetCatShapeList();
  }

  GetCatShapeList() {
    let customer = this.CustomerCode; // '0001101200';
    let project = this.ProjectCode; // '0000113013';
    let shapecategory = 'E-Splice Coupler'; // this.ShapeCategory; // '1 Bend With Arc';
    let coupler = 'E-Splice(S)'; //this.CouplerType; // 'No Coupler';
    this.orderService
      .getShapeImagesByCat_CAB(customer, project, shapecategory, coupler)
      .subscribe({
        next: (response) => {
          console.log('Category List', response);
          this.ShapeCatList = response;
          this.groupShapesByType();
        },
        error: (e) => {},
        complete: () => {
          // this.loading = false;
        },
      });
  }

  convImg(img: string): string {
    return 'data:image/png;base64,' + img;
  }

  groupShapesByType(): void {
    const map = new Map<string, any[]>();

    for (let item of this.ShapeCatList) {
      const type = item.shapeCode.charAt(0);
      if (!map.has(type)) {
        map.set(type, []);
      }
      map.get(type)!.push(item);
    }

    this.groupedShapes = Array.from(map.entries()).map(([type, shapes]) => {
      const labelMap: any = {
        J: 'J : COUPLER + STANDARD THREAD',
        K: 'K : STANDARD THREAD',
        H: 'H : POSITION COUPLER + EXTENDED THREAD',
        I: 'I : EXTENDED THREAD',
      };

      const rows = [];
      for (let i = 0; i < shapes.length; i += 6) {
        rows.push(shapes.slice(i, i + 6));
      }

      return { label: labelMap[type] || type, rows };
    });
  }

  onShapeClick(item: any) {
    alert('Clicked: ' + item.shapeCode);
  }

  onImageClick(event: Event, item: any) {
    event.stopPropagation(); // prevents double click

    // Deselect previously selected images
    this.groupedShapes.forEach((group) =>
      group.rows
        .flatMap((row: any) => row)
        .forEach((shape: { isSelected: boolean }) => (shape.isSelected = false))
    );
    // Set the current img as true
    item.isSelected = true;

    // alert('Image Clicked: ' + item.shapeCode);
  }

  Select() {
    // Find the first selected item (if any)
    const selectedItem = this.groupedShapes
      .flatMap((group) => group.rows.flatMap((row: any) => row))
      .find((shape) => shape.isSelected);

    if (!selectedItem) {
      alert('Please click a shape to select it. (请点击您所选择的图形.)');
      return;
    }

    // let ShapeCode = this.ShapeCatList[index].shapeCode;
    this.saveTrigger.emit(selectedItem.shapeCode);
    this.modalService.dismissAll();
  }

  Download() {
    //loading start
    this.OrderdetailsLoading = true;
    // Downlaod the Images shown in the component as PDF
    const element = document.getElementById('shape_category_list');

    // Check if the element exists
    if (!element) {
      console.error('Element not found');
      return;
    }

    // PDF options
    const pdfOptions: any = {
      filename: 'shape-list.pdf',
      image: { type: 'jpeg', quality: 1 },
      pagebreak: { mode: 'avoid-all' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);
      pdf.save('shape-list.pdf');

      alert("PDF file has been downloaded successfully.");
      this.OrderdetailsLoading = false;
    });
    // alert('PDF file is downloaded successfully.');
  }

  Cancel() {
    // Close the Selection Component
    this.modalService.dismissAll();
  }

  setLabel(lShapeType: any) {
    if (lShapeType) {
      if (lShapeType.trim().length == 1) {
        if (lShapeType == 'C') {
          return 'C : STANDARD COUPLER';
        }
        if (lShapeType == 'N') {
          return 'N : EXTENDED STUD';
        }
        if (lShapeType == 'P') {
          return 'P : POSITION COUPLER + EXTENDED STUD';
        }
        if (lShapeType == 'S') {
          return 'S : STANDARD STUD';
        }
      } else {
        return lShapeType;
      }
    }
    return '';
  }
}
