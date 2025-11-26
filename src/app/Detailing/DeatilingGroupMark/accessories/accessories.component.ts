import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccessoriesService } from '../../MeshDetailing/accessories.service';
import { DetailingService } from '../../DetailingService';

@Component({
  selector: 'app-accessories',
  templateUrl: './accessories.component.html',
  styleUrls: ['./accessories.component.css']
})
export class AccessoriesComponent implements OnInit {
  accessories_list: any = [];
  Slabproductcode_dropdown: any = []
  seDetailingID: any = 0;
  new_accessories_list: any = { 'acc_marking': "AC-1", 'product_code': '', 'qty': 100, 'length': 1000, 'unit_weight': null, 'uom': '', 'invoice': null }
  SapmaterialData: any;
  enableEditIndex: any = null;
  productCode: any;
  productCode_edit: any;
  lastElement: any;
  prev_index: any = null;
  backup_item: any;
  storedObjectData: any;
  strIsReadOnly: any="NO";
  StructureElementId :any;
  MeshData: any
  intRecordCount: number=0;
  loading:boolean=false;
  isaddnewRecord: boolean = false;
  isupdateRecord: boolean = false;
  pageSize = 0;
  maxSize: number = 10;
  currentPage = 1;
  itemsPerPage: number = 10;
  @ViewChild('strucuremarkingInput')
  strucuremarkingInput!: ElementRef;
  constructor(private tosterService: ToastrService, private Accessories: AccessoriesService, public detailingService: DetailingService) { }

  ngOnInit() {
    console.log(localStorage.getItem('PostedGM'));
    this.intRecordCount=Number(localStorage.getItem('PostedGM'));
    console.log(this.intRecordCount);
    if(this.intRecordCount>0)
    {
      this.strIsReadOnly='YES'
    }
    this.storedObjectData = localStorage.getItem('MeshData');
    this.MeshData = JSON.parse(this.storedObjectData);
    this.StructureElementId = this.MeshData.INTSTRUCTUREELEMENTTYPEID;
    this.seDetailingID = this.MeshData.INTSEDETAILINGID;

      this.loadAcsData(this.seDetailingID);
      this.load('A');

  }

  onEnter() {
    this.isaddnewRecord=true;

    if (this.new_accessories_list.acc_marking != null && this.new_accessories_list.product_code != '' && this.new_accessories_list.qty != null && this.new_accessories_list.length != null) {
      const obj =
      {
        SEDetailingID: this.seDetailingID,
        AccProductMarkID: 0,
        SAPMaterialCodeID: this.productCode.SAPMaterialCodeId,
        NoOfPieces: 0,
        CABProductMarkID: this.productCode.ProductCodeId,
        GroupMarkId: 0,
        ActualWeight: 0,
        ExternalWidth: 0,
        ExternalHeight: 0,
        ExternalLength: 0,
        IsCoupler: 0,
        OrderQty: this.new_accessories_list.qty,
        CentralizerFlag: 0,
        Length: this.new_accessories_list.length,
        BitIsCoupler: 0,
        UnitWeight: this.new_accessories_list.unit_weight,
        InvoiceWeight: this.new_accessories_list.invoice,
        UOM: this.new_accessories_list.uom,
        CouplerType: null,
        SAPMaterialCode: this.productCode.SAPMaterialCode,
        CABProductMarkName: this.productCode.ProductCodeName,
        AccProductMarkingName: this.new_accessories_list.acc_marking,
        standard: null,
        MaterialType: null,
        AccessoriesList: null,
        ProductCodeName: this.productCode.ProductCodeName,


      }
      this.Accessories.Insert_Acs(obj).subscribe({
        next: (response) => {
          this.accessories_list = response;


        },
        error: (e) => {
          console.log("error", e);
           if(e.error==='POSTED')
        {
          this.strIsReadOnly='YES';

          this.tosterService.error("The groupmarking is posted already.You cannot Add a Strucutre Marking.")
        }
        else  if (e.error==='DUPLICATE')
        {
          this.tosterService.error("The Accessory Name already exist. Please refresh.")
        }
        else
        {
          this.tosterService.error(e.error);
        }
        this.strucuremarkingInput.nativeElement.focus();

        },
        complete: () => {

          this.loadAcsData(this.seDetailingID);
          this.tosterService.success('Inserted Successfully');
          this.strucuremarkingInput.nativeElement.focus();


        },
      });

    }
    else {
      this.tosterService.error('Can not add blank record.')
    }
  }
  loadAcsData(seDetailingID: any) {
    debugger;
    this.loading = true
    this.Accessories.GetAccessoriesList(seDetailingID).subscribe({
      next: (response) => {

        this.accessories_list = response;
        console.log("ACS data", this.accessories_list);

      },
      error: (e) => {
        console.log("error", e);
        this.loading = false
      },
      complete: () => {
        this.lastElement = this.accessories_list[this.accessories_list.length - 1];
        this.loading = false
        this.initialDataInsert();
      },
    });



  }
  Load_AcsproductCodeDropdown(event: any) {
    event = event.value;
    this.load(event);
    debugger;
  }
  GetSapmaterialData() {
    debugger;
    const isEdit = false
    this.productCode = this.Slabproductcode_dropdown.find((x: any) => x.ProductCodeId === this.new_accessories_list.product_code)
    this.new_accessories_list.SapMaterialCode = this.productCode.SAPMaterialCode;
    this.GetSapDataByName(this.new_accessories_list.SapMaterialCode, isEdit, null);

  }
  GetSapDataByName(SapCode: any, isEdit: any, item: any) {
    this.Accessories.GetSapMaterialList(SapCode).subscribe({
      next: (response) => {
        debugger;
        this.SapmaterialData = response[0];


      },
      error: (e) => {
        console.log("error", e);
      },
      complete: () => {
        if (isEdit === true) {
          item.SAPMaterialCode = this.SapmaterialData.MaterialCode;
          item.UOM = this.SapmaterialData.BaseUOM;
          item.UnitWeight = this.SapmaterialData.UnitWeight;
          this.CalculateInvoiceEdit(item);
        }
        else {

          this.new_accessories_list.unit_weight = this.SapmaterialData.UnitWeight;
          this.new_accessories_list.uom = this.SapmaterialData.BaseUOM;
          this.calculateInvoice();
        }

      },
    });
  }
  calculateInvoice() {
    debugger;
    this.new_accessories_list.invoice = ((this.new_accessories_list.unit_weight*this.new_accessories_list.length/1000) * this.new_accessories_list.qty).toFixed(2);

  }
  Update(item: any, i: any) {

 this.isupdateRecord = true;

 if (item.AccProductMarkingName !=='' && item.CABProductMarkID !== '' && item.Length !=='' && item.OrderQty !== '') {

    this.Accessories.Insert_Acs(item).subscribe({
      next: (response) => {

      },
      error: (e) => {
        console.log("error", e);
        if(e.error==='POSTED')
        {
          this.strIsReadOnly='YES';

          this.tosterService.error("The groupmarking is posted already.You cannot Edit a Strucutre Marking.")
        }
        else  if (e.error==='DUPLICATE')
        {
          this.tosterService.error("The Accessory Name already exist. Please refresh.")
        }
        else
        {
          this.tosterService.error(e.error);
        }
      },
      complete: () => {
        this.enableEditIndex = null;
        this.tosterService.success('Updated Successfully.')
        this.loadAcsData(this.seDetailingID);

      },
    });
  }
  else {
    this.tosterService.error('Can not add blank record.')
  }


  }
  Editcancel(item: any, i: any) {
    debugger;
    let index = this.accessories_list.findIndex((x: any) => x === item);

    this.enableEditIndex = null;



    // if (item.AccProductMarkingName == undefined) {
    //   this.accessories_list[index].AccProductMarkingName = this.backup_item[0].AccProductMarkingName
    // }

    // if (item.ProductCodeName == undefined) {
    //   this.accessories_list[index].ProductCodeName = this.backup_item[0].ProductCodeName
    // }
    // if (item.OrderQty == undefined) {
    //   this.accessories_list[index].OrderQty = this.backup_item[0].OrderQty
    // }
    // if (item.SAPMaterialCode == undefined) {
    //   this.accessories_list[index].SAPMaterialCode = this.backup_item[0].SAPMaterialCode
    // }
    // if (item.Length == "") {
    //   this.accessories_list[index].Length = this.backup_item[0].Length
    // }
    // if (item.UnitWeight == undefined) {
    //   console.log("enter struc")
    //   this.accessories_list[index].UnitWeight = this.backup_item[0].UnitWeight
    // }
    // if (item.UOM == undefined) {
    //   console.log("enter struc")
    //   this.accessories_list[index].UOM = this.backup_item[0].UOM
    // }
    // if (item.InvoiceWeight == undefined) {
    //   console.log("enter struc")
    //   this.accessories_list[index].InvoiceWeight = this.backup_item[0].InvoiceWeight
    // }

  }
  onEdit(item: any, index: any) {

    if(this.strIsReadOnly!='NO'){
      this.tosterService.warning("This record is already posted.");
      return;
    }
    debugger
    this.enableEditIndex = index;
    if (this.prev_index != null) {
      console.log("hello");
      this.accessories_list[this.prev_index] = JSON.parse(JSON.stringify(this.backup_item[0]));
    }
    this.prev_index = this.accessories_list.findIndex((x: any) => x === item)
    this.backup_item = JSON.parse(JSON.stringify(item));
    this.load("A");


  }
  load(char: any) {
    this.detailingService.Get_ACSProductCode_dropDown(char).subscribe({
      next: (response) => {
        debugger;
        this.Slabproductcode_dropdown = response;
      },
      error: (e) => {
        console.log("error", e);
      },
      complete: () => {

      },
    });
  }
  GetSapmaterialDataEdit(item: any) {
    debugger;
    const isEdit = true;

    this.productCode_edit = this.Slabproductcode_dropdown.find((x: any) => x.ProductCodeId === item.CABProductMarkID);
    item.SAPMaterialCode = this.productCode_edit.SAPMaterialCode;
    this.GetSapDataByName(item.SAPMaterialCode, isEdit, item);

  }
  deleteACS(item: any) {
    debugger;
    this.loading = true;
    this.Accessories.DeleteACS(item.AccProductMarkID).subscribe({
      next: (response) => {

      },
      error: (e) => {
        console.log("error", e);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.loadAcsData(this.seDetailingID);

      },
    });
  }
  CalculateInvoiceEdit(item: any) {
    debugger;
    item.InvoiceWeight = ((item.OrderQty *(item.Length/1000))* item.UnitWeight).toFixed(2);
    // Qty**unit Weight
  }

  initialDataInsert() {
    debugger;
if(this.lastElement!==undefined)
{
    let copiedObject = this.lastElement.AccProductMarkingName;
    let lstchar = this.lastElement.AccProductMarkingName.slice(-1);

    copiedObject = copiedObject?.slice(0, -1);
    let tempChar: any;
    if (!this.isNumber(lstchar)) {
      tempChar = this.nextChar(lstchar.toUpperCase());
      tempChar = tempChar.toUpperCase();
    }
    else {
      tempChar = Number(lstchar) + 1;
    }
    copiedObject = copiedObject + tempChar;

    this.new_accessories_list.acc_marking = copiedObject;
    //this.lastElement.StructureMarkingName;
    this.new_accessories_list.qty = this.lastElement.OrderQty;
    this.new_accessories_list.length = this.lastElement.Length;
  }
  }

  isNumber(char: any) {
    return /^\d+$/.test(char);
  }
  nextChar(c: any) {
    return String.fromCharCode(((c.charCodeAt(0) + 1 - 65) % 25) + 65);
  }
  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
    this.enableEditIndex = null;
    if (this.prev_index != null) {
      // this.ColumnStructureMarklist[this.prev_index] = this.backup_item
      // this.isformsubmit = false
      this.prev_index = null
    }

  }
}
