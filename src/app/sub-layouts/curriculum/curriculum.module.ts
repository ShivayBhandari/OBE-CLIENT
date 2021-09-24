import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurriculumRoutingModule } from './curriculum-routing.module';
import { CoursesComponent } from '../../pages/courses/courses.component';
import { CoMappingComponent } from '../../pages/co-mapping/co-mapping.component';


@NgModule({
  declarations: [
    CoursesComponent,
    CoMappingComponent
  ],
  imports: [
    CommonModule,
    CurriculumRoutingModule
  ]
})
export class CurriculumModule { }
