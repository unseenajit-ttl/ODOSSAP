import { ChangeDetectorRef, Component, HostListener, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/Orders/orders.service';
import { HeaderColumn } from 'src/app/Model/reshuffle_column_table_structure';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ToastrService } from 'ngx-toastr';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { e } from 'mathjs';
import { interval, switchMap, takeWhile, finalize } from 'rxjs';


@Component({
  selector: 'app-batchprinting',
  templateUrl: './batchprinting.component.html',
  styleUrls: ['./batchprinting.component.css']
})
export class BatchprintingComponent {

  selectedsupplier: any;
  selectedDeliveredIn: any;
  selectedSONo: any;
  selectedproductype: any;
  selectedPrinter: any;
  selectedTemplate: any;



  searchResult = true;
  searchText: any = '';
  editColumn: boolean = false;
  loading = true;
  isPrintLoading = true;
  searchForm: FormGroup;
  @ViewChild('scrollViewportENT', { static: false })
  public viewPortENT: CdkVirtualScrollViewport | undefined;


  fixedColumn: number = 0;

  BatchPrintColumns: any[] = [];

  Suppliertlist: any = [];
  SoNolist: any = [];
  Sobatchdetails: any[] = [];
  producttypelist: any[] = [];
  PrinterNameList: any[] = [];
  Templatelist: any[] = [];
  currentSortingColumn: string = '';
  isAscending: boolean = false;
  selectedRowIndex: any;


  constructor(private orderService: OrderService, private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder, private toastr: ToastrService,
  ) {
    this.searchForm = this.formBuilder.group({
      OrderNo: ['']
    });
  }

  ngOnInit(): void {

    if (localStorage.getItem('BatchprintFixedColumns')) {
      this.fixedColumn = JSON.parse(
        localStorage.getItem('BatchPrintFixedColumns')!
      );
    }

    if (localStorage.getItem('BatchPrintColumns')) {
      this.BatchPrintColumns = JSON.parse(localStorage.getItem('BatchPrintColumns')!);

    } else {
      this.BatchPrintColumns = [
        {
          controlName: 'order_no',
          displayName: 'Order No.',
          chineseDisplayName: '',
          field: 'order_no',
          colName: 'order_no',
          placeholder: 'Search OrderNumber',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '120',
        },
        {
          controlName: 'vendorname',
          displayName: 'Vendor Name',
          chineseDisplayName: '',
          colName: 'vendorname',
          field: 'vendorname',
          placeholder: 'Search vendorname',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '240',
        },
        {
          controlName: 'BatchNumber',
          displayName: 'Batch Number',
          chineseDisplayName: '',
          colName: 'BatchNumber',
          field: 'BatchNumber',
          placeholder: 'Search BatchNumber',
          isVisible: false,
          width: '10%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'item_no',
          displayName: 'Item No',
          chineseDisplayName: '',
          colName: 'item_no',
          field: 'item_no',
          placeholder: 'Search item_no',
          isVisible: true,
          width: '10%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'shape_code',
          displayName: 'Shape Code',
          chineseDisplayName: '',
          colName: 'shape_code',
          field: 'shape_code',
          placeholder: 'Search shape_code',
          isVisible: true,
          width: '20%',
          left: '0',
          resizeWidth: '90',
        },
        {
          controlName: 'order_qty',
          displayName: 'Order Qty ',
          chineseDisplayName: '',
          colName: 'order_qty',
          field: 'order_qty',
          placeholder: 'Search order_qty',
          isVisible: true,
          width: '10%',
          left: '0',
          resizeWidth: '80',
        },
        {
          controlName: 'sales_uom',
          displayName: 'Sales UOM',
          chineseDisplayName: '',
          colName: 'sales_uom',
          field: 'sales_uom',
          placeholder: 'Search sales_uom',
          isVisible: true,
          width: '20%',
          left: '0',
          resizeWidth: '90',
        },
        {
          controlName: 'order_pieces',
          displayName: 'Order Pieces',
          chineseDisplayName: '',
          colName: 'order_pieces',
          field: 'order_pieces',
          placeholder: 'Search order_pieces',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'material_no',
          displayName: 'Material No',
          chineseDisplayName: '',
          colName: 'material_no',
          field: 'material_no',
          placeholder: 'Search material_no',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '120',
        },
        {
          controlName: 'contract_no',
          displayName: 'Contract No',
          chineseDisplayName: '',
          colName: 'contract_no',
          field: 'contract_no',
          placeholder: 'Search contract_no',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '110',
        },
        {
          controlName: 'cab_cut_length',
          displayName: 'Cab_cut_length',
          chineseDisplayName: '',
          colName: 'cab_cut_length',
          field: 'cab_cut_length',
          placeholder: 'Search cab_cut_length',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '120',
        },
      ];
    }

    this.changeDetectorRef.detectChanges();
    this.GetSupplier();
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

  UpdateFixedColumns(pVal: any) {
    pVal = JSON.stringify(pVal);
    localStorage.setItem('BatchPrintFixedColumns', pVal);
  }

  splitArray(num: number, array: any[]): HeaderColumn[] {
    const midpoint = Math.ceil(array.length / 2);
    if (num == 1) {
      return array.slice(0, midpoint);
    } else {
      return array.slice(midpoint);
    }

    // array.slice(midpoint)];
  }

  SaveColumnsSetting() {
    localStorage.setItem('BatchPrintColumns', JSON.stringify(this.BatchPrintColumns));

    console.log('SaveColumnsSetting', localStorage.getItem('BatchPrintColumns'))
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
    //let colnameo=this.OrdAssgnColumns[event.previousIndex].columnname

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
          this.BatchPrintColumns
        );
        let lpreviousIndex = this.CheckHiddenColumn(
          event.previousIndex,
          this.BatchPrintColumns
        );
        moveItemInArray(this.BatchPrintColumns, lpreviousIndex, lcurrentIndex);
      }
    } else {
      let lcurrentIndex = this.CheckHiddenColumn(
        event.currentIndex,
        this.BatchPrintColumns
      );
      let lpreviousIndex = this.CheckHiddenColumn(
        event.previousIndex,
        this.BatchPrintColumns
      );
      moveItemInArray(this.BatchPrintColumns, lpreviousIndex, lcurrentIndex);
    }
    localStorage.setItem('BatchPrintColumns', JSON.stringify(this.BatchPrintColumns));
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

  toggleSortingOrder(columnname: string, actualColName: any) {
    //  this.currentSortingColumn = columnname;
    // this.isAscending = !this.isAscending;
    debugger
    // this.sortItems(columnname);
    // if (this.isAscending) {
    //   if (columnname == 'OrderNo' || columnname == 'OrderWeight') {
    //     this.OrderAssignmentArray.sort(
    //       (a, b) => Number(a[actualColName]) - Number(b[actualColName])
    //     );
    //   } else {
    //     this.OrderAssignmentArray.sort((a, b) =>
    //       a[actualColName].localeCompare(b[actualColName])
    //     );
    //   }
    // } else {
    //   if (columnname == 'OrderNo' || columnname == 'OrderWeight') {
    //     this.OrderAssignmentArray.sort(
    //       (a, b) => Number(b[actualColName]) - Number(a[actualColName])
    //     );
    //   } else {
    //     this.OrderAssignmentArray.sort((a, b) =>
    //       b[actualColName].localeCompare(a[actualColName])
    //     );
    //   }
    // }
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    // this.sortItems(columnname);
    if (this.isAscending) {
      if (columnname == 'order_no' || columnname == 'item_no' || columnname == 'order_qty' || columnname == 'order_pieces'
        || columnname == 'contract_no' || columnname == 'cab_cut_length'
      ) {
        this.Sobatchdetails.sort(
          (a, b) => Number(a[actualColName]) - Number(b[actualColName])
        );
      } else {
        this.Sobatchdetails.sort((a, b) =>
          a[actualColName].localeCompare(b[actualColName])
        );
      }
    } else {
      if (columnname == 'order_no' || columnname == 'item_no' || columnname == 'order_qty' || columnname == 'order_pieces'
        || columnname == 'contract_no' || columnname == 'cab_cut_length') {
        this.Sobatchdetails.sort(
          (a, b) => Number(b[actualColName]) - Number(a[actualColName])
        );
      } else {
        this.Sobatchdetails.sort((a, b) =>
          b[actualColName].localeCompare(a[actualColName])
        );
      }
    }
  }

  getRightWidthTest(element: HTMLElement, j: number) {
    let width = this.getAllPreviousSiblings(element);
    console.log('previousSibling=>', width);

    this.setLeftOfTabble(j, width);
    // this.changeDetectorRef.detectChanges();
    return width + 'px';
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

  setLeftOfTabble(index: number, width: any) {
    this.BatchPrintColumns[index].left = width;
  }

  onRowKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'ArrowDown' && index < this.Sobatchdetails.length - 1) {
      this.selectedRowIndex = index + 1;
      this.scrollToRow(this.selectedRowIndex);
      event.preventDefault();
    } else if (event.key === 'ArrowUp' && index > 0) {
      this.selectedRowIndex = index - 1;
      this.scrollToRow(this.selectedRowIndex);
      event.preventDefault();
    }
  }

  scrollToRow(index: number) {
    const rows = document.querySelectorAll('.draft-table');
    const row = rows[index] as HTMLElement;
    row?.focus();
  }



  GetSupplier(): void {

    this.orderService
      .GetSupplier_BatchPrinting()
      .subscribe({
        next: (response) => {
          this.Suppliertlist = response;
          console.log('Suppliertlist=>', this.Suppliertlist);
        },
        error: (e) => { },
        complete: () => {
          // this.loading = false;
        },
      });
  }

  GetSoNo(): void {

    console.log('this.selectedsupplier', this.selectedsupplier)
    if (this.selectedsupplier === '' || this.selectedsupplier === undefined) {
      alert("Please select Supplier")
      return;
    }

    if (this.selectedDeliveredIn === '' || this.selectedDeliveredIn === undefined) {
      alert("Please select DeliveryIn")
      return;
    }

    this.orderService
      .GetSONO_BatchPrinting(this.selectedDeliveredIn, this.selectedsupplier)
      .subscribe({
        next: (response) => {
          this.SoNolist = response;
          console.log('SoNolist=>', this.SoNolist);
        },
        error: (e) => { },
        complete: () => {
          // this.loading = false;
        },
      });
  }

  ExportToExcel() {
  }

  getSOBatchdetails() {

    this.orderService.GetBatch_BatchPrinting(this.selectedSONo).subscribe({
      next: (data: any[]) => {
        // this.schnellOrders = data.map(item => ({
        //   ...item,
        //   Extralength: 0,
        //   isSelected: false,
        //   isEditing: false,
        //   isWithdrawal: false
        // }));
        this.Sobatchdetails = data
        this.producttypelist = Array.from(
          new Map(
            this.Sobatchdetails.map(item => {
              const productType = item.product_type === 'MSD' ? 'MESH' : item.product_type;
        
              return [productType, { ...item, product_type: productType }];
            })
          ).values()
        );
        console.log('this.producttypelist', this.producttypelist)
        this.loading = true;
        this.changeDetectorRef.detectChanges();
        console.log(this.Sobatchdetails)
      },
      error: (err: any) => {
        console.error('Failed to fetch Schnell orders', err);
        this.loading = true;
      }
    });
    this.selectedPrinter=''
    this.selectedproductype=''
    this.selectedTemplate=''
    this.GetPrinterName()
  }

  GetTemplateName() {
    //this.selectedPrinter='';
    this.selectedTemplate='';
    this.orderService.GetTemplate_BatchPrinting(this.selectedproductype).subscribe(res => {
      this.Templatelist = res.map((x: any) => ({
        ...x,
        DisplayName: x.Name.split('/').pop() || ''
      }));
      console.log('XML as JSON:', this.Templatelist);
      if (this.Templatelist.length > 0) {
        this.selectedTemplate = this.Templatelist[0].Name;
      }
    });
    //this.selectedTemplate=this.Templatelist[0];
  }

  GetPrinterName() {
    this.selectedTemplate=''
    this.selectedPrinter=''
    this.orderService.GetPrinter_BatchPrinting().subscribe(res => {
      this.PrinterNameList = res
      console.log('XML as JSON:', this.PrinterNameList);
    });
  }

  Print() {
    if(this.selectedproductype && this.selectedTemplate && this.selectedPrinter)
    {
    const payload = {
      so_no: this.selectedSONo,
      Printername: this.selectedPrinter === "Microsoft Print to PDF" ? "PDF" : this.selectedPrinter,
      templateName: this.selectedTemplate,
      producttype: this.selectedproductype
    };
    // this.orderService.Print_BatchPrinting(payload).subscribe({
    //   next: (res: any) => {
    //     const jobId = res.jobId;
    //     console.log("Print Response:", res);
    //     this.isPrintLoading = false;
    //     setTimeout(() => {
    //     this.orderService.Print_GetOutSourcingStatus(jobId).pipe(
    //       finalize(() => {
    //         this.isPrintLoading = true;  // hide loader ALWAYS after print
    //       })
    //     )
    //     .subscribe(
    //       res => {
    //         this.isPrintLoading = false;
    //         console.log("Status Response:", res);
    //         if (res.status == 'Success') {
    //         console.log("Status Response1:", res);

    //           if (this.selectedPrinter === "Microsoft Print to PDF") {
    //             this.orderService.Print_DownloadPDF(this.selectedproductype).subscribe((res: Blob) => {
    //               const blob = new Blob([res], { type: 'application/pdf' });
    //               const url = window.URL.createObjectURL(blob);
                
    //               const a = document.createElement('a');
    //               a.href = url;
    //               a.download = 'Tag_'+this.selectedSONo+'.pdf';
    //               a.click();
    //                 //this.statusResult = res;   // store status
    //               },
    //               err => {
    //                 console.error("Error fetching status", err);
    //               }
    //             );
    //           }
    //           else{
    //             alert("Tag printed successfully")
    //           }
    //         }
    //         else{
    //           alert("Print Failed!!")
    //         }

    //         //this.statusResult = res;   // store status
    //       },
    //       err => {
    //         this.isPrintLoading = false;
    //         console.error("Error fetching status", err);
    //       }
    //     );}, 30000); 
    //   },
    //   error: (err) => {
    //     console.error("Error:", err);
    //   }
    // });

    this.orderService.Print_BatchPrinting(payload).subscribe({
      next: (res: any) => {
        const jobId = res.jobId;
        console.log("Print Response:", res);
    
        this.isPrintLoading = false;  // show loader immediately
    
        interval(3000)   // call status API every 3 seconds
          .pipe(
            switchMap(() => this.orderService.Print_GetOutSourcingStatus(jobId)),
            takeWhile((resp: any) => resp.status !== 'Success' && resp.status !== 'Failed', true),
            finalize(() => {
              this.isPrintLoading = true;  // always hide loader at end
            })
          )
          .subscribe({
            next: (resp: any) => {
              console.log("Status Response:", resp);
    
              if (resp.status === 'Success') {
    
                // If printing to PDF → download the PDF file
                if (this.selectedPrinter === "Microsoft Print to PDF") {
                  this.orderService.Print_DownloadPDF(this.selectedproductype)
                    .subscribe(
                      (pdfBlob: Blob) => {
                        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
                        const url = window.URL.createObjectURL(blob);
    
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Tag_${this.selectedSONo}.pdf`;
                        a.click();
                      },
                      (err) => console.error("PDF download error", err)
                    );
    
                } else {
                  alert("Tag printed successfully");
                }
              }
    
              if (resp.status === 'Failed') {
                alert("Print Failed!!");
              }
            },
    
            error: (err) => {
              this.isPrintLoading = false;
              console.error("Status check error:", err);
            }
          });
      },
    
      error: (err) => {
        console.error("Error:", err);
      }
    });
  }
  else{
    alert("Please select all fields to print")
  }
  }

  onSupplierChange(event: any) {
    this.selectedDeliveredIn=null;
    this.selectedSONo=''
  }

  onDeliveryInChange(event: any) {
    this.selectedSONo=''
    this.GetSoNo();
  }

}


