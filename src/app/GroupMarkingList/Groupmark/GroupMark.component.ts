import { ChangeDetectorRef, Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { MatSortModule } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NewGroupMarkComponent } from './addgroupmark/newgroupmark.component';




@Component({
  selector: 'app-GroupMark',
  templateUrl: './GroupMark.component.html',
  styleUrls: ['./GroupMark.component.css']
})
export class GroupMarkComponent implements OnInit {

  GroupMarkForm!: FormGroup;
  customerList: any[] = [];
  parameterList: any[] = [];
  projectList: any[] = [];
  producttypeList: any[] = [];
  searchResult: boolean = false;
  isaddnew: boolean = false;
  groupmarkinglist: any[] = [];
  StructElementlist: any[] = [];
  structureElementarray:any[]=[];
  




  constructor(public router: Router,private changeDetectorRef: ChangeDetectorRef, private formBuilder: FormBuilder, private modalService: NgbModal
    , private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
    this.customerList = [
      { item_id: 1, item_text: 'ASIAGLOBE TRADE CONSORTIUM PTE LTD' },
      { item_id: 2, item_text: 'ASL SHIPYARD PTE LTD' },
      { item_id: 3, item_text: 'ASSET RECOVERY PTE LTD' }

    ];
    this.parameterList = [
      { value: 1, text: 1 },
      { value: 2, text: 2 },
    ]
    this.projectList = [
      { item_id: 1, item_text: 'AC060648 - HDB-BLDG WKS @ PUNGGOL WE' },
      { item_id: 2, item_text: 'C060649 - HDB BLDG WORKS AT QUEENST' },
      { item_id: 3, item_text: 'INDUSTRIAL DEVELOPMENT BKT _ BATOK' }

    ];
    this.producttypeList = [
      { item_id: 1, item_text: 'CAR' },
      { item_id: 2, item_text: 'MSH' },
      { item_id: 3, item_text: 'PRC' }

    ];
    this.structureElementarray = [
      { item_id: 1, item_text: 'Beam' },
      { item_id: 2, item_text: 'Column' },
      { item_id: 3, item_text: 'Drain' },
      { item_id: 4, item_text: 'Dwall' },
      { item_id: 5, item_text: 'Slab' },
      { item_id: 6, item_text: 'FDN1' },
      { item_id: 7, item_text: 'MISC' },
      { item_id: 8, item_text: 'Pile' },
      { item_id: 9, item_text: 'Scab1' },
      { item_id: 10, item_text: 'Wall' },

    ];
    this.GroupMarkForm = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      // projectname: new FormControl('', Validators.required),
      projecttype: new FormControl('', Validators.required),
      StructureElement:new FormControl('',Validators.required)

    });

  }






  ngOnInit() {

    this.changeDetectorRef.detectChanges();
    this.groupmarkinglist = [
      { 'groupmark': '442A-FDN-B_TEST', 'paramset': 11, 'createdate': '18/01/2023', 'rev': 0 },
      { 'groupmark': '442A-FDN-B', 'paramset': 51, 'createdate': '13/01/2023 ', 'rev': 0 },
      { 'groupmark': 'TEST050720202', 'paramset': 45, 'createdate': '05/07/2022 ', 'rev': 0 },
      { 'groupmark': 'DRCPY', 'paramset': 2, 'createdate': '30/09/2021 ', 'rev': 1 }, 
      { 'groupmark': 'COPYTEST22', 'paramset': 2, 'createdate': '30/09/2021 ', 'rev': 0 },
      { 'groupmark': 'COPYTEST2', 'paramset': 45, 'createdate': '30/09/2021 ', 'rev': 0 },
      { 'groupmark': 'TACTON TEST', 'paramset': 49, 'createdate': '10/07/2019 ', 'rev': 0 },    
      { 'groupmark': 'SHAPE CODE ISSUE', 'paramset': 49, 'createdate': '10/07/2019 ', 'rev': 0 },
      { 'groupmark': 'MJ-ISSUE', 'paramset': 45, 'createdate': '15/05/2029 ', 'rev': 0 },
      { 'groupmark': 'INCORRECT_BOM_TEST', 'paramset': 47, 'createdate': '20/12/2018 ', 'rev': 0 }

    ];
  }

  // convenience getter for easy access to form fields
  get f() { return this.GroupMarkForm.controls; }
  addnew() {
    this.isaddnew = !this.isaddnew;

  }
  SaveParameter() {
    this.isaddnew = !this.isaddnew;
  }
  open() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',


    }
    const modalRef = this.modalService.open(NewGroupMarkComponent, ngbModalOptions);




  }
  search() {
    this.searchResult = true;
  }
  onSubmit() {

    // stop here if form is invalid
    if (this.GroupMarkForm.invalid) {
      return;
    }

  }

  onReset() {
    this.GroupMarkForm.reset();
  }


  isAllCheckBoxChecked() {
    //return this.wbspostingarray.every(p => p.checked);
  }

  checkAllCheckBox(ev: any) { // Angular 9

    //this.products.forEach(x => x.checked = ev.target.checked)
  }
  edit(index: any) {}




}



