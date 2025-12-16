import { Component, OnInit, AfterViewInit, VERSION, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AddNewShape, createpath, CreateshapemasterComponent } from './createshapemaster/createshapemaster.component';
import { AddparameterComponent } from './addparameter/addparameter.component';
import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';
import { addValidationComponent } from './AddValidation/addValidation.component';
import { addFormulaComponent } from './AddFormula/addFormula.component';
import { AllshapesComponent } from './allshapes/allshapes.component';
import { ShapeMasterService } from 'src/app/Masters/Services/shape-master.service'
import { AnyMapping } from 'three';
import { ToastrService } from 'ngx-toastr';
import { AddMeshShapeParam } from 'src/app/Model/add-mesh-shape-param';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ThisReceiver } from '@angular/compiler';
import * as fs from 'fs';
import * as path from 'path';
import { forEach, im } from 'mathjs';
@Component({
  selector: 'app-shapemaster',
  templateUrl: './shapemaster.component.html',
  styleUrls: ['./shapemaster.component.css']
})
export class ShapemasterComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private _canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private paint!: boolean;

  private clickX: number[] = [];
  private clickY: number[] = [];
  private clickDrag: boolean[] = [];


  ShapemasterForm!: FormGroup;
  loading: boolean = false;
  submitted = false;
  searchResult = true;
  closeResult = '';
  ImagePath: string = '';
  ShapeCodeList: any[] = [];
  ShapeCodeDetailsList: any[] = [];

  MOCOList: any[] = [];
  BendTypeList: any[] = [];
  Status: any[] = [];
  isOhIndicator: boolean = false;

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

  selectedviewimage: any;
  Parameterlist: any[] = [];
  Parameterlist_backup: any;
  showTable = false;

  searchText: any = '';
  searchParamName: any;
  searchParamSeq: any;
  searchMWShape: any;
  searchCWShape: any;
  searchchrWireType: any;
  searchAngleType: any;
  searchAngleDir: any;
  searchBendSeq1: any;
  searchBendSeq2: any;
  searchCriticalInd: any;
  searchMinLen: any;
  searchMaxLen: any;
  searchConstValue: any;


  page = 1;
  pageSize = 0;
  currentPage = 1;
  itemsPerPage: number = 10;
  maxSize: number = 10;

  toggleFilters = false;
  isEditing: boolean = false;
  enableEditIndex = null;

  addnewparameter: AddMeshShapeParam[] = [
    {
      chrParamName: '',
      intShapeDetailId: '',
      intShapeID: 0,
      intParamSeq: '',
      vchMWShape: 'NULL',
      vchCWShape: 'NULL',
      chrWireType: 'M',
      chrAngleType: 'S',
      intAngleDir: 1,
      intBendSeq1: 0,
      intBendSeq2: 0,
      chrCriticalInd: 'N',
      intMinLen: 0,
      intMaxLen: 0,
      intConstValue: 0,

    }
  ];

  @HostListener('document:mouseup', ['$event'])
  mouseReleaseEventHandler(event: MouseEvent) {
    this.releaseEventHandler();
  }

  @HostListener('document:touchend', ['$event'])
  touchReleaseEventHandler(event: TouchEvent) {
    this.releaseEventHandler();
  }

  @HostListener('document:mouseout', ['$event'])
  cancelMouseEventHandler() {
    this.cancelEventHandler();
  }

  @HostListener('document:touchcancel', ['$event'])
  cancelTouchEventHandler() {
    this.cancelEventHandler();
  }

  ngAfterViewInit() {

    this.createUserEvents();
  }

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private modalService: NgbModal, private shapemastersrvice: ShapeMasterService, private tosterService: ToastrService) {

  }

  ngOnInit(): void {

    this.GetShapeCodeList();
    this.GetStatusDetails();

    this.ShapemasterForm = this.formBuilder.group({
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

    this.MOCOList = [
      { item_id: 1, item_text: 'M' },
      { item_id: 2, item_text: 'C' },
      { item_id: 3, item_text: 'B' },

    ];
    this.BendTypeList = [
      { item_id: 1, item_text: 'Normal' },
      { item_id: 0, item_text: 'Reverse' },

    ];


  }


  GetShapeCodeList() {
    debugger;

    this.shapemastersrvice.GetShapeCodeList().subscribe({
      next: (response) => {
        this.ShapeCodeList = response;
        console.log("ShapeCode List", this.ShapeCodeList);
      },
      error: (e) => {
      },
      complete: () => {

      },
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

  GetShapeParamDetails(shapid: any) {
    debugger;
    this.loading = true;
    this.shapemastersrvice.GetShapeParamDetails(shapid).subscribe({
      next: (response) => {
        this.Parameterlist = response;
        console.log("Parameter List", this.Parameterlist);

        this.showTable = true;
      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false;
        this.Parameterlist_backup = JSON.parse(JSON.stringify(this.Parameterlist));

      },
    });
  }


  imageExists: boolean = false;
  GetShapeCodeDetails(shapeid: any) {
    debugger;
    this.loading = true
    this.shapemastersrvice.GetShapeCodeDetails(shapeid).subscribe({
      next: (response) => {
        this.ShapeCodeDetailsList = response;
        console.log("selected shape details=>", this.ShapeCodeDetailsList)

        const Meshshapegroup = this.ShapeCodeDetailsList[0].vchMeshShapeGroup;
        sessionStorage.setItem('Meshshapegroup', Meshshapegroup);

      },
      error: (e) => {
      },
      complete: () => {

        this.selected_Meshshapegroup = this.ShapeCodeDetailsList[0].vchMeshShapeGroup;
        this.selected_MO = this.ShapeCodeDetailsList[0].chrMOCO;
        this.selectedNoOfBend = this.ShapeCodeDetailsList[0].sitNoOfBends;
        this.selectedbendinggroup = this.ShapeCodeDetailsList[0].vchBendingGroup == '' ? 'NULL' : this.ShapeCodeDetailsList[0].vchBendingGroup;

        this.selectedmwbending = this.ShapeCodeDetailsList[0].vchMWBendingGroup == '' ? 'NULL' : this.ShapeCodeDetailsList[0].vchMWBendingGroup;
        this.selectedcwbending = this.ShapeCodeDetailsList[0].vchCWBendingGroup == '' ? 'NULL' : this.ShapeCodeDetailsList[0].vchCWBendingGroup;
        this.selectedsegmentno = this.ShapeCodeDetailsList[0].intNoOfSegments;
        this.selectedparameterno = this.ShapeCodeDetailsList[0].intNoOfParameters;
        this.selectedcutno = this.ShapeCodeDetailsList[0].sitNoOfCut;

        let BendType = this.ShapeCodeDetailsList[0].bitBendType;
        if (BendType == "1") {
          this.selectedbendingtype = "Normal";
        }
        else {
          this.selectedbendingtype = "Reverse";
        }
        this.selectedstatus = this.ShapeCodeDetailsList[0].tntStatusId;
        this.selectedrollno = this.ShapeCodeDetailsList[0].sitNoOfRoll;
        this.selectedtxtImage = this.ShapeCodeDetailsList[0].vchImage;

        const img = new Image();
        img.src = `assets/images/Shapes/${this.selectedtxtImage}`;

        img.onload = () => {
          this.imageExists = true;
        };

        img.onerror = () => {
          this.imageExists = false;
        };


        if (this.ShapeCodeDetailsList[0].bitCreepDeductAtCo1 === "True") {
          this.selectedcreepdeductatco1 = true;
        } else {
          this.selectedcreepdeductatco1 = false
        }

        if (this.ShapeCodeDetailsList[0].bitCreepDeductAtMo1 === "True") {
          this.selectedcreepdeductatmo1 = true;
        } else {
          this.selectedcreepdeductatmo1 = false
        }

        if (this.ShapeCodeDetailsList[0].bitDefaultOHIndicator === "True") {
          this.selectedohindicator = true;
          this.isOhIndicator = true;
        } else {
          this.selectedohindicator = false
          this.isOhIndicator = false;
        }


        if (this.ShapeCodeDetailsList[0].bitBendIndicator === "True") {
          this.selectedbendindicator = true;
        } else {
          this.selectedbendindicator = false
        }

        this.selectedcwbvbs = this.ShapeCodeDetailsList[0].vchCwBVBSTemplate;
        this.selectedmwbvbs = this.ShapeCodeDetailsList[0].vchMwBVBSTemplate;
        this.selectedevenmo1 = this.ShapeCodeDetailsList[0].sitEvenMO1;
        this.selectedevenmo2 = this.ShapeCodeDetailsList[0].sitEvenMO2;
        this.selectedoddmo1 = this.ShapeCodeDetailsList[0].sitOddMO1;
        this.selectedoddmo2 = this.ShapeCodeDetailsList[0].sitOddMO2;
        this.selectedevenco1 = this.ShapeCodeDetailsList[0].sitEvenCO1;
        this.selectedevenco2 = this.ShapeCodeDetailsList[0].sitEvenCO2;
        this.selectedoddco1 = this.ShapeCodeDetailsList[0].sitOddCO1;
        this.selectedoddco2 = this.ShapeCodeDetailsList[0].sitOddCO2;


        this.loading = false;
      },
    });
  }


  isEnablebtn: boolean = false;
  changeShapecode(event: any) {
    debugger
    if (event) {
      let selectedShapeCode = this.ShapeCodeList.find((x: any) => x.intShapeID === this.ShapemasterForm.value.shapecode).chrShapeCode.trim();

      if (selectedShapeCode.includes('M')) {
        this.ShapemasterForm.get('cwbending')?.disable();

      }
      else if (selectedShapeCode.includes('C')) {
        this.ShapemasterForm.get('mwbending')?.disable();

      }
      else {
        this.ShapemasterForm.get('cwbending')?.enable();
        this.ShapemasterForm.get('mwbending')?.enable();

      }
      this.GetShapeCodeDetails(event);
      this.GetShapeParamDetails(event);
      this.isEnablebtn = true;
    }
    else {
      this.ShapemasterForm.reset();
      this.Parameterlist = [];
    }


  }

  ShowAllShapes() {
    //const modalRef = this.modalService.open(AllshapesComponent, { size: 'xl', backdrop: 'static' });
    window.open('./#/master/allshapes', '_blank');  // Opens the new tab

  }

  ohindicator() {
    debugger
    this.isOhIndicator = !this.isOhIndicator;
    console.log(this.isOhIndicator)
  }

  txtBoxValidation() {


    debugger;

    if (this.selected_Shape != null || this.selected_Shape != undefined) {
      if (this.selected_Meshshapegroup != null || this.selected_Meshshapegroup !== "" || this.selected_Meshshapegroup != undefined) {
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
                                              this.UpdateShapeCodeDetails();

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
                              this.UpdateShapeCodeDetails();
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

  onImageFilechange(event: Event) {

  }

  onTCXFilechange(event: Event) {

  }

  strselectedShapeCode='';
  UpdateShapeCodeDetails() {
    debugger;

     this.strselectedShapeCode = this.ShapeCodeList.find((x: any) => x.intShapeID === this.ShapemasterForm.value.shapecode).chrShapeCode.trim();

    if (sessionStorage.getItem('Meshshapegroup') !== this.selected_Meshshapegroup && (this.selectedtcxFilepath == '' || this.selectedtcxFilepath == undefined)) {
      this.tosterService.warning("To change mesh shape group please upload tcx file again.");
      return
    }
    const isvalidateBVBSInitial = this.validateBVBSInitial();

    if (!isvalidateBVBSInitial) {
      return;
      this.loading = false
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
          strSlabStructureTcxPath = 'D:/TCX_Files/BeamCage/Data/';
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

                if (this.selectedfupImage !== undefined&&this.selectedfupImage !== ""&&this.selectedfupImage !== null) {

                  const fileName = this.selectedfupImage.split('\\').pop();
                  const strFileType: string = fileName.substring(fileName.lastIndexOf('.') + 1).trim();


                  let strFileName: string = '';
                  strFileName = fileName.substring(0, fileName.lastIndexOf('.')).trim();
                  strFileName = strFileName.replace(/,/g, ' ');


                  console.log('File Type:', strFileType);
                  console.log('File Name:', strFileName);

                  if (strFileName != this.strselectedShapeCode) {
                    this.tosterService.error("Image file name should be same as shape Code name");
                    return;
                  }

                  let strUploadedFiles: string = strFileName + "." + strFileType;
                  this.selectedtxtImage = strUploadedFiles;

                  let imgAppPath: string = "D:/ShapeCodeMesh/";

                  //let imgAppPath: string = this.selectedfupImage;

                  let strdirPath: string = imgAppPath + strFileName + "." + strFileType

                  const now = new Date();
                  const formattedDate = `${now.getDate()}_${now.toLocaleString('default', { month: 'long' })}_${now.getFullYear()}_${now.getHours()}_${now.getMinutes()}`;
                  let ExistingAppPathImg: string = imgAppPath + "Backup/" + strFileName + "_" + formattedDate + "." + strFileType

                  this.selectedtxtImage = strFileName + "." + strFileType;
                  this.selectedfupImage = strdirPath;

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

                          this.UpdateShapeHeaderDetails();
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

                else if (this.selectedfupImage == undefined || this.selectedfupImage == "") {
                  this.selectedtxtImage = this.selectedtxtImage;
                  this.UpdateShapeHeaderDetails();

                }

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
      else if ((this.selectedtcxFilepath !== "" || this.selectedtcxFilepath != undefined) && this.selected_Meshshapegroup.trim() == "") {
        this.tosterService.warning("Please enter Mesh Shape Group");
        return
      }
      else {
        if (this.selectedfupImage !== undefined&&this.selectedfupImage !== ""&&this.selectedfupImage !== null) {

          const fileName = this.selectedfupImage.split('\\').pop();
          const strFileType: string = fileName.substring(fileName.lastIndexOf('.') + 1).trim();


          let strFileName: string = '';
          strFileName = fileName.substring(0, fileName.lastIndexOf('.')).trim();
          strFileName = strFileName.replace(/,/g, ' ');


          console.log('File Type:', strFileType);
          console.log('File Name:', strFileName);

          if (strFileName != this.strselectedShapeCode) {
            this.tosterService.error("Image file name should be same as shape Code name");
            return;
          }

          let strUploadedFiles: string = strFileName + "." + strFileType;
          this.selectedtxtImage = strUploadedFiles;

          let imgAppPath: string = "D:/ShapeCodeMesh/";

          //let imgAppPath: string = this.selectedfupImage;

          let strdirPath: string = imgAppPath + strFileName + "." + strFileType

          const now = new Date();
          const formattedDate = `${now.getDate()}_${now.toLocaleString('default', { month: 'long' })}_${now.getFullYear()}_${now.getHours()}_${now.getMinutes()}`;
          let ExistingAppPathImg: string = imgAppPath + "Backup/" + strFileName + "_" + formattedDate + "." + strFileType

          this.selectedtxtImage = strFileName + "." + strFileType;
          this.selectedfupImage = strdirPath;

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

                  this.UpdateShapeHeaderDetails();
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

        else if (this.selectedfupImage == undefined || this.selectedfupImage == "") {
          this.selectedtxtImage = this.selectedtxtImage;
          this.UpdateShapeHeaderDetails();

        }
      }
    }
  }

  UpdateShapeHeaderDetails() {
    debugger
    if (this.selectedohindicator == false) {
      this.selectedevenmo1 = 0;
      this.selectedevenmo2 = 0;
      this.selectedoddmo1 = 0;
      this.selectedoddmo2 = 0;

      this.selectedevenco1 = 0;
      this.selectedevenco2 = 0;
      this.selectedoddco1 = 0;
      this.selectedoddco2 = 0;
    }

    let selectedShapeCode = this.ShapeCodeList.find((x: any) => x.intShapeID === this.ShapemasterForm.value.shapecode).chrShapeCode.trim();

    const obj: UpdateShape = {
      ShapeId: this.selected_Shape,
      ShapeDescription: selectedShapeCode,
      MeshGroup: this.selected_Meshshapegroup,
      MOCO: this.selected_MO,
      NoOfBends: this.selectedNoOfBend,
      BendingGroup: this.selectedbendinggroup == '' ? 'NULL' : this.selectedbendinggroup,
      MWBendingGroup: this.selectedmwbending == '' ? 'NULL' : this.selectedmwbending,
      CWBendingGroup: this.selectedcwbending == '' ? 'NULL' : this.selectedcwbending,
      NoOfSegments: this.selectedsegmentno,
      NoOfParameters: this.selectedparameterno,
      NoOfCuts: this.selectedcutno,
      Image: this.selectedtxtImage == undefined ? '' : this.selectedtxtImage,
      ImagePath: this.selectedfupImage == undefined ? '' : this.selectedfupImage,
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

    console.log('object', obj)

    this.loading = true;
    this.shapemastersrvice.UpdateShapeHeaderDetails(obj).subscribe({
      next: (response) => {
        if (response == 1) {

          this.tosterService.success("The Shape details updated successfully!");

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

  onReset() {
    this.submitted = false;
    this.ShapemasterForm.reset();
  }
  addNewShape() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',

    }
    const modalRef = this.modalService.open(CreateshapemasterComponent, ngbModalOptions);
    modalRef.componentInstance.name = 'World';
    modalRef.componentInstance.formname = 'Shapemaster';

  }


  onAddNewParameter() {
    debugger
    let noOfParameters = this.Parameterlist.length;


    if (noOfParameters < this.selectedparameterno) {
      if (this.addnewparameter[0].chrParamName == "") {
        this.tosterService.warning("Parameter Name cannot be empty");
        return

      }
      else {
        if (this.addnewparameter[0].intParamSeq == '0' || this.addnewparameter[0].intParamSeq == '') {
          this.tosterService.warning("Parameter Seq cannot be empty or zero")
          return
        }
        else {
          if (this.addnewparameter[0].vchMWShape == "") {
            this.tosterService.warning("MW Shape cannot be empty")
            return
          }
          else {
            if (this.addnewparameter[0].vchCWShape == "") {
              this.tosterService.warning("MW Shape cannot be empty")
              return

            }
            else {
              if (this.addnewparameter[0].chrWireType == "") {
                this.tosterService.warning("Wire Type cannot be empty")
                return
              }
              else {

                if (this.addnewparameter[0].chrAngleType == "") {
                  this.tosterService.warning("Angle Type cannot be empty")
                  return
                }
                else {
                  if (this.addnewparameter[0].intAngleDir == null) {
                    this.tosterService.warning("Angle Dir cannot be empty")
                    return
                  }
                  else {
                    if (this.addnewparameter[0].intBendSeq1 == null) {
                      this.tosterService.warning("Bend Seq1 cannot be empty")
                      return
                    }
                    else {
                      if (this.addnewparameter[0].intBendSeq2 == null) {
                        this.tosterService.warning("Bend Seq2 cannot be empty")
                        return
                      }
                      else {
                        if (this.addnewparameter[0].chrCriticalInd == "") {
                          this.tosterService.warning("Critical Indicator cannot be empty.Please enter 'Y' or 'N'")
                          return
                        }
                        else {

                          if (this.addnewparameter[0].intMinLen == null) {
                            this.tosterService.warning("Min Len cannot be empty")
                            return
                          }
                          else {
                            if (this.addnewparameter[0].intMaxLen == null) {
                              this.tosterService.warning("Max Len cannot be empty")
                              return
                            }
                            else {

                              if (this.addnewparameter[0].intConstValue == null) {
                                this.tosterService.warning("Constant Value cannot be empty")
                                return
                              }
                              else {
                                debugger
                                let isParameterExists = false;
                                let isSequenceExists = false;

                                this.Parameterlist.forEach((item) => {
                                  if (item.chrParamName.trim() == this.addnewparameter[0].chrParamName.trim().toLowerCase()) {
                                    isParameterExists = true;
                                  }

                                  if (item.chrParamName.trim() == this.addnewparameter[0].chrParamName.trim().toUpperCase()) {
                                    isParameterExists = true;
                                  }

                                  if (item.intParamSeq == this.addnewparameter[0].intParamSeq) {
                                    isSequenceExists = true;
                                  }
                                });



                                if (isParameterExists) {

                                  this.tosterService.warning('Parameter Name already exsit!');
                                  return;
                                }
                                else if (isSequenceExists) {
                                  this.tosterService.warning('Parameter Sequence already exsit!');
                                  return
                                }
                                else {
                                  this.loading = true;

                                  const obj: AddMeshShapeParam = {
                                    intShapeDetailId: '0',
                                    intShapeID: this.selected_Shape,
                                    chrParamName: this.addnewparameter[0].chrParamName.toUpperCase(),
                                    intParamSeq: this.addnewparameter[0].intParamSeq,
                                    vchMWShape: this.addnewparameter[0].vchMWShape,
                                    vchCWShape: this.addnewparameter[0].vchCWShape,
                                    chrWireType: this.addnewparameter[0].chrWireType.toUpperCase(),
                                    chrAngleType: this.addnewparameter[0].chrAngleType.toUpperCase(),
                                    intAngleDir: this.addnewparameter[0].intAngleDir,
                                    intBendSeq1: this.addnewparameter[0].intBendSeq1,
                                    intBendSeq2: this.addnewparameter[0].intBendSeq2,
                                    chrCriticalInd: this.addnewparameter[0].chrCriticalInd.toUpperCase(),
                                    intMinLen: this.addnewparameter[0].intMinLen,
                                    intMaxLen: this.addnewparameter[0].intMaxLen,
                                    intConstValue: this.addnewparameter[0].intConstValue,


                                  };

                                  this.shapemastersrvice.InsUpdShapeParamDetails(obj).subscribe({
                                    next: (response) => {
                                      if (response == 1) {

                                        this.tosterService.success("Parameter Saved Successfully.");

                                      }

                                    },
                                    error: (e: any) => {

                                    },
                                    complete: () => {
                                      this.loading = false;

                                      this.GetShapeParamDetails(this.selected_Shape)

                                    },
                                  });

                                }



                              }


                            }


                          }



                        }


                      }


                    }

                  }


                }


              }

            }
          }


        }

      }
    }
    else {
      this.tosterService.warning("'Can't add more parameters than total no.of parameters mentioned'");


    }
  }

  ResetAddnew() {
    this.addnewparameter = [{
      chrParamName: '',
      intShapeDetailId: '',
      intShapeID: 0,
      intParamSeq: '',
      vchMWShape: 'NULL',
      vchCWShape: 'NULL',
      chrWireType: 'M',
      chrAngleType: 'S',
      intAngleDir: 1,
      intBendSeq1: 0,
      intBendSeq2: 0,
      chrCriticalInd: 'N',
      intMinLen: 0,
      intMaxLen: 0,
      intConstValue: 0,

    }];


  }

  onEditParameter(item: any, index: any) {
    debugger
    this.isEditing = true;
    this.enableEditIndex = index;
  }

  Editcancel() {
    this.isEditing = false;
    this.enableEditIndex = null;
    this.GetShapeParamDetails(this.selected_Shape)
  }

  onUpdateParameter(item: any, index: any) {
    console.log(item);
    debugger
    if (item.chrParamName == "") {
      this.tosterService.warning("Parameter Name cannot be empty");
      return

    }
    else {
      if (item.intParamSeq == '0' || item.intParamSeq == '') {
        this.tosterService.warning("Parameter Seq cannot be empty or zero")
        return
      }
      else {
        if (item.vchMWShape == "") {
          this.tosterService.warning("MW Shape cannot be empty")
          return
        }
        else {
          if (item.vchCWShape == "") {
            this.tosterService.warning("MW Shape cannot be empty")
            return

          }
          else {
            if (item.chrWireType == "") {
              this.tosterService.warning("Wire Type cannot be empty")
              return
            }
            else {

              if (item.chrAngleType == "") {
                this.tosterService.warning("Angle Type cannot be empty")
                return
              }
              else {
                if (item.intAngleDir == null) {
                  this.tosterService.warning("Angle Dir cannot be empty")
                  return
                }
                else {
                  if (item.intBendSeq1 == null) {
                    this.tosterService.warning("Bend Seq1 cannot be empty")
                    return
                  }
                  else {
                    if (item.intBendSeq2 == null) {
                      this.tosterService.warning("Bend Seq2 cannot be empty")
                      return
                    }
                    else {
                      if (item.chrCriticalInd == "") {
                        this.tosterService.warning("Critical Indicator cannot be empty.Please enter 'Y' or 'N'")
                        return
                      }
                      else {

                        if (item.intMinLen == null) {
                          this.tosterService.warning("Min Len cannot be empty")
                          return
                        }
                        else {
                          if (item.intMaxLen == null) {
                            this.tosterService.warning("Max Len cannot be empty")
                            return
                          }
                          else {

                            if (item.intConstValue == null) {
                              this.tosterService.warning("Constant Value cannot be empty")
                              return
                            }
                            else {

                              debugger
                              let isParameterExists = false;
                              let isSequenceExists = false;

                              this.Parameterlist.forEach((X) => {
                                if (X.chrParamName.trim() == item.chrParamName.trim().toLowerCase() && X.intShapeDetailId !== item.intShapeDetailId) {
                                  isParameterExists = true;
                                }

                                if (X.chrParamName.trim() == item.chrParamName.trim().toUpperCase() && X.intShapeDetailId !== item.intShapeDetailId) {
                                  isParameterExists = true;
                                }

                                if (X.intParamSeq == item.intParamSeq && X.intShapeDetailId !== item.intShapeDetailId) {
                                  isSequenceExists = true;
                                }
                              });



                              if (isParameterExists) {

                                this.tosterService.warning('Parameter Name already exsit!');
                                return;
                              }
                              else if (isSequenceExists) {
                                this.tosterService.warning('Parameter Sequence already exsit!');
                                return
                              }
                              else {
                                this.loading = true;

                                const obj: AddMeshShapeParam = {
                                  intShapeDetailId: item.intShapeDetailId,
                                  intShapeID: this.selected_Shape,
                                  chrParamName: item.chrParamName.toUpperCase(),
                                  intParamSeq: item.intParamSeq,
                                  vchMWShape: item.vchMWShape,
                                  vchCWShape: item.vchCWShape,
                                  chrWireType: item.chrWireType.toUpperCase(),
                                  chrAngleType: item.chrAngleType.toUpperCase(),
                                  intAngleDir: item.intAngleDir,
                                  intBendSeq1: item.intBendSeq1,
                                  intBendSeq2: item.intBendSeq2,
                                  chrCriticalInd: item.chrCriticalInd.toUpperCase(),
                                  intMinLen: item.intMinLen,
                                  intMaxLen: item.intMaxLen,
                                  intConstValue: item.intConstValue,

                                };

                                this.shapemastersrvice.InsUpdShapeParamDetails(obj).subscribe({
                                  next: (response) => {
                                    if (response == 1) {

                                      this.tosterService.success("Parameter Updated Successfully.");

                                    }

                                  },
                                  error: (e: any) => {

                                  },
                                  complete: () => {
                                    this.loading = false;
                                    this.isEditing = false;
                                    this.enableEditIndex = null;
                                    this.GetShapeParamDetails(this.selected_Shape)

                                  },
                                });

                              }




                            }


                          }


                        }



                      }


                    }


                  }

                }


              }


            }

          }
        }


      }

    }



  }

  onDeleteParameter(intShapeDetailId: any): void {
    debugger
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        debugger
        this.loading = true
        this.shapemastersrvice.DeleteShapeParamDetails(intShapeDetailId).subscribe({
          next: (response) => {
            debugger;
            console.log('isDeleted', response);
            this.tosterService.success("Parameter Deleted Succcessfully");

          },
          error: (e) => {
          },
          complete: () => {
            debugger;

            this.loading = false
            this.GetShapeParamDetails(this.selected_Shape)
          },
        });
      }
    });
  }

  AddValidation() {
    if (this.selected_Shape == undefined || this.selected_Shape == "" || this.selected_Shape == null || this.selected_Shape == 0) {
      window.alert("Please create shape first")

    }
    else {
      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        // centered: true,
        size: 'lg',

      }
      const modalRef = this.modalService.open(addValidationComponent, ngbModalOptions);
      modalRef.componentInstance.ShapeId = this.selected_Shape;
    }


  }
  Addformula() {

    if (this.selected_Shape == undefined || this.selected_Shape == "" || this.selected_Shape == null || this.selected_Shape == 0) {
      window.alert("Please create shape first or select existing shape code.")

    }
    else {
      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        // centered: true,
        size: 'lg',

      }
      const modalRef = this.modalService.open(addFormulaComponent, ngbModalOptions);
      modalRef.componentInstance.ShapeId = this.selected_Shape;
      modalRef.componentInstance.shapegroup = this.selected_Meshshapegroup;
      modalRef.componentInstance.chrShapeType = this.ShapeCodeDetailsList[0].chrShapeType;
    }

  }


  private createUserEvents() {
    let _canvas = this._canvas;

    // document
    //   .getElementById('clear')
    //   .addEventListener('click', this.clearEventHandler);
    // document
    //   .getElementById('Rectangle')
    //   .addEventListener('click', this.drawRectable);
  }



  private clearCanvas() {
    this.context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this.clickX = [];
    this.clickY = [];
    this.clickDrag = [];
  }

  private clearEventHandler = () => {
    this.clearCanvas();
  };

  private releaseEventHandler = () => {
    this.paint = false;
    //this.redraw();
  };

  private cancelEventHandler = () => {
    this.paint = false;
  };


  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }
  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
  }

  searchParameterlist() {

    this.Parameterlist = JSON.parse(JSON.stringify(this.Parameterlist_backup));

    if (this.searchParamName != undefined) {
      this.Parameterlist = this.Parameterlist.filter(item =>
        this.checkFilterData(this.searchParamName, item.chrParamName)
      );
    }

    if (this.searchParamSeq != undefined) {
      this.Parameterlist = this.Parameterlist.filter(item =>
        this.checkFilterData(this.searchParamSeq, item.intParamSeq)
      );
    }

    if (this.searchMWShape != undefined) {
      this.Parameterlist = this.Parameterlist.filter(item =>
        this.checkFilterData(this.searchMWShape, item.vchMWShape)
      );
    }
    if (this.searchCWShape != undefined) {
      this.Parameterlist = this.Parameterlist.filter(item =>
        this.checkFilterData(this.searchCWShape, item.vchCWShape)
      );
    }
    if (this.searchchrWireType != undefined) {
      this.Parameterlist = this.Parameterlist.filter(item =>
        this.checkFilterData(this.searchchrWireType, item.chrWireType)
      );
    }

    if (this.searchAngleType != undefined) {
      this.Parameterlist = this.Parameterlist.filter(item =>
        this.checkFilterData(this.searchAngleType, item.chrAngleType)
      );
    }
    if (this.searchAngleDir != undefined) {
      this.Parameterlist = this.Parameterlist.filter(item =>
        this.checkFilterData(this.searchAngleDir, item.intAngleDir)
      );
    }

    if (this.searchBendSeq1 != undefined) {
      this.Parameterlist = this.Parameterlist.filter(item =>
        this.checkFilterData(this.searchBendSeq1, item.intBendSeq1)
      );
    }
    if (this.searchBendSeq2 != undefined) {
      this.Parameterlist = this.Parameterlist.filter(item =>
        this.checkFilterData(this.searchBendSeq2, item.intBendSeq2)
      );
    }
    if (this.searchCriticalInd != undefined) {
      this.Parameterlist = this.Parameterlist.filter(item =>
        this.checkFilterData(this.searchCriticalInd, item.chrCriticalInd)
      );
    }
    if (this.searchMinLen != undefined) {
      this.Parameterlist = this.Parameterlist.filter(item =>
        this.checkFilterData(this.searchMinLen, item.intMinLen)
      );
    }
    if (this.searchMaxLen != undefined) {
      this.Parameterlist = this.Parameterlist.filter(item =>
        this.checkFilterData(this.searchMaxLen, item.intMaxLen)
      );
    }
    if (this.searchConstValue != undefined) {
      this.Parameterlist = this.Parameterlist.filter(item =>
        this.checkFilterData(this.searchConstValue, item.intConstValue)
      );
    }

    console.log("data = ", this.Parameterlist)

  }

  checkFilterData(ctlValue: any, item: any) {
    if (ctlValue.toString().includes(',')) {
      let value = ctlValue.toString().toLowerCase().trim().split(',');
      return value.some((char: string) => item.toString().toLowerCase().includes(char))
    } else {
      return item
        .toString()
        .toLowerCase()
        .includes(
          ctlValue
            .toString()
            .toLowerCase()
            .trim()
        )
    }
  }



}

export interface UpdateShape {
  ShapeId: number,
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
