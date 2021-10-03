import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AttainmentComponent } from '../../sub-layouts/attainment/attainment.component';
import { HomeComponent } from '../../pages/home/home.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { CurriculumComponent } from 'src/app/sub-layouts/curriculum/curriculum.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CurriculumComponent,
    AttainmentComponent,
    HomeComponent,
    DashboardComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
