import { TestBed } from '@angular/core/testing';

import { FileDownloadDirService } from './file-download-dir.service';

describe('FileDownloadDirService', () => {
  let service: FileDownloadDirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileDownloadDirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
