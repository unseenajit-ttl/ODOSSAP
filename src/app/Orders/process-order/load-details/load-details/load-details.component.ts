import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { i } from 'mathjs';
import { OrderService } from 'src/app/Orders/orders.service';

@Component({
  selector: 'app-load-details',
  templateUrl: './load-details.component.html',
  styleUrls: ['./load-details.component.css']
})
export class LoadDetailsComponent implements OnInit {
  isDragging = false;
  initialX = 0;
  initialY = 0;
  right = 0;
  top = 0;
  @Input() customerCode: any;
  @Input() projectCode: any;
  @Input() loadNumber: any;

  loadDeatailsList: any[] = [];

  lOrderTon: any;
  lOrderPcs: any;
  lSubTon: any;
  lSubPcs: any;
  lCurrLoadNo: any;
  lCurrLoadDate: any;
  lCurrDeldate: any;
  lCurrOrderNo: any;
  lPreLoadNo: any;
  lPreOrderNo: any;
  lOrderSubCT: any;
  lOrderCT: any;

  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.DisplayMessage([]);
    this.GetLoadDetails();
  }

  GetLoadDetails() {
    this.orderService.getLoadDetailList(this.customerCode, this.projectCode, this.loadNumber).subscribe({
      next: (response) => {
        console.log(response);
        if (response) {
          this.DisplayMessage(response);
        }
      },
      error: (e) => {
        alert("Connect to server fails. Please check the Internet connection and try again.");
      },
      complete: () => { },
    });
  }

  DisplayMessage(response: any) {
    var lStyle = "<div>";
    lStyle = lStyle + '<table id="tPinLimit" class="table table-condensed table-hover" style="border:1;margin-bottom:0">';
    lStyle = lStyle + '<thead style="border:1;">'
    //lStyle = lStyle + '<tr><th colspan="5"><legend style="font-size:16px">List of DO Materials (交货单材料列表)</legend></th></tr>';
    lStyle = lStyle + '<tr style="border:1;">';
    lStyle = lStyle + '<th style="border-left: solid 1px">Sales Order<br/>(订单号)</th>';
    lStyle = lStyle + '<th style="border:1;">Sales Item<br/>(项目号)</th>';
    lStyle = lStyle + '<th style="border:1;">Product<br/>(产品名称)</th>';
    lStyle = lStyle + '<th style="text-align:right;border:1;">Quantity<br/>(份量)</th>';
    lStyle = lStyle + '<th style="border:1;">UOM<br/>(计量单位)</th>';
    lStyle = lStyle + '<th style="text-align:right;border:1;">Pieces<br/>(数量)</th>';
    lStyle = lStyle + '<th style="border:1;">WBS1<br/>(分解结构1)</th>';
    lStyle = lStyle + '<th style="border:1;">WBS2<br/>(分解结构2)</th>';
    lStyle = lStyle + '<th style="border:1;">WBS3<br/>(分解结构3)</th>';
    lStyle = lStyle + '<th style="border:1;">BBS No<br/>(加工号码)</th>';
    lStyle = lStyle + '<th style="border:1;">Shape Code<br/>(图形代码)</th>';
    lStyle = lStyle + '</tr>';
    lStyle = lStyle + '</thead>';
    lStyle = lStyle + '<tbody style="border:1;">';
    {
      if (response.length > 0) {
        var lPreLoadNo = "";
        var lCurrLoadNo = "";
        var lCurrLoadDate = "";
        var lCurrDeldate = "";
        var lCurrOrderNo = "";
        var lPreOrderNo = "";
        var lOrderTon = 0;
        var lOrderPcs = 0;
        var lOrderCT = 0;
        var lOrderSubCT = 0;
        var lSubTon = 0;
        var lSubPcs = 0;
        var lSubCT = 0;
        var lTotalTon = 0;
        var lTotalPcs = 0;
        var lTotalCT = 0;
        for (let i = 0; i < response.length; i++) {
          lCurrLoadNo = response[i].LoadNumber;
          lCurrOrderNo = response[i].SONumber;
          lCurrLoadDate = response[i].LoadDate;
          lCurrDeldate = response[i].DeliveredTime;
          if (response[i].Product != null && response[i].Product.substring(0, 3) == "FMS" && response[i].PCs == response[i].Weight) {
            response[i].Weight = 0;
          }
          if (lCurrLoadDate != null && lCurrLoadDate.length >= 8) {
            lCurrLoadDate = lCurrLoadDate.substring(0, 4) + "-" + lCurrLoadDate.substring(4, 6) + "-" + lCurrLoadDate.substring(6, 8);
          }
          if (lCurrDeldate != null && lCurrDeldate.length >= 14) {
            lCurrDeldate = lCurrDeldate.substring(0, 4) + "-" + lCurrDeldate.substring(4, 6) + "-" +
              lCurrDeldate.substring(6, 11) + ":" + lCurrDeldate.substring(11, 13) + ":" + lCurrDeldate.substring(13, 15);
          }
          if ((lCurrOrderNo != lPreOrderNo && lCurrLoadNo == lPreLoadNo) || (lCurrLoadNo != lPreLoadNo && lOrderSubCT > 0)) {
            if (lCurrOrderNo != "" && (lOrderTon > 0 || lOrderPcs > 0)) {
              if (lOrderCT > 1) {
                lStyle = lStyle + '<tr style="border:1;">';
                lStyle = lStyle + '<td colspan="3" style="border:none;">Order Sub Total</td>';
                lStyle = lStyle + '<td align="right" style="border:none;">' + (lOrderTon == 0 ? "" : lOrderTon.toFixed(3)) + '</td>';
                lStyle = lStyle + '<td style="border:none;"></td>';
                lStyle = lStyle + '<td align="right" style="border:none;">' + lOrderPcs + '</td>';
                lStyle = lStyle + '<td colspan="5" style="border:none;"></td>';
                lStyle = lStyle + '</tr>';
              }

              lOrderTon = 0;
              lOrderPcs = 0;
              lOrderCT = 0;
              lOrderSubCT = lOrderSubCT + 1;
            }
            lPreOrderNo = lCurrOrderNo;
          }

          if (lCurrLoadNo != lPreLoadNo) {
            if (lCurrLoadNo != "" && (lSubTon > 0 || lSubPcs > 0)) {
              if (lSubCT > 1) {
                lStyle = lStyle + '<tr style="border:1;">';
                lStyle = lStyle + '<td colspan="3" style="border:none;">Load Sub Total</td>';
                lStyle = lStyle + '<td align="right" style="border:none;">' + (lSubTon == 0 ? "" : lSubTon.toFixed(3)) + '</td>';
                lStyle = lStyle + '<td style="border:none;"></td>';
                lStyle = lStyle + '<td align="right" style="border:none;">' + lSubPcs + '</td>';
                lStyle = lStyle + '<td colspan="5" style="border:none;"></td>';
                lStyle = lStyle + '</tr>';
              }

              lSubTon = 0;
              lSubPcs = 0;
              lSubCT = 0;

              lOrderTon = 0;
              lOrderPcs = 0;
              lOrderCT = 0;
              lOrderSubCT = 0;
            }
            lStyle = lStyle + '<tr style="border-left: solid 1px" >';
            lStyle = lStyle + '<td colspan="3" style="font-weight:normal;border-right:none;border-top: solid 1px;border-bottom: solid 1px;">Load No: <b>' + lCurrLoadNo + '</b></td>';
            lStyle = lStyle + '<td colspan="4" style="font-weight:normal;border-right:none;border-top: solid 1px;border-bottom: solid 1px;">Load Date: <b>' + lCurrLoadDate + '</b></td>';
            lStyle = lStyle + '<td colspan="4" style="font-weight:normal;border-right:none;border-top: solid 1px;border-bottom: solid 1px;">Delivered Date: <b>' + lCurrDeldate + '</b></td>';
            lStyle = lStyle + '</tr>';

            lPreLoadNo = lCurrLoadNo;
            lPreOrderNo = lCurrOrderNo;
          }

          lStyle = lStyle + '<tr style="border:1;">';
          lStyle = lStyle + '<td style="font-weight:normal;border:1;">' + response[i].SONumber + '</td>';
          lStyle = lStyle + '<td style="font-weight:normal;border:1;">' + response[i].SOItem + '</td>';
          lStyle = lStyle + '<td style="font-weight:normal;border:1;">' + response[i].Product + '</td>';
          lStyle = lStyle + '<td align="right" style="font-weight:normal;border:1;">' + (response[i].Weight == 0 ? "" : response[i].Weight.toFixed(3)) + '</td>';
          lStyle = lStyle + '<td style="font-weight:normal;border:1;">' + response[i].UOM + '</td>';
          lStyle = lStyle + '<td align="right" style="font-weight:normal;border:1;">' + response[i].PCs + '</td>';
          lStyle = lStyle + '<td style="font-weight:normal;border:1;">' + response[i].WBS1 + '</td>';
          lStyle = lStyle + '<td style="font-weight:normal;border:1;">' + response[i].WBS2 + '</td>';
          lStyle = lStyle + '<td style="font-weight:normal;border:1;">' + response[i].WBS3 + '</td>';
          lStyle = lStyle + '<td style="font-weight:normal;border:1;">' + response[i].BBSNo + '</td>';
          lStyle = lStyle + '<td style="font-weight:normal;border:1;">' + response[i].ShapeCode + '</td>';
          lStyle = lStyle + '</tr>';

          lOrderTon = lOrderTon + response[i].Weight;
          lOrderPcs = lOrderPcs + response[i].PCs;
          lSubTon = lSubTon + response[i].Weight;
          lSubPcs = lSubPcs + response[i].PCs;
          lTotalTon = lTotalTon + response[i].Weight;
          lTotalPcs = lTotalPcs + response[i].PCs;
          lTotalCT = lTotalCT + 1;
          lSubCT = lSubCT + 1;
          lOrderCT = lOrderCT + 1;
        }

        if ((lSubTon != lOrderTon || lSubPcs != lOrderPcs) && lOrderCT > 1) {
          lStyle = lStyle + '<tr style="border:1;">';
          lStyle = lStyle + '<td colspan="3" style="border:none;">Order Sub Total </td>';
          lStyle = lStyle + '<td align="right" style="border:none;">' + (lOrderTon == 0 ? "" : lOrderTon.toFixed(3)) + '</td>';
          lStyle = lStyle + '<td style="border:none;"></td>';
          lStyle = lStyle + '<td align="right" style="border:none;">' + lOrderPcs + '</td>';
          lStyle = lStyle + '<td colspan="5" style="border:none;"></td>';
          lStyle = lStyle + '</tr>';
          lStyle = lStyle + '<tr>';
        }
        if ((lSubTon != lTotalTon || lSubPcs != lTotalPcs) && lSubCT > 1) {
          lStyle = lStyle + '<tr style="border:1px solid;">';
          lStyle = lStyle + '<td colspan="3" style="border:none;">Load Sub Total</td>';
          lStyle = lStyle + '<td align="right" style="border:none;">' + (lSubTon == 0 ? "" : lSubTon.toFixed(3)) + '</td>';
          lStyle = lStyle + '<td style="border:none;"></td>';
          lStyle = lStyle + '<td align="right" style="border:none;">' + lSubPcs + '</td>';
          lStyle = lStyle + '<td colspan="5" style="border:none;"></td>';
          lStyle = lStyle + '</tr>';
          lStyle = lStyle + '<tr>';
        }
        if (lTotalCT > 1) {
          lStyle = lStyle + '<tr style="border:1;">';
          lStyle = lStyle + '<td colspan="3" style="border:none;">Total</td>';
          lStyle = lStyle + '<td align="right" style="border:none;">' + (lTotalTon == 0 ? "" : lTotalTon.toFixed(3)) + '</td>';
          lStyle = lStyle + '<td style="border:none;"></td>';
          lStyle = lStyle + '<td align="right" style="border:none;">' + lTotalPcs + '</td>';
          lStyle = lStyle + '<td colspan="5" style="border:none;"></td>';
          lStyle = lStyle + '</tr>';
        }
      }


      lStyle = lStyle + '</tbody>';
      lStyle = lStyle + '</table>';
    }

    const outputElement = document.getElementById('output');
    if (outputElement) {
      outputElement.innerHTML = lStyle;
    }
  }
}
