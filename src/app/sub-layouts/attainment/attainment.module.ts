import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttainmentRoutingModule } from './attainment-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImportsMarksComponent } from '../../pages/imports-marks/imports-marks.component';
import { CoAttainmentComponent } from '../../pages/co-attainment/co-attainment.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { PoAttainmentComponent } from '../../pages/po-attainment/po-attainment.component';


@NgModule({
  declarations: [
    ImportsMarksComponent,
    CoAttainmentComponent,
    PoAttainmentComponent
  ],
  imports: [
    CommonModule,
    AttainmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ComponentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AttainmentModule { }
