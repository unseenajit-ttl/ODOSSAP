import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BPCService } from '../../../MeshDetailing/bpc.service';


@Component({
  selector: 'app-cage-notes-popup',
  templateUrl: './cage-notes-popup.component.html',
  styleUrls: ['./cage-notes-popup.component.css']
})
export class CageNotesPopupComponent implements OnInit{
  @Input() Insert_BPC_Structuremarking:any;
  @Input() ParameterValues:any;
  @Input() commonPopupModel:any;
  cageNote:any;
  CageNotes_list: any;
  constructor(public activeModal: NgbActiveModal,
    private BPCService:BPCService,
    ) { 


  }
  ngOnInit(){

this.Load_PopulateCageNotes();
  }

  
  dismissModal() {
    this.activeModal.dismiss("User closed modal!");
  }
  applyData() {
    localStorage.setItem('cageNote',this.cageNote);
    this.activeModal.close(this.cageNote);
  }

  Load_PopulateCageNotes()
  {
    this.BPCService.PopulateCageNotes()
    .subscribe({
      next: (response) => {
        debugger;
        this.CageNotes_list = response;
      },
      error: (e) => {
  
      },
      complete: () => {

        this.cageNote = this.CageNotes_list.find((x: any)=>x.tntNoteID==this.Insert_BPC_Structuremarking.tntCageNoteId).txtCageNote;
        // this.cageNote.replace("\\n", "<br>");
      },
    });
  }
}
