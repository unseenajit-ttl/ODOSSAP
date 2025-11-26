import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-track-status',
  templateUrl: './track-status.component.html',
  styleUrls: ['./track-status.component.css'],
})
export class TrackStatusComponent implements OnInit {
  @Input() OrderNumber: any;
  @Input() PONumber: any;
  @Input() RequiredDate: any;
  @Input() Status: any;
  preparedpath:any='../../../../assets/imagesuiux/trackOrder/prepared_grey.png';
  submittedpath:any='../../../../assets/imagesuiux/trackOrder/submitted_grey.png';
  reviewedpath:any='../../../../assets/imagesuiux/trackOrder/reviewed_grey.png';
  productionpath:any='../../../../assets/imagesuiux/trackOrder/production_grey.png';
  deliveredpath:any='../../../../assets/imagesuiux/trackOrder/delivered_grey.png';
  constructor(public activeModal: NgbActiveModal) {}
  ngOnInit(): void {
    this.GetLinkPath()
    //throw new Error('Method not implemented.');
  }

  GetLinkPath() {
   
    if (this.Status == 'Prepared') {
      this.preparedpath ='../../../../assets/imagesuiux/trackOrder/prepared_color.png';
    }
    else if(this.Status == 'Submitted to NSH'){
      this.submittedpath ='../../../../assets/imagesuiux/trackOrder/submitted_color.png';
    }
    else if(this.Status == 'Reviewed'){
      this.reviewedpath ='../../../../assets/imagesuiux/trackOrder/reviewed_color.png';
    }
    else if(this.Status == 'Production'){
      this.productionpath ='../../../../assets/imagesuiux/trackOrder/production_color.png';
    }
    else if(this.Status == 'Delivered'){
      this.deliveredpath ='../../../../assets/imagesuiux/trackOrder/delivered_color.png';
    }
 
  }
  
}
