import { Component, Input } from '@angular/core';
import { OrderService } from '../../orders.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-view-load',
  templateUrl: './view-load.component.html',
  styleUrls: ['./view-load.component.css']
})
export class ViewLoadComponent {
  @Input() object:any;
  loadBPCData: any[] = [];
  isLoading:boolean = false;

  constructor(private orderService:OrderService,public activeModal: NgbActiveModal,private loginService: LoginService){

  }
  ngOnInit(){
    this.loadData()
  }
  dismissModal(){
    this.activeModal.dismiss("User closed modal!");
  }
  loadData() {
    this.isLoading = true;
    this.object.UserName = this.loginService.GetGroupName()
    this.orderService.getBPCData(this.object).subscribe((response:any)=>{
      if (response != null && response.length > 0) {
        for (var i = 0; i < response.length; i++) {

            //Cage Type
            var lCageType = "";
            var lPileType = response[i].item1.pile_type;
            var lMainBarArrange = response[i].item1.main_bar_arrange;
            var lMainBarType = response[i].item1.main_bar_type;
            if (lPileType == "Micro-Pile") {
                lCageType = "Micro Pile";
            }
            else {
                if (lPileType == "Single-Layer") {
                    if (lMainBarType == "Single") {
                        if (lMainBarArrange == "Single") {
                            lCageType = "Single Layer, Separated Bars";
                        }
                        else if (lMainBarArrange == "Side-By-Side") {
                            lCageType = "Single Layer, Side-By-Side Bundled Bars";
                        }
                        else if (lMainBarArrange == "In-Out") {
                            lCageType = "Single Layer, In-Out Bundled Bars";
                        }
                        else {
                            lCageType = "Single Layer, Complex Bundled Bars";
                        }
                    }
                    if (lMainBarType == "Mixed") {
                        if (lMainBarArrange == "Single") {
                            lCageType = "Single Layer, Mixed Bars";
                        }
                        else if (lMainBarArrange == "Side-By-Side") {
                            lCageType = "Single Layer, Side By Side Bundled, Mixed Bars";
                        }
                        else if (lMainBarArrange == "In-Out") {
                            lCageType = "Single Layer, In-Out Bundled, Mixed Bars";
                        }
                        else {
                            lCageType = "Single Layer, Complex Bundled, Mixed Bars";
                        }
                    }
                }
                else {
                    if (lMainBarArrange == "Single") {
                        lCageType = "Double Layer, Separated Bars";
                    }
                    else if (lMainBarArrange == "Side-By-Side") {
                        lCageType = "Double Layer, Side By Side Bundled Bars";
                    }
                    else {
                        lCageType = "Double Layer, Complex Bundled Bars";
                    }
                }
            }

            //Main Bar
            let lMainBars = "";
            let lBarCTArr = response[i].item1.main_bar_ct.split(",");
            let lBarDiaArr = response[i].item1.main_bar_dia.split(",");
            let lBarType = response[i].item1.main_bar_grade.trim();
            if (lBarCTArr.length > 0 && lBarDiaArr.length > 0) {
                lMainBars = lBarCTArr[0].trim() + lBarType + lBarDiaArr[0].trim();
            }
            if (lBarCTArr.length > 1 && lBarDiaArr.length > 1) {
                lMainBars = lMainBars + ", " + lBarCTArr[1].trim() + lBarType + lBarDiaArr[1].trim();
            }

            //Spiral Link
            let lSpiralLink = "";
            var lSLType = "";
            if (response[i].item1.spiral_link_type.length >= 5) {
                if (response[i].item1.spiral_link_type.substring(0, 5) == "Others") {
                    lSLType = "";
                }
                else if (response[i].item1.spiral_link_type.substring(0, 4) == "Twin") {
                    lSLType = "2";
                }
            }
            var lSLSpacing = response[i].item1.spiral_link_spacing.split(",");
            var lSLGrade = response[i].item1.spiral_link_grade.trim();
            if (lSLSpacing.length > 0 && lSLSpacing.length > 0) {
                lSpiralLink = lSLType + lSLGrade + response[i].item1.sl1_dia + "-" + lSLSpacing[0] + "-" + response[i].item1.sl1_length;
            }
            if (lSLSpacing.length > 1 && lSLSpacing.length > 1) {
                lSpiralLink = lSpiralLink + ", " + lSLType + lSLGrade + response[i].item1.sl2_dia + "-" + lSLSpacing[1] + "-" + response[i].item1.sl2_length;
            }
            if (lSLSpacing.length > 2 && lSLSpacing.length > 2) {
                lSpiralLink = lSpiralLink + ", " + lSLType + lSLGrade + response[i].item1.sl3_dia + "-" + lSLSpacing[2] + "-" + response[i].item1.sl3_length;
            }

            if (i == 0 || response[i].item1.cage_id != response[i - 1].item1.cage_id) {
              this.loadBPCData[i] = {
                    id: i + 1,
                    cage_id: response[i].item1.cage_id,
                    pile_dia: response[i].item1.pile_dia,
                    pile_type: lCageType,
                    main_bar_ct: lMainBars,
                    main_bar_shape: response[i].item1.main_bar_shape,
                    cage_length: response[i].item1.cage_length,
                    lap_length: response[i].item1.lap_length,
                    spiral_link_spacing: lSpiralLink,
                    end_length: response[i].item1.end_length,
                    cage_qty: response[i].item1.cage_qty,
                    cage_location: response[i].item1.cage_location,
                    cage_weight: parseFloat(response[i].item1.cage_weight).toFixed(3),
                    per_set: response[i].item1.per_set,
                    bbs_no: response[i].item1.bbs_no,
                    cage_remarks: response[i].item1.cage_remarks,
                    sor_no: response[i].item2.sor_no,
                    load_id: response[i].item2.load_id,
                    load_qty: response[i].item2.load_qty
                }
            } else {
                this.loadBPCData[i] = {
                    id: i + 1,
                    cage_id: response[i].item1.cage_id,
                    pile_dia: "",
                    pile_type: "",
                    main_bar_ct: "",
                    main_bar_shape: "",
                    cage_length: "",
                    lap_length: "",
                    spiral_link_spacing: "",
                    end_length: "",
                    cage_qty: "",
                    cage_location: "",
                    cage_weight: "",
                    per_set: response[i].item1.per_set,
                    bbs_no: response[i].item1.bbs_no,
                    cage_remarks: "",
                    load_id: response[i].item2.load_id,
                    load_qty: response[i].item2.load_qty
                }
            }
        }
        this.isLoading = false;
      }
      this.isLoading = false;
    })
  }
}

