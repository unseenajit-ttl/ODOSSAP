import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../orders.service';

@Component({
  selector: 'app-sor-watchlist',
  templateUrl: './sor-watchlist.component.html',
  styleUrls: ['./sor-watchlist.component.css']
})
export class SORWatchlistComponent implements OnInit {
  CurrPer: any;
  gridPONoList_watchlist: any[] = [];
  gridPONoList: any[] = [];

  WatchList_SO_Number: string = "";
  WatchList_SOR_Number: string = "";


  show_divFields_watchlist: boolean = false;
  show_divFields: boolean = false;
  show_report_excel: boolean = false;
  disable_btnDelete: boolean = true;

  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService) { }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }


  Watchlist_Search() {
    this.CurrPer = 0;
    var lSONumber: any = this.WatchList_SO_Number;
    var lSORNumber = this.WatchList_SOR_Number;
    if ((lSONumber == null || lSONumber == "") && (lSORNumber == null || lSORNumber == "")) {
      alert("Please enter SO or SOR number to search.");
      // document.getElementById("WatchList_SO_Number").focus();
      return;
    }
    //     startAjax_watchlist(100);
    //     $.ajax({
    //         //url: "/OrderAmendment/Watchlist_Search",
    //         url: "@Url.Action("Watchlist_Search")",
    //         type: "POST",
    //         headers: {
    //             "__RequestVerificationToken": $('input[name="__RequestVerificationToken"]', '@using (Html.BeginForm("Watchlist_Search", "OrderAmendment"))
    //                             {@Html.AntiForgeryToken()
    // } ').val()
    //             },
    let data = {
      SONumber: lSONumber,
      SORNumber: lSORNumber,
    };
    let response: any = this.Watchlist_Search_GET(data);

    if (response === 'error') { }
    /**AIT : Error Handling */
    // error: function (response, textStatus, errorThrown) {
    //     var errorMessage = errorThrown;
    //     if (response.responseJSON != null) {
    //         errorMessage = response.responseJSON.message;
    //     }
    //     alert("Please narrow down search criteria (Too many records): " + errorMessage);
    //     CompleteAjax();
    // },
    else {
      let PONoListdata_watchlist: any[] = [];
      if (response.length > 0) {
        for (var i = 0; i < response.length; i++) {
          PONoListdata_watchlist[i] = {
            SONo: response[i].SONo,
            SORNo: response[i].SORNo,
            Customer: response[i].Customer,
            //Project: response[i].Project,
            //ContractNo: response[i].ContractNo,
            STATUS: response[i].STATUS,
            EntryDate: response[i].EntryDate
          };
        }
        // gridPONoList_watchlist.setData(PONoListdata_watchlist);
        this.gridPONoList_watchlist = PONoListdata_watchlist;

        /**AJIT : Row color CSS */
        // for (var i = 0; i < this.gridPONoList_watchlist.length; i++) {
        //     PONoListdata_watchlist.getItemMetadata = function (i) {
        //         if (PONoListdata_watchlist[i].STATUS == 'X') {
        //             return { "cssClasses": " highlightedGrayed" };
        //         }
        //         else if (PONoListdata_watchlist[i].OnHold == 'Y') {
        //             return { "cssClasses": " highlighted" };
        //         }
        //     };
        // }
        // gridPONoList_watchlist.render();

        // document.getElementById("divFields_watchlist").style.visibility = true;
        this.show_divFields_watchlist = true;
        // document.getElementById("btnDelete").disabled = true;
        this.disable_btnDelete = true;
        if (response.length == 0) {
          // document.getElementById("divFields_watchlist").style.visibility = false;
          this.show_divFields_watchlist = false;
        }
      } else {
        // gridPONoList_watchlist.setData(PONoListdata_watchlist);
        this.gridPONoList_watchlist = PONoListdata_watchlist;

        // gridPONoList_watchlist.render();
        // document.getElementById("divFields_watchlist").style.visibility = false;
        this.show_divFields_watchlist = false;
      }
      return;
    }
  }


  btnQuery_click() {
    /**AJIT: Pass the correct value */
    var lRows_watchlist: any[] = [];// gridPONoList_watchlist.getSelectedRows();
    if (lRows_watchlist.length > 0) {
      var SORNumbers_watchlist = "";
      for (var i = 0; i < lRows_watchlist.length; i++) {
        // var lItem_watchlist = gridPONoList_watchlist.getDataItem(lRows_watchlist[i]);
        var lItem_watchlist = this.gridPONoList_watchlist[lRows_watchlist[i]];
        SORNumbers_watchlist = SORNumbers_watchlist + lItem_watchlist.SORNo + ",";
      }
      //         startAjax_watchlist(100);
      //         $.ajax({
      //             url: "@Url.Action("Watchlist_Query_Result")",
      //             type: "POST",
      //             headers: {
      //                 "__RequestVerificationToken": $('input[name="__RequestVerificationToken"]', '@using (Html.BeginForm("Watchlist_Query_Result", "OrderAmendment"))
      //                                 {@Html.AntiForgeryToken()
      //     } ').val()
      // },
      let data = {
        SORNumbers_to_amend: SORNumbers_watchlist
      };

      let response: any = this.Watchlist_Query_Result_GET(data);
      if (response == 'error') { }
      /**AJIT: Error Handling */
      // error: function (response, textStatus, errorThrown) {
      //     var errorMessage = errorThrown;
      //     if (response.responseJSON != null) {
      //         errorMessage = response.responseJSON.message;
      //     }
      //     alert("Error occurred while querying SOR's in Watchlist, Please try again. " + errorMessage);
      // },
      else {
        // $("#loginModal").modal('hide');
        let PONoListdata: any[] = [];
        if (response.length > 0) {
          for (var i = 0; i < response.length; i++) {
            PONoListdata[i] = {
              SrNo: response[i].SrNo,
              SONo: response[i].SONo,
              Customer: response[i].Customer,
              Project: response[i].Project,
              ContractNo: response[i].ContractNo,
              ProjCoord: response[i].ProjCoord,
              ReqDateFr: response[i].ReqDateFr,
              ReqDateTo: response[i].ReqDateTo,
              ConfirmedDate: response[i].ConfirmedDate,
              OnHold: response[i].OnHold,
              LorryCrane: response[i].LorryCrane,
              DoNotMix: response[i].DoNotMix,
              CallBefDelivery: response[i].CallBefDelivery,
              SpecialPass: response[i].SpecialPass,
              BargeBooked: response[i].BargeBooked,
              CraneBooked: response[i].CraneBooked,
              PoliceEscort: response[i].PoliceEscort,
              PremiumService: response[i].PremiumService,
              UrgentOrder: response[i].UrgentOrder,
              ConquasOrder: response[i].ConquasOrder,
              ZeroTolerance: response[i].ZeroTolerance,
              LowBedVehicleAllowed: response[i].LowBedVehicleAllowed,
              FiftyTonVehicleAllowed: response[i].FiftyTonVehicleAllowed,
              UnitMode: response[i].UnitMode,
              //ProjectCastingDate: response[i].ProjectCastingDate,
              //MustHaveDate: response[i].MustHaveDate,
              SalesOrder: response[i].SalesOrder,
              SORNo: response[i].SORNo,
              GroupID: response[i].GroupID,
              PONumber: response[i].PONumber,
              PODate: response[i].PODate,
              BBSNo: response[i].BBSNo,
              ProductType: response[i].ProductType,
              IntRemark: response[i].IntRemark,
              ExtRemark: response[i].ExtRemark,
              STELEMENTTYPE: response[i].STELEMENTTYPE,
              WBS1: response[i].WBS1,
              WBS2: response[i].WBS2,
              WBS3: response[i].WBS3,
              STATUS: response[i].STATUS
            };
          }
          // gridPONoList.setData(PONoListdata);
          this.gridPONoList = PONoListdata;
          for (var i = 0; i < this.gridPONoList.length; i++) {

            /**AJIT: row color CSS */
            // PONoListdata.getItemMetadata = function (i) {
            //     if (PONoListdata[i].STATUS == 'X') {
            //         return { "cssClasses": " highlightedGrayed" };
            //     }
            //     else if (PONoListdata[i].OnHold == 'Y') {
            //         return { "cssClasses": " highlighted" };
            //     }
            // };
          }
          // gridPONoList.render();
          this.show_divFields = true;
          this.show_report_excel = true;
          if (response.length == 0) {
            this.show_divFields = false;
            this.show_report_excel = false;
          }
        } else {
          // gridPONoList.setData(PONoListdata);
          // gridPONoList.render();
          this.gridPONoList = PONoListdata;

          this.show_divFields = false;
          this.show_report_excel = false;
        }
        // gridPONoList_watchlist.invalidate();
      }
    }
    else {
      alert('No order(s) selected to query to watchlist.');
      return;
    }
  }


  btnDelete_click() {
    /**AJIT: Pass the correct value */
    var lRows_watchlist: any[] = [];// gridPONoList_watchlist.getSelectedRows();
    if (lRows_watchlist.length > 0) {
      var SORNumbers_watchlist = "";
      for (var i = 0; i < lRows_watchlist.length; i++) {
        // var lItem_watchlist = gridPONoList_watchlist.getDataItem(lRows_watchlist[i]);
        var lItem_watchlist = this.gridPONoList_watchlist[lRows_watchlist[i]];

        SORNumbers_watchlist = SORNumbers_watchlist + lItem_watchlist.SORNo + ",";
      }
      if (confirm('Are you sure to delete selected order(s) from watchlist?')) {
        //         startAjax_watchlist(100);
        //         $.ajax({
        //             url: "@Url.Action("Delete_From_Watchlist")",
        //             type: "POST",
        //             headers: {
        //                 "__RequestVerificationToken": $('input[name="__RequestVerificationToken"]', '@using (Html.BeginForm("Delete_From_Watchlist", "OrderAmendment"))
        //                             {@Html.AntiForgeryToken()
        //     } ').val()
        // },

        let data = {
          SORNumbers_to_amend: SORNumbers_watchlist
        };

        let response: any = this.Delete_From_Watchlist_GET(data);
        if (response == 'error') {

        }
        /**AJIT : error handling */

        // error: function (response, textStatus, errorThrown) {
        //     var errorMessage = errorThrown;
        //     if (response.responseJSON != null) {
        //         errorMessage = response.responseJSON.message;
        //     }
        //     alert("Error occurred while deleting order(s) from Watchlist, Please try again. " + errorMessage);
        // },
        else {
          if (response == 1) {
            // gridPONoList_watchlist.invalidate();
            this.reload_Watchlist();
            alert("Order(s) deleted from watchlist successfully.");
          }
          else {
            alert("Error occurred while deleting SO/SOR from watch list. " + response);
          }
        }
      }
    }
    else {
      alert('No order(s) selected to delete from watchlist.');
      return;
    }
  }
  btnSave_click() {
    /**AJIT: Pass the correct value */
    var lRows_watchlist: any[] = [];// gridPONoList_watchlist.getSelectedRows();
    if (lRows_watchlist.length > 0) {
      var SORNumbers_watchlist = "";
      for (var i = 0; i < lRows_watchlist.length; i++) {
        // var lItem_watchlist = gridPONoList_watchlist.getDataItem(lRows_watchlist[i]);
        var lItem_watchlist = this.gridPONoList_watchlist[lRows_watchlist[i]];

        SORNumbers_watchlist = SORNumbers_watchlist + lItem_watchlist.SORNo + ",";
      }

      //         startAjax_watchlist(100);
      //         $.ajax({
      //             url: "@Url.Action("Save_To_Watchlist")",
      //             type: "POST",
      //             headers: {
      //                 "__RequestVerificationToken": $('input[name="__RequestVerificationToken"]', '@using (Html.BeginForm("Save_To_Watchlist", "OrderAmendment"))
      //                                 {@Html.AntiForgeryToken()
      //     } ').val()
      // },
      let data = {
        SORNumbers_to_amend: SORNumbers_watchlist
      };

      let response: any = this.Save_To_Watchlist_GET(data);
      /**AJIT : error handling */
      // error: function (response, textStatus, errorThrown) {
      //     var errorMessage = errorThrown;
      //     if (response.responseJSON != null) {
      //         errorMessage = response.responseJSON.message;
      //     }
      //     alert("Error occurred while saving order(s) in Watchlist, Please try again. " + errorMessage);
      // },

      if (response == 'error') {

      }
      else {
        if (response == 1) {
          // gridPONoList_watchlist.invalidate();
          this.reload_Watchlist();
          alert("Order(s) saved in watchlist successfully.");
        }
        else {
          alert("Error occurred while saving SO/SOR to watch list. " + response);
        }
      }
    }
    else {
      alert('No order(s) selected to save in watchlist.');
      return;
    }
  }
  reload_Watchlist() {
    this.WatchList_SO_Number = "";
    this.WatchList_SOR_Number = "";
    this.CurrPer = 0;
    //     startAjax_watchlist(100);
    //     $.ajax({
    //         url: "@Url.Action("reload_Watchlist")",
    //         type: "POST",
    //         headers: {
    //             "__RequestVerificationToken": $('input[name="__RequestVerificationToken"]', '@using (Html.BeginForm("reload_Watchlist", "OrderAmendment"))
    //                             {@Html.AntiForgeryToken()
    // } ').val()
    //             },

    let response: any = this.reload_Watchlist_POST();
    // async: true,
    //     timeout: 300000,
    //         contentType: "application/json; charset=utf-8",
    //             dataType: "json",

    if (response == 'error') {

    }
    /**JIT: error handling */
    // error: function (response, textStatus, errorThrown) {
    //     var errorMessage = errorThrown;
    //     if (response.responseJSON != null) {
    //         errorMessage = response.responseJSON.message;
    //     }
    //     alert("Please narrow down search criteria (Too many records): " + errorMessage);
    //     CompleteAjax();
    // },
    else {
      let PONoListdata_watchlist: any[] = [];
      if (response.length > 0) {
        for (var i = 0; i < response.length; i++) {
          PONoListdata_watchlist[i] = {
            SONo: response[i].SONo,
            SORNo: response[i].SORNo,
            Customer: response[i].Customer,
            STATUS: response[i].STATUS,
            EntryDate: response[i].EntryDate
          };
        }
        // gridPONoList_watchlist.setData(PONoListdata_watchlist);
        this.gridPONoList_watchlist = PONoListdata_watchlist;

        for (var i = 0; i < this.gridPONoList_watchlist.length; i++) {
          /**AIT: CSS Row color */
          // PONoListdata_watchlist.getItemMetadata = function (i) {
          //     if (PONoListdata_watchlist[i].STATUS == 'X') {
          //         return { "cssClasses": " highlightedGrayed" };
          //     }
          //     else if (PONoListdata_watchlist[i].OnHold == 'Y') {
          //         return { "cssClasses": " highlighted" };
          //     }
          // };
        }
        // gridPONoList_watchlist.render();
        // document.getElementById("divFields_watchlist").style.visibility = true;
        this.show_divFields_watchlist = true;
        // document.getElementById("btnDelete").disabled = false;
        this.disable_btnDelete = false;
        if (response.length == 0) {
          this.show_divFields_watchlist = false;
          // document.getElementById("divFields_watchlist").style.visibility = false;
        }
      } else {
        this.gridPONoList_watchlist = PONoListdata_watchlist;

        // gridPONoList_watchlist.setData(PONoListdata_watchlist);
        // gridPONoList_watchlist.render();
        this.show_divFields_watchlist = false;
        // document.getElementById("divFields_watchlist").style.visibility = false;
      }

    }
    return false;
  }



  async Watchlist_Search_GET(pData: any): Promise<any> {
    try {
      const data = await this.orderService.WatchlistSearch(pData.SONumber, pData.SORNumber).toPromise();
      return data
    } catch (error) {
      return { success: false, errorThrown: error }
    }
  }
  async Watchlist_Query_Result_GET(pData: any): Promise<any> {
    try {
      const data = await this.orderService.WatchlistQueryResult(pData.SORNumbers_to_amend).toPromise();
      return data
    } catch (error) {
      return { success: false, errorThrown: error }
    }
  }
  async Delete_From_Watchlist_GET(pData: any): Promise<any> {
    try {
      const data = await this.orderService.DeleteFromWatchlist(pData.SORNumbers_to_amend).toPromise();
      return data
    } catch (error) {
      return { success: false, errorThrown: error }
    }
  }
  async Save_To_Watchlist_GET(pData: any): Promise<any> {
    try {
      const data = await this.orderService.SaveToWatchlist(pData.SORNumbers_to_amend).toPromise();
      return data
    } catch (error) {
      return { success: false, errorThrown: error }
    }
  }
  async reload_Watchlist_POST(): Promise<any> {
    try {
      const data = await this.orderService.reloadWatchlist().toPromise();
      return data
    } catch (error) {
      return { success: false, errorThrown: error }
    }
  }
}
