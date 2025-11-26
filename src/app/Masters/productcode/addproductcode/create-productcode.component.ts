import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'
import { CAB_GradeType } from 'src/app/Model/cab_gradetype';
import { ACS_FGSA_Material_List, CAB_FGSA_Material_List } from 'src/app/Model/cab_fgsa_material';
import { ProductCodeService } from '../../Services/ProductCode/product-code.service';
import { CoreSAP_Material } from 'src/app/Model/coresap_material';
import { ToastrService } from 'ngx-toastr';
import { ADD_CAB_PRODUCTCODE } from 'src/app/Model/add_cab_productcode';
import { ProductType } from 'src/app/Model/product_type';
import { ADD_CAR_PRODUCTCODE } from 'src/app/Model/add_car_productcode';
import { disableDebugTools } from '@angular/platform-browser';
import { ADD_ACS_PRODUCTCODE } from 'src/app/Model/add_acs_productcode';
import { ADD_MESH_PRODUCTCODE } from 'src/app/Model/add_mesh_productcode';
import { Row_material_model } from 'src/app/Model/row_material_model';
import { RowMaterial_Add_ProductCode } from 'src/app/Model/add_RowMaterial_ProductCode';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-create-productcode',
  templateUrl: './create-productcode.component.html',
  styleUrls: ['./create-productcode.component.css']
})
export class addProductcodeComponent implements OnInit {
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();
  prodcodeForm!: FormGroup;
  CABprodcodeForm!: FormGroup;
  CORECAGEprodcodeForm!: FormGroup;
  MESHprodcodeForm!: FormGroup;
  AccessoriesForm!: FormGroup;
  RowMaterialForm!: FormGroup;


  Productcodestring: string = "";

  MeshSAPMaterialList: any[] = [];

  RawSAPMaterialList: any[] = [];

  WireProductList: any = [];
  MainWireData: any;
  CrossWireData: any;
  strGradeType: string = "";
  strdiameter: string = "";
  ProductDetailsData: any;
  isReadOnly: boolean = false;

  @Input() mode: any = '';
  // @Input() name: any;
  // @Input() formname: any;
  // @Input() proddata: any;
  @Input() Productid: any;
  @Input() Prodtypeid: any;
  @Input() RawMaterial: any;
  @Input() fgsaID: any;
  @Input() rmsaID: any;
  // @Input() description:any;
  // @Input() productcode:any;



  disableSubmit: boolean = false
  iConfirm: boolean = false
  producttypeList: ProductType[] = [];
  structureList: any[] = [];
  ProductCodeTypeList: any[] = [];
  cabgradetypeList: CAB_GradeType[] = [];
  ACSgradetypeList: any[] = [];
  fgsamaterialList: CAB_FGSA_Material_List[] = [];
  rmsamaterialList: CAB_FGSA_Material_List[] = [];

  acsfgsamaterialList: ACS_FGSA_Material_List[] = [];

  //Row Material 
  RowMatrialGradeList: any[] = [];
  RowMaterialList: Row_material_model[] = [];

  selectproductType: any = null;
  is_RowMaterial: boolean = false;

  MaterialTypeList: any[] = [];

  MaterialTypeListRaw: any[] = [];
  selectmainwireProduct: boolean = false;
  selectcrosswireProduct: boolean = false;
  selectsap: any;
  selectMeshsap: any;
  isformsubmit: boolean = false;
  meshCWgrade?:number;
  meshMWgrade?:number;
  gradeList: any[] = [];
  FGSAMaterialList: any[] = [];
  RMSAMaterialList: any[] = [];
  CouplerTypeList: any[] = [];
  isshowcupler: boolean = false;
  isshowstatus: boolean = true;
  mwprod: any = [];

  meshData: any;

  meshmwspace: any = undefined;
  meshcwspace: any = undefined;

  mwtype: any = undefined;
  mwdia: any = '';
  mwgrade: any = '';
  mwwt: any = '';
  mwbend: any = '';

  cwtype: any = undefined;
  cwdia: any = '';
  cwgrade: any = '';
  cwwt: any = '';
  cwbend: any = '';

  TwinIndList: any[] = [];

  corecageselectedStruct = 2;// undefined; //core Cage Structure always column
  Diameterlist: any[] = [];
  selectstruct: any;
  selectedtwin: any = '';
  selectedMWproduct: any = undefined;
  selectedCWproduct: any = undefined;
  //CorecageSAPMaterialList: any[] = [];
  cwprod: any[] = [];
  coresapmaterialList: CoreSAP_Material[] = [];
  // mshsapmaterialList: any[] = [];
  CABProductcodeObj: ADD_CAB_PRODUCTCODE | undefined;
  CARProductcodeObj: ADD_CAR_PRODUCTCODE | undefined;
  MESHProductcodeObj: ADD_MESH_PRODUCTCODE | undefined;
  Materialapprvation: string | undefined = "";
  item: Row_material_model | undefined;

  isMinmax: boolean = false;
  userId:any;


  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private productcodeservice: ProductCodeService,
    private tosterService: ToastrService,
    private loginService: LoginService,) { }


  ngOnInit(): void {
    this.GetGroupTypeList();
    this.GetFGSA_RMSA_Material_List()
    this.GetGroupTypeACSList();
    this.GetRowMaterial_Grade();
    this.userId = this.loginService.GetUserId();

    this.CABprodcodeForm = this.formBuilder.group({
      gradetype: new FormControl('', Validators.required),
      diameter: new FormControl('', Validators.required),
      fgmaterial: new FormControl('', Validators.required),
      rmmaterial: new FormControl('', Validators.required),
      status: new FormControl(true),
      coupler: new FormControl(false),
      couplertype: new FormControl(''),
      productcode: new FormControl(''),
      description: new FormControl('')
    });
    this.AccessoriesForm = this.formBuilder.group({
      acsgradetype: new FormControl('', Validators.required),
      acsdiameter: new FormControl('', Validators.required),
      acsfgmaterial: new FormControl('', Validators.required),


    });

    this.CORECAGEprodcodeForm = this.formBuilder.group({
      sapmaterial: new FormControl('', Validators.required),
      structureelement: new FormControl(''),
      Weightsqm: new FormControl('', Validators.required),
      status: new FormControl(true),
      productcode: new FormControl(''),
      description: new FormControl('')
    });

    this.MESHprodcodeForm = this.formBuilder.group({
      meshsapmaterial: new FormControl('', Validators.required),
      mwspace: new FormControl('', Validators.required),
      cwspace: new FormControl('', Validators.required),
      MWproduct: new FormControl('', Validators.required),
      CWproduct: new FormControl('', Validators.required),
      MWmaterialtype: new FormControl('',),
      CWmaterialtype: new FormControl('',),
      meshWeightsqm: new FormControl('', Validators.required),
      meshstructelement: new FormControl([], Validators.required),
      twinind: new FormControl('', Validators.required),
      MWdia: new FormControl('',),
      MWgrade: new FormControl('',),
      MWweight: new FormControl('',),
      CWdia: new FormControl('',),
      CWgrade: new FormControl('',),
      CWweight: new FormControl('',),
      meshminlink: new FormControl(''),
      meshmaxlink: new FormControl('')
    });

    this.RowMaterialForm = this.formBuilder.group({
      //MWproduct: new FormControl(''),     
      rowMWmaterialtype: new FormControl('', Validators.required),
      rowDiameter: new FormControl('', Validators.required),
      rowMaterialTypeAbbr: new FormControl('', Validators.required),
      rowgrade: new FormControl('', Validators.required),
      rowWeightsqm: new FormControl('', Validators.required),
      rowsapmaterial: new FormControl('', Validators.required),


      


    });

    this.prodcodeForm = this.formBuilder.group({
      productcode: new FormControl('', Validators.required),
      ProductCodeType: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      isRowMaterial: new FormControl(false),
      meshstatus: new FormControl(true),
    });

    this.GetFGSA_Material_List();
    this.GetRMSA_Material_List();
    this.GetSAPMaterialList_CoreCage();
    this.GetSAPMaterialList_Msh();
    this.GetWireMaterialList_Msh()
    this.GetWireProductList_Msh();
    this.GetStructureElement_Msh();
    this.GetTwinIndicator_Mesh();
    this.GetProductTypeList();
    this.GetSAPMaterialList_Raw();
    // this.GetMeshData(10551)


    if (this.mode == 'edit') {

      this.prodcodeForm.reset();
      this.CABprodcodeForm.reset();
      this.CORECAGEprodcodeForm.reset();
      this.MESHprodcodeForm.reset();
      this.RowMaterialForm.reset();


      this.selectproductType = this.Prodtypeid;
      this.is_RowMaterial = this.RawMaterial;
      console.log(this.is_RowMaterial);
      if (this.is_RowMaterial) {
        this.ChangeRowMaterial()
      }

      this.GetProductDetails(this.Prodtypeid, this.Productid);
    }
    // console.log(this.Productid);
    // console.log(this.Prodtypeid);

    this.Diameterlist = [
      { item_id: '6', item_text: '6' },
      { item_id: '7', item_text: '7' },
      { item_id: '8', item_text: '8' },
      { item_id: '10', item_text: '10' },
      { item_id: '12', item_text: '12' },
      { item_id: '13', item_text: '13' },
      { item_id: '16', item_text: '16' },
      { item_id: '20', item_text: '20' },
      { item_id: '22', item_text: '22' },
      { item_id: '24', item_text: '24' },
      { item_id: '25', item_text: '25' },
      { item_id: '28', item_text: '28' },
      { item_id: '32', item_text: '32' },
      { item_id: '40', item_text: '40' },
      { item_id: '50', item_text: '50' },

    ];

    this.CouplerTypeList = [
      { item_id: 'E', item_text: 'E' },
      { item_id: 'X', item_text: 'X' },
      { item_id: 'A', item_text: 'A' },

    ];

  }
  // get f() { return this.prodcodeForm.controls; }
  ChangeRowMaterial() {

    // this.prodcodeForm.reset();
    this.prodcodeForm.controls['productcode'].reset()
    this.prodcodeForm.controls['description'].reset()
    this.MESHprodcodeForm.reset();
    this.RowMaterialForm.reset();

    console.log(this.is_RowMaterial)
    if (this.selectproductType == 7) {

      //if row material is true
      if (this.is_RowMaterial == true) {
        this.GetRowMaterial_GetMaterialType();
        this.GetRowMaterial_Grade();
      }
    }

  }
  GetProductDetails(ProductTypeId: any, ProductId: any) {
    debugger;
    if (ProductTypeId == 4)//CAB
    {
      this.productcodeservice.GetCABProductCodebyId(ProductId).subscribe({
        next: (response) => {

          console.log("cab response", response);
          this.ProductDetailsData = response;
        },
        error: (e) => {
          console.log(e.error);
          this.tosterService.error(e.error.text)
        },
        complete: () => {
          if (this.mode === 'edit') {

            if (this.selectproductType == 4) {
              console.log("listData", this.ProductDetailsData)

              this.CABprodcodeForm.controls['gradetype'].patchValue(this.ProductDetailsData[0].GradeType);
              this.CABprodcodeForm.controls['diameter'].patchValue(this.ProductDetailsData[0].Diameter);
              this.CABprodcodeForm.controls['fgmaterial'].patchValue(this.ProductDetailsData[0].FGSAPMaterialID);
              this.CABprodcodeForm.controls['rmmaterial'].patchValue(this.ProductDetailsData[0].RMSAPMaterialID);
              this.CABprodcodeForm.controls['coupler'].patchValue(this.ProductDetailsData[0].CouplerIndicator);
              if (this.ProductDetailsData[0].CouplerIndicator == true) { this.isshowcupler = true; }
              this.CABprodcodeForm.controls['couplertype'].patchValue(this.ProductDetailsData[0].CouplerType);
              // this.prodcodeForm.controls['meshstatus'].patchValue(this.ProductDetailsData[0].StatusId); 
              this.isshowstatus = this.ProductDetailsData[0].StatusId;
              this.prodcodeForm.controls['description'].patchValue(this.ProductDetailsData[0].Description);
              this.prodcodeForm.controls['productcode'].patchValue(this.ProductDetailsData[0].ProductCode);

            }
          }

        },
      });
    }
    //Core Cage
    if (ProductTypeId == 15) {

      this.productcodeservice.GetCoreCageProductCodebyId(ProductId)
        .subscribe({
          next: (response) => {

            console.log(response);
            this.ProductDetailsData = response;
          },
          error: (e) => {
            console.log(e.error);
            this.tosterService.error(e.error.text)
          },
          complete: () => {
            if (this.mode === 'edit') {

              if (this.selectproductType == 15) {
                console.log(this.ProductDetailsData)

                this.CORECAGEprodcodeForm.controls['sapmaterial'].patchValue(this.ProductDetailsData[0].SAPMaterialCodeId);
                this.corecageselectedStruct = this.ProductDetailsData[0].StructureElementID;
                this.CORECAGEprodcodeForm.controls['structureelement'].patchValue(this.ProductDetailsData[0].StructureElementID);
                this.CORECAGEprodcodeForm.controls['Weightsqm'].patchValue(this.ProductDetailsData[0].WeightArea);
                //   this.prodcodeForm.controls['meshstatus'].patchValue(this.ProductDetailsData[0].StatusId);
                this.isshowstatus = this.ProductDetailsData[0].StatusId;
                this.prodcodeForm.controls['productcode'].patchValue(this.ProductDetailsData[0].ProductCode);
                this.prodcodeForm.controls['description'].patchValue(this.ProductDetailsData[0].ProductDescription);

              }
            }

          },
        });
    }
    if (ProductTypeId == 11)//Accessories
    {
      this.productcodeservice.GetACSProductCodebyIdAsync(ProductId)
        .subscribe({
          next: (response) => {

            this.ProductDetailsData = response;
            console.log(this.ProductDetailsData, "ACS Response");

          },
          error: (e) => {
            console.log(e.error);
            this.tosterService.error(e.error.text)
          },
          complete: () => {
            if (this.mode === 'edit') {

              if (this.selectproductType == 11) {
                console.log(this.ProductDetailsData)
                this.AccessoriesForm.controls['acsgradetype'].patchValue(this.ProductDetailsData[0].GradeType);
                this.AccessoriesForm.controls['acsdiameter'].patchValue(this.ProductDetailsData[0].Diameter);
                this.AccessoriesForm.controls['acsfgmaterial'].patchValue(this.ProductDetailsData[0].FGSAPMaterialID);
                this.isshowstatus = this.ProductDetailsData[0].StatusId;
                this.prodcodeForm.controls['description'].patchValue(this.ProductDetailsData[0].Description);
                this.prodcodeForm.controls['productcode'].patchValue(this.ProductDetailsData[0].ProductCode);

              }
            }

          },
        });
    }
    if (ProductTypeId == 7)//MESH
    {

      if (this.is_RowMaterial == false) {

        this.selectMeshsap = ProductId
        // this.GetMeshData(ProductId)

        this.productcodeservice.GetMeshProductCodebyId(ProductId).subscribe({
          next: (response) => {

            console.log("response", response);
            this.ProductDetailsData = response;
          },
          error: (e) => {
            console.log(e.error);
            this.tosterService.error(e.error.text)
          },
          complete: () => {
            if (this.mode === 'edit') {

              if (this.selectproductType == 7) {
                console.log("data", this.ProductDetailsData)

                this.prodcodeForm.controls['productcode'].patchValue(this.ProductDetailsData[0].ProductCode)
                this.prodcodeForm.controls['description'].patchValue(this.ProductDetailsData[0].ProductDescription)
                this.prodcodeForm.controls['isRowMaterial'].patchValue(this.ProductDetailsData[0].RawMaterial)
                this.is_RowMaterial = this.ProductDetailsData[0].RawMaterial;
                this.prodcodeForm.controls['meshstatus'].patchValue(this.ProductDetailsData[0].StatusId)

                //GREEN 
                this.selectMeshsap = Number(this.ProductDetailsData[0].SAPMaterialCodeId);  //SAP MATERIAL
                this.MESHprodcodeForm.controls['mwspace'].patchValue(this.ProductDetailsData[0].MWSpace);
                this.MESHprodcodeForm.controls['cwspace'].patchValue(this.ProductDetailsData[0].CWSpace);
                this.MESHprodcodeForm.controls['meshWeightsqm'].patchValue(this.ProductDetailsData[0].WeightRun);
                this.selectedtwin = this.ProductDetailsData[0].TwinIndicator

                // StructureId
                this.selectstruct = []
                this.ProductDetailsData[0].StructureId = this.ProductDetailsData[0].StructureId.split(',');
                for (let i = 0; i < this.ProductDetailsData[0].StructureId.length; i++) {
                  this.selectstruct.push(Number(this.ProductDetailsData[0].StructureId[i]))
                }
                this.selectMinmax()
                this.MESHprodcodeForm.controls['meshminlink'].patchValue(this.ProductDetailsData[0].MinLinkFactor);
                this.MESHprodcodeForm.controls['meshmaxlink'].patchValue(this.ProductDetailsData[0].MaxLinkFactor);

                //YELLOW
                this.selectedMWproduct = this.ProductDetailsData[0].MWProductCodeId;
                this.mwtype = this.ProductDetailsData[0].MWMaterialType;
                this.MESHprodcodeForm.controls['MWdia'].patchValue(this.ProductDetailsData[0].MWDiameter);
               //this.MESHprodcodeForm.controls['MWgrade'].patchValue(this.ProductDetailsData[0].MWGrade);
               this.meshMWgrade=Number(this.ProductDetailsData[0].MWGrade);
               
                this.MESHprodcodeForm.controls['MWweight'].patchValue(this.ProductDetailsData[0].MWWeightRun);


                    debugger;

                //RED
                this.selectedCWproduct = this.ProductDetailsData[0].CWProductCodeId;
                this.cwtype = this.ProductDetailsData[0].CWMaterialType;
                this.MESHprodcodeForm.controls['CWdia'].patchValue(this.ProductDetailsData[0].CWDiameter);
                //this.MESHprodcodeForm.controls['CWgrade'].patchValue(this.ProductDetailsData[0].CWGrade);
                this.meshCWgrade=Number(this.ProductDetailsData[0].CWGrade);

                this.MESHprodcodeForm.controls['CWweight'].patchValue(this.ProductDetailsData[0].CWWeightRun);



              }
            }

          },
        });


      }
      else if (this.is_RowMaterial == true)// Row Material
      {

        this.productcodeservice.GetRowMaterialProductCodebyId(ProductId)
          .subscribe({
            next: (response) => {
              debugger;
              console.log(response);
              this.ProductDetailsData = response;
            },
            error: (e) => {
              console.log(e.error);
              this.tosterService.error(e.error.text)
            },
            complete: () => {
              if (this.mode === 'edit') {

                if (this.selectproductType == 7) {
                  console.log(this.ProductDetailsData)

                  this.RowMaterialForm.controls['rowMWmaterialtype'].patchValue(Number(this.ProductDetailsData[0].MaterialType));
                  this.RowMaterialForm.controls['rowDiameter'].patchValue(this.ProductDetailsData[0].Diameter);
                  this.RowMaterialForm.controls['rowMaterialTypeAbbr'].patchValue(this.ProductDetailsData[0].MaterialAbbr);
                  this.RowMaterialForm.controls['rowgrade'].patchValue(Number(this.ProductDetailsData[0].Grade));
                  this.RowMaterialForm.controls['rowWeightsqm'].patchValue(this.ProductDetailsData[0].WeightRun);
                  this.isshowstatus = this.ProductDetailsData[0].StatusId;
                  // this.is_RowMaterial = this.ProductDetailsData[0].RawMaterial;
                  this.prodcodeForm.controls['isRowMaterial'].patchValue(this.ProductDetailsData[0].RawMaterial)

                  this.prodcodeForm.controls['description'].patchValue(this.ProductDetailsData[0].ProductDescription);
                  this.prodcodeForm.controls['productcode'].patchValue(this.ProductDetailsData[0].ProductCode);
                  this.RowMaterialForm.controls['rowsapmaterial'].patchValue(this.ProductDetailsData[0].SAPMaterialCodeId);

                }
              }

            },
          });
      }
      // this.productcodeservice.GetMeshData(ProductId)
      //   .subscribe({
      //     next: (response) => {
      //       
      //       console.log(response);
      //       this.meshData = response;
      //     },
      //     error: (e) => {
      //       console.log(e.error);
      //       this.tosterService.error(e.error)
      //     },
      //     complete: () => {

      //     },
      //   });


    }
  }
  ChangeProductType(event: any) {
    debugger
    // this.prodcodeForm.reset();
    this.prodcodeForm.controls['productcode'].reset()
    this.prodcodeForm.controls['description'].reset()

    this.CABprodcodeForm.reset();
    this.CORECAGEprodcodeForm.reset();
    this.MESHprodcodeForm.reset();
    this.RowMaterialForm.reset();


    this.is_RowMaterial = false;
    this.prodcodeForm.controls['isRowMaterial'].setValue(false);
    this.isformsubmit = false
    this.selectproductType = event;
    if (event == 4 || event == 11) {

      this.isReadOnly = true
    }
    else {
      this.isReadOnly = false;
    }
    console.log(this.selectproductType);
  }

  Changesap(event: any) {
debugger;
this.MESHprodcodeForm.reset();
    this.selectMeshsap = event;
    this.meshData = {};
    if (this.selectMeshsap == undefined) {
      this.MESHprodcodeForm.reset();
      //selectedtwin
      this.selectedtwin = this.TwinIndList.find((x: { AttributeDesc: string; }) => x.AttributeDesc === 'None').AttributeValue
   
      this.MESHprodcodeForm.controls.twinind.setValue(this.selectedtwin);
    
    }

    this.GetMeshData(this.selectMeshsap);
    console.log(event)
  }



  submit() {
    debugger;

    this.isformsubmit = true;
    if (this.prodcodeForm.valid) {

      if (this.selectproductType == 15) {

        if (this.mode !== 'edit') {
          this.isformsubmit = true;

          if (this.CORECAGEprodcodeForm.valid) {

            console.log("log", this.CORECAGEprodcodeForm.value);
            const ProductCodeobj: ADD_CAR_PRODUCTCODE = {
              ProductCodeId: 0,
              SapMaterial: this.CORECAGEprodcodeForm.value.sapmaterial,
              StructureElement: Number(this.CORECAGEprodcodeForm.value.structureelement),
              WeightSqm: Number(this.CORECAGEprodcodeForm.value.Weightsqm),
              StatusId: Number(this.isshowstatus),
              UserId:this.userId,
              ProductCode: this.prodcodeForm.value.productcode,
              ProductDescription: this.prodcodeForm.value.description,
              ProductType: this.prodcodeForm.value.ProductCodeType

            };

            this.productcodeservice.SaveCARProductCode(ProductCodeobj)
              .subscribe({
                next: (response) => {
                  console.log(response);
                  this.CARProductcodeObj = response;
                  if (response == 1) {
                    this.tosterService.success("The Product Code details saved successfully.");
                  }
                  else if (response == 2) {
                    this.tosterService.success("The Product Code details Updated successfully.");
                  }
                  this.saveTrigger.emit(this.CARProductcodeObj);
                  //location.reload();

                },
                error: (e) => {

                  console.log(e.error);
                  this.tosterService.error(e.error.text)
                },
                complete: () => {
                  this.modalService.dismissAll();


                },
              });

          }
          else {
            this.tosterService.error('Please fill the required fields');

          }

        }
        else {
          this.isformsubmit = true;

          if (this.CORECAGEprodcodeForm.valid) {

            const carprod: ADD_CAR_PRODUCTCODE = {
              ProductCodeId: this.ProductDetailsData[0].ProductCodeId,
              SapMaterial: this.CORECAGEprodcodeForm.value.sapmaterial,
              StructureElement: this.CORECAGEprodcodeForm.value.structureelement,
              WeightSqm: this.CORECAGEprodcodeForm.value.Weightsqm,
              StatusId: Number(this.isshowstatus),
              UserId:this.userId,
              ProductCode: this.prodcodeForm.value.productcode,
              ProductDescription: this.prodcodeForm.value.description,
              ProductType: this.prodcodeForm.value.ProductCodeType
            };

            this.productcodeservice.UpdateCARProductCode(carprod)
              .subscribe({
                next: (response) => {
                  console.log(response);
                  this.CARProductcodeObj = response;
                  if (response == 1) {
                    this.tosterService.success("The Product Code details saved successfully.");
                  }
                  else if (response == 2) {
                    this.tosterService.success("The Product Code details Updated successfully.");
                  }
                  this.saveTrigger.emit(this.CARProductcodeObj);
                },
                error: (e) => {

                  console.log(e.error);
                  this.tosterService.error(e.error.text)
                },
                complete: () => {
                  this.modalService.dismissAll();
                  //location.reload();
                },

              });

          }
          else {
            this.tosterService.error('Please fill the required fields');

          }
        }

      }
      else if (this.selectproductType == 4) {

        if (this.mode !== 'edit') {
          this.isformsubmit = true;

          if (this.CABprodcodeForm.valid) {

            console.log("log", this.CABprodcodeForm.value);
            const ProductCodeobj: ADD_CAB_PRODUCTCODE = {
              CabProductCodeId: 0,
              GradeType: this.CABprodcodeForm.value.gradetype.trim(),
              Diameter: Number(this.CABprodcodeForm.value.diameter),
              CouplerIndicator: this.CABprodcodeForm.value.coupler,
              // CouplerType: this.CABprodcodeForm.value.couplertype,
              CouplerType: this.CABprodcodeForm.value.coupler === true ? this.CABprodcodeForm.value.couplertype : '',
              FGSAPMaterialID: Number(this.CABprodcodeForm.value.fgmaterial),
              RMSAPMaterialID: Number(this.CABprodcodeForm.value.rmmaterial),
              StatusId: Number(this.isshowstatus),
              UserId: this.userId,
              ProductCode: this.prodcodeForm.value.productcode,
              Description: this.prodcodeForm.value.description,
              ProductType: this.prodcodeForm.value.ProductCodeType

            };

            this.productcodeservice.SaveCABProductCode(ProductCodeobj)
              .subscribe({
                next: (response) => {
                  console.log("response", response);
                  if (response == 1) {
                    this.tosterService.success("The Product Code details saved successfully.");
                  }
                  else if (response == 2) {
                    this.tosterService.success("The Product Code details Updated successfully.");
                  }
                  this.saveTrigger.emit();
                  //location.reload();
                },
                error: (e) => {

                  console.log(e.error.text);
                  this.tosterService.error(e.error.text)
                },
                complete: () => {
                  this.modalService.dismissAll();


                },
              });

          }
          else {
            this.tosterService.error('Please fill the required fields');

          }

        }
        else {
          this.isformsubmit = true;

          if (this.CABprodcodeForm.valid) {

            console.log("log", this.CABprodcodeForm)
            const cabprod: ADD_CAB_PRODUCTCODE = {
              CabProductCodeId: this.ProductDetailsData[0].CABProductCodeID,
              GradeType: this.CABprodcodeForm.value.gradetype,
              Diameter: Number(this.CABprodcodeForm.value.diameter),
              CouplerIndicator: this.CABprodcodeForm.value.coupler,
              CouplerType: this.CABprodcodeForm.value.coupler === true ? this.CABprodcodeForm.value.couplertype : '',
              FGSAPMaterialID: Number(this.CABprodcodeForm.value.fgmaterial),
              RMSAPMaterialID: Number(this.CABprodcodeForm.value.rmmaterial),
              StatusId: Number(this.isshowstatus),
              UserId: this.userId,
              ProductCode: this.prodcodeForm.value.productcode,
              Description: this.prodcodeForm.value.description,
              ProductType: this.prodcodeForm.value.ProductCodeType
            };

            this.productcodeservice.UpdateCABProductCode(cabprod)
              .subscribe({
                next: (response) => {
                  console.log(response);
                  if (response == 1) {
                    this.tosterService.success("The Product Code details Updated successfully.");
                  }
                  else if (response == 2) {
                    this.tosterService.success("The Product Code details Updated successfully.");
                  }
                  else if (response == 4) {
                    this.tosterService.error("The grade,diameter,coupler indicator and coupler type combination already exist.");
                  }

                },
                error: (e) => {

                  console.log(e.error.text);
                  this.tosterService.error(e.error.text)
                },
                complete: () => {
                  this.saveTrigger.emit();
                  this.modalService.dismissAll();



                },
              });

          }
          else {
            this.tosterService.error('Please fill the required fields');

          }
        }
      }
      else if (this.selectproductType == 7) {
        if (this.is_RowMaterial == true) {
          if (this.mode !== 'edit') {
            this.isformsubmit = true;

            if (this.RowMaterialForm.valid) {
              debugger;
              console.log("log", this.RowMaterialForm.value);
              const ProductCodeobj: RowMaterial_Add_ProductCode = {
                ProductCodeId: 0,
                ProductCode: this.prodcodeForm.value.productcode,
                ProductDescription: this.prodcodeForm.value.description,
                RawMaterial: Number(this.is_RowMaterial),
                MaterialType: this.RowMaterialForm.value.rowMWmaterialtype,
                Diameter: Number(this.RowMaterialForm.value.rowDiameter),
                MaterialAbbr: this.RowMaterialForm.value.rowMaterialTypeAbbr,
                Grade: Number(this.RowMaterialForm.value.rowgrade),
                WeightRun: Number(this.RowMaterialForm.value.rowWeightsqm),
                StatusId: Number(this.isshowstatus),
                UserId: this.userId,
                SapMaterialId: this.RowMaterialForm.value.rowsapmaterial
              };


              this.productcodeservice.SaveRowMaterialProductCode(ProductCodeobj)
                .subscribe({
                  next: (response) => {
                    console.log(response);

                    if (response == 1) {
                      this.tosterService.success("The Product Code details saved successfully.");
                    }
                    else if (response == 2) {
                      this.tosterService.success("The Product Code details Updated successfully.");
                    }
                    this.saveTrigger.emit(this.CARProductcodeObj);
                    //location.reload();

                  },
                  error: (e) => {

                    console.log(e.error);
                    this.tosterService.error(e.error.text)
                  },
                  complete: () => {
                    this.modalService.dismissAll();


                  },
                });

            }
            else {
              this.tosterService.error('Please fill the required fields');

            }

          }
          else {
            //Update
            this.isformsubmit = true;

            if (this.RowMaterialForm.valid) {
              const ProductCodeobj: RowMaterial_Add_ProductCode = {
                SapMaterialId: this.RowMaterialForm.value.rowsapmaterial,
                ProductCodeId: this.ProductDetailsData[0].ProductCodeId,
                MaterialType: this.RowMaterialForm.value.rowMWmaterialtype,
                Diameter: Number(this.RowMaterialForm.value.rowDiameter),
                MaterialAbbr: this.RowMaterialForm.value.rowMaterialTypeAbbr,
                Grade: Number(this.RowMaterialForm.value.rowgrade),
                WeightRun: Number(this.RowMaterialForm.value.rowWeightsqm),
                StatusId: Number(this.isshowstatus),
                RawMaterial: Number(this.is_RowMaterial),
                UserId: this.userId,
                ProductCode: this.prodcodeForm.value.productcode,
                ProductDescription: this.prodcodeForm.value.description,
              }

              this.productcodeservice.UpdateRowMaterialProductCode(ProductCodeobj)
                .subscribe({
                  next: (response) => {
                    console.log(response);
                    this.CARProductcodeObj = response;
                    if (response == 1) {
                      this.tosterService.success("The Product Code details saved successfully.");
                    }
                    else if (response == 2) {
                      this.tosterService.success("The Product Code details Updated successfully.");
                    }
                    //location.reload();
                    this.saveTrigger.emit(this.CARProductcodeObj);
                  },
                  error: (e) => {

                    console.log(e.error);
                    this.tosterService.error(e.error.text)
                  },
                  complete: () => {
                    this.modalService.dismissAll();

                  },
                });
            }
            else {
              this.tosterService.error('Please fill the required fields');

            }
          }
        }
        else {
          if (this.mode !== 'edit') {
            this.isformsubmit = true;

            if (this.MESHprodcodeForm.valid) {
              const ProductCodeobj: ADD_MESH_PRODUCTCODE = {
                ProductCodeId: 0,
                ProductCode: this.prodcodeForm.value.productcode,
                ProductDescription: this.prodcodeForm.value.description,
                RawMaterial: Boolean(this.is_RowMaterial),
                MWProductCodeId: this.MESHprodcodeForm.value.MWproduct,
                MWMaterialType: this.MESHprodcodeForm.value.MWmaterialtype,
                MWDiameter: this.MESHprodcodeForm.value.MWdia,
                MWSpace: Number(this.MESHprodcodeForm.value.mwspace),
                MWGrade: this.MESHprodcodeForm.value.MWgrade.toString(),
                MWWeightRun: this.MESHprodcodeForm.value.MWweight,
                CWProductcodeId: this.MESHprodcodeForm.value.CWproduct,
                CWMaterialType: this.MESHprodcodeForm.value.CWmaterialtype,
                CWDiameter: this.MESHprodcodeForm.value.CWdia,
                CWSpace: Number(this.MESHprodcodeForm.value.cwspace),
                CWGrade: this.MESHprodcodeForm.value.CWgrade.toString(),
                CWWeightRun: this.MESHprodcodeForm.value.CWweight,
                WeightSqm: this.MESHprodcodeForm.value.meshWeightsqm,
                TwinInd: this.MESHprodcodeForm.value.twinind,
                MinLink: Number(this.MESHprodcodeForm.value.meshminlink),
                MaxLink: Number(this.MESHprodcodeForm.value.meshmaxlink),
                SapMaterial: this.MESHprodcodeForm.value.meshsapmaterial,
                ProductTypeID: 7,
                StructureElement: this.MESHprodcodeForm.value.meshstructelement.toString(),
                StatusId: Number(this.isshowstatus),
                UserId: this.userId


              };


              this.productcodeservice.SaveMESHProductCode(ProductCodeobj).subscribe({
                next: (response) => {
                  console.log(response);
                  this.MESHProductcodeObj = response;
                  this.saveTrigger.emit(this.MESHProductcodeObj);
                  console.log("obj", ProductCodeobj)
                  this.tosterService.success('MESH Product Code Added successfully')
                },

                error: (e) => {

                  console.log(e.error);
                  this.tosterService.error(e.error.text)
                },
                complete: () => {
                  this.modalService.dismissAll();
                  this.saveTrigger.emit(this.MESHProductcodeObj);
                },

              });
            } else {
              this.tosterService.error('Please fill the required fields');
            }
          }
          else {
            this.isformsubmit = true;
            if (this.MESHprodcodeForm.valid) {
              const meshprod: ADD_MESH_PRODUCTCODE = {
                ProductCodeId: this.ProductDetailsData[0].ProductCodeId,
                ProductCode: this.prodcodeForm.value.productcode,
                ProductDescription: this.prodcodeForm.value.description,
                RawMaterial: Boolean(this.is_RowMaterial),
                MWProductCodeId: this.MESHprodcodeForm.value.MWproduct,
                MWMaterialType: this.MESHprodcodeForm.value.MWmaterialtype,
                MWDiameter: this.MESHprodcodeForm.value.MWdia,
                MWSpace: Number(this.MESHprodcodeForm.value.mwspace),
                MWGrade: this.MESHprodcodeForm.value.MWgrade.toString(),
                MWWeightRun: this.MESHprodcodeForm.value.MWweight,
                CWProductcodeId: this.MESHprodcodeForm.value.CWproduct,
                CWMaterialType: this.MESHprodcodeForm.value.CWmaterialtype,
                CWDiameter: this.MESHprodcodeForm.value.CWdia,
                CWSpace: Number(this.MESHprodcodeForm.value.cwspace),
                CWGrade: this.MESHprodcodeForm.value.CWgrade.toString(),
                CWWeightRun: this.MESHprodcodeForm.value.CWweight,
                WeightSqm: this.MESHprodcodeForm.value.meshWeightsqm,
                TwinInd: this.MESHprodcodeForm.value.twinind,
                MinLink: Number(this.MESHprodcodeForm.value.meshminlink),
                MaxLink: Number(this.MESHprodcodeForm.value.meshmaxlink),
                SapMaterial: this.MESHprodcodeForm.value.meshsapmaterial,
                ProductTypeID: 7,
                StructureElement: this.MESHprodcodeForm.value.meshstructelement.toString(),
                StatusId: Number(this.isshowstatus),
                UserId: this.userId

              };
              console.log("meshprod", meshprod)
              // alert('data edited')
              this.productcodeservice.UpdateMeshProductCode(meshprod).subscribe({
                next: (response) => {
                  console.log(response);
                  this.MESHProductcodeObj = response;
                  this.saveTrigger.emit(meshprod);
                  this.tosterService.success('MESH Product Code Updated successfully')
                },
                error: (e) => {

                  console.log(e.error);
                  this.tosterService.error(e.error.text)
                },
                complete: () => {
                  this.modalService.dismissAll();
                },
              });
            }
            else {
              this.tosterService.error('Please fill the required fields');
            }
          }
        }
      }
      else if (this.selectproductType == 11) {//Accessories
        //ADD_ACS_PRODUCTCODE

        if (this.mode !== 'edit') {
          this.isformsubmit = true;

          if (this.AccessoriesForm.valid) {

            console.log("log", this.AccessoriesForm.value);
            const ProductCodeobj: ADD_ACS_PRODUCTCODE = {
              AccessoriesProductCodeId: 0,
              GradeType: this.AccessoriesForm.value.acsgradetype,
              Diameter: Number(this.AccessoriesForm.value.acsdiameter),
              FGSAPMaterialID: Number(this.AccessoriesForm.value.acsfgmaterial),
              StatusId: Number(this.isshowstatus),
              UserId: this.userId,
              ProductCode: this.prodcodeForm.value.productcode,
              Description: this.prodcodeForm.value.description,
              ProductType: this.prodcodeForm.value.ProductCodeType

            };

            this.productcodeservice.SaveACSProductCode(ProductCodeobj)
              .subscribe({
                next: (response) => {
                  console.log(response);

                  if (response == 1) {
                    this.tosterService.success("The Product Code details saved successfully.");
                  }
                  else if (response == 2) {
                    this.tosterService.success("The Product Code details Updated successfully.");
                  }
                  else if (response == 3) {
                    this.tosterService.error("The grade,diameter combination already exist.");
                  }
                  //location.reload();
                  this.saveTrigger.emit(this.CARProductcodeObj);


                },
                error: (e) => {

                  console.log(e.error);
                  this.tosterService.error(e.error.text)
                },
                complete: () => {
                  this.modalService.dismissAll();


                },
              });

          }
          else {
            this.tosterService.error('Please fill the required fields');

          }

        }
        else {
          this.isformsubmit = true;

          if (this.AccessoriesForm.valid) {

            const ProductCodeobj: ADD_ACS_PRODUCTCODE = {
              AccessoriesProductCodeId: this.ProductDetailsData[0].AccessoriesProductCodeID,
              GradeType: this.AccessoriesForm.value.acsgradetype,
              Diameter: Number(this.AccessoriesForm.value.acsdiameter),
              FGSAPMaterialID: Number(this.AccessoriesForm.value.acsfgmaterial),
              StatusId: Number(this.isshowstatus),
              UserId: this.userId,
              ProductCode: this.prodcodeForm.value.productcode,
              Description: this.prodcodeForm.value.description,
              ProductType: this.prodcodeForm.value.ProductCodeType

            };

            this.productcodeservice.UpdateACSProduct(ProductCodeobj)
              .subscribe({
                next: (response) => {
                  console.log(response);
                  this.CARProductcodeObj = response;
                  if (response == 1) {
                    this.tosterService.success("The Product Code details saved successfully.");
                  }
                  else if (response == 2) {
                    this.tosterService.success("The Product Code details Updated successfully.");
                  }
                  else if (response == 4) {
                    this.tosterService.error("The grade,diameter combination already exist.");
                  }
                  //location.reload();
                  this.saveTrigger.emit(this.CARProductcodeObj);
                },
                error: (e) => {

                  console.log(e.error);
                  this.tosterService.error(e.error.text)
                },
                complete: () => {
                  this.modalService.dismissAll();

                },
              });

          }
          else {
            this.tosterService.error('Please fill the required fields');

          }
        }
        ///Accessories End


      }
    }
    else {
      this.tosterService.error('Please fill the required fields');
    }
  }

  cancel() {
    this.modalService.dismissAll()
  }

  GetGroupTypeList() {

    this.productcodeservice.GetCAB_GradeType_List().subscribe({
      next: (response) => {

        this.cabgradetypeList = response;
      },
      error: (e) => {

      },
      complete: () => {

      },

    });

  }

  GetFGSA_Material_List() {
    this.productcodeservice.GetFGSA_List().subscribe({
      next: (response) => {
        this.fgsamaterialList = response;
      },
      error: (e) => {

      },
      complete: () => {

      },

    });

  }
  GetFGSA_RMSA_Material_List() {
    this.productcodeservice.GetACSFGSA_RMSA__List().subscribe({
      next: (response) => {

        this.acsfgsamaterialList = response;
      },
      error: (e) => {

      },
      complete: () => {

      },

    });

  }

  ResetCoupler() {

    this.CABprodcodeForm.controls['couplertype'].reset;
  }

  GetRMSA_Material_List() {
    this.productcodeservice.GetFGSA_List().subscribe({
      next: (response) => {
        this.rmsamaterialList = response;
      },
      error: (e) => {

      },
      complete: () => {

      },

    });

  }

  GetSAPMaterialList_CoreCage() {

    this.productcodeservice.GetCoreCageSAP_Material().subscribe({
      next: (response) => {
        this.coresapmaterialList = response;
        console.log("SAP MaterialList", this.coresapmaterialList);

      },
      error: (e) => {

      },
      complete: () => {

      },

    });

  }



  ChangesDiameter(event: any) {

    console.log(this.cabgradetypeList)
    this.strdiameter = event;
    this.Productcodestring = '';
    //this.CABprodcodeForm.controls['']
    if (this.CABprodcodeForm.controls['gradetype'].value && this.CABprodcodeForm.controls['diameter'].value) {
      this.Productcodestring = this.CABprodcodeForm.controls['gradetype'].value + this.CABprodcodeForm.controls['diameter'].value;

      this.prodcodeForm.controls['productcode'].patchValue(this.Productcodestring);
      this.isReadOnly = true;
    }
    else {
      this.Productcodestring = "";
    }


  }

  ChangesACSDiameter(event: any) {

    // this.strdiameter = event;
    this.Productcodestring = '';
    //this.AccessoriesForm.controls['']
    if (this.AccessoriesForm.controls['acsgradetype'].value && this.AccessoriesForm.controls['acsdiameter'].value) {
      this.Productcodestring = this.AccessoriesForm.controls['acsgradetype'].value + this.AccessoriesForm.controls['acsdiameter'].value;

      this.prodcodeForm.controls['productcode'].patchValue(this.Productcodestring);
      this.isReadOnly = true;
    }
    else {
      this.Productcodestring = "";
    }


  }



  ChangesSAPMAterialCorecage(event: any) {

    this.strdiameter = event;
    this.CORECAGEprodcodeForm.controls['']
    if (this.CORECAGEprodcodeForm.controls['sapmaterial'].value) {
      //this.Productcodestring = this.CORECAGEprodcodeForm.controls['sapmaterial'].value;

      this.isReadOnly = false;
    }
    else {
      this.Productcodestring = "";
    }

  }
  GetGroupTypeACSList() {
    this.productcodeservice.GetACS_GradeType_List().subscribe({
      next: (response) => {

        this.ACSgradetypeList = response;
      },
      error: (e) => { },
      complete: () => { },

    });
  }


  GetProductTypeList() {
    this.productcodeservice.GetProductType_List().subscribe({
      next: (response) => {
        this.ProductCodeTypeList = response;
      },
      error: (e) => {
      },
      complete: () => { },

    });

  }


  GetMeshData(SAPMaterialId: any) {
    debugger;
    this.productcodeservice.GetMeshData(SAPMaterialId).subscribe({
      next: (response) => {
        debugger;
        this.meshData = response[0];
        console.log("meshDATA", this.meshData)
        console.log(this.MaterialTypeList);
        this.selectedtwin = this.TwinIndList.find((x: { AttributeDesc: string; }) => x.AttributeDesc === 'None').AttributeValue
   

        this.prodcodeForm.controls['productcode'].setValue(this.meshData.MaterialDescription)
        this.prodcodeForm.controls['description'].setValue(this.meshData.MaterialDescription)

        //GREEN
        this.MESHprodcodeForm.controls['mwspace'].setValue(this.meshData.MainWireSpace);
        this.MESHprodcodeForm.controls['cwspace'].setValue(this.meshData.CrossWireSpace);
        this.MESHprodcodeForm.controls['twinind'].setValue(this.selectedtwin);

        //YELLOW
        this.selectedMWproduct = Number(this.meshData.DRP_M_ProdCodeID);
        if (this.meshData.DRP_M_ProdCodeID == null) {
          this.selectedMWproduct = undefined
        }
        this.mwtype = this.MaterialTypeList.find(x => x.MaterialType === this.meshData.MMType).MaterialTypeId
        this.MESHprodcodeForm.controls['MWdia'].setValue(this.meshData.M_DIA);
        //this.MESHprodcodeForm.controls['MWgrade'].setValue(this.meshData.M_Grade.trim());
        this.meshMWgrade=Number(this.meshData.M_Grade);
        this.MESHprodcodeForm.controls['MWweight'].patchValue(this.meshData.M_WeightRun);

        //RED
        this.selectedCWproduct = Number(this.meshData.DRP_C_ProdCodeID)
        if (this.meshData.DRP_C_ProdCodeID == null) {
          this.selectedCWproduct = undefined
        }
        this.cwtype = this.MaterialTypeList.find(x => x.MaterialType === this.meshData.CMType).MaterialTypeId
        this.MESHprodcodeForm.controls['CWdia'].setValue(this.meshData.C_DIA);
        this.meshCWgrade=Number(this.meshData.C_Grade)
       // this.MESHprodcodeForm.controls['CWgrade'].setValue(this.meshData.C_Grade);
        this.MESHprodcodeForm.controls['CWweight'].setValue(this.meshData.C_WeightRun);
      },
      error: (e) => {

        this.prodcodeForm.controls['productcode'].setValue(null)
        this.prodcodeForm.controls['description'].setValue(null)

        //GREEN
        this.selectedtwin = this.TwinIndList.find((x: { AttributeDesc: string; }) => x.AttributeDesc === 'None').AttributeValue
   
        this.MESHprodcodeForm.controls['mwspace'].setValue(null);
        this.MESHprodcodeForm.controls['cwspace'].setValue(null);
        this.MESHprodcodeForm.controls['twinind'].setValue(this.selectedtwin);

        //YELLOW


        this.selectedMWproduct = undefined

        this.mwtype = null
        this.MESHprodcodeForm.controls['MWdia'].setValue(null);
        this.MESHprodcodeForm.controls['MWgrade'].setValue(null);
        this.MESHprodcodeForm.controls['MWweight'].patchValue(null);

        //RED
        this.selectedCWproduct = undefined

        this.cwtype = null
        this.MESHprodcodeForm.controls['CWdia'].setValue(null);
        this.MESHprodcodeForm.controls['CWgrade'].setValue(null);
        this.MESHprodcodeForm.controls['CWweight'].patchValue(null);
        console.log("This is error", e);
      },
      complete: () => { },

    });

  }
  GetSAPMaterialList_Msh() {
    this.productcodeservice.GetSAPMaterialDropdown_Mesh().subscribe({
      next: (response) => {
        this.MeshSAPMaterialList = response;
      },
      error: (e) => {
      },
      complete: () => { },

    });
  }
  GetSAPMaterialList_Raw() {
    this.productcodeservice.GetSAPMaterialDropdown_Raw().subscribe({
      next: (response) => {
        this.RawSAPMaterialList = response;
      },
      error: (e) => {
      },
      complete: () => { },

    });
  }
  GetWireMaterialList_Msh() {
    this.productcodeservice.GetMaterialType_Raw_Mat().subscribe({
      next: (response) => {
        this.MaterialTypeList = response;
        console.log()
      },
      error: (e) => {
      },
      complete: () => { },

    });
  }
  GetWireProductList_Msh() {
    this.productcodeservice.GetWireProductList_Mesh().subscribe({
      next: (response) => {
        // this.WireProductList = response;
        for (let i = 0; i < response.length; i++) {
          this.WireProductList.push({ item_id: response[i].ProductCodeId, item_text: response[i].ProductCode })
        }
        this.mwprod = this.WireProductList
        console.log("myprod", this.mwprod)
        this.cwprod = this.WireProductList
      },
      error: (e) => {
      },
      complete: () => { },

    });
  }


  GetStructureElement_Msh() {
    this.productcodeservice.GetStructureElement_Dropdown_Mesh_Get().subscribe({
      next: (response) => {
        this.structureList = response;
      },
      error: (e) => {
      },
      complete: () => { },

    });
  }

  GetTwinIndicator_Mesh() {
    this.productcodeservice.GetTwinIndicator_Dropdown_Mesh().subscribe({
      next: (response) => {
        this.TwinIndList = response;
        this.selectedtwin = this.TwinIndList.find((x: { AttributeDesc: string; }) => x.AttributeDesc === 'None').AttributeValue
      },
      error: (e) => {
      },
      complete: () => { },

    });
  }

  //Row Material Methods
  ChangesRowMaterial(event: any) {
    this.item = this.RowMaterialList.find((x: { MaterialTypeId: any }) =>
      x.MaterialTypeId === Number(event));
    console.log(this.item);
    this.Materialapprvation = this.item?.WireSpecDesc.toString();

  }
  GetRowMaterial_GetMaterialType() {
    this.productcodeservice.GetMaterialType_Raw_Mat().subscribe({
      next: (response) => {
        this.RowMaterialList = response;
      },
      error: (e) => {
      },
      complete: () => { },

    });
  }
  GetRowMaterial_Grade() {
    this.productcodeservice.GetGrade_Raw_Mat().subscribe({
      next: (response) => {
        this.RowMatrialGradeList = response;
      },
      error: (e) => {
      },
      complete: () => { },
    });
  }

  selectMinmax() {
    if (this.selectstruct.length == 0) {
      this.isMinmax = false;
      return;
    }
    console.log(this.structureList)
    // for (let i = 0; i < this.selectstruct.length; i++) {
    //   if (this.selectstruct[i] !== 1 && this.selectstruct[i] !== 2) {
    //     this.isMinmax = false;
    //     return;
    //   }
    // }
    if (this.selectstruct.length == 1 && this.selectstruct[0] == 4){
      this.isMinmax = false;
        return;
    }
    this.isMinmax = true;
  }
  ChangeMWProduct() {
    debugger;
    if (this.selectedMWproduct === null) {
      this.mwtype = null

      this.MESHprodcodeForm.controls['MWdia'].setValue(null);
      this.MESHprodcodeForm.controls['MWweight'].setValue(null);
      this.MESHprodcodeForm.controls['MWgrade'].setValue(null);
    }
    this.GetMWMaterial(this.selectedMWproduct);



  }
  ChangeCWProduct() {
    debugger;
    if (this.selectedCWproduct === null) {
      this.cwtype = null

      this.MESHprodcodeForm.controls['CWdia'].setValue(null);
      this.MESHprodcodeForm.controls['CWweight'].setValue(null);
      this.MESHprodcodeForm.controls['CWgrade'].setValue(null);
    }
    this.GetCWMaterial(this.selectedCWproduct);



  }
  GetMWMaterial(MWMaterialID: any) {
    this.productcodeservice.GetMWMaterialData(MWMaterialID).subscribe({
      next: (response) => {
        debugger;
        this.MainWireData = response[0];
        console.log("meshDATA", this.MainWireData)
        this.mwtype = this.MainWireData.intMaterialTypeId

        this.MESHprodcodeForm.controls['MWdia'].setValue(this.MainWireData.decMWDiameter);
        this.MESHprodcodeForm.controls['MWweight'].setValue(this.MainWireData.decWeigthPerMeterRun);
        //this.MESHprodcodeForm.controls['MWgrade'].setValue(this.MainWireData.M_GRADE.trim());
        if(this.MainWireData.M_GRADE )
        {
        this.meshMWgrade=Number(this.MainWireData.M_GRADE);
        }
      },
      error: (e) => {

      },
      complete: () => { },

    });

  }
  GetCWMaterial(CWMaterialID:any)
  {
    debugger;
    this.productcodeservice.GetCWMaterialData(CWMaterialID).subscribe({
      next: (response) => {
        debugger;
        this.CrossWireData = response[0];
        console.log("meshDATA", this.CrossWireData)     
  
        this.cwtype = this.CrossWireData.intMaterialTypeId
        
        this.MESHprodcodeForm.controls['CWdia'].setValue(this.CrossWireData.decCWDiameter);
        this.MESHprodcodeForm.controls['CWweight'].setValue(this.CrossWireData.decCWWeigthPerMeterRun);
       // this.MESHprodcodeForm.controls['CWgrade'].setValue(this.CrossWireData.C_GRADE.trim());
       if(this.CrossWireData.C_GRADE)
       {
       this.meshCWgrade=Number(this.CrossWireData.C_GRADE);
       }
      },
      error: (e) => {
       
       
      },
      complete: () => { },

    });

  }
}

