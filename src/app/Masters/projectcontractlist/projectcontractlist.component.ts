import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';

import { Workbook } from 'exceljs';
import saveAs from 'file-saver';

@Component({
  selector: 'app-projectcontractlist',
  templateUrl: './projectcontractlist.component.html',
  styleUrls: ['./projectcontractlist.component.css']
})
export class ProjectcontractlistComponent implements OnInit {

  projectcontractform!: FormGroup 
  submitted = false;
  searchResult =true;
  closeResult = '';
  searchText:any;
  projectList: any[]=[];
  Customerlist:any[]=[];
  Contractlist:any[]=[];
  ProjectContractList:any[]=[];
  enableEditIndex:any=null;
  toggleFilters=false
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
    this.projectcontractform = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      contract: new FormControl('', Validators.required),
      projecttype: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),

    });
  

}

onReset()
{

}
onSubmit()
{

}
loaddata()
{
  this.ProjectContractList=[       
 
 
    {'projcode':'0000100466','projname':'HDB BUILDING WORKS AT SEMBAWANG N4 C15 (471 UNITS)', 'desc':'HDB BUILDING WORKS AT SEMBAWANG N4 C15 (471 UNITS)','coordinator':'LIN QUAN LONG 91060961', 'contrano': '1020000030','contradesc':'DUMMY-MESH'        ,  'startdate':'22/01/2022','enddate':'21/04/2022'},

    {'projcode':'0000100507','projname':'HDB LUP BULK C30 & LUP BULK C31'                    ,'desc':'HDB LUP BULK C30 & LUP BULK C31'                   ,'coordinator':'LIN QUAN LONG 91060961', 'contrano': '1020000031','contradesc':'DDUMMY-DRAIN-NET'  ,  'startdate':'22/01/2022','enddate':'21/04/2022'},
    
    {'projcode':'0000100507','projname':'HDB BUILDING WORKS AT PUNGGOL'                    ,'desc':'HDB BUILDING WORKS AT PUNGGOL'                      ,'coordinator':'LIN QUAN LONG 91060961', 'contrano': 'NSH/09/445','contradesc':'DDUMMY-MESH'        ,   'startdate':'23/11/2021','enddate':'31/12/2022'},                                          
    {'projcode':'0000100466','projname':'HDB BUILDING WORKS AT SEMBAWANG N4 C15 (471 UNITS)', 'desc':'HDB BUILDING WORKS AT SEMBAWANG N4 C15 (471 UNITS)','coordinator':'LIN QUAN LONG 91060961', 'contrano': '1020000030','contradesc':'DUMMY-MESH'        ,  'startdate':'22/01/2022','enddate':'21/04/2022'},

    {'projcode':'0000100507','projname':'HDB LUP BULK C30 & LUP BULK C31'                    ,'desc':'HDB LUP BULK C30 & LUP BULK C31'                   ,'coordinator':'LIN QUAN LONG 91060961', 'contrano': '1020000031','contradesc':'DDUMMY-DRAIN-NET'  ,  'startdate':'22/01/2022','enddate':'21/04/2022'},
    
    {'projcode':'0000100507','projname':'HDB BUILDING WORKS AT PUNGGOL'                    ,'desc':'HDB BUILDING WORKS AT PUNGGOL'                      ,'coordinator':'LIN QUAN LONG 91060961', 'contrano': 'NSH/09/445','contradesc':'DDUMMY-MESH'        ,   'startdate':'23/11/2021','enddate':'31/12/2022'}  ,                                        
    {'projcode':'0000100466','projname':'HDB BUILDING WORKS AT SEMBAWANG N4 C15 (471 UNITS)', 'desc':'HDB BUILDING WORKS AT SEMBAWANG N4 C15 (471 UNITS)','coordinator':'LIN QUAN LONG 91060961', 'contrano': '1020000030','contradesc':'DUMMY-MESH'        ,  'startdate':'22/01/2022','enddate':'21/04/2022'},

    {'projcode':'0000100507','projname':'HDB LUP BULK C30 & LUP BULK C31'                    ,'desc':'HDB LUP BULK C30 & LUP BULK C31'                   ,'coordinator':'LIN QUAN LONG 91060961', 'contrano': '1020000031','contradesc':'DDUMMY-DRAIN-NET'  ,  'startdate':'22/01/2022','enddate':'21/04/2022'},
    
    {'projcode':'0000100507','projname':'HDB BUILDING WORKS AT PUNGGOL'                    ,'desc':'HDB BUILDING WORKS AT PUNGGOL'                      ,'coordinator':'LIN QUAN LONG 91060961', 'contrano': 'NSH/09/445','contradesc':'DDUMMY-MESH'        ,   'startdate':'23/11/2021','enddate':'31/12/2022'}  ,                                        
    {'projcode':'0000100466','projname':'HDB BUILDING WORKS AT SEMBAWANG N4 C15 (471 UNITS)', 'desc':'HDB BUILDING WORKS AT SEMBAWANG N4 C15 (471 UNITS)','coordinator':'LIN QUAN LONG 91060961', 'contrano': '1020000030','contradesc':'DUMMY-MESH'        ,  'startdate':'22/01/2022','enddate':'21/04/2022'},

    {'projcode':'0000100507','projname':'HDB LUP BULK C30 & LUP BULK C31'                    ,'desc':'HDB LUP BULK C30 & LUP BULK C31'                   ,'coordinator':'LIN QUAN LONG 91060961', 'contrano': '1020000031','contradesc':'DDUMMY-DRAIN-NET'  ,  'startdate':'22/01/2022','enddate':'21/04/2022'},
    
    {'projcode':'0000100507','projname':'HDB BUILDING WORKS AT PUNGGOL'                    ,'desc':'HDB BUILDING WORKS AT PUNGGOL'                      ,'coordinator':'LIN QUAN LONG 91060961', 'contrano': 'NSH/09/445','contradesc':'DDUMMY-MESH'        ,   'startdate':'23/11/2021','enddate':'31/12/2022'}                                          
        
  
  ];
}
getPageData(){
  this.loaddata();
this.ProjectContractList =  this.ProjectContractList
 .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  
}

downloadFile() {
  let fileName='ProjectContractList';  
 
   const blob =   new Blob(this.ProjectContractList, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
    saveAs(blob, fileName + '.xlsx');
 
 }
}
