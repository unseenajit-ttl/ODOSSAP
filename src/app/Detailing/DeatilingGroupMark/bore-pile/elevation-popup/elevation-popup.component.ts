import { ChangeDetectorRef, Component ,Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ElevationPopUp } from 'src/app/Model/elevation_pop_up';
import { MainBarPatternPopUp } from 'src/app/Model/main_bar_pattern_popup';
import { BPCService } from '../../../MeshDetailing/bpc.service';
import { ElevationList } from 'src/app/Model/bore_pile_detailing_harcoded_value';

@Component({
  selector: 'app-elevation-popup',
  templateUrl: './elevation-popup.component.html',
  styleUrls: ['./elevation-popup.component.css']
})
export class ElevationPopupComponent {
  @Input() Insert_BPC_Structuremarking:any;
  @Input() ParameterValues:any
  @Input() commonPopupModel:any;
  cageLenth = 0;
  ddlPattern!:any;
  mainBarList:any;
  trMainBarImage!:string;
  objToSend!:ElevationPopUp[];
  layerList!:any;
  SIZETYPES_list: any;
  ELEVATIONPATTERN_list: any;
  singleLinkList: any;
  doubleLinkList: any;
  constructor(public activeModal: NgbActiveModal,
    private BPCService:BPCService,private changeDetectorRef: ChangeDetectorRef) { }
  ngOnInit() {
    this.layerList = [
      {label:1,value:1},
      {label:2,value:2}
    ]

    this.ddlPattern = this.Insert_BPC_Structuremarking?.vchElevationPattern;
    this.cageLenth = parseInt(this.Insert_BPC_Structuremarking?.numCageLength ) - (parseInt(this.Insert_BPC_Structuremarking?.intLapLength) + parseInt(this.Insert_BPC_Structuremarking?.intEndLength));
    this.singleLinkList = this.commonPopupModel.SingleLink;
    this.doubleLinkList = this.commonPopupModel.DoubleLink;

    this.checkNewTableContentents(this.ddlPattern);
    this.Load_GetBorePilePopulateMethods("ELEVATIONPATTERN",this.ParameterValues.sitProductTypel2Id,this.Insert_BPC_Structuremarking.vchMainBarPattern);
    this.Load_GetBorePilePopulateMethods("SIZETYPES",0," A");
    this.loadDefaultValuesIfExists();
    this.trMainBarImage =  '../../../../../assets/images/BPC/ElevationPattern/'+ this.ddlPattern +'.PNG'
    // this.ddlPattern = 'SLC23';
  }
  dismissModal() {
    this.activeModal.dismiss("User closed modal!");
  }
  applyData() {

   this.Insert_BPC_Structuremarking.vchElevationPattern =this.ddlPattern;
    let array:ElevationList[]  = [];
    this.objToSend.forEach((obj:any)=>{
      console.log("obj.size=>",obj.ddlElevation)
      let match:any = obj.ddlElevation.match(/^([A-Za-z]+)(\d+)$/);
      let obj1:ElevationList = {
        spiral_link_part_grade_field: match[1],
        spiral_link_part_dia_field : match[2],
        spiral_link_part_pitch_field : obj.txtPitch,
        spiral_link_part_length_field : obj.txtLength,
      } ;
      array.push(obj1);
    })
    if(this.Insert_BPC_Structuremarking?.intStructureMarkId){
      this.Insert_BPC_Structuremarking.vchTactonConfigurationState.elevationList = array;
    }else{
      localStorage.setItem('ElevationList',JSON.stringify(array));
    }
    this.Insert_BPC_Structuremarking.vchLinkPitch = this.objToSend[0].txtPitch;
    this.Insert_BPC_Structuremarking.vchLinkDia = this.objToSend[0].ddlElevation;
    this.passValues_Insert()
    this.changeDetectorRef.detectChanges();
    this.activeModal.close(this.objToSend);
  }
  loadDefaultValuesIfExists() {
    let mbList = [];
    if(this.Insert_BPC_Structuremarking.intStructureMarkId && this.Insert_BPC_Structuremarking.vchTactonConfigurationState !=''){
     let tactonEditData = this.Insert_BPC_Structuremarking.vchTactonConfigurationState;
     mbList = tactonEditData.elevationList;
     this.populateModalData(mbList);
    }else if(localStorage.getItem('ElevationList')){
      mbList = JSON.parse(localStorage.getItem('ElevationList')!)
      this.populateModalData(mbList);
    }
  }
  populateModalData(data:any){
    data.forEach((mbobj:any,index:number)=>{
      this.objToSend[index].ddlElevation = mbobj.spiral_link_part_grade_field +''+ mbobj.spiral_link_part_dia_field;
      this.objToSend[index].txtPitch = mbobj.spiral_link_part_pitch_field;
      this.objToSend[index].txtLength = mbobj.spiral_link_part_length_field;
    });
  }
  changeImageSrc(){
    this.trMainBarImage =  '../../../../../assets/images/BPC/ElevationPattern/'+ this.ddlPattern +'.PNG'
  }
  checkNewTableContentents(event:any){
    console.log("event=>",event,this.doubleLinkList);
    if(this.doubleLinkList.includes(event)){
      this.objToSend = [
        {
          ddlElevation : "D10",
          txtLength : this.cageLenth/2,
          txtPitch : ''
        },
        {
          ddlElevation : "D10",
          txtLength : this.cageLenth/2,
          txtPitch : ''
        }
      ]
    }else{
      this.objToSend = [
        {
          ddlElevation :"D10",
          txtLength : this.cageLenth,
          txtPitch : ''
        }
      ]
    }
  }
  Load_GetBorePilePopulateMethods(strType:any,intProductL2Id:any,strMainBarCode :any)
  {
    this.BPCService.GetBorePilePopulateMethods(strType,intProductL2Id,strMainBarCode)
    .subscribe({
      next: (response) => {
        debugger;

         if(strType=="ELEVATIONPATTERN")
        {
          this.ELEVATIONPATTERN_list = response;
          console.log("ELEVATIONPATTERN",this.ELEVATIONPATTERN_list);
        }
        if(strType=="SIZETYPES")
        {
          this.SIZETYPES_list = response;
        }
      },
      error: (e) => {

      },
      complete: () => {
        // if(this.doubleLinkList.includes(this.ddlPattern)){
        //   this.objToSend[0].ddlElevation=this.SIZETYPES_list[0].vchSizeTypes;
        //   this.objToSend[1].ddlElevation=this.SIZETYPES_list[0].vchSizeTypes;
        // }else{
        //   this.objToSend[0].ddlElevation=this.SIZETYPES_list[0].vchSizeTypes;
        // }
      },
    });
  }

  passValues_Insert():any {



    var fabricationtype = this.Insert_BPC_Structuremarking.vchFabricationType;
    //get main bar dia field
    var TargetBaseControl = document.getElementById('<%= me.gvMainBarSize.ClientId %>')


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

      let mainBarListJson:any=[];
      let mainBarList_:any = [];

       if(localStorage.getItem("MainBarList")){
        mainBarListJson=localStorage.getItem("MainBarList");
        mainBarList_  = JSON.parse(mainBarListJson);
       }
       if(this.Insert_BPC_Structuremarking.intStructureMarkId && this.Insert_BPC_Structuremarking.vchTactonConfigurationState !=''){
        mainBarListJson=this.Insert_BPC_Structuremarking.vchTactonConfigurationState;
        mainBarList_  = mainBarListJson.mainBarList;
       }



        mainBarList_.forEach((element:any) => {

            if (element.main_bar_part_length_field== 0) {
              alert('Please enter length value.');
              return ;
            }
            if (Number(element.main_bar_part_length_field) > 14000) {
              alert('Length value must less than 14000.');
              return ;
            }
            if (Number(element.main_bar_part_length_field) > 12000) {
              var highMWAlert = confirm('Main wire length is more than 12000. Do you like to continue ?');
              if (highMWAlert == false) {
                return ;
              }
            }

            if (mbcount == 0) {
              mainBarLen1 = Number(element.main_bar_part_length_field);
              //for layer 1 min length value validation
              if (fabricationtype == 'Micro Pile') {

                if (Number(element.main_bar_part_length_field) < 1000) {

                  alert('Length can not be less than 1000 for micropile.\nPlease change Lap length or End Length for having a smaller main bar length.');
                  return ;
                }
              }
              else {

                if (Number(element.main_bar_part_length_field) < Number(minMainBarLength)) {
                  alert('Length can not be less than ' + minMainBarLength + '.\nPlease change Lap length or End Length for having a smaller main bar length.');
                  return ;
                }
              }
            }
            if (mbcount == 1) {
              mainBarLen2 = Number(element.main_bar_part_length_field);
            }
            debugger;
            //set max length for cage length field
            var cage = this.Insert_BPC_Structuremarking.numCageLength
            if (length != "") {
              var maxcagelength = Math.max(Number(element.main_bar_part_length_field), Number(length));
              this.Insert_BPC_Structuremarking.numCageLength=maxcagelength
                 }
            else {
              this.Insert_BPC_Structuremarking.numCageLength = Number(element.main_bar_part_length_field)
            }
            length = element.main_bar_part_length_field;
            mbcount++;




            if (Number(element.main_bar_part_quantity_field) == 0) {
              alert('Quantity value can not be 0.');
              return ;
            }
            if (Number(element.main_bar_part_quantity_field) != 0 && element.main_bar_part_quantity_field != '') {
              noofmainbar = Number(noofmainbar) + Number(element.main_bar_part_quantity_field);
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
      //   var Inputs = TargetBaseControl.getElementsByTagName("input");
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

      //   let mainBarListJson=localStorage.getItem("MainBarList");



      //  let mainBarList_  = JSON.parse(mainBarListJson);



      //   mainBarList_.forEach((element:any) => {

      //       if (element.main_bar_part_length_field== 0) {
      //         alert('Please enter length value.');
      //         return ;
      //       }
      //       if (Number(element.main_bar_part_length_field) > 14000) {
      //         alert('Length value must less than 14000.');
      //         return ;
      //       }
      //       if (Number(element.main_bar_part_length_field) > 12000) {
      //         var highMWAlert = confirm('Main wire length is more than 12000. Do you like to continue ?');
      //         if (highMWAlert == false) {
      //           return ;
      //         }
      //       }

      //       if (mbcount == 0) {
      //         mainBarLen1 = Number(element.main_bar_part_length_field);
      //         //for layer 1 min length value validation
      //         if (fabricationtype == 'Micro Pile') {

      //           if (Number(element.main_bar_part_length_field) < 1000) {

      //             alert('Length can not be less than 1000 for micropile.\nPlease change Lap length or End Length for having a smaller main bar length.');
      //             return ;
      //           }
      //         }
      //         else {

      //           if (Number(element.main_bar_part_length_field) < Number(minMainBarLength)) {
      //             alert('Length can not be less than ' + minMainBarLength + '.\nPlease change Lap length or End Length for having a smaller main bar length.');
      //             return ;
      //           }
      //         }
      //       }
      //       if (mbcount == 1) {
      //         mainBarLen2 = Number(element.main_bar_part_length_field);
      //       }

      //       //set max length for cage length field
      //       var cage = this.Insert_BPC_Structuremarking.numCageLength
      //       if (length != "") {
      //         var maxcagelength = Math.max(Number(element.main_bar_part_length_field), Number(length));
      //         this.Insert_BPC_Structuremarking.numCageLength=maxcagelength
      //            }
      //       else {
      //         this.Insert_BPC_Structuremarking.numCageLength = Number(element.main_bar_part_length_field)
      //       }
      //       length = element.main_bar_part_length_field;
      //       mbcount++;




      //       if (Number(element.main_bar_part_quantity_field) == 0) {
      //         alert('Quantity value can not be 0.');
      //         return ;
      //       }
      //       if (Number(element.main_bar_part_quantity_field) != 0 && element.main_bar_part_quantity_field != '') {
      //         noofmainbar = Number(noofmainbar) + Number(element.main_bar_part_quantity_field);
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
      //get mainbarlength
      var mainBarLen = this.cageLenth

      // if (mainBarLen == '') {
      //   alert('Please select main bar length by clicking the V link under main bar pattern.')
      //   return false;
      // }
      debugger;
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


        spiralLinkList.forEach((element: any) => {
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
