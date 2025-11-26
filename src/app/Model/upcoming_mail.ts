export interface UpcomingMailModel {
    EmailTo: string,
    CustomerCode: string,
    ProjectCode: string,
    
    EmailBy: string,
    WBS1: any[],
    WBS2: any[],
    WBS3: any[],
    StructureElement:any[],
    ProductType:any[],
    ForeCastDate:any[]
}

// EmailTo: "Ajit.kamble@tatatechnologies.com;kunal.ayer@tatatechnologies.com",
// CustomerCode: "0001101170",
// ProjectCode: "0000113012",
// OrderNumber: [
//     277882,
//     277904
// ]