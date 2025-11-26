import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable,{ UserOptions,RowInput } from 'jspdf-autotable';
import { PreCastDetails } from '../Model/StandardbarOrderArray';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorServiceService {

  constructor() { }

  generateReport(customerName: string, projectName: string, tableData: PreCastDetails[]) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Load the logo from assets
    const img = new Image();
    img.src = '\\assets\\images\\NatSteel logo 2021-01.png'; // Path to the image in the assets folder

    img.onload = () => {
        // Add the logo to the PDF with reduced position
        doc.addImage(img, 'PNG', pageWidth - 60, 5, 50, 15); // Adjusted size and position

        // Add Title with reduced vertical spacing
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14); // Reduced font size
        doc.text('Precast Report', pageWidth / 2, 25, { align: 'center' }); // Reduced position

        // Define the Customer and Project Table with reduced padding
        const customerProjectTable: RowInput[] = [
            [
                { content: 'Customer', styles: { halign: 'center', fontStyle: 'bold' } },
                { content: customerName, styles: { halign: 'left', fontStyle: 'normal' } },
            ],
            [
                { content: 'Project', styles: { halign: 'center', fontStyle: 'bold' } },
                { content: projectName, styles: { halign: 'left', fontStyle: 'normal' } },
            ],
        ];

        // Draw the Customer and Project Table with reduced padding and black borders
        autoTable(doc, {
            startY: 40, // Reduced starting Y
            body: customerProjectTable,
            theme: 'grid',
            styles: {
                fontSize: 10, // Reduced font size
                cellPadding: 2, // Reduced padding
                valign: 'middle',
                font: 'helvetica',
                lineColor: [0, 0, 0], // Black border
                lineWidth: 0.3,
            },
            tableLineColor: [0, 0, 0], // Black border
            tableLineWidth: 0.3,
        });

        // Start main table below the Customer/Project section
        const finalY = (doc as any).lastAutoTable.finalY; // Access lastAutoTable
        autoTable(doc, {
            startY: finalY + 5, // Reduced vertical spacing
            head: [['Component Marking', 'Block', 'Level', 'Qty', 'Remark', 'Page No']],
            body: tableData.map<RowInput>((row) => [
                row.ComponentMarking,
                row.Block,
                row.Level,
                row.Qty,
                row.Remark,
                row.PageNo,
            ]),
            styles: {
                fontSize: 9, // Reduced font size
                cellPadding: 1, // Reduced padding
                halign: 'center',
                valign: 'middle',
                lineColor: [0, 0, 0], // Black border
                lineWidth: 0.5,
                font: 'helvetica',
            },
            headStyles: {
                fillColor: [60, 60, 60], // Dark gray header
                textColor: [255, 255, 255], // White text
                fontStyle: 'bold',
                lineColor: [0, 0, 0], // Black border
                lineWidth: 0.5,
            },
            bodyStyles: {
                minCellHeight: 7, // Reduced minimum cell height
                halign: 'center',
                lineColor: [0, 0, 0], // Black border
                lineWidth: 0.5,
            },
            theme: 'grid',
            didParseCell: function (data) {
                if (data.section === 'body') {
                  const rowData = tableData[data.row.index] as PreCastDetails; // ✅ original object
            
                  if (rowData.InGmList === 1) {
                    data.cell.styles.fillColor = [240, 128, 128]; // light red if not in GMList
                  }
                }
              }
        });

        // Add Footer with Page Numbers with reduced vertical spacing
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);

            // Add Footer with Page Number
            const pageHeight = doc.internal.pageSize.getHeight();
            doc.setFontSize(8); // Reduced font size
            doc.setFont('helvetica', 'normal');
            doc.text(
                `Page ${i} of ${pageCount}`,
                pageWidth - 20,
                pageHeight - 8, // Reduced position
                { align: 'right' }
            );

            // Add Total Pages on the first page with reduced vertical spacing
            if (i === 1) {
                doc.setFontSize(8); // Reduced font size
                doc.text(
                    `Total Pages: ${pageCount}`,
                    pageWidth - 50,
                    30 // Reduced position
                );
            }
        }
        // ✅ Add legend below the table
        const finalY_New = (doc as any).lastAutoTable.finalY || 20;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');

        // Draw color box
        doc.setFillColor(240, 128, 128);
        doc.setDrawColor(1, 1, 1);
        doc.rect(14, finalY_New + 6, 6, 6, 'FD'); // small red box

        // Legend text
        doc.text('Component Marking not matching with existing Groupmarks', 24, finalY_New + 11);
        // Save PDF
        const pdfData = doc.output("bloburl");  // create a blob URL

        // Open in a new tab
        window.open(pdfData, "_blank");

    };

    img.onerror = (error) => {
        console.error('Failed to load the logo image', error);
    };
}
  
  
}
