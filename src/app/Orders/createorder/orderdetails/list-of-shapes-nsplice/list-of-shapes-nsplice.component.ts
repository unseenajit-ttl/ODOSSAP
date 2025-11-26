import { Component, EventEmitter, Input, Output } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/Orders/orders.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
@Component({
  selector: 'app-list-of-shapes-nsplice',
  templateUrl: './list-of-shapes-nsplice.component.html',
  styleUrls: ['./list-of-shapes-nsplice.component.css'],
})
export class ListOfShapesNSpliceComponent {
  @Input() CustomerCode: any;
  @Input() ProjectCode: any;
  @Input() CouplerType: any;
  @Input() ShapeCategory: any = 'N-Splice Coupler';

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
    let shapecategory = 'N-Splice Coupler'; // this.ShapeCategory; // '1 Bend With Arc';
    let coupler = 'N-Splice'; //this.CouplerType; // 'No Coupler';
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
    this.saveTrigger.emit(selectedItem?.shapeCode);
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

    // Use html2canvas to create a screenshot of the element
    // html2canvas(element, {
    //   scale: 2, // Increase scale for higher quality
    //   useCORS: true, // Use CORS if required for external resources
    //   // letterRendering: true,
    //   // dpi: 192 // High DPI for clear image quality
    // })
    //   .then((canvas) => {
    //     const imgData = canvas.toDataURL(
    //       'image/jpeg',
    //       pdfOptions.image.quality
    //     );

    //     // Calculate image dimensions to fit in an A4 page
    //     const pdf = new jsPDF(pdfOptions.jsPDF);
    //     const imgWidth = 210; // A4 width in mm
    //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

    //     // Add the image to the PDF
    //     pdf.addImage(imgData, 'JPEG', 5, 10, imgWidth - 10, imgHeight - 10); // Adjust margins if needed
    //     pdf.save(pdfOptions.filename);

    //     // Alert after successful save
    //     alert('PDF file is downloaded successfully.');
    //     this.OrderdetailsLoading = false;
    //   })
    //   .catch((error) => {
    //     console.error('Error generating PDF:', error);
    //     this.OrderdetailsLoading = false;
    //   });

    html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Scale to maintain aspect ratio

        let yPosition = 0;
        let page = 1;
        let remainingHeight = imgHeight;

        while (remainingHeight > 0) {
          const splitCanvas = document.createElement('canvas');
          splitCanvas.width = canvas.width;
          splitCanvas.height = Math.min(
            canvas.height,
            (pageHeight * canvas.width) / imgWidth
          );

          const splitContext = splitCanvas.getContext('2d');
          if (splitContext) {
            splitContext.drawImage(
              canvas,
              0,
              yPosition,
              canvas.width,
              splitCanvas.height,
              0,
              0,
              splitCanvas.width,
              splitCanvas.height
            );
          }

          const splitImgData = splitCanvas.toDataURL('image/png');
          if (page > 1) pdf.addPage();
          pdf.addImage(
            splitImgData,
            'PNG',
            0,
            10,
            imgWidth,
            (splitCanvas.height * imgWidth) / canvas.width
          );

          yPosition += splitCanvas.height;
          remainingHeight -= splitCanvas.height;
          page++;
        }

        pdf.save('shape-list.pdf');
        alert('PDF file has been downloaded successfully.');
        this.OrderdetailsLoading = false;
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
        this.OrderdetailsLoading = false;
      });
  }

  Cancel() {
    // Close the Selection Component
    this.modalService.dismissAll();
  }
  setLabel(lShapeType: any) {
    if (lShapeType) {
      if (lShapeType.trim().length == 1) {
        if (lShapeType == 'H') {
          return 'H : POSITION COUPLER + EXTENDED THREAD';
        }
        if (lShapeType == 'I') {
          return 'I : EXTENDED THREAD';
        }
        if (lShapeType == 'J') {
          return 'J : COUPLER + STANDARD THREAD';
        }
        if (lShapeType == 'K') {
          return 'K : STANDARD THREAD';
        }
      } else {
        return lShapeType;
      }
    }
    return '';
  }
}
