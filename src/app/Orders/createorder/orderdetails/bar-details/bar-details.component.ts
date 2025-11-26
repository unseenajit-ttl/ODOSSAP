import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BarDetails } from 'src/app/Model/bardetails';
import { OrderService } from 'src/app/Orders/orders.service';
import { LoginService } from 'src/app/services/login.service';
import * as math from 'mathjs';

@Component({
  selector: 'app-bar-details',
  templateUrl: './bar-details.component.html',
  styleUrls: ['./bar-details.component.css'],
})
export class BarDetailsComponent implements OnInit {
  varianceData: any;
  VarianceListData: any[] = [];
  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService,
    private loginService: LoginService
  ) {}
  ngOnInit(): void {
    let receivedData: any = localStorage.getItem('VarianceData');

    receivedData = JSON.parse(receivedData);

    if (receivedData) {
      this.varianceData = receivedData;
    }
    this.get_VarianceData();
  }

  get_VarianceData() {
    //this.OrderdetailsLoading = true;

    let obj: BarDetails = {
      CustomerCode: this.varianceData.CustomerCode,
      ProjectCode: this.varianceData.ProjectCode,
      JobID: this.varianceData.JobID,
      BBSID: this.varianceData.BBSID,
      BarID: this.varianceData.BarID,
      BarSort: this.varianceData.BarSort,
      Cancelled: this.varianceData.Cancelled,
      BarCAB: this.varianceData.BarCAB,
      BarSTD: this.varianceData.BarSTD,
      ElementMark: this.varianceData.ElementMark,
      BarMark: this.varianceData.BarMark,
      BarType: this.varianceData.BarType,
      BarSize: this.varianceData.BarSize,
      BarMemberQty: this.varianceData.BarMemberQty,
      BarEachQty: this.varianceData.BarEachQty,
      BarTotalQty: this.varianceData.BarTotalQty,
      BarShapeCode: this.varianceData.BarShapeCode,
      A: this.varianceData.A,
      B: this.varianceData.B,
      C: this.varianceData.C,
      D: this.varianceData.D,
      E: this.varianceData.E,
      F: this.varianceData.F,
      G: this.varianceData.G,
      H: this.varianceData.H,
      I: this.varianceData.I,
      J: this.varianceData.J,
      K: this.varianceData.K,
      L: this.varianceData.L,
      M: this.varianceData.M,
      N: this.varianceData.N,
      O: this.varianceData.O,
      P: this.varianceData.P,
      Q: this.varianceData.Q,
      R: this.varianceData.R,
      S: this.varianceData.S,
      T: this.varianceData.T,
      U: this.varianceData.U,
      V: this.varianceData.V,
      W: this.varianceData.W,
      X: this.varianceData.X,
      Y: this.varianceData.Y,
      Z: this.varianceData.Z,
      BarLength: this.varianceData.BarLength,
      BarWeight: this.varianceData.BarWeight,
      Remarks: this.varianceData.Remarks,
      shapeParameters: this.varianceData.shapeParameters,
      shapeLengthFormula: this.varianceData.shapeLengthFormula,
      shapeParaValidator: this.varianceData.shapeParaValidator,
      shapeTransportValidator: this.varianceData.Z,
      shapeParType: this.varianceData.shapeParType,
      shapeDefaultValue: this.varianceData.shapeDefaultValue,
      shapeHeightCheck: this.varianceData.shapeHeightCheck,
      shapeAutoCalcFormula1: this.varianceData.shapeAutoCalcFormula1,
      shapeAutoCalcFormula2: this.varianceData.shapeAutoCalcFormula2,
      shapeAutoCalcFormula3: this.varianceData.shapeAutoCalcFormula3,
      shapeTransport: this.varianceData.shapeTransport,
      PinSize: this.varianceData.PinSize,
      TeklaGUID: this.varianceData.TeklaGUID,
      PartGUID: this.varianceData.PartGUID,
      UpdateDate: this.varianceData.UpdateDate,
      UpdateBy: this.loginService.GetGroupName(),
    };

    console.log('obj', obj);
    this.orderService.VarianceData(obj).subscribe({
      next: (response) => {
        this.VarianceListData = response;
        console.log('VarianceData', response);

        this.VarianceListData.forEach((x) => {
          x.BarLength = this.calTotalLen(x, 'A', x.A);
        });
      },
      error: (e) => {},
      complete: () => {
        // this.loading = false;
      },
    });
  }

  getVarMaxValue(pValue: any) {
    var rValue = 0;
    if (pValue != null) {
      if (isNaN(pValue)) {
        var lVarLen = pValue.split('-');
        if (lVarLen.length == 2) {
          var lVar1 = 0;
          var lVar2 = 0;
          if (isNaN(lVarLen[0]) == false) {
            lVar1 = parseInt(lVarLen[0]);
          }
          if (isNaN(lVarLen[1]) == false) {
            lVar2 = parseInt(lVarLen[1]);
          }
          if (lVar1 > lVar2) {
            rValue = lVar1;
          } else {
            rValue = lVar2;
          }
        } else {
          rValue = 0;
        }
      } else {
        rValue = parseInt(pValue);
      }
    }
    return rValue;
  }

  getVarMinValue(pValue: any) {
    var rValue = 0;
    if (pValue != null) {
      if (isNaN(pValue)) {
        var lVarLen = pValue.split('-');
        if (lVarLen.length == 2) {
          var lVar1 = 0;
          var lVar2 = 0;
          if (isNaN(lVarLen[0]) == false) {
            lVar1 = parseInt(lVarLen[0]);
          }
          if (isNaN(lVarLen[1]) == false) {
            lVar2 = parseInt(lVarLen[1]);
          }
          if (lVar1 > lVar2) {
            rValue = lVar2;
          } else {
            rValue = lVar1;
          }
        } else {
          rValue = 0;
        }
      } else {
        rValue = parseInt(pValue);
      }
    }

    return rValue;
  }

  calWeight(pItem: any) {
    var lDia = [6, 8, 10, 12, 13, 16, 20, 24, 25, 28, 32, 36, 40, 50];
    var lUnitWT = [
      0.222, 0.395, 0.617, 0.888, 1.042, 1.579, 2.466, 3.699, 3.854, 4.834,
      6.313, 7.769, 9.864, 15.413,
    ];
    var lWeight = 0;
    var lKGM = 0;
    var lBarLength = pItem['BarLength'];

    if (!isNaN(pItem['BarTotalQty']) && !isNaN(pItem['BarSize'])) {
      for (var i = 0; i < lDia.length; i++) {
        if (pItem['BarSize'] == lDia[i]) {
          lKGM = lUnitWT[i];
          break;
        }
      }
      if (lKGM > 0) {
        if (isNaN(lBarLength)) {
          if (lBarLength != null) {
            lWeight =
              Math.round(
                (lKGM *
                  pItem['BarTotalQty'] *
                  (this.getVarMinValue(lBarLength) +
                    this.getVarMaxValue(lBarLength))) /
                  2
              ) / 1000;
          }
        } else {
          lWeight = Math.round(lKGM * pItem['BarTotalQty'] * lBarLength) / 1000;
        }
      }
    }

    return lWeight;
  }

  showColumn(pChar: string): boolean {
    let lData = this.VarianceListData;
    if (lData) {
      for (let i = 0; i < lData.length; i++) {
        let lItem = lData[i];
        if (lItem[pChar]) {
          return true;
        }
      }
    }
    return false;
  }

  calTotalLen(pItem: any, pColumnName: any, pValue: any) {
    var lItem = JSON.parse(JSON.stringify(pItem));
    var lF = pItem['shapeLengthFormula'];
    if (!lF) {
      lF = this.varianceData.shapeLengthFormula;
    }
    var lResult = pItem['BarLength'];
    var lColumnName = pColumnName;
    var lVarMax = 0;
    var lVarMin = 0;
    if (
      (lF == null || lF == '') &&
      (pItem['BarShapeCode'] == '020' || pItem['BarShapeCode'] == '20')
    ) {
      lF = 'A';
      pItem['shapeLengthFormula'] = 'A';
    }
    if (lF != null) {
      if (lF != '') {
        if (
          (lColumnName == 'A' && lF.indexOf('A') >= 0) ||
          (lColumnName == 'B' && lF.indexOf('B') >= 0) ||
          (lColumnName == 'C' && lF.indexOf('C') >= 0) ||
          (lColumnName == 'D' && lF.indexOf('D') >= 0) ||
          (lColumnName == 'E' && lF.indexOf('E') >= 0) ||
          (lColumnName == 'F' && lF.indexOf('F') >= 0) ||
          (lColumnName == 'G' && lF.indexOf('G') >= 0) ||
          (lColumnName == 'H' && lF.indexOf('H') >= 0) ||
          (lColumnName == 'I' && lF.indexOf('I') >= 0) ||
          (lColumnName == 'J' && lF.indexOf('J') >= 0) ||
          (lColumnName == 'K' && lF.indexOf('K') >= 0) ||
          (lColumnName == 'L' && lF.indexOf('L') >= 0) ||
          (lColumnName == 'M' && lF.indexOf('M') >= 0) ||
          (lColumnName == 'N' && lF.indexOf('N') >= 0) ||
          (lColumnName == 'O' && lF.indexOf('O') >= 0) ||
          (lColumnName == 'P' && lF.indexOf('P') >= 0) ||
          (lColumnName == 'Q' && lF.indexOf('Q') >= 0) ||
          (lColumnName == 'R' && lF.indexOf('R') >= 0) ||
          (lColumnName == 'S' && lF.indexOf('S') >= 0) ||
          (lColumnName == 'T' && lF.indexOf('T') >= 0) ||
          (lColumnName == 'U' && lF.indexOf('U') >= 0) ||
          (lColumnName == 'V' && lF.indexOf('V') >= 0) ||
          (lColumnName == 'W' && lF.indexOf('W') >= 0) ||
          (lColumnName == 'X' && lF.indexOf('X') >= 0) ||
          (lColumnName == 'Y' && lF.indexOf('Y') >= 0) ||
          (lColumnName == 'Z' && lF.indexOf('Z') >= 0)
        ) {
          lItem[pColumnName] = pValue;
          if (lF.indexOf('A') >= 0)
            if (isNaN(lItem['A']) || lItem['A'] == null)
              lF = lF.replace(
                new RegExp('A', 'g'),
                this.getVarValue1(lItem['A'])
              );
            else lF = lF.replace(new RegExp('A', 'g'), lItem['A']);
          if (lF.indexOf('B') >= 0)
            if (isNaN(lItem['B']) || lItem['B'] == null)
              lF = lF.replace(
                new RegExp('B', 'g'),
                this.getVarValue1(lItem['B'])
              );
            else lF = lF.replace(new RegExp('B', 'g'), lItem['B']);
          if (lF.indexOf('C') >= 0)
            if (isNaN(lItem['C']) || lItem['C'] == null)
              lF = lF.replace(
                new RegExp('C', 'g'),
                this.getVarValue1(lItem['C'])
              );
            else lF = lF.replace(new RegExp('C', 'g'), lItem['C']);
          if (lF.indexOf('D') >= 0)
            if (isNaN(lItem['D']) || lItem['D'] == null)
              lF = lF.replace(
                new RegExp('D', 'g'),
                this.getVarValue1(lItem['D'])
              );
            else lF = lF.replace(new RegExp('D', 'g'), lItem['D']);
          if (lF.indexOf('E') >= 0)
            if (isNaN(lItem['E']) || lItem['E'] == null)
              lF = lF.replace(
                new RegExp('E', 'g'),
                this.getVarValue1(lItem['E'])
              );
            else lF = lF.replace(new RegExp('E', 'g'), lItem['E']);
          if (lF.indexOf('F') >= 0)
            if (isNaN(lItem['F']) || lItem['F'] == null)
              lF = lF.replace(
                new RegExp('F', 'g'),
                this.getVarValue1(lItem['F'])
              );
            else lF = lF.replace(new RegExp('F', 'g'), lItem['F']);
          if (lF.indexOf('G') >= 0)
            if (isNaN(lItem['G']) || lItem['G'] == null)
              lF = lF.replace(
                new RegExp('G', 'g'),
                this.getVarValue1(lItem['G'])
              );
            else lF = lF.replace(new RegExp('G', 'g'), lItem['G']);
          if (lF.indexOf('H') >= 0)
            if (isNaN(lItem['H']) || lItem['H'] == null)
              lF = lF.replace(
                new RegExp('H', 'g'),
                this.getVarValue1(lItem['H'])
              );
            else lF = lF.replace(new RegExp('H', 'g'), lItem['H']);
          if (lF.indexOf('I') >= 0)
            if (isNaN(lItem['I']) || lItem['I'] == null)
              lF = lF.replace(
                new RegExp('I', 'g'),
                this.getVarValue1(lItem['I'])
              );
            else lF = lF.replace(new RegExp('I', 'g'), lItem['I']);
          if (lF.indexOf('J') >= 0)
            if (isNaN(lItem['J']) || lItem['J'] == null)
              lF = lF.replace(
                new RegExp('J', 'g'),
                this.getVarValue1(lItem['J'])
              );
            else lF = lF.replace(new RegExp('J', 'g'), lItem['J']);
          if (lF.indexOf('K') >= 0)
            if (isNaN(lItem['K']) || lItem['K'] == null)
              lF = lF.replace(
                new RegExp('K', 'g'),
                this.getVarValue1(lItem['K'])
              );
            else lF = lF.replace(new RegExp('K', 'g'), lItem['K']);
          if (lF.indexOf('L') >= 0)
            if (isNaN(lItem['L']) || lItem['L'] == null)
              lF = lF.replace(
                new RegExp('L', 'g'),
                this.getVarValue1(lItem['L'])
              );
            else lF = lF.replace(new RegExp('L', 'g'), lItem['L']);
          if (lF.indexOf('M') >= 0)
            if (isNaN(lItem['M']) || lItem['M'] == null)
              lF = lF.replace(
                new RegExp('M', 'g'),
                this.getVarValue1(lItem['M'])
              );
            else lF = lF.replace(new RegExp('M', 'g'), lItem['M']);
          if (lF.indexOf('N') >= 0)
            if (isNaN(lItem['N']) || lItem['N'] == null)
              lF = lF.replace(
                new RegExp('N', 'g'),
                this.getVarValue1(lItem['N'])
              );
            else lF = lF.replace(new RegExp('N', 'g'), lItem['N']);
          if (lF.indexOf('O') >= 0)
            if (isNaN(lItem['O']) || lItem['O'] == null)
              lF = lF.replace(
                new RegExp('O', 'g'),
                this.getVarValue1(lItem['O'])
              );
            else lF = lF.replace(new RegExp('O', 'g'), lItem['O']);
          if (lF.indexOf('P') >= 0)
            if (isNaN(lItem['P']) || lItem['P'] == null)
              lF = lF.replace(
                new RegExp('P', 'g'),
                this.getVarValue1(lItem['P'])
              );
            else lF = lF.replace(new RegExp('P', 'g'), lItem['P']);
          if (lF.indexOf('Q') >= 0)
            if (isNaN(lItem['Q']) || lItem['Q'] == null)
              lF = lF.replace(
                new RegExp('Q', 'g'),
                this.getVarValue1(lItem['Q'])
              );
            else lF = lF.replace(new RegExp('Q', 'g'), lItem['Q']);
          if (lF.indexOf('R') >= 0)
            if (isNaN(lItem['R']) || lItem['R'] == null)
              lF = lF.replace(
                new RegExp('R', 'g'),
                this.getVarValue1(lItem['R'])
              );
            else lF = lF.replace(new RegExp('R', 'g'), lItem['R']);
          if (lF.indexOf('S') >= 0)
            if (isNaN(lItem['S']) || lItem['S'] == null)
              lF = lF.replace(
                new RegExp('S', 'g'),
                this.getVarValue1(lItem['S'])
              );
            else lF = lF.replace(new RegExp('S', 'g'), lItem['S']);
          if (lF.indexOf('T') >= 0)
            if (isNaN(lItem['T']) || lItem['T'] == null)
              lF = lF.replace(
                new RegExp('T', 'g'),
                this.getVarValue1(lItem['T'])
              );
            else lF = lF.replace(new RegExp('T', 'g'), lItem['T']);
          if (lF.indexOf('U') >= 0)
            if (isNaN(lItem['U']) || lItem['U'] == null)
              lF = lF.replace(
                new RegExp('U', 'g'),
                this.getVarValue1(lItem['U'])
              );
            else lF = lF.replace(new RegExp('U', 'g'), lItem['U']);
          if (lF.indexOf('V') >= 0)
            if (isNaN(lItem['V']) || lItem['V'] == null)
              lF = lF.replace(
                new RegExp('V', 'g'),
                this.getVarValue1(lItem['V'])
              );
            else lF = lF.replace(new RegExp('V', 'g'), lItem['V']);
          if (lF.indexOf('W') >= 0)
            if (isNaN(lItem['W']) || lItem['W'] == null)
              lF = lF.replace(
                new RegExp('W', 'g'),
                this.getVarValue1(lItem['W'])
              );
            else lF = lF.replace(new RegExp('W', 'g'), lItem['W']);
          if (lF.indexOf('X') >= 0)
            if (isNaN(lItem['X']) || lItem['X'] == null)
              lF = lF.replace(
                new RegExp('X', 'g'),
                this.getVarValue1(lItem['X'])
              );
            else lF = lF.replace(new RegExp('X', 'g'), lItem['X']);
          if (lF.indexOf('Y') >= 0)
            if (isNaN(lItem['Y']) || lItem['Y'] == null)
              lF = lF.replace(
                new RegExp('Y', 'g'),
                this.getVarValue1(lItem['Y'])
              );
            else lF = lF.replace(new RegExp('Y', 'g'), lItem['Y']);
          if (lF.indexOf('Z') >= 0)
            if (isNaN(lItem['Z']) || lItem['Z'] == null)
              lF = lF.replace(
                new RegExp('Z', 'g'),
                this.getVarValue1(lItem['Z'])
              );
            else lF = lF.replace(new RegExp('Z', 'g'), lItem['Z']);
          //if (lF.indexOf("math") >= 0) {
          //    lF = lF.split("math").join("Math");
          //}
          //if (lF.indexOf("pi") >= 0) {
          //    lF = lF.split("pi").join("PI");
          //}
          if (lF.indexOf('math.') >= 0)
            lF = lF.replace(new RegExp('math.', 'g'), '');
          lVarMax = math.evaluate(lF);
          //call it in validation -- before the cell value -- it is ld value.
          //if (lItem[lColumnName] == null) {
          //    lVarMax = lVarMax + getVarMaxValue(pValue);
          //}
          //else {
          //    lVarMax = lVarMax - getVarMaxValue(lItem[lColumnName]) + getVarMaxValue(pValue);
          //}

          lF = pItem['shapeLengthFormula'];
          if (!lF) {
            lF = this.varianceData.shapeLengthFormula;
          }
          if (lF.indexOf('A') >= 0)
            if (isNaN(lItem['A']) || lItem['A'] == null)
              lF = lF.replace(
                new RegExp('A', 'g'),
                this.getVarValue2(lItem['A'])
              );
            else lF = lF.replace(new RegExp('A', 'g'), lItem['A']);
          if (lF.indexOf('B') >= 0)
            if (isNaN(lItem['B']) || lItem['B'] == null)
              lF = lF.replace(
                new RegExp('B', 'g'),
                this.getVarValue2(lItem['B'])
              );
            else lF = lF.replace(new RegExp('B', 'g'), lItem['B']);
          if (lF.indexOf('C') >= 0)
            if (isNaN(lItem['C']) || lItem['C'] == null)
              lF = lF.replace(
                new RegExp('C', 'g'),
                this.getVarValue2(lItem['C'])
              );
            else lF = lF.replace(new RegExp('C', 'g'), lItem['C']);
          if (lF.indexOf('D') >= 0)
            if (isNaN(lItem['D']) || lItem['D'] == null)
              lF = lF.replace(
                new RegExp('D', 'g'),
                this.getVarValue2(lItem['D'])
              );
            else lF = lF.replace(new RegExp('D', 'g'), lItem['D']);
          if (lF.indexOf('E') >= 0)
            if (isNaN(lItem['E']) || lItem['E'] == null)
              lF = lF.replace(
                new RegExp('E', 'g'),
                this.getVarValue2(lItem['E'])
              );
            else lF = lF.replace(new RegExp('E', 'g'), lItem['E']);
          if (lF.indexOf('F') >= 0)
            if (isNaN(lItem['F']) || lItem['F'] == null)
              lF = lF.replace(
                new RegExp('F', 'g'),
                this.getVarValue2(lItem['F'])
              );
            else lF = lF.replace(new RegExp('F', 'g'), lItem['F']);
          if (lF.indexOf('G') >= 0)
            if (isNaN(lItem['G']) || lItem['G'] == null)
              lF = lF.replace(
                new RegExp('G', 'g'),
                this.getVarValue2(lItem['G'])
              );
            else lF = lF.replace(new RegExp('G', 'g'), lItem['G']);
          if (lF.indexOf('H') >= 0)
            if (isNaN(lItem['H']) || lItem['H'] == null)
              lF = lF.replace(
                new RegExp('H', 'g'),
                this.getVarValue2(lItem['H'])
              );
            else lF = lF.replace(new RegExp('H', 'g'), lItem['H']);
          if (lF.indexOf('I') >= 0)
            if (isNaN(lItem['I']) || lItem['I'] == null)
              lF = lF.replace(
                new RegExp('I', 'g'),
                this.getVarValue2(lItem['I'])
              );
            else lF = lF.replace(new RegExp('I', 'g'), lItem['I']);
          if (lF.indexOf('J') >= 0)
            if (isNaN(lItem['J']) || lItem['J'] == null)
              lF = lF.replace(
                new RegExp('J', 'g'),
                this.getVarValue2(lItem['J'])
              );
            else lF = lF.replace(new RegExp('J', 'g'), lItem['J']);
          if (lF.indexOf('K') >= 0)
            if (isNaN(lItem['K']) || lItem['K'] == null)
              lF = lF.replace(
                new RegExp('K', 'g'),
                this.getVarValue2(lItem['K'])
              );
            else lF = lF.replace(new RegExp('K', 'g'), lItem['K']);
          if (lF.indexOf('L') >= 0)
            if (isNaN(lItem['L']) || lItem['L'] == null)
              lF = lF.replace(
                new RegExp('L', 'g'),
                this.getVarValue2(lItem['L'])
              );
            else lF = lF.replace(new RegExp('L', 'g'), lItem['L']);
          if (lF.indexOf('M') >= 0)
            if (isNaN(lItem['M']) || lItem['M'] == null)
              lF = lF.replace(
                new RegExp('M', 'g'),
                this.getVarValue2(lItem['M'])
              );
            else lF = lF.replace(new RegExp('M', 'g'), lItem['M']);
          if (lF.indexOf('N') >= 0)
            if (isNaN(lItem['N']) || lItem['N'] == null)
              lF = lF.replace(
                new RegExp('N', 'g'),
                this.getVarValue2(lItem['N'])
              );
            else lF = lF.replace(new RegExp('N', 'g'), lItem['N']);
          if (lF.indexOf('O') >= 0)
            if (isNaN(lItem['O']) || lItem['O'] == null)
              lF = lF.replace(
                new RegExp('O', 'g'),
                this.getVarValue2(lItem['O'])
              );
            else lF = lF.replace(new RegExp('O', 'g'), lItem['O']);
          if (lF.indexOf('P') >= 0)
            if (isNaN(lItem['P']) || lItem['P'] == null)
              lF = lF.replace(
                new RegExp('P', 'g'),
                this.getVarValue2(lItem['P'])
              );
            else lF = lF.replace(new RegExp('P', 'g'), lItem['P']);
          if (lF.indexOf('Q') >= 0)
            if (isNaN(lItem['Q']) || lItem['Q'] == null)
              lF = lF.replace(
                new RegExp('Q', 'g'),
                this.getVarValue2(lItem['Q'])
              );
            else lF = lF.replace(new RegExp('Q', 'g'), lItem['Q']);
          if (lF.indexOf('R') >= 0)
            if (isNaN(lItem['R']) || lItem['R'] == null)
              lF = lF.replace(
                new RegExp('R', 'g'),
                this.getVarValue2(lItem['R'])
              );
            else lF = lF.replace(new RegExp('R', 'g'), lItem['R']);
          if (lF.indexOf('S') >= 0)
            if (isNaN(lItem['S']) || lItem['S'] == null)
              lF = lF.replace(
                new RegExp('S', 'g'),
                this.getVarValue2(lItem['S'])
              );
            else lF = lF.replace(new RegExp('S', 'g'), lItem['S']);
          if (lF.indexOf('T') >= 0)
            if (isNaN(lItem['T']) || lItem['T'] == null)
              lF = lF.replace(
                new RegExp('T', 'g'),
                this.getVarValue2(lItem['T'])
              );
            else lF = lF.replace(new RegExp('T', 'g'), lItem['T']);
          if (lF.indexOf('U') >= 0)
            if (isNaN(lItem['U']) || lItem['U'] == null)
              lF = lF.replace(
                new RegExp('U', 'g'),
                this.getVarValue2(lItem['U'])
              );
            else lF = lF.replace(new RegExp('U', 'g'), lItem['U']);
          if (lF.indexOf('V') >= 0)
            if (isNaN(lItem['V']) || lItem['V'] == null)
              lF = lF.replace(
                new RegExp('V', 'g'),
                this.getVarValue2(lItem['V'])
              );
            else lF = lF.replace(new RegExp('V', 'g'), lItem['V']);
          if (lF.indexOf('W') >= 0)
            if (isNaN(lItem['W']) || lItem['W'] == null)
              lF = lF.replace(
                new RegExp('W', 'g'),
                this.getVarValue2(lItem['W'])
              );
            else lF = lF.replace(new RegExp('W', 'g'), lItem['W']);
          if (lF.indexOf('X') >= 0)
            if (isNaN(lItem['X']) || lItem['X'] == null)
              lF = lF.replace(
                new RegExp('X', 'g'),
                this.getVarValue2(lItem['X'])
              );
            else lF = lF.replace(new RegExp('X', 'g'), lItem['X']);
          if (lF.indexOf('Y') >= 0)
            if (isNaN(lItem['Y']) || lItem['Y'] == null)
              lF = lF.replace(
                new RegExp('Y', 'g'),
                this.getVarValue2(lItem['Y'])
              );
            else lF = lF.replace(new RegExp('Y', 'g'), lItem['Y']);
          if (lF.indexOf('Z') >= 0)
            if (isNaN(lItem['Z']) || lItem['Z'] == null)
              lF = lF.replace(
                new RegExp('Z', 'g'),
                this.getVarValue2(lItem['Z'])
              );
            else lF = lF.replace(new RegExp('Z', 'g'), lItem['Z']);
          //if (lF.indexOf("math") >= 0) {
          //    lF = lF.split("math").join("Math");
          //}
          //if (lF.indexOf("pi") >= 0) {
          //    lF = lF.split("pi").join("PI");
          //}
          if (lF.indexOf('math.') >= 0)
            lF = lF.replace(new RegExp('math.', 'g'), '');
          lVarMin = math.evaluate(lF);
          //call it in validation -- before the cell value -- it is ld value.
          //if (lItem[lColumnName] == null) {
          //    lVarMin = lVarMin + getVarMinValue(pValue);
          //}
          //else {
          //    lVarMin = lVarMin - getVarMinValue(lItem[lColumnName]) + getVarMinValue(pValue);
          //}

          lVarMin = Math.round(lVarMin);
          lVarMax = Math.round(lVarMax);

          if (lVarMin == 0 || lVarMin == lVarMax) {
            lResult = lVarMax;
          } else {
            lResult = lVarMax + '-' + lVarMin;
          }
        }
      }
    }
    return lResult;
  }

  getVarValue1(pValue: any) {
    var rValue = 0;
    if (pValue != null) {
      if (isNaN(pValue)) {
        var lVarLen = pValue.split('-');
        if (lVarLen.length == 2) {
          var lVar1 = 0;
          if (isNaN(lVarLen[0]) == false) {
            lVar1 = parseInt(lVarLen[0]);
          }
          rValue = lVar1;
        } else {
          rValue = 0;
        }
      } else {
        rValue = parseInt(pValue);
      }
    }
    return rValue;
  }

  getVarValue2(pValue: any) {
    var rValue = 0;
    if (pValue != null) {
      if (isNaN(pValue)) {
        var lVarLen = pValue.split('-');
        if (lVarLen.length == 2) {
          var lVar2 = 0;
          if (isNaN(lVarLen[1]) == false) {
            lVar2 = parseInt(lVarLen[1]);
          }
          rValue = lVar2;
        } else {
          rValue = 0;
        }
      } else {
        rValue = parseInt(pValue);
      }
    }
    return rValue;
  }
}
