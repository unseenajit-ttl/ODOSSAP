import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CabShapeServiceService } from '../Service/cab-shape-service.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AllShapesComponent } from './all-shapes/all-shapes.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cab-shape-master',
  templateUrl: './cab-shape-master.component.html',
  styleUrls: ['./cab-shape-master.component.css']
})
export class CabShapeMasterComponent implements OnInit {
  selectedFile: any;
  gShapeImage: string='';
  testimage: boolean=false;


  display: any = "00:00";
  shapeImageUrl: string = '';
  errorMessage: string = '';
  imageSrc: any;
  shapeList:any[]=[];
  selectedShapecode:any = undefined;
  status:any=undefined;
  version:any = '';
  cabShapeCoOrdinatest:any[]=[];
  cabShapeCoOrdinatest_backup:any[]=[];
  enableEditIndex =-1;
  image:any;
  importImage:boolean = false;
  @ViewChild('myCanvas', { static: true }) Canvas!: ElementRef<HTMLCanvasElement>;
  Showimage:boolean = false;

  constructor(private cabShapeService:CabShapeServiceService,private location: Location,public router: Router,
    private  tosterService:ToastrService,private modalService: NgbModal) {}

ngOnInit() {
  this.loadCabShape();

}

loadImage(): void {

  if(this.selectedShapecode)
  {


    this.cabShapeService.getShapeImage(this.selectedShapecode).subscribe({
      next: (response) => {
        if(response)
        {

          this.createImageFromBase64(response);
        }


      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {
        this.loadCabShapeCoOrdinatest();

      },
    });

  }
}

createImageFromBlob(image: Blob): void {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    this.imageSrc = reader.result;
  }, false);
  if (image) {
    reader.readAsDataURL(image);
  }
}

createImageFromBase64(base64String: string): void {
  this.imageSrc = 'data:image/png;base64,' + base64String;
}

loadCabShape() {
  //debugger;
  this.cabShapeService.PopulateShapes().subscribe({
    next: (response) => {
      //console.log(response);
      this.shapeList = response;

    },
    error: (e) => {
      //console.log("error", e);
    },
    complete: () => {

    },
  });



}

loadCabShapeCoOrdinatest() {
  //debugger;
  this.cabShapeService.GetShapeDetails(this.selectedShapecode).subscribe({
    next: (response) => {
      //console.log(response);
      this.cabShapeCoOrdinatest = response;
      this.cabShapeCoOrdinatest_backup = JSON.parse(JSON.stringify(this.cabShapeCoOrdinatest));

    },
    error: (e) => {
      //console.log("error", e);
    },
    complete: () => {
      if(this.cabShapeCoOrdinatest.length)
      {
        this.version = this.cabShapeCoOrdinatest[0].VERSION
        if(this.cabShapeCoOrdinatest[0].ACTIVE)
        {
          this.status = "Active"
        }
        else{
          this.status = "Inactive"

        }

      }
      this.displayShapeImage();

    },
  });



}
changeShape()
{
  this.Showimage =false;
  this.testimage = false;
  this.loadImage();
}
SaveImage()
{
  debugger;
  console.log(this.image);
}
onFileSelected(event: any) {
  debugger;
  this.image = event.target.files[0];
  // this.selectedFile = this.image
}

uploadFile() {
  debugger;
  const formData = new FormData();
    formData.append('file', this.image);

    this.cabShapeService.ImportImageToDB(formData,this.selectedShapecode).subscribe({
      next: (response) => {
        //console.log(response);


      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {


      },
    });
  if (this.selectedFile) {
    debugger;
    // You can now use this.selectedFile to upload the file to your API or perform other operations.
    console.log('Selected File:', this.selectedFile);
  } else {
    console.error('No file selected.');
  }
}
DeleteShapeCode() {
  //debugger;
  this.cabShapeService.DeleteShapeCode(this.selectedShapecode).subscribe({
    next: (response) => {


    },
    error: (e) => {
      //console.log("error", e);
    },
    complete: () => {
      window.location.reload();

    },
  });
}
displayShapeImage() {
  //CALL THE CANVAS FUNCTION HERE


    var lParaA = this.cabShapeCoOrdinatest;


    // var canImg: any = document.getElementById("rightShapeImage-" + pGridID);
    var canImg: HTMLCanvasElement = this.Canvas.nativeElement;
    var ctxImg: any = canImg.getContext('2d');
    ctxImg.clearRect(0, 0, canImg.width, canImg.height);



    var imgObj = new Image();
    let testValue = this.testimage;
    imgObj.onload = function () {
      ctxImg.drawImage(
        imgObj,
        0,
        0,
        imgObj.width,
        imgObj.height,
        0,
        0,
        canImg.width,
        canImg.height
      );

      lParaA.forEach(element => {

        if(element.VISIBLE=='VISIBLE')
        {


        var lRatioX = canImg.width / imgObj.width;
        var lRatioY = canImg.height / imgObj.height;
        ctxImg.font = 'Bold 12px verdana';
        ctxImg.fillStyle = '#000000';
        ctxImg.strokeStyle = '#000000';
        ctxImg.lineWidth = 1;
        if(testValue)
        {
          ctxImg.fillText(
            element.DEFAULTPARAMVALUE.toString(),
            lRatioX * (parseInt(element.INTXCOORD) + 4),
            lRatioY * (parseInt(element.INTYCOORD) + 16)
          );
        }
        else{
          ctxImg.fillText(
            element.CHRPARAMNAME.toString().trim(),
            lRatioX * (parseInt(element.INTXCOORD) + 4),
            lRatioY * (parseInt(element.INTYCOORD) + 16)
          );
        }

      }
      });


      // if (this.gShapeParameters != null) {

    };

    imgObj.src = this.imageSrc;



}
testImage()
{
  debugger;
  this.Showimage =true;
  this.testimage = true;
  this.displayShapeImage();
}
EditCancel()
{
  this.enableEditIndex = -1;
  this.cabShapeCoOrdinatest = JSON.parse(JSON.stringify(this.cabShapeCoOrdinatest_backup));

}
UpdateParameters(item:any)
{
  debugger;
  const obj =
  {

      "StrShapeID": this.selectedShapecode,
      "ParameterSeq": item.INTPARAMSEQ,
      "ParameterName": item.CHRPARAMNAME.trim(),
      "XCoor": item.INTXCOORD,
      "YCoor": item.INTYCOORD,
      "ZCoor": item.INTZCOORD,
      "Visible": (item.VISIBLE.trim()==='VISIBLE') ? true : false,
      "symmetricTo": item.SYMMETRICTO,
      "Formula": item.FORMULA,
      "HAFormula": item.HEIGHTANGLEFORMULA,
      "OAFormula": item.OFFSETANGLEFORMULA,
      "Range": item.RoundOffRANGE

  }
  this.cabShapeService.UpdateParameters(obj).subscribe({
    next: (response) => {

      if(response)
      {
        this.tosterService.success("Parameters updated successfully");
      }
    },
    error: (e) => {
      this.tosterService.error("Failed to update parameters",e.error);
    },
    complete: () => {
      this.Showimage=false;
      this.enableEditIndex = -1;
      this.changeShape();
    },
  });
}
ShowAllShapes(){
  const modalRef = this.modalService.open(AllShapesComponent, { size: 'xl', backdrop: 'static' });
}

createCabShape() {
debugger;
this.cabShapeService.setShapecode(this.selectedShapecode);
  this.router.navigate(['/detailing/cabShape']);
}

chageStatusCab(status:number)
{
   status = Number(status);
this.cabShapeService.updateCabShapeStatus(this.selectedShapecode,status).subscribe({
      next:(response)=>{
        
      },
      error:(error)=>{
        alert("Status not changed ");
      },
      complete:()=>{
        alert("Status Updated Successfully");

      }
})
}

}
