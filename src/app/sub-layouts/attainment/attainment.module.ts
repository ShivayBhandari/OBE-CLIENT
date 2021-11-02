import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttainmentRoutingModule } from './attainment-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImportsMarksComponent } from '../../pages/imports-marks/imports-marks.component';
import { CoAttainmentComponent } from '../../pages/co-attainment/co-attainment.component';


@NgModule({
  declarations: [
    ImportsMarksComponent,
    CoAttainmentComponent
  ],
  imports: [
    CommonModule,
    AttainmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AttainmentModule { }
