import { ChangeDetectorRef, Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from '@angular/router';
//import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';



@Component({
  selector: 'app-ordercomponent',
  templateUrl: './ordercomponent.component.html',
  styleUrls: ['./ordercomponent.component.css']
})
export class OrdercomponentComponent implements OnInit {

  ordercomponentForm!: FormGroup;
  submitted = false;
  searchResult = true;
  closeResult = '';
  searchText: any = '';
  customerList: any = [];

  istoggel: boolean = false;
 
  projectList: any = [];
  loadingData = false;
  cancelledorderarray: any = [];
  isExpand: boolean = false;
  toggleFilters = false;

  page = 1;
  pageSize = 10;
  producttypeList: any []= [];


  constructor(private router: Router, private changeDetectorRef: ChangeDetectorRef, private formBuilder: FormBuilder, private modalService: NgbModal
    , private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
    this.customerList = [
      { item_id: 1, item_text: 'ASIAGLOBE TRADE CONSORTIUM PTE LTD' },
      { item_id: 2, item_text: 'ASL SHIPYARD PTE LTD' },
      { item_id: 3, item_text: 'ASSET RECOVERY PTE LTD' }

    ];
    this.producttypeList = [
      
      { item_id: 'ACS', item_text: 'ACS' },
      { item_id: 'BPC', item_text: 'BPC' },
      { item_id: 'CAB', item_text: 'CAB' },
      { item_id: 'MSH', item_text: 'MSH' },
      { item_id: 'CAR', item_text: 'CAR' },
      { item_id: 'PRC', item_text: 'PRC' },       

    ];
    this.ordercomponentForm = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      projecttype: new FormControl('', Validators.required),
      structelement: new FormControl('', Validators.required),      
      isallstd: new FormControl('', Validators.required),

    });

  }

  ngOnInit() {   

    this.changeDetectorRef.detectChanges();
    this.loadingData = true;
    console.log(this.loadingData)
    this.Loaddata();

  }
  Loaddata() {

    // Component Name , Revision, Transport Mode,Total Weight,
    // Total Pieces,   Standard,    Remarks,   Updated By
    // Updated Date ,Header  , Copy From

    this.cancelledorderarray = [
      { 'componentname':'TPNBC31CESBM260','rev':0, 'tranmode':'HB1', 'totwt':'23.5', 'totpc':'120', 'std':1, 'Remark':'', 'updatedby':'', 'updatedate':'', 'header':'', 'copyfrom':''  },
      { 'componentname':'TPNBC31CESBM259','rev':0, 'tranmode':'HB2', 'totwt':'23.5', 'totpc':'100', 'std':1, 'Remark':'', 'updatedby':'', 'updatedate':'', 'header':'', 'copyfrom':''  },
      { 'componentname':'TPNBC31CESBM258','rev':0, 'tranmode':'HB6', 'totwt':'23.5', 'totpc':'150', 'std':1, 'Remark':'', 'updatedby':'', 'updatedate':'', 'header':'', 'copyfrom':''  },
      { 'componentname':'TPNBC31CESBM257','rev':0, 'tranmode':'HB12','totwt':'23.5', 'totpc':'100', 'std':1, 'Remark':'', 'updatedby':'', 'updatedate':'', 'header':'', 'copyfrom':''  },
      { 'componentname':'TPNBC31CESBM256','rev':0, 'tranmode':'HB12','totwt':'23.5', 'totpc':'100', 'std':1, 'Remark':'', 'updatedby':'', 'updatedate':'', 'header':'', 'copyfrom':''  },
      { 'componentname':'TPNBC31CESBM255','rev':1, 'tranmode':'HB12','totwt':'23.5', 'totpc':'100', 'std':1, 'Remark':'', 'updatedby':'', 'updatedate':'', 'header':'', 'copyfrom':''  },
      { 'componentname':'TPNBC31CESBM254','rev':1, 'tranmode':'HB12','totwt':'23.5', 'totpc':'200', 'std':1, 'Remark':'', 'updatedby':'', 'updatedate':'', 'header':'', 'copyfrom':''  },
      { 'componentname':'TPNBC31CESBM253','rev':1, 'tranmode':'HB12','totwt':'23.5', 'totpc':'200', 'std':1, 'Remark':'', 'updatedby':'', 'updatedate':'', 'header':'', 'copyfrom':''  },
      { 'componentname':'TPNBC31CESBM252','rev':1, 'tranmode':'HB12','totwt':'23.5', 'totpc':'100', 'std':1, 'Remark':'', 'updatedby':'', 'updatedate':'', 'header':'', 'copyfrom':''  },
      { 'componentname':'TPNBC31CESBM251','rev':1, 'tranmode':'HB12','totwt':'23.5', 'totpc':'100', 'std':1, 'Remark':'', 'updatedby':'', 'updatedate':'', 'header':'', 'copyfrom':''  },
      { 'componentname':'TPNBC31CESBM250','rev':1, 'tranmode':'HB12','totwt':'23.5', 'totpc':'100', 'std':1, 'Remark':'', 'updatedby':'', 'updatedate':'', 'header':'', 'copyfrom':''  },
      { 'componentname':'TPNBC31CESBM249','rev':1, 'tranmode':'HB12','totwt':'23.5', 'totpc':'230', 'std':1, 'Remark':'', 'updatedby':'', 'updatedate':'', 'header':'', 'copyfrom':''  },
      { 'componentname':'TPNBC31CESBM248','rev':1, 'tranmode':'HB12','totwt':'23.5', 'totpc':'300', 'std':1, 'Remark':'', 'updatedby':'', 'updatedate':'', 'header':'', 'copyfrom':''  }
    ];
  }
  showDetails(item: any) {
    this.isExpand = true
  }
  public onItemSelect(item: any) {
    console.log(item.item_text);
    // console.log(e.target.value);
    // console.log(this.ordercomponentForm)

    //  let projecttName =e.target.value  
    this.ordercomponentForm.patchValue({ projectname: item.item_text });
  }
  // convenience getter for easy access to form fields
  get f() { return this.ordercomponentForm.controls; }

  onSubmit() {
    // console.log("submit clicked");
    this.submitted = true;

    // stop here if form is invalid
    if (this.ordercomponentForm.invalid) {
      return;
    }

    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.wbsForm.value, null, 4));


  }

  onReset() {
    this.submitted = false;
    this.ordercomponentForm.reset();
  }




  getPageData() {
    this.Loaddata();

    this.cancelledorderarray = this.cancelledorderarray
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

  }
  changecustomer(event: any) {
    console.log(event);
    this.LoadProject(event)

  }
  LoadProject(customerid: any) {
    if (customerid == 1) {
      this.projectList = [
        { item_id: 1, item_text: '0000100258-ECAGING FOR MARINA(0000102094:2990)-CAR' },
        { item_id: 2, item_text: '0000100805-PRECAGING FOR MARINA(0000102094:2990)-CAR' },
        { item_id: 3, item_text: '0000102416-PRECAGING FOR MARINA(0000102094:2990)-CAR' }];


    }
    else if (customerid == 2) {
      this.projectList = [
        { item_id: 4, item_text: '0000102444-PRECAGING FOR MARINA(0000102094:2990)-CAR' },
        { item_id: 5, item_text: '0000100326-HDB BUILDING WORKS AT KALLANG WHAMP OA RC 31(0000102256:3305)-ACS/BPC/CAB/CAR/MSH/PRC' },
        { item_id: 6, item_text: '0000100258-HDB BUILDING WORKS AT KALLANG WHAMP OA RC 31 (816 DU)(0000102259:3310)-ACS/BPC/CAB/CAR/MSH/PRC' }
      ];

    }
    else if (customerid == 3) {
      this.projectList = [
        { item_id: 7, item_text: '0000100326-HDB BUILDING WORKS AT KALLANG WHAMP OA RC 31 (816 DU)(0000102259:3310)-ACS/BPC/CAB/CAR/MSH/PRC' },
        { item_id: 8, item_text: '0000100001-REBAR TERM CONTRACT FOR 2009(0000100001:4553)-ACS/BPC/CAB/CAR/MSH/PRC' },
        { item_id: 9, item_text: '0000100705-REBAR TERM CONTRACT FOR 2009(0000100001:4553)-ACS/BPC/CAB/CAR/MSH/PRC' }

      ];

    }
    else if (customerid == 4) {
      this.projectList = [
        { item_id: 1, item_text: '0000100258-ECAGING FOR MARINA(0000102094:2990)-CAR' },
        { item_id: 2, item_text: '0000100805-PRECAGING FOR MARINA(0000102094:2990)-CAR' },
        { item_id: 3, item_text: '0000102416-PRECAGING FOR MARINA(0000102094:2990)-CAR' }
      ];

    }
    else if (customerid == 5) {
      this.projectList = [
        { item_id: 4, item_text: '0000102444-PRECAGING FOR MARINA(0000102094:2990)-CAR' },
        { item_id: 5, item_text: '0000100326-HDB BUILDING WORKS AT KALLANG WHAMP OA RC 31(0000102256:3305)-ACS/BPC/CAB/CAR/MSH/PRC' },
        { item_id: 6, item_text: '0000100258-HDB BUILDING WORKS AT KALLANG WHAMP OA RC 31 (816 DU)(0000102259:3310)-ACS/BPC/CAB/CAR/MSH/PRC' },
      ];

    }




  }
  changeproject(event: any) {
    if (event === 1 || event === 2 || event === 3 || event === 4) {
      // this.producttypeList = [
      //   { item_id: 'CAR', item_text: 'CAR' },  


      // ];
    }
    if (event === 5 || event === 6) {
      // this.producttypeList = [

      //   { item_id: 'ACS', item_text: 'ACS' },
      //   { item_id: 'BPC', item_text: 'BPC' },
      //   { item_id: 'CAB', item_text: 'CAB' },
      //   { item_id: 'MSH', item_text: 'MSH' },
      //   { item_id: 'CAR', item_text: 'CAR' },
      //   { item_id: 'PRC', item_text: 'PRC' },

      // ];
    }
    if (event === 7 || event === 8) {
      // this.producttypeList = [

      //   { item_id: 'ACS', item_text: 'ACS' },
      //   { item_id: 'BPC', item_text: 'BPC' },
      //   { item_id: 'CAB', item_text: 'CAB' }

      // ];
    }

  }
  // changestatus(iscreated:any,isdetailing:any,isposted:any,isreleased:any)
  // {
  //   this.Loaddata();
  //  this.iscreated=iscreated;
  //  this.isdetailing=isdetailing;
  //  this.isposted=isposted;
  //  this.isreleased=isreleased;


  // }

  download() {
    let fileName='ActiveOrders';    
     const blob =   new Blob(this.cancelledorderarray, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
      saveAs(blob, fileName + '.xlsx');
   
 }

 giveRowcolor(item:any)
 { 
   var color='#ffffff'

   if(item.istodaydeliver)
   {
     color='#6AB200';

   }
   else if(item.ispartialdeliver)
   {
     color='#00A589';
   }
  
   return color

 }
 



}



