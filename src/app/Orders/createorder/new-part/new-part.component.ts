import { Component, Input,ElementRef,VERSION,ViewChild,OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import SignaturePad from 'signature_pad';
import { AddWbsBbsComponent } from 'src/app/wbs/addWBSBBS/addwbsbbs.component';



@Component({
  selector: 'app-new-part',
  templateUrl: './new-part.component.html',
  styleUrls: ['./new-part.component.css']
})
export class NewPartComponent {
  createsNewWBSForm!: FormGroup;
  signPad: any;
  @ViewChild('signPadCanvas', {static: false}) signaturePadElement:any;
  signImage:any;

  @Input() name:any;
  @Input() formname:any;
  @Input() wbsitemdata:any;
  userProfile: any
  disableSubmit: boolean = false
  iConfirm: boolean = false
  selectedItems = [];
  dropdownSettings = {};
  MOCOList:any=[];
  BendTypeList:any=[];
  Status:any=[];
  isOHindicatior:boolean=false;
  
  
  constructor(public activeModal: NgbActiveModal,private modalService: NgbModal,private formBuilder: FormBuilder) {}
  
    ngOnInit(): void {
      this.MOCOList=[
        { item_id: 1, item_text: 'C' },
        
      ];
      this.BendTypeList=[
        { item_id: 1, item_text: 'Normal' },
        
      ];
      this.Status=[
        { item_id: 1, item_text: 'Active' },
        { item_id: 2, item_text: 'InActive' },
  
        
      ]
  
      this.selectedItems = [
        //  { item_id: 3, item_text: 'Pune' },
         //{ item_id: 4, item_text: 'Navsari' }
      ];
      this.dropdownSettings = {
        singleSelection: true,
        idField: 'item_id',
        textField: 'item_text',
        //selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 1,
        allowSearchFilter: true
      };
  
  
  
  
      this.createsNewWBSForm = this.formBuilder.group({
        WBS1: new FormControl ('', Validators.required),
        WBS2: new FormControl ('', Validators.required),
        WBS3: new FormControl ('', Validators.required),
        
      
    });
    
    }
    public onFilterChange(item: any) {
      console.log(item);
    }
    public onDropDownClose(item: any) {
      console.log(item);
    }
  
    public onItemSelect(item: any) {
      console.log(item);
    }
    public onDeSelect(item: any) {
      console.log(item);
    }
  
    submitReview() {
      alert("Details Submitted Successfully!")
     
    }
  
    cancel() {
      this.modalService.dismissAll()
    }
    changeOHindicatior()
    {
      this.isOHindicatior=!this.isOHindicatior;
    }
    
    
    ngAfterViewInit() {
      this.signPad = new SignaturePad(this.signaturePadElement.nativeElement);
    }
    /*It's work in devices*/
    startSignPadDrawing(event: Event) {
      console.log(event);
    }
    /*It's work in devices*/
    movedFinger(event: Event) {
    }
    /*Undo last step from the signature*/
    undoSign() {
      const data = this.signPad.toData();
      if (data) {
        data.pop(); // remove the last step
        this.signPad.fromData(data);
      }
    }
    /*Clean whole the signature*/
    clearSignPad() {
      this.signPad.clear();
    }
    /*Here you can save the signature as a Image*/
    saveSignPad() {
      const base64ImageData = this.signPad.toDataURL();
      this.signImage = base64ImageData;
      //Here you can save your signature image using your API call.
    }
  
}
