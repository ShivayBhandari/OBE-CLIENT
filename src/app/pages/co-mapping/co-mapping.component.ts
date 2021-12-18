import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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

  selectedPO: any;
  enableSelects: boolean = false;

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
      this.getPOMap();
    }, (error) => { });
  }
  
  getPOMap() {
    this.httpClient.get<{ poMap: any }>(
      `${environment.serverUrl}/co_po_mapping/${this.selectedCourse._id}/get-po-map/${this.selectedCourse.poMapId}`,
      { headers: this.dataService.httpHeaders }
    ).toPromise()
    .then((res) => {
      this.selectedPO = res.poMap;
      this.reInitialiseForm();
    }, (error) => { });
  }

  reInitialiseForm() {
    // this.selectedCourseCOCodes.forEach((code, idx) => {
    //   Object.assign([], this.selectedPO[code]).forEach((po: string, index: number) => {          
    //     let selectRef = <HTMLInputElement>document.getElementById(code+po+'Strength');          
    //     selectRef.checked = true;
    //     this.addPOFormGroup(code, po);
    //   });
    // });
  }
  
  initialiseFormGroup(){
    this.coMappingForm = this.fb.group({
      _id: [this.selectedCourse.poMapId || ""],
      curriculumId: [this.selectedCourse.curriculumId],
      curriculumName: [this.selectedCourse.curriculumName],
      termId: [this.selectedCourse.termId],
      termName: [this.selectedCourse.termName],
      termNo: [this.selectedCourse.termNo],
      courseTitle: [this.selectedCourse.courseTitle],
      courseCode: [this.selectedCourse.courseCode],
      courseId: [this.selectedCourse._id],
    });

    // this.selectedCourseCOCodes.forEach((code, index) => {
    //   this.coMappingForm.addControl(code, this.fb.array([]))
    // });    
  }

  addPOFormGroup(coCode: string, poCode: string) {
    if(this.coMappingForm.contains(poCode)) {
      let coFormArray: FormArray = this.coMappingForm.get(poCode) as FormArray;
      if(coFormArray.value.includes(coCode)) {
        let idx: number = coFormArray.controls.findIndex((x: any) => x === coCode)
        if(coFormArray.length > 1) {
          coFormArray.removeAt(idx);
        } else {
          this.coMappingForm.removeControl(poCode)
        }
      } else {
        coFormArray.push(this.fb.control(coCode))
      }     
    } else {
      this.coMappingForm.addControl(poCode, this.fb.array([
        this.fb.control(coCode)
      ]))
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
