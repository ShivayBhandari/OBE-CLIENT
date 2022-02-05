import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course';

@Component({
  selector: 'app-attainment-gap',
  templateUrl: './attainment-gap.component.html',
  styleUrls: ['./attainment-gap.component.css']
})
export class AttainmentGapComponent implements OnInit {
  selectedCourse: any;

  constructor() { }

  ngOnInit(): void {
  }


  getSelectedCourse(courseObj: Course) {
    this.selectedCourse = { ...courseObj };

    console.log(this.selectedCourse);
    
  }


}
