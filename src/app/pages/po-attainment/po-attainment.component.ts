import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course';
import { CourseOutcomes } from 'src/app/models/course-outcomes';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-po-attainment',
  templateUrl: './po-attainment.component.html',
  styleUrls: ['./po-attainment.component.css']
})
export class PoAttainmentComponent implements OnInit {

  selectedCourse: Course;
  poMap: any;
  totalAttainment: any;

  constructor(
    private httpClient: HttpClient,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
  }

  getSelectedCourse(courseObj: Course) {
    this.selectedCourse = courseObj
    this.httpClient.get<{ poMap: any, finalCo: any, cos: CourseOutcomes[] }>(
      `${environment.serverUrl}/co_po_mapping/${this.selectedCourse._id}/get-po-map/${this.selectedCourse.poMapId}`,
      { headers: this.dataService.httpHeaders }
    ).toPromise()
    .then((res) => {
      console.log(res);
      
      let poKeys = Object.keys(res.poMap).filter(x => RegExp(/[PO]/g).test(x))
      console.log(poKeys);
      
    }, (error) => { });
  }
}
