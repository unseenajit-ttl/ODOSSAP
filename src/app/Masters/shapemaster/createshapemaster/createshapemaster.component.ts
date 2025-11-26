import { Component, Input, ElementRef, VERSION, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import SignaturePad from 'signature_pad';
import { ShapeMasterService } from '../../Services/shape-master.service';
import { ToastrService } from 'ngx-toastr';
import { EqualStencilFunc } from 'three';
import * as fs from 'fs';
import * as path from 'path';
import { im } from 'mathjs';



@Component({
  selector: 'app-createshapemaster',
  templateUrl: './createshapemaster.component.html',
  styleUrls: ['./createshapemaster.component.css']

})
export class CreateshapemasterComponent implements OnInit {
  createshapemasterForm!: FormGroup;
  signPad: any;
  @ViewChild('signPadCanvas', { static: false }) signaturePadElement: any;
  signImage: any;

  @Input() name: any;
  @Input() formname: any;
  @Input() wbsitemdata: any;
  userProfile: any
  disableSubmit: boolean = false
  iConfirm: boolean = false
  selectedItems = [];
  dropdownSettings = {};
  MOCOList: any = [];
  BendTypeList: any = [];
  Status: any = [];
  isOHindicatior: boolean = false;

  loading: boolean = false;

  selected_Shape: any;
  selected_MO: any;
  selected_Meshshapegroup: any;
  selectedNoOfBend: any;
  selectedbendinggroup: any;
  selectedmwbending: any;
  selectedcwbending: any;
  selectedsegmentno: any;
  selectedparameterno: any;
  selectedcutno: any;
  selectedbendingtype: any;
  selectedstatus: any;
  selectedtcxFilepath: any;
  selectedrollno: any;
  selectedfupImage: any;
  selectedtxtImage: any;
  selectedcwbvbs: any;
  selectedmwbvbs: any;
  selectedcreepdeductatco1: boolean = false;
  selectedcreepdeductatmo1: boolean = false;
  selectedohindicator: boolean = false;
  selectedbendindicator: boolean = false;
  selectedevenmo1: any;
  selectedevenmo2: any;
  selectedoddmo1: any;
  selectedoddmo2: any;
  selectedevenco1: any;
  selectedevenco2: any;
  selectedoddco1: any;
  selectedoddco2: any;

  addnewshape: AddNewShape[] = [
    {
      //ShapeId:'',
      ShapeDescription: '',
      MeshGroup: '',
      MOCO: '',
      NoOfBends: 0,
      BendingGroup: '',
      MWBendingGroup: '',
      CWBendingGroup: '',
      NoOfSegments: 0,
      NoOfParameters: 0,
      NoOfCuts: 0,
      Image: '',
      ImagePath: '',
      NoOfRoll: 0,
      ShapeType: '',
      BendIndicator: false,
      BendType: false,
      CreepMO1: false,
      CreepCO1: false,
      StatusId: 0,
      CWTemplate: '',
      MWTemplate: '',
      EvenMO1: 0,
      EvenMO2: 0,
      OddMO1: 0,
      OddMO2: 0,
      EvenCO1: 0,
      EvenCO2: 0,
      OddCO1: 0,
      OddCO2: 0,
      OHIndicator: false

    }];

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal, private formBuilder: FormBuilder, private shapemastersrvice: ShapeMasterService, private tosterService: ToastrService) { }

  ngOnInit(): void {

    this.GetStatusDetails();

    this.MOCOList = [
      { item_id: 1, item_text: 'M' },
      { item_id: 2, item_text: 'C' },
      { item_id: 3, item_text: 'B' },

    ];
    this.BendTypeList = [
      { item_id: 1, item_text: 'Normal' },
      { item_id: 0, item_text: 'Reverse' },

    ];

    this.createshapemasterForm = this.formBuilder.group({
      shapecode: ['', Validators.required],
      meshshapegroup: ['', Validators.required],
      moco: [''],
      noofbends: ['', Validators.required],
      bendinggroup: [''],
      mwbending: [''],
      cwbending: [''],
      segmentno: ['', Validators.required],
      parameterno: ['', Validators.required],
      cutno: ['', Validators.required],
      bendingtype: ['', Validators.required],
      status: ['', Validators.required],
      rollno: ['', Validators.required],
      tcxFilepath: [''],
      fupImage: [''],
      txtImage: [''],
      creepdeductatco1: [''],
      creepdeductatmo1: [''],
      ohindicator: [''],
      bendindicator: [''],
      cwbvbs: ['', Validators.required],
      mwbvbs: ['', Validators.required],
      evenmo1: ['', Validators.required],
      evenmo2: ['', Validators.required],
      oddmo1: ['', Validators.required],
      oddmo2: ['', Validators.required],
      evenco1: ['', Validators.required],
      evenco2: ['', Validators.required],
      oddco1: ['', Validators.required],
      oddco2: ['', Validators.required]

    });

  }


  GetStatusDetails() {
    debugger;

    this.shapemastersrvice.GetStatusDetails().subscribe({
      next: (response) => {
        this.Status = response;

      },
      error: (e) => {
      },
      complete: () => {

      },
    });
  }



  txtBoxValidation() {


    debugger;

    if (this.selected_Shape != null || this.selected_Shape != undefined) {
      if (this.selected_Meshshapegroup != null || this.selected_Meshshapegroup != undefined) {
        if (this.selected_MO != null || this.selected_MO != undefined) {
          if (this.selectedNoOfBend != null || this.selected_MO != undefined) {
            if (this.selectedsegmentno != null || this.selectedsegmentno != undefined) {
              if (this.selectedparameterno != null || this.selectedparameterno != undefined) {
                if (this.selectedcutno != null || this.selectedcutno != undefined) {
                  if (this.selectedrollno != null || this.selectedrollno != undefined) {
                    if (this.selectedbendingtype != null || this.selectedbendingtype != undefined) {
                      if (this.selectedstatus != null || this.selectedstatus != undefined) {
                        if (this.selectedcwbvbs != null || this.selectedcwbvbs != undefined) {
                          if (this.selectedmwbvbs != null || this.selectedmwbvbs != undefined) {
                            if (this.selectedohindicator == true) {
                              if (this.selectedevenmo1 != null || this.selectedevenmo1 != undefined) {
                                if (this.selectedevenmo2 != null || this.selectedevenmo2 != undefined) {
                                  if (this.selectedoddmo1 != null || this.selectedoddmo1 != undefined) {
                                    if (this.selectedoddmo2 != null || this.selectedoddmo2 != undefined) {
                                      if (this.selectedevenco1 != null || this.selectedevenco1 != undefined) {
                                        if (this.selectedevenco2 != null || this.selectedevenco2 != undefined) {
                                          if (this.selectedoddco1 != null || this.selectedoddco1 != undefined) {
                                            if (this.selectedoddco2 != null || this.selectedoddco2 != undefined) {
                                              this.AddNewShape();
                                              //this.AddNewShapeWithValidation();
                                              this.activeModal.close('submitted');

                                            }
                                            else {
                                              this.tosterService.warning("Odd CO2 cannot be empty")

                                            }

                                          }
                                          else {
                                            this.tosterService.warning("Odd CO1 cannot be empty")

                                          }

                                        }
                                        else {
                                          this.tosterService.warning("Even CO2 cannot be empty")

                                        }

                                      }
                                      else {
                                        this.tosterService.warning("Even CO1 cannot be empty")

                                      }

                                    }
                                    else {
                                      this.tosterService.warning("Odd MO2 cannot be empty")

                                    }

                                  }
                                  else {
                                    this.tosterService.warning("Odd MO1 cannot be empty")

                                  }

                                }
                                else {
                                  this.tosterService.warning("Even MO2 cannot be empty")

                                }

                              }
                              else {
                                this.tosterService.warning("Even MO1 cannot be empty")

                              }

                            }
                            else {
                              //call insert method
                              this.AddNewShape();
                              this.activeModal.close('submitted');
                              //this.AddNewShapeWithValidation();
                            }


                          }
                          else {
                            this.tosterService.warning("MW Template cannot be empty")

                          }

                        }
                        else {
                          this.tosterService.warning("CW Template cannot be empty")
                        }
                      }
                      else {
                        this.tosterService.error('Please select status');
                      }


                    }
                    else {
                      this.tosterService.warning("Please select the bend type")

                    }

                  }
                  else {
                    this.tosterService.warning("No of Roll cannot be empty")

                  }

                }
                else {
                  this.tosterService.error('No of Cut cannot be empty');
                }

              }
              else {
                this.tosterService.warning("No of Parameters cannot be empty ");

              }

            }
            else {
              this.tosterService.warning("Segments cannot be empty");

            }

          }
          else {
            this.tosterService.warning("No of Bends cannot be empty");

          }

        }
        else {
          this.tosterService.error('Please select the MO CO');

        }

      }
      else {
        this.tosterService.error('Please enter the ShapeGroup value');
      }
    }
    else {
      this.tosterService.error("Please enter Shape Code value")

    }

  }





  AddNewShape() {
    debugger;
    this.loading = true;
    this.shapemastersrvice.CheckShapeExists(this.selected_Shape).subscribe({
      next: (response) => {
        if (response.length > 0) {

          this.tosterService.error("Shape Code with same name already exists!");

        }
        else {

          const isvalidateBVBSInitial = this.validateBVBSInitial();

          if (!isvalidateBVBSInitial) {
            return;
          }
          else {

            if ((this.selectedtcxFilepath !== "" && this.selectedtcxFilepath !== undefined) && this.selected_Meshshapegroup.trim() != "") {
              let strFileType_tcx: string = '';

              const fileName = this.selectedtcxFilepath.split('\\').pop();
              strFileType_tcx = fileName.substring(fileName.lastIndexOf('.') + 1).trim();

              if (strFileType_tcx != 'tcx') {
                this.tosterService.error("Incorrect tcx file format. Please select file with .tcx entension only");
                return;
              }

              let strFileName_tcx: string = '';
              strFileName_tcx = fileName.substring(0, fileName.lastIndexOf('.')).trim();
              strFileName_tcx = strFileName_tcx.replace(/,/g, ' ');

              if (strFileName_tcx != this.selected_Meshshapegroup.toString()) {
                this.tosterService.warning("TCX file name should be same as Mesh Shape Group")
                return
              }

              let strSlabStructureTcxPath: string;
              let strdirPath_tcx: string;

              if (this.selected_Meshshapegroup.trim() == "PRODUCT_BEAM" || this.selected_Meshshapegroup.trim() == "Beam5M2B") {
                strSlabStructureTcxPath = 'D:/TCX_Files/BeamCage/Data';
                strdirPath_tcx = strSlabStructureTcxPath + strFileName_tcx + "." + strFileType_tcx

              }
              else if (this.selected_Meshshapegroup.trim() == "product_Column") {
                strSlabStructureTcxPath = 'D:/TCX_Files/ColumnCage/Data/'
                strdirPath_tcx = strSlabStructureTcxPath + strFileName_tcx + "." + strFileType_tcx
              }
              else {
                strSlabStructureTcxPath = "D:/TCX_Files/SlabWall/Data/"
                strdirPath_tcx = strSlabStructureTcxPath + strFileName_tcx + "." + strFileType_tcx
              }

              //constructing backup file path
              let ExistingAppPath: string = strSlabStructureTcxPath + "Backup\\"
              const now = new Date();
              const formattedDate = `${now.getDate()}_${now.toLocaleString('default', { month: 'long' })}_${now.getFullYear()}_${now.getHours()}_${now.getMinutes()}`;

              let strExsitingdirPath_tcx: string = ExistingAppPath + strFileName_tcx + "_" + formattedDate + "." + strFileType_tcx



              const obj: createpath = {
                Path: strSlabStructureTcxPath,
                strdirPath_tcx: strdirPath_tcx,
                strExsitingdirPath_tcx: strExsitingdirPath_tcx
              }
              this.shapemastersrvice.CheckandCreateDirectory(obj).subscribe({
                next: (response) => {
                  debugger

                  console.log("Directory Response")

                  this.shapemastersrvice.movefiletoBackup(obj).subscribe({
                    next: (response) => {
                      debugger
                      console.log("Directory Response")

                      this.InsUpdShapeHeaderDetails()

                    },
                    error: (e) => {
                    },
                    complete: () => {

                    },
                  });



                },
                error: (e) => {
                },
                complete: () => {

                },
              });





            }
            else if ((this.selectedtcxFilepath == "" || this.selectedtcxFilepath == undefined) && this.selected_Meshshapegroup.trim() == '') {
              alert('TCX file path and Mesh shape group cannot be empty');
              return;
            }
            else if ((this.selectedtcxFilepath == "" || this.selectedtcxFilepath == undefined) && this.selected_Meshshapegroup.trim() !== '') {

              this.shapemastersrvice.CheckMeshShapeGroupExists(this.selected_Meshshapegroup).subscribe({
                next: (response) => {
                  if (response.length < 0) {

                    this.tosterService.warning("Please enter valid/exsiting Mesh Shape Group or Upload tcx file")
                    return

                  }
                  else {
                    this.InsUpdShapeHeaderDetails()

                  }

                },
                error: (e) => {
                },
                complete: () => {

                },
              });


            }
            else if ((this.selectedtcxFilepath !== "" || this.selectedtcxFilepath != undefined) && this.selected_Meshshapegroup.trim() == "") {
              this.tosterService.warning("Please enter Mesh Shape Group");
              return
            }


          }


        }

      },
      error: (e: any) => {
        console.error('Error:', e);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;


      },
    });

  }


  InsUpdShapeHeaderDetails() {
    debugger
    let selectedMOCO: any;
    if (this.selected_MO == undefined || this.selected_MO == null) {
      selectedMOCO = '';
    }
    else {
      selectedMOCO = this.MOCOList.find((x: any) => x.item_id === this.createshapemasterForm.value.moco).item_text.trim();

    }

    if (this.selectedfupImage !== undefined && this.selectedfupImage !== "" &&this.selectedfupImage !==null) {



      const fileName = this.selectedfupImage.split('\\').pop();
      const strFileType: string = fileName.substring(fileName.lastIndexOf('.') + 1).trim();


      let strFileName: string = '';
      strFileName = fileName.substring(0, fileName.lastIndexOf('.')).trim();
      strFileName = strFileName.replace(/,/g, ' ');


      console.log('File Type:', strFileType);
      console.log('File Name:', strFileName);

      if (strFileName != this.selected_Shape) {
        this.tosterService.error("Image file name should be same as shape Code name");
        return;
      }

      let strUploadedFiles: string = strFileName + "." + strFileType;
      this.selectedtxtImage = strUploadedFiles;

      
      let imgAppPath: string ="D:/ShapeCodeMesh/";
      //let imgAppPath: string =this.selectedfupImage;
      
      let strdirPath: string = imgAppPath + strFileName + "." + strFileType

      const now = new Date();
      const formattedDate = `${now.getDate()}_${now.toLocaleString('default', { month: 'long' })}_${now.getFullYear()}_${now.getHours()}_${now.getMinutes()}`;
      let ExistingAppPathImg: string = imgAppPath + "Backup/" + strFileName + "_" + formattedDate + "." + strFileType

      let nslfp4Path: string = "//nslfp4.natsteel.corp/BTlabelPrintDEV/Siddhi/"
      let img_nslfp4: string = nslfp4Path + strFileName + "." + strFileType

      const objimg: createpath = {
        Path: imgAppPath,
        strdirPath_tcx: strdirPath,
        strExsitingdirPath_tcx: ExistingAppPathImg
      }
      this.shapemastersrvice.CheckandCreateDirectory(objimg).subscribe({
        next: (response) => {
          debugger

          console.log("Directory Response")

          this.shapemastersrvice.movefiletoBackup(objimg).subscribe({
            next: (response) => {
              debugger
              console.log("Directory Response")


            },
            error: (e) => {
            },
            complete: () => {

            },
          });



        },
        error: (e) => {
        },
        complete: () => {

        },
      });


      this.selectedtxtImage = strFileName + "." + strFileType

      if (this.selectedohindicator == true) {
        this.selectedevenmo1 = 0;
        this.selectedevenmo2 = 0;
        this.selectedoddmo1 = 0;
        this.selectedoddmo2 = 0;

        this.selectedevenco1 = 0;
        this.selectedevenco2 = 0;
        this.selectedoddco1 = 0;
        this.selectedoddco2 = 0;

      }

      const obj: AddNewShape = {

        ShapeDescription: this.selected_Shape,
        MeshGroup: this.selected_Meshshapegroup,
        MOCO: selectedMOCO,
        NoOfBends: this.selectedNoOfBend,
        BendingGroup: this.selectedbendinggroup == '' ? 'NULL' : this.selectedbendinggroup,
        MWBendingGroup: this.selectedmwbending == '' ? 'NULL' : this.selectedmwbending,
        CWBendingGroup: this.selectedcwbending == '' ? 'NULL' : this.selectedcwbending,
        NoOfSegments: this.selectedsegmentno,
        NoOfParameters: this.selectedparameterno,
        NoOfCuts: this.selectedcutno,
        Image: this.selectedtxtImage == undefined ? 'NULL' : this.selectedtxtImage,
        ImagePath: this.selectedfupImage == undefined ? 'NULL' : strdirPath,
        NoOfRoll: this.selectedrollno,
        ShapeType: "Slab",
        BendIndicator: this.selectedbendindicator,
        BendType: this.selectedbendingtype == 1 ? true : false,
        CreepMO1: this.selectedcreepdeductatmo1,
        CreepCO1: this.selectedcreepdeductatco1,
        StatusId: this.selectedstatus,
        CWTemplate: this.selectedcwbvbs,
        MWTemplate: this.selectedmwbvbs,
        EvenMO1: this.selectedevenmo1,
        EvenMO2: this.selectedevenmo2,
        OddMO1: this.selectedoddmo1,
        OddMO2: this.selectedoddmo2,
        EvenCO1: this.selectedevenco1,
        EvenCO2: this.selectedevenco2,
        OddCO1: this.selectedoddco1,
        OddCO2: this.selectedoddco2,
        OHIndicator: this.selectedohindicator,

      };
      this.shapemastersrvice.InsUpdShapeHeaderDetails(obj).subscribe({
        next: (response) => {
          if (response == 1) {

            this.tosterService.success("The Shape details inserted successfully!");

          }
          else {

            this.tosterService.warning("The Shape details unable to process. Try again")
          }

        },
        error: (e: any) => {
          console.error('Error:', e);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;


        },
      });



    }

    else if (this.selectedfupImage == undefined && this.selectedfupImage == "") {
      this.tosterService.warning("Please select an image to upload for the shape! ")
    }



  }



  CheckMeshShapeGroupExists() {
    debugger
    this.shapemastersrvice.CheckMeshShapeGroupExists(this.selected_Meshshapegroup).subscribe({
      next: (response) => {
        if (response.length > 0) {
          return true;

        }
        else {
          return false;
        }

      },
      error: (e) => {
      },
      complete: () => {

      },
    });

  }

  cancel() {
    this.modalService.dismissAll()
  }
  changeOHindicatior() {
    this.isOHindicatior = !this.isOHindicatior;

  }

  validateBVBSInitial(): boolean {
    try {
      debugger
      const mwBVBS: string = this.selectedmwbvbs.trim();
      const cwBVBS: string = this.selectedcwbvbs.trim();
      const mwBVBSArr: string[] = mwBVBS.split("@");
      const cwBVBSArr: string[] = cwBVBS.split("@");

      if (mwBVBS.substring(0, 7) !== "BF2D@Gl" || mwBVBS.substring(mwBVBS.length - 4) !== "@w0@") {
        this.tosterService.warning("Please check MW BVBS string");
        return false;
      }

      if (cwBVBS.substring(0, 7) !== "BF2D@Gl" || cwBVBS.substring(cwBVBS.length - 4) !== "@w0@") {
        this.tosterService.warning("Please check CW BVBS string");
        return false;
      }

      const specialChars = "[~`!#$%^&*()-+=|{}':;.,<>/?]";
      if (mwBVBS.match(new RegExp(specialChars)) || cwBVBS.match(new RegExp(specialChars))) {
        this.tosterService.warning("Only '@' is allowed");
        return false;
      }

      for (let i = 2; i < mwBVBSArr.length - 2; i++) {
        if (mwBVBSArr[i].charAt(0) !== "l" && mwBVBSArr[i].charAt(0) !== "w") {
          this.tosterService.warning("Please validate MW BVBS");
          return false;
        }
      }

      for (let i = 2; i < cwBVBSArr.length - 2; i++) {
        if (cwBVBSArr[i].charAt(0) !== "l" && cwBVBSArr[i].charAt(0) !== "w") {
          this.tosterService.warning("Please validate CW BVBS");
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("An error occurred:", error);
      return false;
    }
  }

  onImageFilechange(event: Event) {
    // debugger
    // const file = (event.target as HTMLInputElement).files?.[0];
    // if (file) {
    //   console.log('File selected:', file.name);
    //   this.selectedfupImage = file;

    // }
  }

  onTCXFilechange(event: Event) {
    
  }


}

export interface AddNewShape {
  //ShapeId: String,
  ShapeDescription: string,
  MeshGroup: string,
  MOCO: String,
  NoOfBends: number,
  BendingGroup: string,
  MWBendingGroup: string,
  CWBendingGroup: string,
  NoOfSegments: number,
  NoOfParameters: number,

  NoOfCuts: number,
  Image: string,
  ImagePath: string,
  NoOfRoll: number,
  ShapeType: string,
  BendIndicator: boolean,

  BendType: boolean,
  CreepMO1: boolean,
  CreepCO1: boolean,
  StatusId: number,
  CWTemplate: string,
  MWTemplate: string,
  EvenMO1: number,
  EvenMO2: number,
  OddMO1: number,
  OddMO2: number,
  EvenCO1: number,
  EvenCO2: number,
  OddCO1: number,
  OddCO2: number,
  OHIndicator: boolean

}

export interface createpath {
  Path: string,
  strdirPath_tcx: string
  strExsitingdirPath_tcx: string

}

export interface createimgpath {
  Path: string,
  strdirPath_tcx: string
  strExsitingdirPath_tcx: string

}
