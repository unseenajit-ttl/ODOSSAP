import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { HeaderColumn } from 'src/app/Model/reshuffle_column_table_structure';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/Orders/orders.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-batchgenerationfull',
  templateUrl: './batchgenerationfull.component.html',
  styleUrls: ['./batchgenerationfull.component.css']
})
export class BatchgenerationfullComponent implements OnInit {
  searchResult = true;
  searchText: any = '';
  editColumn: boolean = false;
  fixedColumn: number = 0;
  selectedVendor: any;
  activeorderForm!: FormGroup;
  selectedContractNo: any;
  selectedDeliveredBy: any;
  BatchGenColumns: any[] = [];
  FullOutsourceOrders: any[] = [];
  headerColumn: any[] = [];
  batchColumns: HeaderColumn[] = [];
  isLoading = false;
  submitted = false;
  fullOrderNo: any[] = [];
  currentSortingColumn: string = '';
  isAscending: boolean = false;
  searchForm!: FormGroup;
  selectedRowIndex: any;
  ReqDelDate: any;
  @ViewChild('scrollViewportENT', { static: false })
  public viewPortENT: CdkVirtualScrollViewport | undefined;
  supplierList: {
    SupplierCode: string;
    SupplierName: string;
    ProductType: string | null;
    ServiceType: string | null;
    Contracts: {
      ContractNo: string;
      ContractDesc: string;
    }[];
  }[] = [];
  today!: string;

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<BatchgenerationfullComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  close() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    debugger;
    const now = new Date();

    this.today = now.toISOString().split('T')[0];
    const getFullOrders = localStorage.getItem('fulloutsourceorders');

    if (getFullOrders && getFullOrders !== 'undefined' && getFullOrders !== 'null') {
      try {
        this.fullOrderNo = JSON.parse(getFullOrders);
      }
      catch (e) {
        console.error('Invalid JSON in localStorage:', getFullOrders, e);
      }
    }

    const productType = localStorage.getItem('SelectedProductType');
    //console.log("SelectedProductType",productType);
    this.getSuppliersList(productType);
    this.getContractsForSelectedSupplier();


    console.log(this.fullOrderNo);
    this.orderService.getFullOrdersDetails(this.fullOrderNo).subscribe({
      next: (response) => {
        debugger;
        console.log('API response:', response);
        this.FullOutsourceOrders = response;
        // Optionally navigate to another page
        // this.router.navigate(['/reports/OutsourceFull']);
      },
      error: (error) => {
        console.error('API error:', error);
      }
    });

    if (localStorage.getItem('OrdAssgnFixedColumns')) {
      this.fixedColumn = JSON.parse(
        localStorage.getItem('OrdAssgnFixedColumns')!
      );
    }

    if (localStorage.getItem('BatchGenColumns')) {
      this.BatchGenColumns = JSON.parse(localStorage.getItem('BatchGenColumns')!);

    } else {
      this.BatchGenColumns = [
        {
          controlName: 'order_request_no',
          displayName: 'Order Request No.',
          chineseDisplayName: '',
          field: 'order_request_no',
          colName: 'order_request_no',
          placeholder: 'Search order_request_no',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '130',
        },
        {
          controlName: 'order_no',
          displayName: 'Order No',
          chineseDisplayName: '',
          field: 'order_no',
          colName: 'order_no',
          placeholder: 'Search order_no',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '120',
        },
        {
          controlName: 'cust_code',
          displayName: 'Customer Code',
          chineseDisplayName: '',
          colName: 'cust_code',
          field: 'cust_code',
          placeholder: 'Search cust_code',
          isVisible: false,
          width: '5%',
          left: '0',
          resizeWidth: '200',
        },
        {
          controlName: 'Cust_Name',
          displayName: 'Customer Name',
          chineseDisplayName: '',
          colName: 'Cust_Name',
          field: 'Cust_Name',
          placeholder: 'Search Cust_Name',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '240',
        },
        {
          controlName: 'cust_order_date',
          displayName: 'Order Date',
          chineseDisplayName: '',
          colName: 'cust_order_date',
          field: 'cust_order_date',
          placeholder: 'Search cust_order_date',
          isVisible: true,
          width: '20%',
          left: '0',
          resizeWidth: '120',
        },
        {
          controlName: 'Proj_No',
          displayName: 'Project No',
          chineseDisplayName: '',
          colName: 'Proj_No',
          field: 'Proj_No',
          placeholder: 'Search Proj_No',
          isVisible: false,
          width: '10%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'Proj_Name',
          displayName: 'Project Name',
          chineseDisplayName: '',
          colName: 'Proj_Name',
          field: 'Proj_Name',
          placeholder: 'Search Proj_Name',
          isVisible: true,
          width: '10%',
          left: '0',
          resizeWidth: '250',
        },
        {
          controlName: 'Cust_Po_No',
          displayName: 'Customer PO No',
          chineseDisplayName: '',
          colName: 'Cust_Po_No',
          field: 'Cust_Po_No',
          placeholder: 'Search Cust_Po_No',
          isVisible: true,
          width: '10%',
          left: '0',
          resizeWidth: '180',
        },

      ];
    }
    this.changeDetectorRef.detectChanges();


  }

  HoverSetting: boolean = false;
  @HostListener('document:click', ['$event'])
  handleMouseClick(event: MouseEvent) {
    if (event.button === 0) {
      if (this.HoverSetting == false) {
        this.editColumn = false;
      }
    }
  }
  SaveColumnsSetting() {
    localStorage.setItem('BatchGenColumns', JSON.stringify(this.BatchGenColumns));
    console.log('SaveColumnsSetting', localStorage.getItem('BatchGenColumns'))
  }
  UpdateFixedColumns(pVal: any) {
    pVal = JSON.stringify(pVal);
    localStorage.setItem('OrdAssgnFixedColumns', pVal);
  }
  onRowKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'ArrowDown' && index < this.FullOutsourceOrders.length - 1) {
      this.selectedRowIndex = index + 1;
      this.scrollToRow(this.selectedRowIndex);
      event.preventDefault();
    } else if (event.key === 'ArrowUp' && index > 0) {
      this.selectedRowIndex = index - 1;
      this.scrollToRow(this.selectedRowIndex);
      event.preventDefault();
    } else if (event.key === 'Enter' && event.shiftKey && this.FullOutsourceOrders[index]) {
      debugger
      if (this.FullOutsourceOrders[index].AssignmentStatus === 'ASSIGNED') {
        alert("Order Request No '" + this.FullOutsourceOrders[index].OrderRequestNo + "' has already been assigned")
      }
      else {
        this.FullOutsourceOrders[index].isSelected = !this.FullOutsourceOrders[index].isSelected;
        event.preventDefault();
      }
    }
  }
  scrollToRow(index: number) {
    const rows = document.querySelectorAll('.draft-table');
    const row = rows[index] as HTMLElement;
    row?.focus();
  }

  onSubmit() {
    // //console.log("submit clicked");
    this.submitted = true;

    // stop here if form is invalid
    if (this.activeorderForm.invalid) {
      return;
    }

    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.wbsForm.value, null, 4));
  }
  splitArray(num: number, array: any[]): HeaderColumn[] {
    const midpoint = Math.ceil(array.length / 2);
    if (num == 1) {
      return array.slice(0, midpoint);
    } else {
      return array.slice(midpoint);
    }
  }

  CheckHiddenColumn(index: any, dataList: any) {
    let lInVisibleColumns = 0;
    for (let i = 0; i <= index; i++) {
      if (dataList[i].isVisible != true) {
        lInVisibleColumns = lInVisibleColumns + 1;
      }
    }

    return index + lInVisibleColumns;
  }

  syncScroll(event: any) {
    //this.tableContainer.nativeElement.scrollLeft = event.target.scrollLeft;
  }

  public get inverseOfENT(): string {
    if (!this.viewPortENT || !this.viewPortENT['_renderedContentOffset']) {
      return '-0px';
    }
    let offset = this.viewPortENT['_renderedContentOffset'];
    return `-${offset}px`;
  }
  public get inverseOfENTSearch(): string {
    if (!this.viewPortENT || !this.viewPortENT['_renderedContentOffset']) {
      return '-0px';
    }
    let offset = this.viewPortENT['_renderedContentOffset'] - 30;
    return `-${offset}px`;
  }
  dropCol(event: any) {
    debugger
    if (this.fixedColumn != 0) {
      if (
        event.previousIndex < this.fixedColumn &&
        event.currentIndex > this.fixedColumn
      ) {
        this.toastr.warning("Fixed columns can't be moved to normal columns!");
        // moveItemInArray(this.draftColumns, event.previousIndex, event.previousIndex);
      } else if (
        event.previousIndex > this.fixedColumn &&
        event.currentIndex < this.fixedColumn
      ) {
        // moveItemInArray(this.draftColumns, event.previousIndex, event.previousIndex);
        this.toastr.warning("Columns can't be moved to fixed columns!");
      } else {
        let lcurrentIndex = this.CheckHiddenColumn(
          event.currentIndex,
          this.BatchGenColumns
        );
        let lpreviousIndex = this.CheckHiddenColumn(
          event.previousIndex,
          this.BatchGenColumns
        );
        moveItemInArray(this.BatchGenColumns, lpreviousIndex, lcurrentIndex);
      }
    } else {
      let lcurrentIndex = this.CheckHiddenColumn(
        event.currentIndex,
        this.BatchGenColumns
      );
      let lpreviousIndex = this.CheckHiddenColumn(
        event.previousIndex,
        this.BatchGenColumns
      );
      moveItemInArray(this.BatchGenColumns, lpreviousIndex, lcurrentIndex);
    }
    localStorage.setItem('BatchGenColumns', JSON.stringify(this.BatchGenColumns));
  }

  setLeftOfTabble(index: number, width: any) {
    this.BatchGenColumns[index].left = width;
  }

  onWidthChange(obj: any) {
    this.BatchGenColumns[obj.index].resizeWidth = obj.width;
    console.log('onWidthChange', this.BatchGenColumns[obj.index]);
    this.SaveColumnsSetting();
  }
  getAllPreviousSiblings(element: HTMLElement) {
    let currentSibling = element.previousElementSibling;
    let totalWidth = 0;

    while (currentSibling) {
      const width = window.getComputedStyle(currentSibling).width;
      totalWidth += parseFloat(width);
      currentSibling = currentSibling.previousElementSibling;
    }

    return totalWidth;
  }
  getRightWidthTest(element: HTMLElement, j: number) {
    let width = this.getAllPreviousSiblings(element);
    console.log('previousSibling=>', width);

    this.setLeftOfTabble(j, width);
    // this.changeDetectorRef.detectChanges();
    return width + 'px';
  }
  toggleSortingOrder(columnname: string, actualColName: any) {

    debugger
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    // this.sortItems(columnname);
    if (this.isAscending) {
      if (columnname == 'OrderNo' || columnname == 'CustCode' || columnname == 'ProjNo' || columnname == 'NoofPieces'
        || columnname == 'SLBendings' || columnname == 'SLPieces' || columnname == 'SCBMRun' || columnname == 'SCBPieces'
        || columnname == 'SBCPieces' || columnname == 'CouplrBrPeices' || columnname == 'CouplrEnds' || columnname == 'Score'
      ) {
        this.FullOutsourceOrders.sort(
          (a, b) => Number(a[actualColName]) - Number(b[actualColName])
        );
      } else {
        this.FullOutsourceOrders.sort((a, b) =>
          a[actualColName].localeCompare(b[actualColName])
        );
      }
    } else {
      if (columnname == 'OrderNo' || columnname == 'CustCode' || columnname == 'ProjNo' || columnname == 'NoofPieces'
        || columnname == 'SLBendings' || columnname == 'SLPieces' || columnname == 'SCBMRun' || columnname == 'SCBPieces'
        || columnname == 'SBCPieces' || columnname == 'CouplrBrPeices' || columnname == 'CouplrEnds' || columnname == 'Score') {
        this.FullOutsourceOrders.sort(
          (a, b) => Number(b[actualColName]) - Number(a[actualColName])
        );
      } else {
        this.FullOutsourceOrders.sort((a, b) =>
          b[actualColName].localeCompare(a[actualColName])
        );
      }
    }
  }

  generateBatchFullOutSource() {
    if (
      this.selectedDeliveredBy === "" || this.selectedDeliveredBy === undefined || this.selectedDeliveredBy === null ||
      this.selectedVendor === "" || this.selectedVendor === undefined || this.selectedVendor === null
      || this.ReqDelDate === "" || this.ReqDelDate === undefined || this.ReqDelDate === null

    ) {
      this.toastr.warning("select all required fields!")
    }
    else {
      debugger;
      this.isLoading = true;
      const supplier = this.supplierList.find(s => s.SupplierCode === this.selectedVendor);

      if (!supplier) {
        alert("Selected supplier not found in the list!");
        return;
      }

      const soNums = this.FullOutsourceOrders.map(o => o.order_no);
      this.orderService.generateBatchFullOutSource(
        soNums,
        "Full Outsourcing",
        this.selectedDeliveredBy,
        // "",
        // "",
        supplier.SupplierCode,
        supplier.SupplierName,
        this.selectedContractNo ?? null,
        this.ReqDelDate
      ).subscribe({
        next: (response) => {
          console.log('Data saved successfully:', response);
          alert("Batch generation and assigning completed for all Full Outsourced orders.")
        },
        error: (error) => {
          console.error('Error saving data:', error);
        },
        complete: () => {
          this.isLoading = false;
          this.dialogRef.close({
            success: true
          });
        }
      });
    }
  }

  getSuppliersList(prdType: any) {
    this.orderService.getSupplierData(prdType).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const grouped = res.data.reduce((acc, curr) => {
            const existing = acc.find(x => x.SupplierCode === curr.SupplierCode);
            if (existing) {
              existing.Contracts.push(...curr.Contracts);
            } else {
              acc.push({
                SupplierCode: curr.SupplierCode,
                SupplierName: curr.SupplierName,
                ProductType: curr.ProductType,
                ServiceType: curr.ServiceType,
                Contracts: [...curr.Contracts]
              });
            }
            return acc;
          }, [] as typeof this.supplierList);

          this.supplierList = grouped;
        }
      },
      error: (err) => console.error(err)
    });
  }
  getContractsForSelectedSupplier() {
    debugger
    console.log(this.selectedVendor);
    if (!this.selectedVendor) return [];
    const supplier = this.supplierList.find(s => s.SupplierCode === this.selectedVendor);
    return supplier ? supplier.Contracts : [];
  }



}
