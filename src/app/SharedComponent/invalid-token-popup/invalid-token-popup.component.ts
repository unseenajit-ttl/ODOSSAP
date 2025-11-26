import { Component } from '@angular/core';

@Component({
  selector: 'app-invalid-token-popup',
  templateUrl: './invalid-token-popup.component.html',
  styleUrls: ['./invalid-token-popup.component.css']
})
export class InvalidTokenPopupComponent {
  OpenHome() {
    window.location.href = 'https://devniceump.natsteel.com.sg/';
  }
}
