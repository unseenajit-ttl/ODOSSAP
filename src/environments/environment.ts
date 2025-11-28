// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


// "src/app/DrawShape/fabric.min.js"  ,
// "src/app/DrawShape/main5.js"


export const environment = {
  production: false,
  //apiUrl: 'https://localhost:5003/',
 // apiUrl: 'http://172.25.1.224:89/',
  apiUrl:'https://odossap.natsteel.com.sg:444/',
  // apiUrl:'https://odos.natsteel.com.sg/GetWayAPI/',
  // apiUrl:'http://172.25.1.141:89/', // detailing prod
  // apiURL_Ordering:'https://localhost:5003/', // Ordering prod
  // ReportUrl: 'http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fGroupMarkingReport_ODOS&rs:Command=Render&'
  ReportUrl: 'http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fGroupMarkingReport_ODOS&rs:Command=Render&'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.


//test