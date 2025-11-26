import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 
  startTime:any;// = '14/03/2022, 17:12:19';
  stopTime:any
  inHhMmSsFormat:any;
  interval: any;
  display: any = "00:00";
  constructor(private datePipe: DatePipe) {}

  ngOnInit() {

    // this.interval = setInterval(() => {
    //   this.calculatetime();
    // }, 1000);




  }
  calculatetime()
  {
    let create_date='2023-01-05 20:43:04.023'
    this.startTime= new Date(create_date);      //this.datePipe.transform(dte,'dd/MM/yyyy, hh:mm:ss' );
    this.stopTime= new Date();/// this.datePipe.transform(new Date(),'dd/MM/yyyy, hh:mm:ss' );//new Date();
    
    console.log(this.startTime)
    console.log(this.stopTime)
    
    const msBetweenDates =  this.stopTime.getTime()-this.startTime.getTime() ;
    this.convertMsToTime(msBetweenDates);
  }
   convertMsToTime(milliseconds: number) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
  
    seconds = seconds % 60;
    minutes = minutes % 60;
    this.display=hours +':'+minutes+':'+seconds;
    console.log('Difference in hh:mm:ss format: ', hours +':'+minutes+':'+seconds);
  }
  EndProcessClick()
  {
    if (this.interval) {
      clearInterval(this.interval);
   }
  }



}
