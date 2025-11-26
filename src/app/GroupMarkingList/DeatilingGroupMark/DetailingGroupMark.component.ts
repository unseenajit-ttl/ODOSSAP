import { ChangeDetectorRef, Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-DetailingGroupMark',
  templateUrl: './DetailingGroupMark.component.html',
  styleUrls: ['./DetailingGroupMark.component.css']
})
export class DetailingGroupMarkComponent implements OnInit {

 // DetailingGroupMarkForm!: FormGroup;
  shapeCode_Toadd: any = {
    0: "2MR1",
    1: "2M12"
  }
  isEdit = false
  shapeList: any = [
    { value: 0, text: "2MR1" },
    { value: 1, text: "2M12" },
    { value: " ", text: " " }

  ];
  structElement: string;
  SlabHeading: string | undefined;
  selectparameter2: any;
  shapeSelected = false;
  imgTable: any;
  selectparameter: any;
  customerList: any[] = [];
  parameterList: any[] = [];
  projectList: any[] = [];
  WBSList: any[] = [];
  searchResult: boolean = false;
  isaddnew: boolean = false;
  groupmarkingColumnlist: any[] = [];
  groupmarkingBeamlist: any[] = [];
  StructElementlist: any[] = [];
  structureElementarray: any[] = [];
  Productmarkinglist: any[] = [];
  groupmarkingSlablist: any[] = [];
  shapeParameter: any = [];
  new_groupmarkingBeamlist: any[] = []
  showImage: boolean = false;
  startEdit = true;
  showChild: boolean = false;
  isExpand = false;
  flag = false;
  addList_flag = false;
  addList: any[] = [];
  obj_2M12: any = {
    'A': '',
    'B': '',
    'C': '',
    'p': '',
    'q': '',

  }
  obj_2MR1: any = {
    'A': '',
    'B': '',
    'C': '',

  }
  pushElement: any = {
    isExpand: false,
    'Marking': '',
    'Product': '',
    'Main': '',
    'Cross': '',
    'Qty': '',
    'Pin_Size': '32',
    'Shape': '',
    'Produce_Ind': '',
    'Split_Up _Ind': '',

    'Productmarkinglist': [

      { 'marking': '1', 'bi': 'S', 'width': 300, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 600, 'cross': 100, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;' },
    ]
  };


  //elementDetails:any[]=[];
  Queryparameterset: any;

  // items = [
  //   {
  //     id: 1,
  //     description: "one"
  //   },
  //   {
  //     id: 2,
  //     description: "two"
  //   },
  //   {
  //     id: 3,
  //     description: "tree"
  //   }

  // ];
  elementDetails: any;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute

  ) {




    this.customerList = [
      { item_id: 1, item_text: 'ASIAGLOBE TRADE CONSORTIUM PTE LTD' },
      { item_id: 2, item_text: 'ASL SHIPYARD PTE LTD' },
      { item_id: 3, item_text: 'ASSET RECOVERY PTE LTD' }

    ];
    this.Queryparameterset = this.route.snapshot.params['parameter'];

    this.structElement = this.route.snapshot.params['structureElement'];
    console.log(this.structElement)
    debugger;
    if (this.structElement == 'Slab' || this.structElement == 'Slab-B' || this.structElement == 'Slab-T' || this.structElement == 'Wall') {
      this.SlabHeading = this.structElement;
    } else {
      this.SlabHeading = "Slab";
    }

    this.parameterList = [
      { value: 1, text: 1 },
      { value: 2, text: 2 },

    ];

    this.parameterList.push({ value: this.Queryparameterset, text: this.Queryparameterset })
    this.projectList = [
      { item_id: 1, item_text: 'AC060648 - HDB-BLDG WKS @ PUNGGOL WE' },
      { item_id: 2, item_text: 'C060649 - HDB BLDG WORKS AT QUEENST' },
      { item_id: 3, item_text: 'INDUSTRIAL DEVELOPMENT BKT _ BATOK' }

    ];
    this.WBSList = [
      { item_id: 'BD849', item_text: 'BD849' },
      { item_id: 'GPER7', item_text: 'GPER7' },
      { item_id: 'GTY79', item_text: 'GTY79' },
      { item_id: 'BD849', item_text: 'BD849' }
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
    // this.DetailingGroupMarkForm = this.formBuilder.group({
    //   customer: new FormControl('', Validators.required),
    //   project: new FormControl('', Validators.required),
    //   projecttype: new FormControl('', Validators.required),
    //   StructureElement: new FormControl('', Validators.required),
    //   paramterset: new FormControl('', Validators.required),
    //   Marking: new FormControl(),
    //   Product: new FormControl(),
    //   Main: new FormControl(),
    //   Cross: new FormControl(),
    //   Shape: new FormControl(),
    //   Qty: new FormControl(),
    //   Pin_Size: new FormControl(),
    // });

  }

  showDetails(item: any) {
    this.isExpand = true
    // if (this.elementDetails != null && this.elementDetails.id == item.id){
    //   this.elementDetails = null;
    //   }
    // else this.elementDetails = item;
  }


  ngOnInit() {

    this.changeDetectorRef.detectChanges();
    this.groupmarkingColumnlist = [
      {
        'marking': '15', 'WID': 200, 'LEN': 600, 'Totallnk': 10, 'Product': 'LD10100', 'Shape': '2M1C', 'RowatLen': 0, 'Clinklen': 'LD10100CL', 'qty': 1, 'RowatWID': 0, 'ClinkWidth': 'LD10100CL', 'htg': '1000', 'clnk': true, 'clonly': true, 'pi': true, 'bc': false, 'pinsize': 32,
        isExpand: false,
        'Productmarkinglist': [

          { 'marking': '15', 'bi': 'S', 'width': 300, 'length': 500, 'qty': 1, 'Shape': '2M1C', 'main': 1800, 'cross': 2000, 'MO': '300/600', 'CO': '50/50', 'nooflinks': 20, 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' },
          { 'marking': '15', 'bi': 'S', 'width': 400, 'length': 500, 'qty': 1, 'Shape': '2M1C', 'main': 1800, 'cross': 2000, 'MO': '300/600', 'CO': '50/50', 'nooflinks': 20, 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' }

        ]

      },
      {
        'marking': '16', 'WID': 200, 'LEN': 600, 'Totallnk': 10, 'Product': 'LD10100', 'Shape': '2M1C', 'RowatLen': 0, 'Clinklen': 'LD10100CL', 'qty': 1, 'RowatWID': 0, 'ClinkWidth': 'LD10100CL', 'htg': '1000', 'clnk': true, 'clonly': true, 'pi': true, 'bc': false, 'pinsize': 32,
        isExpand: false,
        'Productmarkinglist': [

          { 'marking': '16', 'bi': 'S', 'width': 300, 'length': 500, 'qty': 1, 'Shape': '2M1C', 'main': 1800, 'cross': 2000, 'MO': '300/600', 'CO': '50/50', 'nooflinks': 20, 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' },
          { 'marking': '1615', 'bi': 'S', 'width': 400, 'length': 500, 'qty': 1, 'Shape': '2M1C', 'main': 1800, 'cross': 2000, 'MO': '300/600', 'CO': '50/50', 'nooflinks': 20, 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' }

        ]

      },

      {
        'marking': '18', 'WID': 200, 'LEN': 600, 'Totallnk': 10, 'Product': 'LD10100', 'Shape': '2M1C', 'RowatLen': 0, 'Clinklen': 'LD10100CL', 'qty': 1, 'RowatWID': 0, 'ClinkWidth': 'LD10100CL', 'htg': '1000', 'clnk': true, 'clonly': true, 'pi': true, 'bc': false, 'pinsize': 32,
        isExpand: false,
        'Productmarkinglist': [

          { 'marking': '16', 'bi': 'S', 'width': 300, 'length': 500, 'qty': 1, 'Shape': '2M1C', 'main': 1800, 'cross': 2000, 'MO': '300/600', 'CO': '50/50', 'nooflinks': 20, 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' },
          { 'marking': '1615', 'bi': 'S', 'width': 400, 'length': 500, 'qty': 1, 'Shape': '2M1C', 'main': 1800, 'cross': 2000, 'MO': '300/600', 'CO': '50/50', 'nooflinks': 20, 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' }

        ]

      },
      {
        'marking': '19', 'WID': 200, 'LEN': 600, 'Totallnk': 10, 'Product': 'LD10100', 'Shape': '2M1C', 'RowatLen': 0, 'Clinklen': 'LD10100CL', 'qty': 1, 'RowatWID': 0, 'ClinkWidth': 'LD10100CL', 'htg': '1000', 'clnk': true, 'clonly': true, 'pi': true, 'bc': false, 'pinsize': 32,
        isExpand: false,
        'Productmarkinglist': [

          { 'marking': '16', 'bi': 'S', 'width': 300, 'length': 500, 'qty': 1, 'Shape': '2M1C', 'main': 1800, 'cross': 2000, 'MO': '300/600', 'CO': '50/50', 'nooflinks': 20, 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' },
          { 'marking': '1615', 'bi': 'S', 'width': 400, 'length': 500, 'qty': 1, 'Shape': '2M1C', 'main': 1800, 'cross': 2000, 'MO': '300/600', 'CO': '50/50', 'nooflinks': 20, 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' }

        ]
      },
      { 'marking': '20', 'WID': 200, 'LEN': 600, 'Totallnk': 10, 'Product': 'LD10100', 'Shape': '2M1C', 'RowatLen': 0, 'Clinklen': 'LD10100CL', 'qty': 1, 'RowatWID': 0, 'ClinkWidth': 'LD10100CL', 'htg': '1000', 'clnk': true, 'clonly': true, 'pi': true, 'bc': false, 'pinsize': 32 },
      { 'marking': '22', 'WID': 200, 'LEN': 600, 'Totallnk': 10, 'Product': 'LD10100', 'Shape': '2M1C', 'RowatLen': 0, 'Clinklen': 'LD10100CL', 'qty': 1, 'RowatWID': 0, 'ClinkWidth': 'LD10100CL', 'htg': '1000', 'clnk': true, 'clonly': true, 'pi': true, 'bc': false, 'pinsize': 32 },
      { 'marking': '25', 'WID': 200, 'LEN': 600, 'Totallnk': 10, 'Product': 'LD10100', 'Shape': '2M1C', 'RowatLen': 0, 'Clinklen': 'LD10100CL', 'qty': 1, 'RowatWID': 0, 'ClinkWidth': 'LD10100CL', 'htg': '1000', 'clnk': true, 'clonly': true, 'pi': true, 'bc': false, 'pinsize': 32 },

    ];
    // console.log(this.groupmarkingBeamlist[0])
    this.shapeParameter = [{
      '2M1C': ['A'],
      '2M1E': ['A', 'B'],
      '2M1D': ['A', 'B']
    }]

    this.imgTable = {
      'MO1': '700', 'MO2': '200', 'CO1': '150', 'CO2': '140', 'A': '900', 'B': '400', 'C': '300', 'p': '50', 'q': ''
    }

    this.groupmarkingBeamlist = [
      [{
        'marking': '1', 'width': 200, 'depth': 600, 'slope': 100, 'Stirrups': 2349, 'shape': '2MR1', 'product': 'WB10', 'qty': 1, 'span': 2350, 'capping': true, 'capproduct': 'SR10100CP', 'prodind': true, 'pinsize': 32,
        isExpand: false, showImage: false, 'MO1': '700', 'MO2': '200', 'CO1': '150', 'CO2': '140', 'A': '50', 'B': '50', 'C': '50', 'MO1_isEdit': false, 'MO2_isEdit': false, 'CO1_isEdit': false, 'CO2_isEdit': false, 'A_isEdit': false, 'B_isEdit': false, 'C_isEdit': false, 'D_isEdit': false,
        'name': ['A', 'B', 'C', 'D'],
        lnk: '../../../assets/images/detailingGroupMarkImage1.png',

        editFieldName: false,
        'Productmarkinglist': [

          { 'marking': '1', 'bi': 'S', 'width': 300, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 600, 'cross': 100, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;' },
          { 'marking': '1', 'bi': 'S', 'width': 400, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 600, 'cross': 100, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;' }
        ]
      }],
      [{
        'marking': '1', 'width': 200, 'depth': 600, 'slope': 100, 'Stirrups': 2349, 'shape': '2M12', 'product': 'C', 'qty': 1, 'span': 2350, 'capping': true, 'capproduct': 'SR10100CP', 'prodind': true, 'pinsize': 32,
        isExpand: false, showImage: false, 'MO1': '', 'MO2': '', 'CO1': '', 'CO2': '', 'A': '', 'B': '', 'C': '', 'D': '', 'MO1_isEdit': true, 'MO2_isEdit': true, 'CO1_isEdit': true, 'CO2_isEdit': true, 'A_isEdit': true, 'B_isEdit': true, 'C_isEdit': true, 'D_isEdit': true,
        'name': ['A', 'B', 'C', 'D'],
        'Values': ['500', '300', '600', '900'],
        lnk: '../../../assets/images/detailingGroupMarkImage2.png',
        editFieldName: true,
        'Productmarkinglist': [

          { 'marking': '1', 'bi': 'S', 'width': 300, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' },
          { 'marking': '1', 'bi': 'S', 'width': 400, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' }
        ]
      }],



      // [
      //   {
      //     'marking': '2', 'width': 200, 'depth': 600, 'slope': 100, 'Stirrups': 2349, 'product': '2M1C', 'shape': 'C', 'qty': 1, 'span': 2350, 'capping': true, 'capproduct': 'SR10100CP', 'prodind': true, 'pinsize': 32,
      //     isExpand: false,
      //     'Productmarkinglist': [

      //       { 'marking': '2', 'bi': 'S', 'width': 300, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' },
      //       { 'marking': '2', 'bi': 'S', 'width': 400, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' }

      //     ]

      //   }
      // ],   // {
      //   'marking': '2', 'width': 200, 'depth': 600, 'slope': 100, 'Stirrups': 2349, 'product': '2M1C', 'shape': 'C', 'qty': 1, 'span': 2350, 'capping': true, 'capproduct': 'SR10100CP', 'prodind': true, 'pinsize': 32,
      //   isExpand: false,
      //   'Productmarkinglist': [

      //     { 'marking': '2', 'bi': 'S', 'width': 300, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' },
      //     { 'marking': '2', 'bi': 'S', 'width': 400, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' }

      //   ]

      // },

      // {
      //   'marking': '3', 'width': 200, 'depth': 600, 'slope': 100, 'Stirrups': 2349, 'product': '2M1C', 'shape': 'C', 'qty': 1, 'span': 2350, 'capping': true, 'capproduct': 'SR10100CP', 'prodind': true, 'pinsize': 32,
      //   isExpand: false,
      //   'Productmarkinglist': [

      //     { 'marking': '3', 'bi': 'S', 'width': 300, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' },
      //     { 'marking': '3', 'bi': 'S', 'width': 400, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' }

      //   ]

      // },
      // {
      //   'marking': '4', 'width': 200, 'depth': 600, 'slope': 100, 'Stirrups': 2349, 'product': '2M1C', 'shape': 'C', 'qty': 1, 'span': 2350, 'capping': true, 'capproduct': 'SR10100CP', 'prodind': true, 'pinsize': 32,
      //   isExpand: false,
      //   'Productmarkinglist': [

      //     { 'marking': '4', 'bi': 'S', 'width': 300, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' },
      //     { 'marking': '4', 'bi': 'S', 'width': 400, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' }

      //   ]

      // },

    ];
    this.groupmarkingSlablist = [
      {
        'marking': '1', 'width': 200, 'depth': 600, 'slope': 100, 'Stirrups': 2349, 'product': '2M1C', 'shape': 'C', 'qty': 1, 'span': 2350, 'capping': true, 'capproduct': 'SR10100CP', 'prodind': true, 'pinsize': 32,
        isExpand: false,
        'Productmarkinglist': [

          { 'marking': '1', 'bi': 'S', 'width': 300, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' },
          { 'marking': '1', 'bi': 'S', 'width': 400, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' }

        ],

      },
      {
        'marking': '2', 'width': 200, 'depth': 600, 'slope': 100, 'Stirrups': 2349, 'product': '2M1C', 'shape': 'C', 'qty': 1, 'span': 2350, 'capping': true, 'capproduct': 'SR10100CP', 'prodind': true, 'pinsize': 32,
        isExpand: false,
        'Productmarkinglist': [

          { 'marking': '2', 'bi': 'S', 'width': 300, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' },
          { 'marking': '2', 'bi': 'S', 'width': 400, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' }

        ]

      },

      {
        'marking': '3', 'width': 200, 'depth': 600, 'slope': 100, 'Stirrups': 2349, 'product': '2M1C', 'shape': 'C', 'qty': 1, 'span': 2350, 'capping': true, 'capproduct': 'SR10100CP', 'prodind': true, 'pinsize': 32,
        isExpand: false,
        'Productmarkinglist': [

          { 'marking': '3', 'bi': 'S', 'width': 300, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' },
          { 'marking': '3', 'bi': 'S', 'width': 400, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' }

        ]

      },
      {
        'marking': '4', 'width': 200, 'depth': 600, 'slope': 100, 'Stirrups': 2349, 'product': '2M1C', 'shape': 'C', 'qty': 1, 'span': 2350, 'capping': true, 'capproduct': 'SR10100CP', 'prodind': true, 'pinsize': 32,
        isExpand: false,
        'Productmarkinglist': [

          { 'marking': '4', 'bi': 'S', 'width': 300, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' },
          { 'marking': '4', 'bi': 'S', 'width': 400, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 1800, 'cross': 2000, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;D:300' }

        ]

      },

    ];
  }

  // convenience getter for easy access to form fields
  //get f() { return this.DetailingGroupMarkForm.controls; }
  addnew() {
    this.isaddnew = !this.isaddnew;

  }
  SaveParameter() {
    this.isaddnew = !this.isaddnew;
  }
  Beamstructenrty() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',


    }
    const modalRef = this.modalService.open(BeamStructMarkComponent, ngbModalOptions);




  }

  Columnstructenrty() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',


    }
    const modalRef = this.modalService.open(ColumnStructMarkComponent, ngbModalOptions);



  }
  search() {
    this.searchResult = true;
  }
  onSubmit() {

    // // stop here if form is invalid
    // if (this.DetailingGroupMarkForm.invalid) {
    //   return;
    // }

  }

  setImg(str: string, field: any) {




    this.groupmarkingBeamlist[this.i][0][str] = field;

    this.groupmarkingBeamlist[this.i][0].editFieldName = false;





  }

  onReset() {
   // this.DetailingGroupMarkForm.reset();
  }


  isAllCheckBoxChecked() {
    //return this.wbspostingarray.every(p => p.checked);
  }

  checkAllCheckBox(ev: any) { // Angular 9
    console.log(ev)
    this.showChild = !this.showChild;
    //this.products.forEach(x => x.checked = ev.target.checked)
  }
  edit(index: any) { }

  onCopy(item: any, index: any) {
    console.log(index)
    this.groupmarkingBeamlist[this.i][index].Productmarkinglist.push(item)
  }
  onCopy1(item: any) {
    item.Productmarkinglist.push(item.Productmarkinglist[0]);
  }
  i = 0;
  isTrue() {
    this.isEdit = true;
  }

  onEditNew(item: any, str: string) {

    item.editFieldName = str;
  }
  set(item: any, str: string, field: any) {

    item[str] = field;
    item.editFieldName = false;


  }
  setImage(item: any) {
    console.log(item)
  }
  Changeparam(event: any) {
    // this.shapeParameter = event;
    this.i = event;
    this.isEdit = false;
    this.shapeSelected = true;
    this.showImage = true;

  }
  suggestionChange() {
    alert("WBS has been assigned!")
  }

  flagTrue() {
    this.flag = true;
  }
  onEnter() {
    this.addList_flag = true;
    this.pushElement.Shape = this.shapeCode_Toadd[this.pushElement.Shape];
    if (this.pushElement.Shape == "2MR1") {
      this.pushElement.Productmarkinglist[0].shapeparam = `A:${this.obj_2MR1.A} ;B:${this.obj_2MR1.B};C:${this.obj_2MR1.C};`;
    }
    if (this.pushElement.Shape == "2M12") {
      this.pushElement.Productmarkinglist[0].shapeparam = `A:${this.obj_2M12.A} ;B:${this.obj_2M12.B};C:${this.obj_2M12.C} ; p:${this.obj_2M12.p};q:${this.obj_2M12.q} `;
    }

    this.pushElement.Productmarkinglist[0].main = this.pushElement.Main
    this.pushElement.Productmarkinglist[0].cross = this.pushElement.Cross
    this.pushElement.Productmarkinglist[0].qty = this.pushElement.Qty
    this.addList.push(this.pushElement);
    console.log(this.pushElement.Produce_Ind);
    this.pushElement = {
      isExpand: false,
      'Marking': '',
      'Product': '',
      'Main': '',
      'Cross': '',
      'Qty': '',
      'Pin_Size': '32',
      'Shape': '',
      'Produce_Ind': '',
      'Split_Up _Ind': '',

      'Productmarkinglist': [

        { 'marking': '1', 'bi': 'S', 'width': 300, 'depth': 500, 'slope': 500, 'qty': 1, 'main': 600, 'cross': 100, 'Shape': '2M1C', 'MO': '300/600', 'CO': '50/50', 'pi': true, 'bc': false, 'shapeparam': 'A:500;B:300;C:500;' },
      ]


    };
    this.obj_2M12 = {
      'A': '',
      'B': '',
      'C': '',
      'p': '',
      'q': '',

    }
    this.obj_2MR1 = {
      'A': '',
      'B': '',
      'C': '',

    }
    this.showImage = false;


  }
}


