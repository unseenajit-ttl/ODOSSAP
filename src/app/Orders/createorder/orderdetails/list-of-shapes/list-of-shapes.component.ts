import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/Orders/orders.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-list-of-shapes',
  templateUrl: './list-of-shapes.component.html',
  styleUrls: ['./list-of-shapes.component.css']
})
export class ListOfShapesComponent implements OnInit {

  @Input() CustomerCode: any;
  @Input() ProjectCode: any;
  @Input() CouplerType: any;
  @Input() ShapeCategory: any;

  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();


  OrderdetailsLoading: boolean = false;
  ShapeCatList: any[] = [];
  // ShapeCatList: { shapeCode: string, shapeImage: string }[] = [
  //   {
  //     shapeCode: "RQ9",
  //     shapeImage: "iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAalSURBVHhe7Z1PTBRXHMdnKf8kCiSiaQiWhIQQDDUkcikGjMZITSoxNkYPnjxo2kNL4qVVQtMSD8YSTXqg2HKBRmOoiZFLQzwUGq0mxKYHkROhtNa2NCIBBUvor3wfv0dnl4Wd2d1hfrPzPsnLvPfbnZns+8yb2XnzZsYigyiMEGEYIcIwQoRhhAjDCBGGESKMUAtpPVBCHYO/cUkGIRYyS9tKd1GutZvLMgitkJ++bKK2gb/ozfKtNDT5L0f9J7RCGqq30OddXdT18btUf/wzjvpPKIXMTT4mK7+RS0R51uv0zyIXfCbUB3WJGCHCMEKEkbFCnj59Sl1LB+1Tp06RZVmuEubBvFjGRpNxQgoKCqIq98SJE/TixQuVEqG/h3nsy8AyN4qMEHLu3LmVyrtw4QKNjo7yJ6mDZWGZevlYl5cERkjsVjo1NbVSSSUlJRx1zvPnzznnDqxLr9cLAtVC8vLy1PTQoUOqQurq6mh2dlbF3FJaWkoXL17kkjuwTqzbCwIl5M6dO0rE7t2p9T/l5+dTU1MT3bt3j/r6+jgqg8AIaWhoUDKGhoZo8+bNHHWP3tVACCgvL6dLly6pvATECxkbG1O7qp07d3JkmWSOG3a0EGmIF4ItWm/V6cQIccn4+LgScePGDY6kFyPEJZAxMjLCpfRjhLgAMryuMCPEIZCxfft2LoUPUUJOnz5NZWVlXAonYoSgU8+Lf1NBQ0wNQIbXHXdBQIQQ9KZmZ2dzyTlHjx5VUzddKe/ssujJ0nT65z7aVvEWLSyHxSBCCFrH5OQkl5yjhVy+fFlNW1tb1Rk80uHDh1UsFi0EfFBr0eM/E18n2UjECEmGqqoqtZurr69X5YGBAdXakHp6elQsFruQlrqlcx0jJBpszckeO2JbiBO0kMWFeYpkVZAsHQKEpPLPCi1Cg2vgTvju2y71XaSXHJOEr0J6e3vNX90YfK0NyPCq8zCo+C4kmX9XmYzvQgzRGCHC8K1GcHZ98uRJLhk0ooR43WJwvrOSrg1xVBZihEQiEc45A6NQNGfOnOHc+liv5dIM56UiQkhtba3Kr5XiYReiW1aieaxIFh3nz7/5YYyjskhJyNmDFj2eX6CRW59Q4db3OeoMu5Du7m56+PChyjsFQrAMpImJCRUbHh5eSfHI+BaihYz2t1PxwU856ozYXRa6QSorK7mUmHgtJBGhEUJ/PKDcLVs56oxYIaCzs5NziTl//jzniPr7+zkXfNIjhKbJ2lREbm8uNuchq0mpRm51tlBLy3IanuKgC4yQ1fhaIxBi+rKi8V2I03OIsOCrEHM9ZDW+14YREo3vtZHsNXX7ecixY8c4tz5WJEL1S/Nh3msPfuGoLERsnsm0kngnhvrMHSkepi/LIajQ69evc8kZEIITSyTdVYJjkk7xsPdl/Z7cvaKeI0IIxlGl0tvrtIWZFuICVOqRI0e4lJirV69yjuju3bucWx8jxAV69PvLlxJHS20cYoQA3B9SXFzMpXAiSgioqKhwfEzIRET+cgiReg+g14jdFCHFfuBON2tdVfQbsULwgBdIaWtr40h6MXfhJgmkxDumxIu5wQhJkoWFBfWsrJycHI4sP81ncTG157oaISmin+pWU1PDkdQwQtJAVlaWejIQxCR7pVHv6uxCZmbknL8HRoi9ZbS3t6uK3bFjh2sxOPmsrq5eEVJUVET3799XeadgnVi3FwRCyFoHcHSz4zMkN39j8QwuzFNYWMgRZ2Aden1rdfGnSqB2WWuBp8zpikIv8ODgIH+yNk6PIVgWlqmXj3V5SUYIsYM7c3XlITU2NtLNmzdVSoT+3t69e6OWoe/23QgyTohmfn5ePQTtypUrUZXrJGEezItlbDQZKySoGCHCMEKEESohOC4gTb/igEBCI6Tz7AH68OsfiV79TdW5BfRE6MX10AipXPr3FARCI+QNI0QWX330Nr33xfdLuWmqyt5Ev5qBcv6DTkGkmXkh78iLQ6iEBAEjRBhGiDCMEGEYIcIwQoRhhAjDCBFG2oVgANuePXuoubl55Z4P+0sh9WtN8Rme965Hjegyngqk31cYRjxpIRgUYL8ODQFAv1fKji5jqh+GjAEIUgeyeY3nQvQYKoBp7GADfVs0ph0dHSq2f/9+IySdQAheTRr7pIb1hGAM7759+9RbDfA9IySN2FsIKlcPYltvl6WZm5tbFQsTngvBmwvsFYxxUvgc4HUTt2/fVnkNvvvs2TMuhQ9fNsVHjx6pioccQzS+7hv0oAPD/4R3Zy0Sov8AX4L0i+7timMAAAAASUVORK5CYII="
  //   }];

  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService,
    private dropdown: CustomerProjectService,
    private modalService: NgbModal,
  ) { }
  ngOnInit(): void {
    this.GetCatShapeList();
  }


  SelectShape(item: any) {
    this.ShapeCatList.forEach(x => x.isSelected = false);
    item.isSelected = true;
  }

  GetCatShapeList() {
    let customer = this.CustomerCode;// '0001101200';
    let project = this.ProjectCode; // '0000113013';
    let shapecategory = this.ShapeCategory;// '1 Bend With Arc';
    let coupler = this.CouplerType;// 'No Coupler';
    this.orderService.getShapeImagesByCat_CAB(customer, project, shapecategory, coupler).subscribe({
      next: (response) => {
        console.log("Category List", response)
        this.ShapeCatList = response;
      },
      error: (e) => {
      },
      complete: () => {
        // this.loading = false;
      },
    })
  }

  convImg(shapeImage: any) {
    return 'data:image/png;base64,' + shapeImage;
  }

  Select() {
    // Return the Selected ShapeCode
    let index = this.ShapeCatList.findIndex(x => x.isSelected === true);

    if (index == -1) {
      alert("Please click a shape to select it. (请点击您所选择的图形.)");
      return;
    }

    let ShapeCode = this.ShapeCatList[index].shapeCode;
    this.saveTrigger.emit(ShapeCode);
    this.modalService.dismissAll()

  }

  Download() {
    //loading start
    this.OrderdetailsLoading=true;
    // Downlaod the Images shown in the component as PDF
    const element = document.getElementById('shape_category_list');
 
    // Check if the element exists
    if (!element) {
      console.error("Element not found");
      return;
    }
 
    // PDF options
    const pdfOptions: any = {
      filename: 'shape-list.pdf',
      image: { type: 'jpeg', quality: 1 },
      pagebreak: { mode: 'avoid-all' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
 
    // Use html2canvas to create a screenshot of the element
    html2canvas(element, {
      scale: 2, // Increase scale for higher quality
      useCORS: true, // Use CORS if required for external resources
      // letterRendering: true,
      // dpi: 192 // High DPI for clear image quality
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg', pdfOptions.image.quality);
 
      // Calculate image dimensions to fit in an A4 page
      const pdf = new jsPDF(pdfOptions.jsPDF);
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
 
      // Add the image to the PDF
      pdf.addImage(imgData, 'JPEG', 5, 10, imgWidth - 10, imgHeight - 10); // Adjust margins if needed
      pdf.save(pdfOptions.filename);
 
      // Alert after successful save
      alert("PDF file is downloaded successfully.");
      this.OrderdetailsLoading=false;
    }).catch((error) => {
      console.error("Error generating PDF:", error);
      this.OrderdetailsLoading=false;
    });
 
  }

  Cancel() {
    // Close the Selection Component
    this.modalService.dismissAll()
  }
}
