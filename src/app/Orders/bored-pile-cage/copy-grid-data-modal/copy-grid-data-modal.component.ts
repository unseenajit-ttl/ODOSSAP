import { Component, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../orders.service';
import { data } from 'jquery';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-copy-grid-data-modal',
  templateUrl: './copy-grid-data-modal.component.html',
  styleUrls: ['./copy-grid-data-modal.component.css']
})
export class CopyGridDataModalComponent {
  customerList: any;
  selectCustomerCode: any;
  projectList: any;
  selectedProjectCode: any;
  products: any[] = [];
  copyData: any[] = [];
  constructor(private orderService: OrderService,
    public activeModal: NgbActiveModal,
    private renderer: Renderer2,
    private loginService: LoginService) { }
  ngOnInit() {
    this.getOrderCustomer();
    this.getInitialProjectsList();
    this.loadData();
  }
  dismissModal() {
    this.activeModal.dismiss("User closed modal!");
  }
  applyData() {
    let obj = {
      SourceCustomerCode: this.selectCustomerCode,
      SourceProjectCode: this.selectedProjectCode,
      SourceJobIDs: this.products,
      DesCustomerCode: this.selectCustomerCode,
      DesProjectCode: this.selectedProjectCode
    }
    this.activeModal.close(obj);
  }

  getOrderCustomer() {
    //debugger;
    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType()
    this.orderService.GetCustomers(pGroupName, pUserType).subscribe({
      next: (response) => {
        this.customerList = response.map((i: any) => { i.CustomerName = i.CustomerName + ' (' + i.CustomerCode + ')'; return i; });
        console.log('customer=>', this.customerList);
      },
      error: (e) => { },
      complete: () => {
        // this.loading = false;
      },
    });
  }
  getInitialProjectsList() {

    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType()
    this.projectList = [];
    this.orderService.GetProjects(this.selectCustomerCode, pUserType, pGroupName).subscribe({
      next: (response) => {
        this.projectList = response.map((i: any) => { i.ProjectTitle = i.ProjectTitle + ' (' + i.ProjectCode + ')'; return i; });;
      },
      error: (e) => { },
      complete: () => {
        // this.loading = false;
      },
    });

  }
  getOrderProjectsList() {

    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType()
    this.selectedProjectCode = null;
    this.projectList = [];
    this.orderService.GetProjects(this.selectCustomerCode, pUserType, pGroupName).subscribe({
      next: (response) => {
        this.projectList = response.map((i: any) => { i.ProjectTitle = i.ProjectTitle + ' (' + i.ProjectCode + ')'; return i; });;
      },
      error: (e) => { },
      complete: () => {
        // this.loading = false;
      },
    });

  }
  loadData() {
    // [("/getTemplateData_bpc/CustomerCode/ProjectCode/PileDia/BarDia/BarQty")]
    let obj = {
      CustomerCode: this.selectCustomerCode,
      ProjectCode: this.selectedProjectCode,
      PileDia: null,
      BarDia: null,
      BarQty: null
    };
    this.copyData = [];
    this.orderService.getTemplateData_bpc(obj).subscribe((response: any) => {
      if (response != null && response.length > 0) {
        for (var i = 0; i < response.length; i++) {

          this.copyData[i] = {
            lib_id: i + 1,
            JobID: response[i].JobID,
            lib_name: response[i].PONumber,
            pile_cover: response[i].cover_to_link,
            pile_type: response[i].pile_type,
            pile_dia: response[i].pile_dia,
            cage_dia: response[i].cage_dia,
            set_code: response[i].set_code,
            main_bar_arrange: response[i].main_bar_arrange,
            main_bar_type: response[i].main_bar_type,
            main_bar_ct: response[i].main_bar_ct,
            main_bar_shape: response[i].main_bar_shape,
            main_bar_grade: response[i].main_bar_grade,
            main_bar_dia: response[i].main_bar_dia,
            main_bar_topjoin: response[i].main_bar_topjoin,
            main_bar_endjoin: response[i].main_bar_endjoin,
            cage_length: response[i].cage_length,
            spiral_link_type: response[i].spiral_link_type,
            spiral_link_grade: response[i].spiral_link_grade,
            spiral_link_dia: response[i].spiral_link_dia,
            spiral_link_spacing: response[i].spiral_link_spacing,
            lap_length: response[i].lap_length,
            end_length: response[i].end_length,
            cage_location: response[i].cage_location,
            rings_start: response[i].rings_start,
            rings_end: response[i].rings_end,
            rings_addn_no: response[i].rings_addn_no,
            rings_addn_member: response[i].rings_addn_member,
            no_of_sr: response[i].no_of_sr,
            sr_grade: response[i].sr_grade,
            sr_dia: response[i].sr_dia,
            sr_dia_add: response[i].sr_dia_add == null ? 13 : response[i].sr_dia_add,
            sr1_location: response[i].sr1_location,
            sr2_location: response[i].sr2_location,
            sr3_location: response[i].sr3_location,
            sr4_location: response[i].sr4_location,
            sr5_location: response[i].sr5_location,
            crank_height_top: response[i].crank_height_top,
            crank_height_end: response[i].crank_height_end,
            crank2_height_top: response[i].crank2_height_top,
            crank2_height_end: response[i].crank2_height_end,
            sl1_length: response[i].sl1_length,
            sl2_length: response[i].sl2_length,
            sl3_length: response[i].sl3_length,
            sl1_dia: response[i].sl1_dia,
            sl2_dia: response[i].sl2_dia,
            sl3_dia: response[i].sl3_dia,
            total_sl_length: response[i].total_sl_length,
            no_of_cr_top: response[i].no_of_cr_top,
            cr_spacing_top: response[i].cr_spacing_top,
            no_of_cr_end: response[i].no_of_cr_end,
            cr_spacing_end: response[i].cr_spacing_end,
            cr_end_remarks: response[i].cr_end_remarks == null ? "" : response[i].cr_end_remarks,
            extra_support_bar_ind: response[i].extra_support_bar_ind == null ? "None" : response[i].extra_support_bar_ind,
            extra_support_bar_dia: response[i].extra_support_bar_dia == null ? 0 : response[i].extra_support_bar_dia,
            extra_cr_no: response[i].extra_cr_no == null ? 0 : response[i].extra_cr_no,
            extra_cr_loc: response[i].extra_cr_loc == null ? 0 : response[i].extra_cr_loc,
            extra_cr_dia: response[i].extra_cr_dia == null ? 0 : response[i].extra_cr_dia,
            mainbar_length_2layer: response[i].mainbar_length_2layer,
            mainbar_location_2layer: response[i].mainbar_location_2layer,
            bundle_same_type: response[i].bundle_same_type,
            per_set: response[i].per_set,
            bbs_no: response[i].bbs_no,
            cage_remarks: response[i].cage_remarks
          }
        }
      }
    })

  }
  productClicked(product: any) {
    console.log("product", product);
    if (this.products.some((obj: any) => obj.JobID === product.JobID)) {
      this.products = this.products.filter(({ el }) => !el.includes(product.JobID));
    } else {
      this.products.push(product.JobID);
    }
  }
  toggleClass(event: any) {
    const className = "product-clicked";
    console.log(event.currentTarget);
    const hasClass = event.currentTarget.classList.contains(className);
    if (hasClass) {
      this.renderer.removeClass(event.currentTarget, className);
    } else {
      this.renderer.addClass(event.currentTarget, className);
    }
  }
}
