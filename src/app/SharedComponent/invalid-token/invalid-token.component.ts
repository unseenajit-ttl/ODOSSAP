import { Component } from '@angular/core';

@Component({
  selector: 'app-invalid-token',
  templateUrl: './invalid-token.component.html',
  styleUrls: ['./invalid-token.component.css']
})
export class InvalidTokenComponent {
  OpenHome() {
    // window.location.href = 'https://ump.natsteel.com.sg/';
    window.location.href = 'https://devniceump.natsteel.com.sg/';
  }
}
