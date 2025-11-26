import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'
import { GroupMark } from 'src/app/Model/groupmark';
import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';

@Component({
  selector: 'app-releasewbs',
  templateUrl: './releasewbs.component.html',
  styleUrls: ['./releasewbs.component.css']
})
export class ReleasewbsComponent implements OnInit {
  releasewbsForm!: FormGroup;


  @Input() prodttype: any;
  @Input() structure: any;
  // @Input() wbsitemdata:any;
  userProfile: any
  formsubmit: boolean = false;
  disableSubmit: boolean = false
  isaddnew: boolean = false
  selectedItems: any = [];
  disabledropdown: boolean = false;

  groupmarkList: any = [];
  customerList: any[] = [];
  projectList: any[] = [];
  producttypeList: any[] = [];
  structureElementarray: any[] = [];

  wbssorlist: any[] = [];



  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal, private formBuilder: FormBuilder) { }
  ngOnInit(): void {
  

    this.wbssorlist = [
      {'SNO':'230136',  WBS1: '859C', WBS2: '1',  WBS3: 'D-1', BBS: 'ENGHT45543', BBSDesc: 'ENGHT45543', groupid: '1'  },
      {'SNO':'2288004', WBS1: 'MISC', WBS2: '1',  WBS3: 'D-2', BBS: 'ENGHT45543', BBSDesc: 'ENGHT45543', groupid: '1' },
      {'SNO':'230135',  WBS1: 'MISC', WBS2: 'TM', WBS3: 'D-2', BBS: 'ENGHT45543', BBSDesc: 'ENGHT45543', groupid: '1'  },
      {'SNO':'2288003', WBS1: 'MISC', WBS2: '13', WBS3: 'D-2', BBS: 'ENGHT45543', BBSDesc: 'ENGHT45543', groupid: '1' },
      {'SNO':'2288002', WBS1: '859C', WBS2: '14', WBS3: 'D-2', BBS: 'ENGHT45543', BBSDesc: 'ENGHT45543', groupid: '1'  },
      {'SNO':'2288001', WBS1: '859C', WBS2: '14', WBS3: 'D-2', BBS: 'ENGHT45543', BBSDesc: 'ENGHT45543', groupid: '1' },
      {'SNO':'226123',  WBS1: '859C', WBS2: '14', WBS3: 'D-2', BBS: 'ENGHT45543', BBSDesc: 'ENGHT45543', groupid: '1'  },
      {'SNO':'226122',  WBS1: '859C', WBS2: '14', WBS3: 'D-2', BBS: 'ENGHT45543', BBSDesc: 'ENGHT45543', groupid: '1' },

    ];

    //console.log(this.wbsdata)
    this.releasewbsForm = this.formBuilder.group({
      customer: [''],
      project: [''],
      projecttype: [''],
      groupmark: ['', Validators.required],
      StructureElement: [''],
      rev: ['0'],
      postqty: ['', Validators.required],
      remark: ['']

    });

  }
 
  submitReview() {
    this.activeModal.close({ event: 'close', isConfirm: true })
    //this.modalService.dismissAll()
  }



  cancel() {
    this.modalService.dismissAll()
  }

}
