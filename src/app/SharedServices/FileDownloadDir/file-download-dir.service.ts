import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadDirService {

  constructor(private http: HttpClient) {}
 
  downloadFile(url: string, params: any, fileName: string): void {
    this.http.post(url, params, { responseType: 'blob' }).subscribe(
      (response: Blob) => {
        const blobUrl = URL.createObjectURL(response);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = fileName;
 
        // Trigger a click to download the file
        anchor.click();
 
        // Revoke the object URL to free memory
        URL.revokeObjectURL(blobUrl);
      },
      (error) => {
        console.error('File download failed', error);
      }
    );
  }
}
