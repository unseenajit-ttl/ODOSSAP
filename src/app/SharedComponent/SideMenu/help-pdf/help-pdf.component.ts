import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-help-pdf',
  templateUrl: './help-pdf.component.html',
  styleUrls: ['./help-pdf.component.css']
})
export class HelpPdfComponent {
  pdfUrl: string;
  pdfSafeUrl: SafeResourceUrl;

  showbutton=false;
  constructor(private sanitizer: DomSanitizer) {
    this.pdfUrl = 'assets/OrderingUserManual.pdf';
    this.pdfSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl + '#toolbar=0');
    this.openPdfInNewTab();
  }

  openPdfInNewTab() {
    // Open a new tab
    const newTab = window.open('', '_blank');

    if (newTab) {
      this.showbutton=true;
      // Write the HTML structure inside the new tab
      newTab.document.write(`
        <html>
        <head>
          <title>User Manual</title>
          <style>
            body { text-align: center; font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .header { display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f4f4f4; }
            .download-icon {
              text-decoration: none;
              color: black;
              font-size: 30px;
              margin-right: 20px;
            }
            iframe { width: 100%; height: 90vh; border: none; }
          </style>
          <script>
            function downloadManual() {
              const a = document.createElement('a');
              a.href = '${this.pdfUrl}';
              a.download = 'OrderingUserManual.pdf';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
          </script>
        </head>
        <body>
          <div class="header">
          <i class="material-icons"
          ngbTooltip="Download Excel">download</i>
            <h2>User Manual</h2>
            <a href="javascript:void(0)" onclick="downloadManual()" class="download-icon" title="Download Manual">
              📥
            </a>
           
          </div>
          <iframe src="${this.pdfUrl}#toolbar=0"></iframe>
        </body>
        </html>
      `);
    } else {
      alert('Popup blocked! Please allow popups for this site.');
    }
  }
  downloadFile() {
    const a = document.createElement('a');
    a.href = this.pdfUrl;
    a.download = 'OrderingUserManual.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

  }
}

