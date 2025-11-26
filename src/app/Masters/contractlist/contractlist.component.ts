import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';

@Component({
  selector: 'app-contractlist',
  templateUrl: './contractlist.component.html',
  styleUrls: ['./contractlist.component.css']
})
export class ContractlistComponent implements OnInit {
  contractmasterform!: FormGroup 
  submitted = false;
  searchResult =true;
  closeResult = '';
  searchText:any;

  toggleFilters:boolean=false;
  projectList: any[]=[];
  Customerlist:any[]=[];
  Contractlist:any[]=[];
  contracttablelist:any[]=[];
  enableEditIndex:any=null;

  page = 1;
  pageSize = 10;

  constructor(private formBuilder: FormBuilder,private modalService: NgbModal) { }
  
 

  ngOnInit() {
   this.loaddata();
   
    this.Customerlist = [
      { item_id: 1, item_text: 'ASIAGLOBE TRADE CONSORTIUM PTE LTD' },
      { item_id: 2, item_text: 'ASL SHIPYARD PTE LTD' },
      { item_id: 3, item_text: 'ASSET RECOVERY PTE LTD' }

    ];
    this.projectList = [
      { item_id: 1, item_text: 'AC060648 - HDB-BLDG WKS @ PUNGGOL WE' },
      { item_id: 2, item_text: 'C060649 - HDB BLDG WORKS AT QUEENST' },
      { item_id: 3, item_text: 'INDUSTRIAL DEVELOPMENT BKT _ BATOK' }

    ];
    this.Contractlist = [
      { item_id: 1, item_text: '12648696' },
      { item_id: 2, item_text: '12648698' },
      { item_id: 3, item_text: '12648699' }

    ];  
    
    this.contractmasterform = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      contract: new FormControl('', Validators.required),
      projecttype: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),

    });

}
loaddata()
{
  this.contracttablelist=[       
 
    {'contrano':'1020000030','desc':'DUMMY-MESH',       'customercode':'0001100024','custname':'A PECIFIC CONSTRUCTION &DEVELOPMENT','startdate':'22/01/2022','enddate':'21/04/2022'},
    {'contrano':'1020000031','desc':'DUMMY-DRAIN-NET',  'customercode':'0001100031','custname':'ABI-SHOWATECH PTE LTD'              ,'startdate':'22/01/2022','enddate':'21/04/2022'},
    {'contrano':'NSH/09/445','desc':'DUMMY-MESH',       'customercode':'0001100101','custname':'ABCOM TRADING PTE LTD'              ,'startdate':'23/11/2021','enddate':'31/12/2021'},
    {'contrano':'1020000030','desc':'DUMMY-MESH',       'customercode':'0001100024','custname':'A PECIFIC CONSTRUCTION &DEVELOPMENT','startdate':'22/01/2022','enddate':'21/04/2022'},
    {'contrano':'1020000031','desc':'DUMMY-DRAIN-NET',  'customercode':'0001100031','custname':'ABI-SHOWATECH PTE LTD'              ,'startdate':'22/01/2022','enddate':'21/04/2022'},
    {'contrano':'NSH/09/445','desc':'DUMMY-MESH',       'customercode':'0001100101','custname':'ABCOM TRADING PTE LTD'              ,'startdate':'23/11/2021','enddate':'31/12/2021'},
    {'contrano':'1020000030','desc':'DUMMY-MESH',       'customercode':'0001100024','custname':'A PECIFIC CONSTRUCTION &DEVELOPMENT','startdate':'22/01/2022','enddate':'21/04/2022'},
    {'contrano':'1020000031','desc':'DUMMY-DRAIN-NET',  'customercode':'0001100031','custname':'ABI-SHOWATECH PTE LTD'              ,'startdate':'22/01/2022','enddate':'21/04/2022'},
    {'contrano':'NSH/09/445','desc':'DUMMY-MESH',       'customercode':'0001100101','custname':'ABCOM TRADING PTE LTD'              ,'startdate':'23/11/2021','enddate':'31/12/2021'},
    {'contrano':'1020000030','desc':'DUMMY-MESH',       'customercode':'0001100024','custname':'A PECIFIC CONSTRUCTION &DEVELOPMENT','startdate':'22/01/2022','enddate':'21/04/2022'},
    {'contrano':'1020000031','desc':'DUMMY-DRAIN-NET',  'customercode':'0001100031','custname':'ABI-SHOWATECH PTE LTD'              ,'startdate':'22/01/2022','enddate':'21/04/2022'},
    {'contrano':'NSH/09/445','desc':'DUMMY-MESH',       'customercode':'0001100101','custname':'ABCOM TRADING PTE LTD'              ,'startdate':'23/11/2021','enddate':'31/12/2021'}
  
  
  
                           
       ];
}
onReset()
{

}
onSubmit()
{

}
getPageData(){
    this.loaddata();
  this.contracttablelist =  this.contracttablelist
   .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    
  }


downloadFile() {
  let fileName='ContractList';  
 
   const blob =   new Blob(this.contracttablelist, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
    saveAs(blob, fileName + '.xlsx');
 
 }


}
