import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../orders.service';

@Component({
  selector: 'app-update-project-incharge',
  templateUrl: './update-project-incharge.component.html',
  styleUrls: ['./update-project-incharge.component.css']
})
export class UpdateProjectInchargeComponent implements OnInit {
  @Input() CustomerCode: any;
  @Input() ProjectCode: any;
  @Input() ProjectIncharge:any;
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();


  Projectincharge: any = ""

  ProjectInchargeList: any[] = [];
  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService) { }
  ngOnInit(): void {
    this.GetProjectIncharge()
  }

  GetProjectIncharge() {
    this.orderService.getProjectIncharge().subscribe({
      next: (response) => {
        console.log(response);
        this.ProjectInchargeList = response;


        const selectedArray = this.ProjectIncharge
          ? Array.isArray(this.ProjectIncharge)
            ? this.ProjectIncharge
            : [this.ProjectIncharge]
          : [];

          selectedArray.forEach((val) => {
            if (
              !this.ProjectInchargeList.some(
                (item) => item.ProjectIncharge === val
              )
            ) {
              this.ProjectInchargeList.push({ ProjectIncharge: val });
            }
          });
          this.Projectincharge = selectedArray;

      },
      error: (e) => { },
      complete: () => {
      },
    });
  }


  UpdateIncharge() {
    debugger
    let obj = {
      CustomerCode: [
        this.CustomerCode
      ],
      ProjectCode: [
        this.ProjectCode
      ],
      ProjIncharge: this.Projectincharge[0]
    }
    this.orderService.UpdateProjInchargeDB(obj).subscribe({
      next: (response) => {
        if (response.Value.success) {
          alert('Project In-Charge Updated Successfully')
          this.saveTrigger.emit();
          this. close();

        }
      },
      error: (e) => { },
      complete: () => {
      },
    });
  }

  close() {
    this.activeModal.dismiss('Cross click')
  }
}
