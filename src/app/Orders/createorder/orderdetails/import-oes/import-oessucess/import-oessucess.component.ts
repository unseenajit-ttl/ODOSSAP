import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-import-oessucess',
  templateUrl: './import-oessucess.component.html',
  styleUrls: ['./import-oessucess.component.css'],
})
export class ImportOESSucessComponent {
  @Input() lWt: any;
  @Input() lTotal: any;
  @Input() lPONo: any;
  @Input() lBBSNo: any;
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}
  ngOnInit() {
    this.DisplayMesssage(this.lWt, this.lTotal, this.lPONo, this.lBBSNo);
  }

  DisplayMesssage(OrderWT: any, ExcelWT: any, pPONo: any, pBBSNo: any) {
    var lMsg = '';

    if (
      (OrderWT == ExcelWT || (OrderWT > 0 && ExcelWT == 0)) &&
      pPONo == '' &&
      pBBSNo == '' &&
      pBBSNo == ''
    ) {
      // alert("Order import is completed sucessfully with tallied weight " + OrderWT + "kg. (导入订单已成功完成，并且导入重量相同.)");
      lMsg =
        'Order import is completed sucessfully with tallied weight ' +
        OrderWT +
        'kg. (导入订单已成功完成，并且导入重量相同.)';
    } else {
      var lCT = 0;
      if (pPONo != '') {
        lCT = lCT + 1;
        lMsg =
          "<p style='color:red;font-size:16px;'>Warning!</p> <br>" +
          lCT +
          ". The PO Number in DigiOS is different from Excel. Please check whether you imported wrong Excel file. <p style='color:red'>" +
          pPONo +
          '</p>' +
          '(数码系统中的订单号码与Excel中的不一致, 请检查是否导入了错的Excel文件.)<br><br>';
      }

      if (pBBSNo != '') {
        lCT = lCT + 1;
        if (lMsg == '') {
          lMsg =
            "<p style='color:red;font-size:16px;'>Warning!</p> <br>" +
            lCT +
            ". The BBS Nos in DigiOS is different from Excel. Please check whether you imported wrong Excel file. <p style='color:red'>" +
            pBBSNo +
            '</p>' +
            '(数码系统中的加工表号码与Excel中的不一致, 请检查是否导入了错的Excel文件.)<br><br>';
        } else {
          lMsg =
            lMsg +
            lCT +
            ". The BBS Nos in DigiOS is different from Excel. Please check whether you imported wrong Excel file. <p style='color:red'>" +
            pBBSNo +
            '</p>' +
            '(数码系统中的加工表号码与Excel中的不一致, 请检查是否导入了错的Excel文件.)<br><br>';
        }
      }

      if ((OrderWT != ExcelWT && ExcelWT > 0) || OrderWT == 0) {
        if (lMsg == '') {
          lMsg =
            "<p style='color:red;font-size:16px;'>Warning!</p> <br> Order import is completed sucessfully, but weigh not tallied, Excel weight: " +
            ExcelWT +
            'kg, imported weight: ' +
            OrderWT +
            'kg. Please check whether there is any line missed out from the import.<br>(导入订单已成功完成, 导入的重量与Excel中的重量不一致, 请检查是否有几行漏掉导入.)';
        } else {
          lCT = lCT + 1;
          lMsg =
            lMsg +
            lCT +
            ". Weight is not tallied. Please check whether there is any line missed out from the import. <p style='color:red'>Excel weight: " +
            ExcelWT +
            "kg</p> <p style='color:red'>Imported weight: " +
            OrderWT +
            'kg</p> (导入的重量与Excel中的重量不一致, 请检查是否有几行漏掉导入.)';
        }
      }

      if (lMsg == '') {
        lMsg =
          'Order import is completed sucessfully, the imported weight is exactly same as the weight in Excel: ' +
          OrderWT +
          'kg.<br>(导入订单已成功完成, 导入的重量与Excel中的重量完全一致.)';
      }
    }

    const outputElement = document.getElementById('output');
    if (outputElement) {
      outputElement.innerHTML = lMsg;
    }
  }

  close() {
    // this.modalService.dismissAll();
    //this.activeModal.dismiss('Cross click');
    this.saveTrigger.emit(true);
  }
}
