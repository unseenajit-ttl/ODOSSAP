import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CabShapeServiceService } from '../../Service/cab-shape-service.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { forEach } from 'mathjs';

@Component({
  selector: 'app-all-shapes',
  templateUrl: './all-shapes.component.html',
  styleUrls: ['./all-shapes.component.css']
})
export class AllShapesComponent implements OnInit {
   // Initialize as 'undefined' for TypeScript
  isDrawing: boolean = false;
  isLoading: boolean = false;
  items = [
    { id: 1, name: 'Option 1', description: 'Description of option 1' },
    { id: 2, name: 'Option 2', description: 'Description of option 2' },
    { id: 3, name: 'Option 3', description: 'Description of option 3' }
  ];
  selectedItem: any;
  selectedDescription: string="";
  AllShapes:any[]=[];
  array:any[]=  [1,2,3,4]

  onSelectionChange() {
    if (this.selectedItem) {
      this.selectedDescription = this.selectedItem.description;
    } else {
      this.selectedDescription = '';
    }
  }


  constructor(private cabService:CabShapeServiceService,public modal : NgbActiveModal) {}

  ngOnInit() {



this.GetallImage();



  }
  // calculatetime()
  // {
  //   let create_date='2023-01-05 20:43:04.023'
  //   this.startTime= new Date(create_date);      //this.datePipe.transform(dte,'dd/MM/yyyy, hh:mm:ss' );
  //   this.stopTime= new Date();/// this.datePipe.transform(new Date(),'dd/MM/yyyy, hh:mm:ss' );//new Date();

  //   console.log(this.startTime)
  //   console.log(this.stopTime)

  //   const msBetweenDates =  this.stopTime.getTime()-this.startTime.getTime() ;
  //   this.convertMsToTime(msBetweenDates);
  // }
  //  convertMsToTime(milliseconds: number) {
  //   let seconds = Math.floor(milliseconds / 1000);
  //   let minutes = Math.floor(seconds / 60);
  //   const hours = Math.floor(minutes / 60);

  //   seconds = seconds % 60;
  //   minutes = minutes % 60;
  //   this.display=hours +':'+minutes+':'+seconds;
  //   console.log('Difference in hh:mm:ss format: ', hours +':'+minutes+':'+seconds);
  // }
  // EndProcessClick()
  // {
  //   if (this.interval) {
  //     clearInterval(this.interval);
  //  }
  // }
  dismissModal(){
    this.modal.dismiss("User closed modal!");
  }
  GetallImage() {
    //debugger;
    this.isLoading = true;
    this.cabService.PreviewAllImage().subscribe({
      next: (response) => {
        //console.log(response);
        this.AllShapes = response;

      },
      error: (e) => {
        //console.log("error", e);
        this.isLoading = false;
      },
      complete: () => {
        this.AllShapes.forEach(element => {
            element['imageSrc'] = 'data:image/png;base64,' + element.CSM_SHAPE_IMAGE;
          });
          this.isLoading = false;
      },
    });



  }

  downloadShapePDF(): void {
    const doc = new jsPDF();
  
    doc.text('Shape List', 14, 16);
  
    // Collect promises properly
    this.isLoading = true;
    const tableDataPromises = this.AllShapes.map(item =>
      this.resizeBase64Image(item.CSM_SHAPE_IMAGE, 200, 200)
        .then(resizedImage => ({
          chrShapeCode: item.CSM_SHAPE_ID,
          statusText: item.CSM_ACT_INACTIVE ? "Active" : "InActive",
          imageUrl: resizedImage,
          imageWidth: 40, // slightly smaller to fit better
          imageHeight: 40
        }))
    );
  
    Promise.all(tableDataPromises)
      .then(tableData => {
        const maxRowsPerPage = 5;
        const maxImageWidth = 50;
        const maxImageHeight = 50;
  
        // 🔥 Split tableData into chunks of 5 rows each
        const chunks = [];
        for (let i = 0; i < tableData.length; i += maxRowsPerPage) {
          chunks.push(tableData.slice(i, i + maxRowsPerPage));
        }
  
        chunks.forEach((chunk, index) => {
          // Add a new page except for the first one
          if (index > 0) {
            doc.addPage();
            doc.text('Shape List (continued)', 14, 16);
          }
  
          autoTable(doc, {
            head: [['Shape Code', 'Status', 'Image']],
            body: chunk.map(item => [
              item.chrShapeCode,
              item.statusText,
              ''
            ]),
            startY: 20,
            columnStyles: {
              2: { cellWidth: maxImageWidth, minCellHeight: maxImageHeight }
            },
            didDrawCell: (data) => {
              if (data.row.section === 'body') {
                const rowData = chunk[data.row.index];
                if (data.column.index === 2 && rowData?.imageUrl) {
                  doc.addImage(
                    rowData.imageUrl,
                    'PNG',
                    data.cell.x + 1,
                    data.cell.y + 1,
                    rowData.imageWidth,
                    rowData.imageHeight
                  );
                }
              }
            }
          });
        });
  
        doc.save('AllShapesList.pdf');
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Error generating PDF:', error);
        this.isLoading = false;
      });
  }
  
  
  resizeBase64Image(base64Str: string, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
  
        // Maintain aspect ratio while resizing
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
  
        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Failed to get canvas context');
  
        ctx.drawImage(img, 0, 0, width, height);
  
        // Convert canvas back to Base64
        const resizedBase64 = canvas.toDataURL('image/jpeg'); // can use 'image/png'
        resolve(resizedBase64);
      };
  
      img.onerror = (err) => reject(err);
      img.src = 'data:image/jpeg;base64,' + base64Str;
    });
  }

  
  
}
