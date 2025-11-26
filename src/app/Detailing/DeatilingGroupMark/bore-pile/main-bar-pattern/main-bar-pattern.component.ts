import { ChangeDetectorRef, Component, Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MainBarPatternPopUp } from 'src/app/Model/main_bar_pattern_popup';
import { BPCService } from '../../../MeshDetailing/bpc.service';
import { MainBarList } from 'src/app/Model/bore_pile_detailing_harcoded_value';

@Component({
  selector: 'app-main-bar-pattern',
  templateUrl: './main-bar-pattern.component.html',
  styleUrls: ['./main-bar-pattern.component.css']
})
export class MainBarPatternComponent {
  @Input() Insert_BPC_Structuremarking:any;
  @Input() ParameterValues:any
  @Input() commonPopupModel:any;
  ddlPattern!:any;
  mainBarList:any;
  trMainBarImage!:any;
  objToSend!:MainBarPatternPopUp[];
  singleLinkList!:any;
  doubleLinkList!:any;
  layerList!:any;
  SizeList:any
  MAINBARPATTERN_list: any;
  SIZETYPES_list: any;
  constructor(public activeModal: NgbActiveModal,
    private BPCService:BPCService,private changeDetectorRef: ChangeDetectorRef) { }
  ngOnInit() {
    this.layerList = [
      {label:1,value:1},
      {label:2,value:2}
    ]
    console.log("ParameterValues",this.ParameterValues);
    console.log("Insert_BPC_Structuremarking",this.Insert_BPC_Structuremarking)
    this.ddlPattern = this.Insert_BPC_Structuremarking?.vchMainBarPattern;
    this.singleLinkList = this.commonPopupModel.SingleLayerMB;
    this.doubleLinkList = this.commonPopupModel.DoubleLayerMB;
    if(this.ddlPattern)
     this.checkNewTableContentents(this.ddlPattern);
    this.Load_GetBorePilePopulateMethods("MAINBARPATTERN",this.ParameterValues.sitProductTypel2Id," A");
    this.Load_GetBorePilePopulateMethods("SIZETYPES",0," A");
    this.loadDefaultValuesIfExists();
    this.trMainBarImage =  '../../../../../assets/images/BPC/MainBarPattern/'+ this.ddlPattern +'.PNG'
  }
  loadDefaultValuesIfExists() {
    let mbList = [];
    debugger;
    if(this.Insert_BPC_Structuremarking.intStructureMarkId && this.Insert_BPC_Structuremarking.vchTactonConfigurationState !=''){
     let tactonEditData = this.Insert_BPC_Structuremarking.vchTactonConfigurationState;
     mbList = tactonEditData.mainBarList;
     this.populateModalData(mbList);
    }else if(localStorage.getItem('MainBarList')){
      mbList = JSON.parse(localStorage.getItem('MainBarList')!)
      this.populateModalData(mbList);
    }
  }
  populateModalData(data:any){
    data.forEach((mbobj:any,index:number)=>{
      this.objToSend[index].size = mbobj.main_bar_part_grade_field +''+ mbobj.main_bar_part_dia_field;
      this.objToSend[index].txtQuantity = mbobj.main_bar_part_quantity_field;
      this.objToSend[index].txtLength = mbobj.main_bar_part_length_field;
      this.objToSend[index].hdnLayer = mbobj.main_bar_part_layer_field;
    });
  }
  dismissModal() {
    this.activeModal.dismiss("User closed modal!");
    // vchMainBarDia
    // vchLinkDia
    // vchLinkPitch
  }
  applyData() {
    debugger;
    let array:MainBarList[]  = [];
    this.objToSend.forEach((obj:any)=>{
      console.log("obj.size=>",obj.size)
      let match:any = obj.size.match(/^([A-Za-z]+)(\d+)$/);
      let obj1:MainBarList = {
        main_bar_part_grade_field : match[1],
        main_bar_part_dia_field : match[2],
        main_bar_part_quantity_field : obj.txtQuantity,
        main_bar_part_length_field : obj.txtLength,
        main_bar_part_layer_field : obj.hdnLayer,
      } ;
      array.push(obj1);
    })
    this.Insert_BPC_Structuremarking.intSmallerMainBarLength = this.objToSend.reduce((prev:any, current:any) => {
      return (parseInt(prev.txtLength) < parseInt(current.txtLength)) ? prev.txtLength : current.txtLength;
    });
    console.log("applyData=>",array,this.Insert_BPC_Structuremarking);
    if(this.Insert_BPC_Structuremarking?.intStructureMarkId){
      this.Insert_BPC_Structuremarking.vchTactonConfigurationState.mainBarList = array;
    }else{
      localStorage.setItem('MainBarList',JSON.stringify(array));
    }
    this.Insert_BPC_Structuremarking.vchMainBarDia = this.objToSend[0].size;
    this.passValues_Insert()
    this.changeDetectorRef.detectChanges();
    this.activeModal.close(array);
  }
  changeImageSrc(){
    this.Insert_BPC_Structuremarking.vchMainBarPattern = this.ddlPattern  ;
    this.trMainBarImage =  '../../../../../assets/images/BPC/MainBarPattern/'+ this.ddlPattern +'.PNG'

  }
  Load_GetBorePilePopulateMethods(strType:any,intProductL2Id:any,strMainBarCode :any)
  {
    this.BPCService.GetBorePilePopulateMethods(strType,intProductL2Id,strMainBarCode)
    .subscribe({
      next: (response) => {
        debugger;

       if(strType=="MAINBARPATTERN")
        {
          this.MAINBARPATTERN_list = response;
          console.log("MAINBARPATTERN ",this.MAINBARPATTERN_list);
        }
        if(strType=="SIZETYPES")
        {
          this.SIZETYPES_list = response;
          console.log("MAINBARPATTERN ",this.MAINBARPATTERN_list);
        }
      },
      error: (e) => {

      },
      complete: () => {
        // if(this.doubleLinkList.includes(this.ddlPattern)){
        //   this.objToSend[0].size=this.SIZETYPES_list[0].vchSizeTypes;
        //   this.objToSend[1].size=this.SIZETYPES_list[0].vchSizeTypes;
        // }else{
        //   this.objToSend[0].size=this.SIZETYPES_list[0].vchSizeTypes;
        // }
      },
    });
  }
  checkNewTableContentents(event:any){
    console.log("event=>",event,this.doubleLinkList);
    if(this.doubleLinkList.includes(event)){
      this.objToSend = [
        {
          ddlMainBar:'',
          txtLength:'',
          txtQuantity:'',
          hdnLayer:1,
          size:'D10'
        },
        {
          ddlMainBar:'',
          txtLength:'',
          txtQuantity:'',
          hdnLayer:1,
          size:'D10'
        }
      ]
    }else{
      this.objToSend = [
        {
          ddlMainBar:'',
          txtLength:'',
          txtQuantity:'',
          hdnLayer:1,
          size:'D10'
        }
      ]
    }
  }

   passValues_Insert():any {

    var hdngridcount = document.getElementById('<%= me.hdngridcount.ClientId %>');
    var ddlPattern = document.getElementById('<%= me.ddlPattern.ClientId %>');
    var hdngridcount = document.getElementById('<%= me.hdngridcount.ClientId %>');


    var fabricationtype = this.Insert_BPC_Structuremarking.vchFabricationType;
    //get main bar dia field


      var mainBarLen1 = 0;
      var mainBarLen2 = 0;
      var mainBarLength = 0;
      //onchange if schnell machine it should check once more

      var strMainBarDia = this.Insert_BPC_Structuremarking.vchMainBarDia;


        var length = "";
        var mbLen = "";
        var MainBarNo = this.Insert_BPC_Structuremarking.tntNumOfMainBar
        var noofmainbar = 0;
        var count = 0;
        var mbcount = 0;
        var startLength =this.Insert_BPC_Structuremarking.intLapLength
        var endLength = this.Insert_BPC_Structuremarking.intEndLength
        if (fabricationtype == 'Manual') {
          var minMainBarLength = Number(startLength) + Number(endLength);
        }
        else {
          var minMainBarLength = Number(startLength) + Number(endLength) + 1500;
        }
        this.objToSend.forEach(element => {

            if (element.txtLength== '') {
              alert('Please enter length value.');
              return ;
            }
            if (Number(element.txtLength) > 14000) {
              alert('Length value must less than 14000.');
              return ;
            }
            if (Number(element.txtLength) > 12000) {
              var highMWAlert = confirm('Main wire length is more than 12000. Do you like to continue ?');
              if (highMWAlert == false) {
                return ;
              }
            }

            if (mbcount == 0) {
              mainBarLen1 = Number(element.txtLength);
              //for layer 1 min length value validation
              if (fabricationtype == 'Micro Pile') {

                if (Number(element.txtLength) < 1000) {

                  alert('Length can not be less than 1000 for micropile.\nPlease change Lap length or End Length for having a smaller main bar length.');
                  return ;
                }
              }
              else {

                if (Number(element.txtLength) < Number(minMainBarLength)) {
                  alert('Length can not be less than ' + minMainBarLength + '.\nPlease change Lap length or End Length for having a smaller main bar length.');
                  return ;
                }
              }
            }
            if (mbcount == 1) {
              mainBarLen2 = Number(element.txtLength);
            }

            //set max length for cage length field
            var cage = this.Insert_BPC_Structuremarking.numCageLength
            if (length != "") {
              var maxcagelength = Math.max(Number(element.txtLength), Number(length));
              this.Insert_BPC_Structuremarking.numCageLength=maxcagelength
                 }
            else {
              this.Insert_BPC_Structuremarking.numCageLength = Number(element.txtLength)
            }
            length = element.txtLength;
            mbcount++;



            if (element.txtQuantity == '') {
              alert('Please enter Quantity value.');
              return ;
            }
            if (Number(element.txtQuantity) == 0) {
              alert('Quantity value can not be 0.');
              return ;
            }
            if (Number(element.txtQuantity) != 0 && element.txtQuantity != '') {
              noofmainbar = Number(noofmainbar) + Number(element.txtQuantity);
              if (Number(noofmainbar) > 100) {
                alert('No of main bars can not be more than 100 !');
                return ;
              }
              else {
                this.Insert_BPC_Structuremarking.tntNumOfMainBar = noofmainbar;
              }
            }



        });




        // var Inputs = TargetBaseControl.getElementsByTagName("select");
        var size = "";
        var x = 0;




        // for (var n = 0; n < Inputs.length; ++n) {
        //   if (Inputs[n].type == 'select-one' && Inputs[n].id.indexOf("ddlMainBar", 0) >= 0) {
        //     if (Number(hdngridcount.value) > 1) {
        //       if (x == 0) {
        //         strMainBarDia.value = Inputs[n].options[Inputs[n].selectedIndex].text;
        //       }
        //       x++;

        //     }
        //     else {
        //       strMainBarDia.value = Inputs[n].options[Inputs[n].selectedIndex].text;
        //       if (strMainBarDia.value.length == 2)
        //         strMainBarDia.value = '0' + strMainBarDia.value;

        //     }

        //   }
        //   if (Inputs[n].id.indexOf("ddlLayer", 0) >= 0) {
        //     if (Number(hdngridcount.value) > 1) {
        //       if (count == 0) {
        //         if (Inputs[n].options[Inputs[n].selectedIndex].text == '2') {
        //           alert('First bar should be layer one.');
        //           return false;
        //         }
        //         else {
        //           mainBarLength = mainBarLen1;
        //         }
        //       }
        //       else {
        //         if (Inputs[n].options[Inputs[n].selectedIndex].text == '1') {
        //           if (Number(mainBarLen2) < Number(minMainBarLength)) {
        //             alert('Length can not be less than ' + minMainBarLength + '.\nPlease change Lap length or End Length for having a smaller main bar length.');

        //             return false;
        //           }
        //         }

        //         if (Inputs[n].options[Inputs[n].selectedIndex].text == '1') {
        //           if (Number(mainBarLen1) > Number(mainBarLen2)) {
        //             mainBarLength = mainBarLen1;
        //           }
        //           else {
        //             mainBarLength = mainBarLen2;
        //           }
        //         }
        //       }
        //       if (size != "") {
        //         if ((Inputs[n].options[Inputs[n].selectedIndex].text == size) && (Inputs[n].options[Inputs[n].selectedIndex].text == '2')) {
        //           alert('Both bars can not be second layer.');
        //           return false;
        //         }
        //       }
        //       size = Inputs[n].options[Inputs[n].selectedIndex].text;
        //       count++;
        //     }
        //     else {
        //       mainBarLength = mainBarLen1;
        //       if (Inputs[n].options[Inputs[n].selectedIndex].text == '2') {
        //         alert('Single bar can not be second layer.');
        //         return false;
        //       }
        //     }

        //   }
        // }

        // set max length for mainbar length field

        var mblength = this.Insert_BPC_Structuremarking.tntNumOfMainBar;
        // if (mblength != '') {
        //   window.opener.document.getElementById(mblength).value = mainBarLength;
        // }

      // if (strMainBarDia != '') {

      //   var length = "";
      //   var mbLen = "";
      //   var MainBarNo = this.Insert_BPC_Structuremarking.tntNumOfMainBar
      //   var noofmainbar = 0;
      //   var count = 0;
      //   var mbcount = 0;
      //   var startLength =this.Insert_BPC_Structuremarking.intLapLength
      //   var endLength = this.Insert_BPC_Structuremarking.intEndLength
      //   if (fabricationtype == 'Manual') {
      //     var minMainBarLength = Number(startLength) + Number(endLength);
      //   }
      //   else {
      //     var minMainBarLength = Number(startLength) + Number(endLength) + 1500;
      //   }
      //   this.objToSend.forEach(element => {

      //       if (element.txtLength== '') {
      //         alert('Please enter length value.');
      //         return ;
      //       }
      //       if (Number(element.txtLength) > 14000) {
      //         alert('Length value must less than 14000.');
      //         return ;
      //       }
      //       if (Number(element.txtLength) > 12000) {
      //         var highMWAlert = confirm('Main wire length is more than 12000. Do you like to continue ?');
      //         if (highMWAlert == false) {
      //           return ;
      //         }
      //       }

      //       if (mbcount == 0) {
      //         mainBarLen1 = Number(element.txtLength);
      //         //for layer 1 min length value validation
      //         if (fabricationtype == 'Micro Pile') {

      //           if (Number(element.txtLength) < 1000) {

      //             alert('Length can not be less than 1000 for micropile.\nPlease change Lap length or End Length for having a smaller main bar length.');
      //             return ;
      //           }
      //         }
      //         else {

      //           if (Number(element.txtLength) < Number(minMainBarLength)) {
      //             alert('Length can not be less than ' + minMainBarLength + '.\nPlease change Lap length or End Length for having a smaller main bar length.');
      //             return ;
      //           }
      //         }
      //       }
      //       if (mbcount == 1) {
      //         mainBarLen2 = Number(element.txtLength);
      //       }

      //       //set max length for cage length field
      //       var cage = this.Insert_BPC_Structuremarking.numCageLength
      //       if (length != "") {
      //         var maxcagelength = Math.max(Number(element.txtLength), Number(length));
      //         this.Insert_BPC_Structuremarking.numCageLength=maxcagelength
      //            }
      //       else {
      //         this.Insert_BPC_Structuremarking.numCageLength = Number(element.txtLength)
      //       }
      //       length = element.txtLength;
      //       mbcount++;



      //       if (element.txtQuantity == '') {
      //         alert('Please enter Quantity value.');
      //         return ;
      //       }
      //       if (Number(element.txtQuantity) == 0) {
      //         alert('Quantity value can not be 0.');
      //         return ;
      //       }
      //       if (Number(element.txtQuantity) != 0 && element.txtQuantity != '') {
      //         noofmainbar = Number(noofmainbar) + Number(element.txtQuantity);
      //         if (Number(noofmainbar) > 100) {
      //           alert('No of main bars can not be more than 100 !');
      //           return ;
      //         }
      //         else {
      //           this.Insert_BPC_Structuremarking.tntNumOfMainBar = noofmainbar;
      //         }
      //       }



      //   });




      //   // var Inputs = TargetBaseControl.getElementsByTagName("select");
      //   var size = "";
      //   var x = 0;




      //   // for (var n = 0; n < Inputs.length; ++n) {
      //   //   if (Inputs[n].type == 'select-one' && Inputs[n].id.indexOf("ddlMainBar", 0) >= 0) {
      //   //     if (Number(hdngridcount.value) > 1) {
      //   //       if (x == 0) {
      //   //         strMainBarDia.value = Inputs[n].options[Inputs[n].selectedIndex].text;
      //   //       }
      //   //       x++;

      //   //     }
      //   //     else {
      //   //       strMainBarDia.value = Inputs[n].options[Inputs[n].selectedIndex].text;
      //   //       if (strMainBarDia.value.length == 2)
      //   //         strMainBarDia.value = '0' + strMainBarDia.value;

      //   //     }

      //   //   }
      //   //   if (Inputs[n].id.indexOf("ddlLayer", 0) >= 0) {
      //   //     if (Number(hdngridcount.value) > 1) {
      //   //       if (count == 0) {
      //   //         if (Inputs[n].options[Inputs[n].selectedIndex].text == '2') {
      //   //           alert('First bar should be layer one.');
      //   //           return false;
      //   //         }
      //   //         else {
      //   //           mainBarLength = mainBarLen1;
      //   //         }
      //   //       }
      //   //       else {
      //   //         if (Inputs[n].options[Inputs[n].selectedIndex].text == '1') {
      //   //           if (Number(mainBarLen2) < Number(minMainBarLength)) {
      //   //             alert('Length can not be less than ' + minMainBarLength + '.\nPlease change Lap length or End Length for having a smaller main bar length.');

      //   //             return false;
      //   //           }
      //   //         }

      //   //         if (Inputs[n].options[Inputs[n].selectedIndex].text == '1') {
      //   //           if (Number(mainBarLen1) > Number(mainBarLen2)) {
      //   //             mainBarLength = mainBarLen1;
      //   //           }
      //   //           else {
      //   //             mainBarLength = mainBarLen2;
      //   //           }
      //   //         }
      //   //       }
      //   //       if (size != "") {
      //   //         if ((Inputs[n].options[Inputs[n].selectedIndex].text == size) && (Inputs[n].options[Inputs[n].selectedIndex].text == '2')) {
      //   //           alert('Both bars can not be second layer.');
      //   //           return false;
      //   //         }
      //   //       }
      //   //       size = Inputs[n].options[Inputs[n].selectedIndex].text;
      //   //       count++;
      //   //     }
      //   //     else {
      //   //       mainBarLength = mainBarLen1;
      //   //       if (Inputs[n].options[Inputs[n].selectedIndex].text == '2') {
      //   //         alert('Single bar can not be second layer.');
      //   //         return false;
      //   //       }
      //   //     }

      //   //   }
      //   // }

      //   // set max length for mainbar length field
      //   var mblength = this.Insert_BPC_Structuremarking.tntNumOfMainBar;
      //   // if (mblength != '') {
      //   //   window.opener.document.getElementById(mblength).value = mainBarLength;
      //   // }
      // }

    //get link dia & link pitch

     var fabricationtype = this.Insert_BPC_Structuremarking.vchFabricationType;

    //alert(fabricationtype);

      //get link pitch
      // var hdnLinkPitch = document.getElementById('hdnLinkPitch').value;
      // //get mainbarlength
      // var mainBarLen = document.getElementById('hdnMainBarLength').value;

      // var hdnLinkPitch
      // //get mainbarlength
      // var mainBarLen

      // //get spiral link length
      // var defaultSpiralLength

      var hdnLinkPitch
      //get mainbarlength
      var mainBarLen

      var hdnLinkPitch
      //get mainbarlength
      var mainBarLen

      //get spiral link length
      var defaultSpiralLength
    //commented by Tanmay
      // if (!mainBarLen) {
      //   alert('Please select main bar length by clicking the V link under main bar pattern.')
      //   return ;
      // }

      let spiralLinkListJson:any = [];
      var spiralLinkList:any  = [];

       if(localStorage.getItem("ElevationList")){
        spiralLinkListJson=localStorage.getItem("ElevationList");
        spiralLinkList  = JSON.parse(spiralLinkListJson);
       }
       if(this.Insert_BPC_Structuremarking.intStructureMarkId && this.Insert_BPC_Structuremarking.vchTactonConfigurationState !=''){
        spiralLinkListJson=this.Insert_BPC_Structuremarking.vchTactonConfigurationState;
        spiralLinkList  = spiralLinkListJson.elevationList;
       }

      var laplen =this.Insert_BPC_Structuremarking.intLapLength
      var endlen = this.Insert_BPC_Structuremarking.intEndLength

      var laplength = this.Insert_BPC_Structuremarking.intLapLength
      var endlength = this.Insert_BPC_Structuremarking.intEndLength
      var Count = 0;
      var totalElevationLength = 0;
      // var strLinkDia = document.getElementById('hdnLinkDia').value;

      // if (strLinkDia != '') {
      //   strLinkDia = window.opener.document.getElementById(strLinkDia);
      //   var Inputs = TargetBaseControl.getElementsByTagName("select");
      //   var size = "";
      //   for (var n = 0; n < Inputs.length; ++n) {
      //     if (Inputs[n].type == 'select-one' && Inputs[n].id.indexOf("ddlElevation", 0) >= 0) {
      //       strLinkDia.value = Inputs[n].options[Inputs[n].selectedIndex].text;
      //       if (strLinkDia.value.length == 2) {
      //         strLinkDia.value = '0' + strLinkDia.value;
      //       }
      //     }
      //   }
      // }


        var LinkPitch;
        if(spiralLinkList.length>0)
        {
        spiralLinkList.forEach((element: any):void => {
        if(element.spiral_link_part_pitch_field==0)
        {
          alert('Please enter pitch value.');
          return ;

          }
          else   if(element.spiral_link_part_length_field==0)
          {
            alert('Please enter length value.');
            return ;
          }
          if (fabricationtype == 'Manual')
          { }
          else {
            if (element.spiral_link_part_length_field < 500 || element.spiral_link_part_length_field > 14000) {
              alert('Length value must be > 500 and < 14000.');
              return ;
            }

          }
          totalElevationLength = Number(totalElevationLength) + Number(element.spiral_link_part_length_field);
        });
      }
        //end of loop
        //setting elevation length
        var spiralLength = totalElevationLength;
        // if (spiralLength != '') {
        //   window.opener.document.getElementById(spiralLength).value = totalElevationLength;
        // }
        // var sumOfLength = Number(totalElevationLength) + Number(laplength) + Number(endlength);
        // if (sumOfLength != mainBarLen) {
        //   var difference = Number(sumOfLength) - Number(mainBarLen);
        //   alert('Sum of Lap length, End length and Elevation length is not equal to Main Bar Length. \nThe difference is ' + difference + '. Please change lap length nad end length.');
        //   return false;
        // }
      //end hdnLinkPitch !=0
      return true;
  }

}
