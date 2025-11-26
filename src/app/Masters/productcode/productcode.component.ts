import { Component, NgModuleRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { addProductcodeComponent } from './addproductcode/create-productcode.component';
import { DeleteDialogComponent } from 'src/app/SharedComponent/Dialogs/delete-dialog/delete-dialog.component';
import { ProductCodeService } from '../Services/ProductCode/product-code.service';
import { ALL_PRODUCT_CODE_LIST } from 'src/app/Model/all_product_code_list';
import { CORECAGE_PRODUCT_CODE_LIST } from 'src/app/Model/corecage_product_code_list';
import { CAB_PRODUCT_CODE_LIST } from 'src/app/Model/cab_product_code_list';
import { ToastrService } from 'ngx-toastr';
import { INPUT_MODALITY_DETECTOR_DEFAULT_OPTIONS } from '@angular/cdk/a11y';
import { ACS_PRODUCT_CODE_LIST } from 'src/app/Model/acs_product_code_list';
import * as XLSX from 'xlsx'
import { MESH_PRODUCTCODE_LIST } from 'src/app/Model/mesh_productcode_list';
import { ALL_COMMONPRODUCTCODE_LIST } from 'src/app/Model/all_commonproductcode_list';
import { RowMaterialProductCode } from 'src/app/Model/rowmaterialproductcode';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/SharedServices/CommonService';



@Component({
  selector: 'app-productcode',
  templateUrl: './productcode.component.html',
  styleUrls: ['./productcode.component.css']
})
export class ProductcodeComponent implements OnInit {
  productcodeForm!: FormGroup;
  mainwireDetails!: FormGroup;
  crosswireDetails!: FormGroup;
  sap_step = false;
  TotalNumberofRecord = 10;
  mainwire_step = false;
  crosswire_step = false;
  step = 1;
  searchText: any;
  searchResult = true;

  ProductCodeTypeList: any[] = [];
  prodlist: MESH_PRODUCTCODE_LIST[] = [];
  backup_prodlist: MESH_PRODUCTCODE_LIST[] = [];

  gradeList: any[] = [];
  FGSAMaterialList: any = [];
  RMSAMaterialList: any = [];
  CouplerTypeList: any = [];
  statuslist: any[] = [];
  isshowcupler: boolean = false;

  loading = true;
  toggleFilters = false;
  isEditing: boolean = false;
  enableEditIndex = null;

  productcodelist: any[] = [];

  cabprodlist: any[] = [];
  selectproductType: any[] = [];

  isRowMaterial: boolean = false;
  corecageprodlist: any[] = [];
  filteredPost: any[] = [];


  structureList: any[] = [];
  twinindlist: any[] = [];
  mwprod: any[] = [];
  Allproductlist: ALL_COMMONPRODUCTCODE_LIST[] = [];

  // productType: any[] = [];
  productCode: any[] = [];
  structureElement: any[] = [];



  allprodarraylen: any;
  meshprodarraylen: any;
  cabprodarraylen: any;
  corecagearraylen: any;
  combined_table: any[] = []
  combined_table_code: any[] = []
  combined_tabl_type: any[] = []
  temp_table: any[] = []
  name: string = '';
  AllProductListData: ALL_PRODUCT_CODE_LIST[] = [];
  backupData: ALL_PRODUCT_CODE_LIST[] = [];

  CabProductListData: CAB_PRODUCT_CODE_LIST[] = [];
  backup_CABData: CAB_PRODUCT_CODE_LIST[] = [];

  AcsProductListData: ACS_PRODUCT_CODE_LIST[] = [];
  backup_AccList: ACS_PRODUCT_CODE_LIST[] = [];

  CoreCageProductListData: CORECAGE_PRODUCT_CODE_LIST[] = [];
  backup_CoreCageData: CORECAGE_PRODUCT_CODE_LIST[] = [];

  multipleSelect: boolean = true
  prodtypeid: CAB_PRODUCT_CODE_LIST[] = [];
  RowProdcodeList: RowMaterialProductCode[] = [];
  backup_RowProdcodeList: RowMaterialProductCode[] = [];

  searchcorecageprodcode: any = undefined;
  searchcorecagedesc: any;
  searchcorecageprotype: any;
  searchcorecagestructtype: any;
  searchcorecagewt: any;
  searchcorecagestatus: any;

  maxSize = 5;
  currentPageCAB = 1;
  itemsPerPageCAB = 10;
  pageSizeCAB: number = 0;
  TotalNumberofRecordCAB: any;

  currentPageCAR = 1;
  itemsPerPageCAR = 10;
  pageSizeCAR: number = 0;

  currentPageMESH = 1;
  itemsPerPageMESH = 10;
  pageSizeMESH: number = 0;

  currentPage = 1;
  pageSize = 0;
  itemsPerPage = 10;


  pageSizeROW: number = 0;
  itemsPerPageROW = 10;
  currentPageROW = 1;

  listTodownload: any;

  searchprodcode: any;
  searchdesc: any;
  searchprotype: any;
  searchstructtype: any;
  searchwt: any;
  searchstatus: any;

  searchgreadetype: any;
  searchdiameter: any;
  searchfgsa: any;
  searchrmsa: any;
  searchcoupler: any;
  searchcouplertype: any;
  searchcabstatus: any;
  searchproductcode: any;
  searchproductdesc: any;

  searchMESHprodcode: any;
  searchMESHDesc: any;
  searchMESHmwprod: any;
  searchMESHcwprod: any;
  searchMESHmwspace: any;
  searchMESHcwspace: any;
  searchMESHstructtype: any;
  searchMESHwt: any;
  searchMESHtwinind: any;
  searchMESHstatus: any;

  //ACE
  searchACCproductcode: any;
  searchACCdescription: any;
  searchACCgradetype: any;
  searchACCdiameter: any;
  searchACCfgsa: any;
  searchACCrmsa: any;
  searchACCstatus: any;
  searchACCcreatedby: any;
  searchACCupdatedby: any;

  //Common
  searchAllprodcode: any;
  searchAllDesc: any;
  searchAllprotype: any;
  searchAllstructtype: any;
  searchAllstatus: any;

  //IsRowMaterial
  searchRowprodcode: any;
  searchRowdescription: any;
  searchRowmaterialtype: any;
  searchRowdiameter: any;
  searchRowmaterialabbr: any;
  searchRowgrade: any;
  searchRowweightrun: any;
  searchRowstatus: any;


  currentPageCommon: number = 1;
  itemsPerPageCommon: number = 10;
  pageSizeCommon: number = 0;





  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private productcodeService: ProductCodeService,
    private tosterService: ToastrService, private route: ActivatedRoute,private commonService: CommonService) { }


  ngOnInit(): void {
    this.commonService.changeTitle('ProductCode | ODOS');
    this.GetProductTypeList();
    this.GetStructureElement();
    this.LoadAllproductData(this.selectproductType.toString());

    //CALLING THESE METHODS FROM NGONINIT UNTILL A RESOLVER OR ANOTHER SOLUTION IS MADE

    this.statuslist = [
      { item_id: 1, item_text: 'Active' },
      { item_id: 2, item_text: 'Inactive' }];


    this.productcodeForm = this.formBuilder.group({
      producttype: ['', Validators.required],
      structureelement: ['', Validators.required],
      productcode: ['', Validators.required],
      IsRowMaterial: ['', Validators.required]

    });




  }

  public onPageChangeCommon(pageNum: number): void {

    this.pageSizeCommon = this.itemsPerPageCommon * (pageNum - 1);

  }


  GetStructureElement() {
    this.productcodeService.GetStructureElement_Dropdown_Mesh().subscribe({
      next: (response) => {
        this.structureList = response;
      },
      error: (e) => {
      },
      complete: () => {

      },

    });
  }

  onSubmit() {
    console.log("submit clicked");
    //this.submitted = true;

    // stop here if form is invalid
    if (this.productcodeForm.invalid) {
      return;
    }


  }

  GetProductTypeList() {
    this.productcodeService.GetProductType_List().subscribe({
      next: (response) => {
        this.ProductCodeTypeList = response;
      },
      error: (e) => {
      },
      complete: () => { },

    });
  }
  onReset() {
    //this.submitted = true;

    this.productcodeForm.reset();

    this.selectproductType = [];
    this.productCode = [];
    this.structureElement = [];
    this.allprodarraylen = this.Allproductlist.length;
    //this.selectproductType.reset();
    this.LoadAllproductData(this.selectproductType.toString())

  }

  selectFilter(arr: any) {
    let list = JSON.parse(JSON.stringify(arr));
    this.allprodarraylen = list.length;

    console.log(this.selectproductType,
      this.productCode,
      this.structureElement)

    this.temp_table = [];
    if (this.selectproductType.length > 1 || this.selectproductType.length == 0) {
      if (this.selectproductType.length != 0) {

        for (let obj in this.selectproductType) {
          let object = this.ProductCodeTypeList.find(x => x.ProductTypeID === this.selectproductType[obj])
          this.filteredPost = list.filter((item: { ProductType: string; }) =>
            item.ProductType.toLowerCase().includes(object.ProductType.toLowerCase())
          );
          this.temp_table = [...this.temp_table, ...this.filteredPost]
        }
        list = this.temp_table
      };
    }
    this.temp_table = [];
    this.filteredPost = [];

    if (this.productCode.length != 0) {
      for (let obj in this.productCode) {
        this.filteredPost = list.filter((item: { ProductCode: string; }) =>
          item.ProductCode?.toLowerCase().includes(this.productCode[obj].toLowerCase())
        );
        this.temp_table = [...this.temp_table, ...this.filteredPost]
      }
      list = this.temp_table
    };
    this.temp_table = [];
    this.filteredPost = [];

    if (this.structureElement.length != 0) {
      for (let obj in this.structureElement) {
        let object = this.structureList.find(x => x.StructureElementTypeId === this.structureElement[obj])
        this.filteredPost = list.filter((item: { StructureElementType: string; }) =>
          item.StructureElementType?.toLowerCase().includes(object.StructureElementType.toLowerCase())
        );
        this.temp_table = [...this.temp_table, ...this.filteredPost]
      }
      list = this.temp_table
    };
    this.temp_table = [];
    this.filteredPost = [];

    console.log("all", list)
    return list
  }


  filterData() {
    debugger;
    this.loading = true;
    if (this.selectproductType.length == 1) {
      if (this.selectproductType[0] == 4) {
        this.GetCabProducuctCodeList();

      }
      else if (this.selectproductType[0] == 15) {
        this.GetCoreCageProductCodeList()

      }
      else if (this.selectproductType[0] == 11) {
        this.GetAcsProducuctCodeList();

      }
      else if (this.selectproductType[0] == 7 && this.isRowMaterial == true) {
        debugger;
        this.GetRowMaterialProducuctCodeList();


      }
      else if (this.selectproductType[0] == 7 && this.isRowMaterial == false) {
        debugger;
        this.GetMeshProducuctCodeList();

      }
    }
    else if (this.selectproductType.length > 1 || this.selectproductType.length == 0) {
      console.log(this.selectproductType);
      this.LoadAllproductData(this.selectproductType.toString())
      this.Allproductlist = JSON.parse(JSON.stringify(this.backupData));

      this.productcodelist = JSON.parse(JSON.stringify(this.Allproductlist));
      this.allprodarraylen = this.Allproductlist.length;

    }
  }


  LoadAllproductData(selectedproducttype: any) {
    this.productcodeService.GetCommonProductCodeList(selectedproducttype.toString()).subscribe({
      next: (response) => {
        this.Allproductlist = response;
        this.productcodelist = response
        debugger;
        console.log(this.Allproductlist);
      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false;
        this.backupData = JSON.parse(JSON.stringify(this.Allproductlist));
        this.Allproductlist = this.selectFilter(this.Allproductlist)
      },
    });
  }
  ChangeRowMaterial() {
    if (this.selectproductType[0] == 7 && this.isRowMaterial == true) {
      debugger;
      this.GetRowMaterialProducuctCodeList();
      this.structureElement = [];
      this.productCode = [];
    }
    else if (this.selectproductType[0] == 7 && this.isRowMaterial == false) {
      debugger;
      //Mesh List to do
    }

  }


  Cabdelete(index: any, item: any) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      // size: 'lg',
    }
    this.loading = true;
    const modalRef = this.modalService.open(DeleteDialogComponent, ngbModalOptions);
    console.log(item);
    modalRef.result.then(modalResult => {
      if (modalResult.isConfirm) {
        let id = item.CABProductCodeID;
        this.productcodeService.DeleteCabProductCodeList(id).subscribe({
          next: (response) => {
            // this.RowProdcodeList.splice(index, 1);  
            this.tosterService.success(' Cab  deleted successfully')

          },
          error: (e) => {
          },
          complete: () => {
            this.GetCabProducuctCodeList();
            this.loading = false;

          },

        });

        this.GetCabProducuctCodeList();


      }
    });


  }
  ACSdelete(index: any, item: any) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      // size: 'lg',
    }
    const modalRef = this.modalService.open(DeleteDialogComponent, ngbModalOptions);
    console.log(item);
    this.loading = true;

    modalRef.result.then(modalResult => {
      if (modalResult.isConfirm) {
        let id = item.AccessoriesProductCodeID;
        this.productcodeService.DeleteAcsProductCodeList(id).subscribe({
          next: (response) => {
            // this.RowProdcodeList.splice(index, 1);  
            this.tosterService.success(' Accessories deleted successfully')

          },
          error: (e) => {
          },
          complete: () => {
            this.GetAcsProducuctCodeList();
            this.loading = false;
          },

        });

      }
    })

  }



  searchACCData() {
    this.GetCabProducuctCodeList()
    this.AcsProductListData = JSON.parse(JSON.stringify(this.backup_AccList));
    debugger;
    if (this.searchACCproductcode != undefined) {

      this.AcsProductListData = this.AcsProductListData.filter(item =>

        item.ProductCode.toLowerCase().includes(this.searchACCproductcode.trim().toLowerCase())

      );

    }

    if (this.searchACCdescription != undefined) {

      this.AcsProductListData = this.AcsProductListData.filter(item =>

        item.Description.toLowerCase().includes(this.searchACCdescription.trim().toLowerCase())

      );

    }

    if (this.searchACCgradetype != undefined) {

      this.AcsProductListData = this.AcsProductListData.filter(item =>

        item.GradeType?.toLowerCase().includes(this.searchACCgradetype.trim().toLowerCase())

      );

    }

    if (this.searchACCdiameter != undefined) {

      this.AcsProductListData = this.AcsProductListData.filter(item =>

        item.Diameter.toString().toLowerCase().includes(this.searchACCdiameter.trim().toLowerCase()));

    }

    if (this.searchACCfgsa != undefined) {




      this.AcsProductListData = this.AcsProductListData.filter(item =>




        item.FG_SAPMaterialCode.toString().toLowerCase().includes(this.searchACCfgsa.trim().toLowerCase())




      );

    }

    if (this.searchACCcreatedby != undefined) {

      this.AcsProductListData = this.AcsProductListData.filter(item =>
        item.CreatedUId.toString().toLowerCase().includes(this.searchACCcreatedby.trim().toLowerCase())




      );




    }




    if (this.searchACCupdatedby != undefined) {




      this.AcsProductListData = this.AcsProductListData.filter(item =>




        item.UpdatedUId.toString().toLowerCase().includes(this.searchACCupdatedby.trim().toLowerCase())




      );



    }
    if (this.searchACCstatus != undefined) {

      this.AcsProductListData = this.AcsProductListData.filter(item =>

        item.StatusId.toString().toLowerCase().includes(this.searchACCstatus.toString().toLowerCase())

      );
    }



  }



  corecagedelete(index: any, item: any) {
    debugger;
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      // size: 'lg',
    }
    this.loading = true;
    const modalRef = this.modalService.open(DeleteDialogComponent, ngbModalOptions);
    console.log("corecagedelete", item);
    modalRef.result.then(modalResult => {
      if (modalResult.isConfirm) {
        let id = item.ProductCodeId;
        this.productcodeService.DeleteCarProductCodeList(id).subscribe({
          next: (response) => {
            // this.RowProdcodeList.splice(index, 1);  
            this.tosterService.success(' Corecage  deleted successfully')

          },
          error: (e) => {
          },
          complete: () => {            
            this.GetCoreCageProductCodeList();
            this.loading = false;
          },

        });
        console.log(modalResult.isConfirm);



      }
    });



  }
  meshdelete(index: any, item: any) {

    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      // size: 'lg',
    }
    this.loading = true;
    const modalRef = this.modalService.open(DeleteDialogComponent, ngbModalOptions);



    modalRef.result.then(modalResult => {
      if (modalResult.isConfirm) {
        let id = item.ProductCodeId;
        this.productcodeService.DeleteMESHProductCodeList(id).subscribe({
          next: (response) => {
            // this.RowProdcodeList.splice(index, 1);  
            this.tosterService.success(' Mesh deleted successfully')

          },
          error: (e) => {
          },
          complete: () => {

            this.GetMeshProducuctCodeList();
            this.loading = false;
          },

        });
        console.log(modalResult.isConfirm);


      }
    });


  }

  onEdit(ProductID: any, ProductTypeId: any, index: any) {
    debugger
    // index = this.pageSize * (this.page - 1) + index;
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',

    }
    const modalRef = this.modalService.open(addProductcodeComponent, ngbModalOptions);
    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.Prodtypeid = ProductTypeId
    modalRef.componentInstance.Productid = ProductID;
    if (this.isRowMaterial) {
      modalRef.componentInstance.RawMaterial = index ///In case row material only
    } else {
      modalRef.componentInstance.RawMaterial = false
    }
    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      this.GetCabProducuctCodeList();
      this.GetCoreCageProductCodeList();
      this.GetAcsProducuctCodeList();
      this.GetRowMaterialProducuctCodeList();
      this.GetMeshProducuctCodeList();
    })
  }
  commondelete(ProductCodeID: any, ProductTypeId: any) {
    debugger;
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      // size: 'lg',
    }
    const modalRef = this.modalService.open(DeleteDialogComponent, ngbModalOptions);

    modalRef.result.then(modalResult => {
      if (modalResult.isConfirm) {
        debugger;
        this.productcodeService.DeleteCommonProductCode(ProductCodeID, ProductTypeId).subscribe({
          next: (response) => {
            this.loading=true;
            // this.RowProdcodeList.splice(index, 1);  
            this.tosterService.success(' Row Material deleted successfully')

          },
          error: (e) => {
          },
          complete: () => {
            this.LoadAllproductData(this.selectproductType.toString());
            this.loading=false;
          },

        });

      }
    });



    // }

  }
  onEditAllProd(ProductCodeID: any, ProductTypeId: any, index: any) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',

    }
    const modalRef = this.modalService.open(addProductcodeComponent, ngbModalOptions);
    modalRef.componentInstance.mode = 'edit';

    modalRef.componentInstance.Prodtypeid = ProductTypeId
    modalRef.componentInstance.Productid = ProductCodeID;
    if (this.isRowMaterial) {
      modalRef.componentInstance.RawMaterial = index ///In case row material only
    } else {
      modalRef.componentInstance.RawMaterial = false
    }

    this.GetCabProducuctCodeList();
    this.GetCoreCageProductCodeList();
    this.GetAcsProducuctCodeList();
    this.GetRowMaterialProducuctCodeList();
    this.LoadAllproductData(this.selectproductType.toString());



  }
  GetMeshProducuctCodeList() {
    debugger;
    // this.prodlist = this.route.snapshot.data['mesh']

    // this.productcodelist = JSON.parse(JSON.stringify(this.prodlist));
    this.productcodeService.GetMeshProductCode_List().subscribe({
      next: (response) => {
        this.prodlist = response;
        this.productcodelist = response;
        this.TotalNumberofRecord = this.prodlist.length;
        console.log("this is MeshProductCodeList ", this.prodlist);
      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false;
        this.backup_prodlist = JSON.parse(JSON.stringify(this.prodlist));
        this.prodlist = this.selectFilter(this.prodlist)

      },
    });
  }

  Update(item: any, index: any) {
    console.log(item);


  }

  Editcancel() {
    this.isEditing = false;
    this.enableEditIndex = null;
  }

  open() {
    debugger;
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',

    }
    const modalRef = this.modalService.open(addProductcodeComponent, ngbModalOptions);
    // const modalRef = this.modalService.open(CreateproductcodeComponent, ngbModalOptions);
    modalRef.componentInstance.name = 'World';
    modalRef.componentInstance.formname = 'productcode';
    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      debugger;
      this.GetCabProducuctCodeList();
      this.GetCoreCageProductCodeList();
      this.GetAcsProducuctCodeList();
      this.GetMeshProducuctCodeList();
      this.GetRowMaterialProducuctCodeList();
      this.LoadAllproductData(this.selectproductType);

    })
  }

  searchMeshData() {
    // this.GetMeshProducuctCodeList();
    // this.LoadMeshdata();

    this.prodlist = JSON.parse(JSON.stringify(this.backup_prodlist));


    debugger;
    if (this.searchMESHprodcode != undefined) {
      this.prodlist = this.prodlist.filter(item =>
        item.ProductCode.toLowerCase().includes(this.searchMESHprodcode.trim().toLowerCase())
      );
    }
    if (this.searchMESHDesc != undefined) {
      this.prodlist = this.prodlist.filter(item =>
        item.ProductDescription.toLowerCase().includes(this.searchMESHDesc.trim().toLowerCase())
      );
    }
    if (this.searchMESHmwprod != undefined) {
      this.prodlist = this.prodlist.filter(item =>
        item.MainWire_Productcode.toLowerCase().includes(this.searchMESHmwprod.trim().toLowerCase())
      );
    }

    if (this.searchMESHcwprod != undefined) {
      this.prodlist = this.prodlist.filter(item =>
        item.CrossWire_Productcode.toLowerCase().includes(this.searchMESHcwprod.trim().toLowerCase())
      );
    }
    if (this.searchMESHmwspace != undefined) {
      this.prodlist = this.prodlist.filter(item =>
        item.MWSpace.toString().toLowerCase().includes(this.searchMESHmwspace.trim().toLowerCase())
      );
    }
    if (this.searchMESHcwspace != undefined) {
      this.prodlist = this.prodlist.filter(item =>
        item.CWSpace.toString().toLowerCase().includes(this.searchMESHcwspace.trim().toLowerCase())
      );
    }
    if (this.searchMESHstructtype != undefined) {
      this.prodlist = this.prodlist.filter(item =>
        item.StructureElementType.toString().toLowerCase().includes(this.searchMESHstructtype.trim().toLowerCase())
      );
    }
    if (this.searchMESHwt != undefined) {
      this.prodlist = this.prodlist.filter(item =>
        item.WeightRun.toString().toLowerCase().includes(this.searchMESHwt.trim().toLowerCase())
      );
    }
    if (this.searchMESHtwinind != undefined) {
      this.prodlist = this.prodlist.filter(item =>
        item.TwinIndicator.toLowerCase().includes(this.searchMESHtwinind.trim().toLowerCase())
      );
    }
    if (this.searchMESHstatus != undefined) {
      this.prodlist = this.prodlist.filter(item =>
        item.StatusId.toString().toLowerCase().includes(this.searchMESHstatus.toString().toLowerCase())
      );
    }

  }
  searchCABData() {
    // this.GetCabProducuctCodeList();
    debugger;
    this.CabProductListData = JSON.parse(JSON.stringify(this.backup_CABData));
    if (this.searchproductcode != undefined) {
      this.CabProductListData = this.CabProductListData.filter(item =>
        item.ProductCode?.toLowerCase().includes(this.searchproductcode.trim().toLowerCase())
      );
    }

    if (this.searchproductdesc != undefined) {
      this.CabProductListData = this.CabProductListData.filter(item =>
        item.Description?.toLowerCase().includes(this.searchproductdesc.trim().toLowerCase())
      );
    }

    if (this.searchgreadetype != undefined) {
      this.CabProductListData = this.CabProductListData.filter(item =>
        item.GradeType.toLowerCase().includes(this.searchgreadetype.trim().toLowerCase())
      );
    }
    if (this.searchdiameter != undefined) {
      this.CabProductListData = this.CabProductListData.filter(item =>
        item.Diameter.toString().includes(this.searchdiameter.trim().toLowerCase())
      );
    }
    if (this.searchfgsa != undefined) {
      this.CabProductListData = this.CabProductListData.filter(item =>
        item.FG_SAPMaterialCode.toLowerCase().includes(this.searchfgsa.trim().toLowerCase())
      );
    }

    if (this.searchrmsa != undefined) {
      this.CabProductListData = this.CabProductListData.filter(item =>
        item.RM_SAPMaterialCode.toLowerCase().includes(this.searchrmsa.trim().toLowerCase())
      );
    }
    if (this.searchcoupler != undefined) {
      this.CabProductListData = this.CabProductListData.filter(item =>
        item.CouplerIndicator.toString().toLowerCase().includes(this.searchcoupler.trim().toLowerCase())
      );
    }
    if (this.searchcouplertype != undefined) {
      this.CabProductListData = this.CabProductListData.filter(item =>
        item.CouplerType?.toString().toLowerCase().includes(this.searchcouplertype.trim().toLowerCase())
      );
    }
    if (this.searchcabstatus != undefined) {
      this.CabProductListData = this.CabProductListData.filter(item =>
        item.StatusId.toString().toLowerCase().includes(this.searchcabstatus.toString().toLowerCase())
      );
    }


  }
  searchCorecageData() {

    debugger;
    // this.GetCoreCageProductCodeList();
    this.CoreCageProductListData = JSON.parse(JSON.stringify(this.backup_CoreCageData));

    if (this.searchcorecageprodcode != undefined) {
      this.CoreCageProductListData = this.CoreCageProductListData.filter(item =>
        item.ProductCode.toLowerCase().includes(this.searchcorecageprodcode.trim().toLowerCase())
      );
    }
    if (this.searchcorecagedesc != undefined) {
      this.CoreCageProductListData = this.CoreCageProductListData.filter(item =>
        item.ProductDescription.toLowerCase().includes(this.searchcorecagedesc.trim().toLowerCase())
      );
    }
    if (this.searchcorecageprotype != undefined) {
      this.CoreCageProductListData = this.CoreCageProductListData.filter(item =>
        item.ProductType.toLowerCase().includes(this.searchcorecageprotype.trim().toLowerCase())
      );
    }

    if (this.searchcorecagestructtype != undefined) {
      this.CoreCageProductListData = this.CoreCageProductListData.filter(item =>
        item.StructureElementType.toLowerCase().includes(this.searchcorecagestructtype.trim().toLowerCase())
      );
    }
    if (this.searchcorecagewt != undefined) {
      this.CoreCageProductListData = this.CoreCageProductListData.filter(item =>
        item.WeightArea.toString().toLowerCase().includes(this.searchcorecagewt.trim().toLowerCase())
      );
    }
    if (this.searchcorecagestatus != undefined) {
      this.CoreCageProductListData = this.CoreCageProductListData.filter(item =>
        item.StatusId.toString().toLowerCase().includes(this.searchcorecagestatus.toString().toLowerCase())
      );
    }



  }
  searchData() {
    debugger;
    // this.LoadAllproductData(this.selectproductType.toString())
    this.Allproductlist = JSON.parse(JSON.stringify(this.backupData));

    if (this.searchAllprodcode != undefined) {
      this.Allproductlist = this.Allproductlist.filter(item =>
        item.ProductCode?.toLowerCase().includes(this.searchAllprodcode.trim().toLowerCase())
      );
    }
    if (this.searchAllDesc != undefined) {
      this.Allproductlist = this.Allproductlist.filter(item =>
        item.Description?.toLowerCase().includes(this.searchAllDesc.trim().toLowerCase())
      );
    }
    if (this.searchAllprotype != undefined) {
      this.Allproductlist = this.Allproductlist.filter(item =>
        item.ProductType?.toLowerCase().includes(this.searchAllprotype.trim().toLowerCase())
      );
    }

    if (this.searchAllstructtype != undefined && this.searchAllstructtype != "") {
      this.Allproductlist = this.Allproductlist.filter(item =>
        item.StructureElementType?.toLowerCase().includes(this.searchAllstructtype.trim().toLowerCase())
      );
    }
    if (this.searchAllstatus != undefined) {
      this.Allproductlist = this.Allproductlist.filter(item =>
        item.statusId.toString().toLowerCase().includes(this.searchAllstatus.toString().toLowerCase())
      );
    }
    //this.LoadAllproductData(this.selectproductType.toString());


  }
  wildcardSearch() {

    debugger;
    if (this.searchText === "") {
      this.searchText = undefined;
    }
    if (this.selectproductType.length == 1) {
      if (this.selectproductType[0] === 4) {
        this.CabProductListData = JSON.parse(JSON.stringify(this.backup_CABData));

        if (this.searchText !== undefined) {
          debugger;

          this.CabProductListData = this.CabProductListData.filter(item =>
            item.ProductCode?.toLowerCase().includes(this.searchText.toLowerCase())
            || item.Description?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.GradeType?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.Diameter?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.FG_SAPMaterialCode?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.RM_SAPMaterialCode?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.CouplerType?.toString().toLowerCase().includes(this.searchText.toLowerCase())

          );
        }

      }
      else if (this.selectproductType[0] === 14) {
        this.CoreCageProductListData = JSON.parse(JSON.stringify(this.backup_CoreCageData));

        if (this.searchText !== undefined) {
          debugger;

          this.CoreCageProductListData = this.CoreCageProductListData.filter(item =>
            item.ProductCode?.toLowerCase().includes(this.searchText.toLowerCase())
            || item.ProductDescription?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.ProductType?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.StructureElementType?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.WeightArea?.toString().toLowerCase().includes(this.searchText.toLowerCase())

          );
        }
      }
      else if (this.selectproductType[0] === 11) {
        this.AcsProductListData = JSON.parse(JSON.stringify(this.backup_AccList));

        if (this.searchText !== undefined) {
          debugger;

          this.AcsProductListData = this.AcsProductListData.filter(item =>
            item.ProductCode?.toLowerCase().includes(this.searchText.toLowerCase())
            || item.Description?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.GradeType?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.FG_SAPMaterialCode?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.CreatedUId?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.UpdatedUId?.toString().toLowerCase().includes(this.searchText.toLowerCase())
          );
        }
      }
      else if (this.selectproductType[0] === 7 && this.isRowMaterial == true) {
        this.RowProdcodeList = JSON.parse(JSON.stringify(this.backup_RowProdcodeList));

        if (this.searchText !== undefined) {
          debugger;

          this.RowProdcodeList = this.RowProdcodeList.filter(item =>
            item.ProductCode?.toLowerCase().includes(this.searchText.toLowerCase())
            || item.ProductDescription?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.MaterialType?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.Diameter?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.MaterialAbbr?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.Grade?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.WeightRun?.toString().toLowerCase().includes(this.searchText.toLowerCase())
          );
        }
      }
      else if (this.selectproductType[0] === 7 && this.isRowMaterial == false) {
        this.prodlist = JSON.parse(JSON.stringify(this.backup_prodlist));

        if (this.searchText !== undefined) {
          debugger;

          this.prodlist = this.prodlist.filter(item =>
            item.ProductCode?.toLowerCase().includes(this.searchText.toLowerCase())
            || item.ProductDescription?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.MainWire_Productcode?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.StructureElementType?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.CrossWire_Productcode?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.MWSpace?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.CWSpace?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.WeightRun?.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || item.TwinIndicator?.toString().toLowerCase().includes(this.searchText.toLowerCase())
          );
        }
      }

    }
    else {
      this.Allproductlist = JSON.parse(JSON.stringify(this.backupData));

      if (this.searchText !== undefined) {
        debugger;

        this.Allproductlist = this.Allproductlist.filter(item =>
          item.ProductCode?.toLowerCase().includes(this.searchText.toLowerCase())
          || item.Description?.toString().toLowerCase().includes(this.searchText.toLowerCase())
          || item.ProductType?.toString().toLowerCase().includes(this.searchText.toLowerCase())
          || item.StructureElementType?.toString().toLowerCase().includes(this.searchText.toLowerCase())
        );
      }
    }

  }

  GetCabProducuctCodeList() {
    debugger;
    // this.CabProductListData = this.route.snapshot.data['cab']

    // this.productcodelist = JSON.parse(JSON.stringify(this.CabProductListData));

    this.productcodeService.GetCabProductCode_List().subscribe({
      next: (response) => {
        this.CabProductListData = response;
        this.productcodelist = response
        this.TotalNumberofRecord = this.CabProductListData.length;
        console.log("this is CabProductCodeList ", this.CabProductListData);
      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false;

        this.backup_CABData = JSON.parse(JSON.stringify(this.CabProductListData));
        this.CabProductListData = this.selectFilter(this.CabProductListData)

      },
    });
  }
  GetAcsProducuctCodeList() {
    debugger;
    // this.AcsProductListData = this.route.snapshot.data['accs']

    // this.productcodelist = JSON.parse(JSON.stringify(this.AcsProductListData));
    this.productcodeService.GetAcsProductCode_List().subscribe({
      next: (response) => {
        this.AcsProductListData = response;
        this.productcodelist = response;
        console.log("this is Accessoriles  product ", this.AcsProductListData);
      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false;

        this.backup_AccList = JSON.parse(JSON.stringify(this.AcsProductListData));
        this.AcsProductListData = this.selectFilter(this.AcsProductListData)
      },
    });
  }
  GetRowMaterialProducuctCodeList() {
    debugger;
    // this.RowProdcodeList = this.route.snapshot.data['rawmat']

    // this.productcodelist = JSON.parse(JSON.stringify(this.RowProdcodeList));
    this.productcodeService.GetRawMaterialList().subscribe({
      next: (response) => {
        this.RowProdcodeList = response;
        this.productcodelist = response
        console.log("this is RowMaterialProductCodeList ", this.RowProdcodeList);
      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false;

        this.backup_RowProdcodeList = JSON.parse(JSON.stringify(this.RowProdcodeList))
        this.RowProdcodeList = this.selectFilter(this.RowProdcodeList)
      },
    });
  }

  GetCoreCageProductCodeList() {
    debugger;
    // this.CoreCageProductListData = this.route.snapshot.data['corecage']

    // this.productcodelist = JSON.parse(JSON.stringify(this.CoreCageProductListData));
    this.productcodeService.GetCoreCageProductCode_List().subscribe({
      next: (response) => {
        console.log(response);
        this.CoreCageProductListData = response;
        this.productcodelist = response

        console.log("this is CoreCage ", this.CoreCageProductListData);
      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false;

        this.backup_CoreCageData = JSON.parse(JSON.stringify(this.CoreCageProductListData));
        this.CoreCageProductListData = this.selectFilter(this.CoreCageProductListData)

      },
    });
  }
  public onPageChangeCAB(pageNum: number): void {
    this.pageSizeCAB = this.itemsPerPageCAB * (pageNum - 1);
  }
  OnPageSizeChangeCAB(itemsPerPage: number) {
    debugger;
    this.pageSizeCAB = 0;
    this.itemsPerPageCAB = itemsPerPage;
    this.currentPageCAB = 1;
  }
  public onPageChangeMESH(pageNum: number): void {
    this.pageSizeMESH = this.itemsPerPageMESH * (pageNum - 1);
  }
  OnPageSizeChangeMESH(itemsPerPage: number) {
    debugger;
    this.pageSizeMESH = 0;
    this.itemsPerPageMESH = itemsPerPage;
    this.currentPageMESH = 1;
  }
  public onPageChangeCoreCage(pageNum: number): void {
    this.pageSizeCAR = this.itemsPerPageCAR * (pageNum - 1);
  }

  getPageDataCorecage(itemsPerPage: number) {
    debugger;
    this.pageSizeCAR = 0;
    this.itemsPerPageCAR = itemsPerPage;
    this.currentPageCAR = 1;


  }

  OnPageSizeChangeCommon(itemsPerPage: number) {
    this.pageSizeCommon = 0;
    this.itemsPerPageCommon = itemsPerPage;
    this.currentPageCommon = 1;
  }
  OnPageSizeChangeCAR(itemsPerPage: number) {
    this.pageSizeCAR = 0;
    this.itemsPerPageCAR = itemsPerPage;
    this.currentPageCAR = 1;
  }



  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }
  OnPageSizeChange(itemsPerPage: number) {
    debugger;
    this.pageSize = 0;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
  }
  searchROWData() {
    debugger;

    this.RowProdcodeList = JSON.parse(JSON.stringify(this.backup_RowProdcodeList))


    if (this.searchRowprodcode != undefined) {
      this.RowProdcodeList = this.RowProdcodeList.filter(item =>

        item.ProductCode.toLowerCase().includes(this.searchRowprodcode.trim().toLowerCase())

      );

    }

    if (this.searchRowdescription != undefined) {

      this.RowProdcodeList = this.RowProdcodeList.filter(item =>

        item.ProductDescription.toLowerCase().includes(this.searchRowdescription.trim().toLowerCase())

      );

    }




    if (this.searchRowmaterialtype != undefined) {

      this.RowProdcodeList = this.RowProdcodeList.filter(item =>

        item.MaterialType.toLowerCase().includes(this.searchRowmaterialtype.trim().toLowerCase())

      );

    }

    if (this.searchRowdiameter != undefined) {

      this.RowProdcodeList = this.RowProdcodeList.filter(item =>

        item.Diameter.toString().includes(this.searchRowdiameter.trim().toLowerCase())

      );

    }




    if (this.searchRowmaterialabbr != undefined) {

      this.RowProdcodeList = this.RowProdcodeList.filter(item =>

        item.MaterialAbbr.toString().toLowerCase().includes(this.searchRowmaterialabbr.trim().toLowerCase()));

    }

    if (this.searchRowgrade != undefined) {

      this.RowProdcodeList = this.RowProdcodeList.filter(item =>

        item.Grade.toString().toLowerCase().includes(this.searchRowgrade.trim().toLowerCase())




      );

    }




    if (this.searchRowweightrun != undefined) {




      this.RowProdcodeList = this.RowProdcodeList.filter(item =>




        item.WeightRun.toString().toLowerCase().includes(this.searchRowweightrun.trim().toLowerCase())




      );




    }




    if (this.searchRowstatus != undefined) {
      this.RowProdcodeList = this.RowProdcodeList.filter(item =>
        item.StatusId.toString().toLowerCase().includes(this.searchRowstatus.toString().toLowerCase())
      );
    }
  }




  public onPageChangeROW(pageNum: number): void {
    this.pageSizeROW = this.itemsPerPageROW * (pageNum - 1);
  }
  OnPageSizeChangeROW(itemsPerPage: number) {
    debugger;
    this.pageSizeROW = 0;
    this.itemsPerPageROW = itemsPerPage;
    this.currentPageROW = 1;
  }
  ROWdelete(index: any, item: any) {
    debugger;
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      // size: 'lg',
    }
    const modalRef = this.modalService.open(DeleteDialogComponent, ngbModalOptions);
    console.log(item);

    modalRef.result.then(modalResult => {
      if (modalResult.isConfirm) {
        this.RowProdcodeList = [];
        let id = item.ProductCodeId;
        this.productcodeService.DeleteRowMaterialProductCodeList(id).subscribe({
          next: (response) => {
            // this.RowProdcodeList.splice(index, 1);  
            this.tosterService.success(' Row Material deleted successfully')

          },
          error: (e) => {
          },
          complete: () => {
            this.GetRowMaterialProducuctCodeList();
          },

        });
      }
    });

  }


  downloadFile() {
    if (this.selectproductType.length == 1) {

      if (this.selectproductType[0] == 4) {
        this.GetCabProducuctCodeList();
        this.listTodownload = this.CabProductListData;
        this.name = 'Cablist'

      }
      else if (this.selectproductType[0] == 15) {
        this.GetCoreCageProductCodeList();
        this.listTodownload = this.CoreCageProductListData;
        this.name = 'CoreCagelist'
      }
      else if (this.selectproductType[0] == 11) {
        this.GetAcsProducuctCodeList();
        this.listTodownload = this.AcsProductListData;
        this.name = 'Accessorieslist'
      }
      else if (this.selectproductType[0] == 7 && this.isRowMaterial == true) {
        this.GetRowMaterialProducuctCodeList();
        this.listTodownload = this.RowProdcodeList;
        this.name = 'RawMateriallist'
      }
      else if (this.selectproductType[0] == 7 && this.isRowMaterial == false) {
        this.GetMeshProducuctCodeList();
        this.listTodownload = this.prodlist;
        this.name = 'Meshlist'

      }

    }
    else {
      this.LoadAllproductData(this.selectproductType.toString());
      this.listTodownload = this.Allproductlist;
      this.name = 'commonList'
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listTodownload);

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, 'export');

  }


  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.name + ".xlsx";
    link.click();
  }

  resetsearchValue() {
    this.searchprodcode = undefined;
    this.searchdesc = undefined;
    this.searchprotype = undefined;
    this.searchstructtype = undefined;
    this.searchwt = undefined;
    this.searchstatus = undefined;

    this.itemsPerPage = 10;
    this.filterData();

  }
  resetCorecagesearchValue() {
    this.searchcorecageprodcode = undefined;
    this.searchcorecagedesc = undefined;
    this.searchcorecageprotype = undefined;
    this.searchcorecagestructtype = undefined;
    this.searchcorecagewt = undefined;
    this.searchcorecagestatus = undefined;
    this.searchcorecagestatus = undefined;
    this.itemsPerPage = 10;
    this.filterData();

  }

  resetCABsearchValue() {
    this.searchgreadetype = undefined;
    this.searchdiameter = undefined;
    this.searchfgsa = undefined;
    this.searchrmsa = undefined;
    this.searchcoupler = undefined;
    this.searchcouplertype = undefined;
    this.searchcabstatus = undefined;
    this.searchproductcode = undefined;
    this.searchproductdesc = undefined;
    this.filterData();
  }

  resetMESHsearchValue() {
    this.searchMESHprodcode = undefined;
    this.searchMESHDesc = undefined;
    this.searchMESHmwprod = undefined;
    this.searchMESHcwprod = undefined;
    this.searchMESHmwspace = undefined;
    this.searchMESHcwspace = undefined;
    this.searchMESHstructtype = undefined;
    this.searchMESHwt = undefined;
    this.searchMESHtwinind = undefined;
    this.searchMESHstatus = undefined;
    this.GetMeshProducuctCodeList()
    // this.filterData(this.selectproductType);

  }

  resetAccsearchValue() {
    this.searchACCproductcode = undefined;
    this.searchACCdescription = undefined;
    this.searchACCgradetype = undefined;
    this.searchACCdiameter = undefined;
    this.searchACCfgsa = undefined;
    this.searchACCrmsa = undefined;
    this.searchACCstatus = undefined;
    this.searchACCcreatedby = undefined;
    this.searchACCupdatedby = undefined;
    this.GetAcsProducuctCodeList();
  }

  resetCommonsearchValue() {
    this.searchAllprodcode = undefined;
    this.searchAllDesc = undefined;
    this.searchAllprotype = undefined;
    this.searchAllstructtype = undefined;
    this.searchAllstatus = undefined;
    this.LoadAllproductData(this.selectproductType.toString());

  }

  resetRowsearchValue() {
    this.searchRowprodcode = undefined;
    this.searchRowdescription = undefined;
    this.searchRowmaterialtype = undefined;
    this.searchRowdiameter = undefined;
    this.searchRowmaterialabbr = undefined;
    this.searchRowgrade = undefined;
    this.searchRowweightrun = undefined;
    this.searchRowstatus = undefined;
    this.GetRowMaterialProducuctCodeList();

  }

}

