import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class dataTransferService {

    Pagename: BehaviorSubject<any> = new BehaviorSubject('')
    isEditableBPC: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isEditableBPC$ = this.isEditableBPC.asObservable();
    private dataSubject = new BehaviorSubject<any>(null);
    data$ = this.dataSubject.asObservable();

    constructor() {
    }

    sendData(data: any) {
      this.dataSubject.next(data);
    }
    setBpc(val:boolean) {
      this.isEditableBPC.next(val);
    }

}
