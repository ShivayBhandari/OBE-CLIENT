import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PO_CODE, PSO_CODE } from 'src/app/models/constants';
import { Course } from 'src/app/models/course';
import { CourseOutcomes } from 'src/app/models/course-outcomes';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-co-mapping',
  templateUrl: './co-mapping.component.html',
  styleUrls: ['./co-mapping.component.css']
})
export class CoMappingComponent implements OnInit {

  coMappingForm: FormGroup;

  selectedCourse: Course;
  selectedCourseCOS: CourseOutcomes[] = [];
  selectedCourseCOCodes: string[] = [];

  poCodes: string[] = [];
  psoCodes: string[] = [];

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private dataService: DataService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.poCodes = [...PO_CODE];
    this.psoCodes = [...PSO_CODE];
  }

  getCourses(course: Course) {
    this.selectedCourse = course;
    this.httpClient.get<{ coursesCO: CourseOutcomes[] }>(
      `${environment.serverUrl}/course-outcomes/${this.selectedCourse._id}/theory-cos`,
      { headers: this.dataService.httpHeaders }
    ).toPromise()
    .then((res) => {
      this.selectedCourseCOS = res.coursesCO.map(e => e);
      this.selectedCourseCOCodes = res.coursesCO.map(e => e.coCode?.toUpperCase() || "");
      this.initialiseFormGroup();      
    }, (error) => { });
  }
  
  initialiseFormGroup(){
    this.coMappingForm = this.fb.group({
      _id: [""],
      curriculumId: [this.selectedCourse.curriculumId],
      curriculumName: [this.selectedCourse.curriculumName],
      termId: [this.selectedCourse.termId],
      termName: [this.selectedCourse.termName],
      termNo: [this.selectedCourse.termNo],
      courseTitle: [this.selectedCourse.courseTitle],
      courseCode: [this.selectedCourse.courseCode],
      courseId: [this.selectedCourse._id],
    });

    this.selectedCourseCOCodes.forEach((code, index) => {
      this.coMappingForm.addControl(code, this.fb.group({}))
    });    
  }

  addPOFormGroup(coCode: string, poCode: string, strength: number) {
    let coFormGroup: FormGroup = this.coMappingForm.get(coCode) as FormGroup;
    if(coFormGroup.contains(poCode)) {
      if(Number(strength) !== 0) {
        coFormGroup.setControl(poCode, this.fb.control(Number(strength)));
      } else {
        coFormGroup.removeControl(poCode);
      }
    } else {
      coFormGroup.addControl(poCode, this.fb.control(Number(strength)))
    }    
  }

  saveCOPOMapping() {
    let values = { ...this.coMappingForm.value };
    this.httpClient.post(
      `${environment.serverUrl}/co_po_mapping/add`,
      { ...values },
      { headers: this.dataService.httpHeaders }
    ).toPromise()
    .then((value) => {
      console.log(value);
      this.toast.success("Co PO Mapping Save Successfully", "Success");
    }, (error) => {
      console.log(error);
      this.toast.warning("Something Went Wrong!! Please Try Again", "Error");
    })
  }

}
