import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Bendinglimit } from 'src/app/Model/bendinglimit';
import { OrderService } from 'src/app/Orders/orders.service';

@Component({
  selector: 'app-binding-limit',
  templateUrl: './binding-limit.component.html',
  styleUrls: ['./binding-limit.component.css']
})
export class BindingLimitComponent {
  bendinglimitTable:Bendinglimit[]=[]
  constructor(public activeModal: NgbActiveModal,
    private orderService: OrderService) { }

  ngOnInit(): void {
    debugger

    this.GetBendingList()

  }
  GetBendingList(): void {
    debugger;
  
    this.orderService.getBendingList().subscribe({
      next: (response) => {
        console.log("Bendingresponse", response);
        this.bendinglimitTable=response;
      },
      error: (e) => {
      },
      complete: () => {

      },
    });

  }


}
