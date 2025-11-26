import { Component } from '@angular/core';
import { CabShapeServiceService } from 'src/app/DrawShape/Service/cab-shape-service.service';
import { ShapeMasterService } from '../../Services/shape-master.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



@Component({
  selector: 'app-allshapes',
  templateUrl: './allshapes.component.html',
  styleUrls: ['./allshapes.component.css']
})
export class AllshapesComponent {

  isDrawing: boolean = false;
  isLoading: boolean = false;
  selectedItem: any;
  selectedDescription: string = "";
  AllShapes: any[] = [];
  array: any[] = [1, 2, 3, 4]

  onSelectionChange() {
    if (this.selectedItem) {
      this.selectedDescription = this.selectedItem.description;
    } else {
      this.selectedDescription = '';
    }
  }


  constructor(private cabService: CabShapeServiceService,
    private shapemastersrvice: ShapeMasterService) { }

  ngOnInit() {



    this.GetallImage();



  }

  dismissModal() {
    // this.modal.dismiss("User closed modal!");
  }
  image: any;
  GetallImage() {
    //debugger;
    this.isLoading = true;

    this.shapemastersrvice.PreviewAllImage_MSH().subscribe({
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
          if (element.vchImage) {

            element['imageSrc'] = 'assets/images/Shapes/' + element.vchImage;  // Construct image path
          }
        });
        this.isLoading = false;

      },
    });



  }


  downloadPdf(): void {
    const doc = new jsPDF();

    // Add text to the PDF
    doc.text('Shape List', 14, 16);
    this.isLoading = true
    // Convert images to data URLs and prepare table data
    const tableDataPromises = this.AllShapes.map(item => this.loadImageAsDataUrl('assets/images/Shapes/' + item.vchImage)
      .then(({ dataUrl, width, height }) => ({
        chrShapeCode: item.chrShapeCode,
        statusText: this.getStatusText(item.tntStatusId),
        imageUrl: dataUrl,
        imageWidth: width,
        imageHeight: height
      }))
      .catch(() => ({
        chrShapeCode: item.chrShapeCode,
        statusText: this.getStatusText(item.tntStatusId),
        imageUrl: null, // No image
        imageWidth: 0,
        imageHeight: 0
      }))
    );

    Promise.all(tableDataPromises).then(tableData => {
      // Define maximum image dimensions and column width
      const maxImageWidth = 50; // Maximum width for image column
      const maxImageHeight = 50; // Maximum height for image column

      autoTable(doc, {
        head: [['Shape Code', 'Status', 'Image']],  // Table headers
        body: tableData.map(item => [
          item.chrShapeCode,
          item.statusText,
          item.imageUrl ? { image: item.imageUrl, width: Math.min(item.imageWidth, maxImageWidth), height: Math.min(item.imageHeight, maxImageHeight) } : null
        ]),
        startY: 20,  // Start position for the table
        columnStyles: {
          2: { cellWidth: maxImageWidth, minCellHeight: maxImageHeight } // Set column width and height for images
        },

        didDrawCell: (data) => {
          if (data.column.index === 2 && data.cell.raw && typeof data.cell.raw === 'object' && 'image' in data.cell.raw) {
            // Add image to cell if it exists
            const cellData = data.cell.raw as { image: string, width: number, height: number };
            if (cellData.image) {
              // Ensure the image fits within the cell
              const imageWidth = Math.min(cellData.width, maxImageWidth);
              const imageHeight = Math.min(cellData.height, maxImageHeight);
              doc.addImage(cellData.image, 'PNG', data.cell.x + 1, data.cell.y + 1, imageWidth, imageHeight);
            }
          }
        },

        margin: { bottom: 20 } // Add margin at the bottom of the page if needed
      });

      doc.save('AllShapesList.pdf');
      this.isLoading = false
    });
  }


  // Helper function to convert image to data URL and get its dimensions
  loadImageAsDataUrl(src: string): Promise<{ dataUrl: string, width: number, height: number }> {
    return new Promise<{ dataUrl: string, width: number, height: number }>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';  // Handle cross-origin images if necessary
      img.src = src;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve({
            dataUrl: canvas.toDataURL('image/png'),
            width: img.width,
            height: img.height
          });
        } else {
          reject(new Error('Canvas context is not available.'));
        }
      };

      img.onerror = () => reject(new Error('Image failed to load.'));
    });
  }

  downloadShapePDF(): void {
    const doc = new jsPDF();

    // Add text to the PDF
    doc.text('Shape List', 14, 16);
    this.isLoading = true;

    // Convert images to data URLs and prepare table data
    const tableDataPromises = this.AllShapes.map(item =>
        this.loadImageAsDataUrl('assets/images/Shapes/' + item.vchImage)
            .then(({ dataUrl, width, height }) => ({
                chrShapeCode: item.chrShapeCode,
                statusText: this.getStatusText(item.tntStatusId),
                imageUrl: dataUrl,
                imageWidth: width,
                imageHeight: height
            }))
            .catch(() => ({
                chrShapeCode: item.chrShapeCode,
                statusText: this.getStatusText(item.tntStatusId),
                imageUrl: null, // No image
                imageWidth: 0,
                imageHeight: 0
            }))
    );

    Promise.all(tableDataPromises).then(tableData => {
        // Define maximum image dimensions and column width
        const maxImageWidth = 50; // Maximum width for image column
        const maxImageHeight = 50; // Maximum height for image column

        autoTable(doc, {
            head: [['Shape Code', 'Status', 'Image']],  // Table headers
            body: tableData.map(item => [
                item.chrShapeCode,
                item.statusText,
                ''  // Leave the image column empty for now
            ]),
            startY: 20,  // Start position for the table
            columnStyles: {
                2: { cellWidth: maxImageWidth, minCellHeight: maxImageHeight } // Set column width and height for images
            },

            didDrawCell: (data) => {
                // Skip the header row (row index 0)
                if (data.row.section === 'body') {
                    const rowIndex = data.row.index; // Get the current row index in the body
                    const rowData = tableData[rowIndex]; // Match rowData to body rows only

                    // Check if the current column is the image column
                    if (data.column.index === 2 && rowData && rowData.imageUrl) {
                        // Add image to cell if it exists
                        const imageWidth = Math.min(rowData.imageWidth, maxImageWidth);
                        const imageHeight = Math.min(rowData.imageHeight, maxImageHeight);
                        doc.addImage(rowData.imageUrl, 'PNG', data.cell.x + 1, data.cell.y + 1, imageWidth, imageHeight);
                    }
                }
            },

            margin: { bottom: 20 } // Add margin at the bottom of the page if needed
        });

        doc.save('AllShapesList.pdf');
        this.isLoading = false;
    }).catch(error => {
        console.error('Error generating PDF:', error);
        this.isLoading = false;
    });
}


  getStatusText(statusId: number): string {
    switch (statusId) {
      case 1:
        return 'Active';
      case 2:
        return 'Inactive';
      default:
        return 'Unknown';
    }
  }
}
