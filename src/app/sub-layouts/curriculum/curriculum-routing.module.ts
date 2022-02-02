import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchesComponent } from 'src/app/pages/batches/batches.component';
import { CoMappingComponent } from 'src/app/pages/co-mapping/co-mapping.component';
import { CourseOutcomeComponent } from 'src/app/pages/course-outcome/course-outcome.component';
import { CoursesComponent } from 'src/app/pages/courses/courses.component';

const routes: Routes = [
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
  { path: 'courses/:courseId/course-outcomes', component: CourseOutcomeComponent },
  { path: 'batches', component: BatchesComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'co-mapping', component: CoMappingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurriculumRoutingModule { }
