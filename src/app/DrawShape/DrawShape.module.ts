import { CommonModule } from '@angular/common'
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../app.component';
import { DrawShapeRoutingModule } from './DrawShape-routing.module';
// import { DrawShapeComponent } from './DrawShape.component';
import { CabShapeMasterComponent } from './cab-shape-master/cab-shape-master.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AllShapesComponent } from './cab-shape-master/all-shapes/all-shapes.component';  


@NgModule({
    declarations: [
       CabShapeMasterComponent,AllShapesComponent, 
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      NgbModule,
      DrawShapeRoutingModule,
      NgSelectModule
    ],
    providers: [

    ],
    entryComponents: [],
    exports: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  export class DrawShapeModule {}

