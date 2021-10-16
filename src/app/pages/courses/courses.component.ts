import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { COURSE_TYPE, DEPARTMENTS } from 'src/app/models/constants';
import { Course } from 'src/app/models/course';
import { Curriculum } from 'src/app/models/curriculum';
import { Term } from 'src/app/models/term';
import { User } from 'src/app/models/user';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  courseForm: FormGroup | undefined;
  loader: boolean = false;

  curriculums: Curriculum[] = [];
  curriculumSub: Subscription | undefined;
  courses: Course[] = [];

  terms: Term[] = [];
  
  courseType: any;
  departments: any;

  userModel: User = JSON.parse(localStorage.getItem("user") || "");

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private data: DataService,
    private httpClient: HttpClient,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.courseType = COURSE_TYPE;
    this.departments = DEPARTMENTS;

    this.httpClient.get<{ courses: Course[] }>(`${environment.serverUrl}/courses`)
      .toPromise()
      .then((value) => {
        this.courses = value?.courses.filter(x => x.courseOwnerId === this.userModel._id);        
      }, (err) => {
        console.log(">>> error: ", err);
        
      })
  }

  initialiseForm(){
    this.courseForm = this.fb.group({
      curriculum: [null],
      term: [null],
      courseDomain: [null],
      typeOfCourse: [null], //Theory, Theory with Lab, Lab/Project Works/Others
      courseCode: [null],
      courseTitle: [null],
      courseAcronym: [null],
      theoryCredits: [null],
      tutorialCredits: [null],
      practicalCredits: [null],
      totalCredits: [null],
      totalCiaWeightage: [null],
      totalTeeWeightage: [null],
      totalWeightage: [null],
      ciaPassingMarks: [null],
      prerequisiteCourses: [null],
      courseOwner: [this.userModel.firstName + " " + this.userModel.lastName],
      courseOwnerId: [this.userModel._id],
      reviewerDepartment: [this.userModel.department],
      courseReviewer: [null],
      lastDateToReview: [null],
      totalCourseConatactHours: [null],
      totalCiaMarks: [null],
      totalMidTermMarks: [null],
      totalTeeMarks: [null],
      totalAttendanceMarks: [null],
      totalMarks: [null],
      teeDuration: [null],
      blommsDomain: [null],
      state: [true]
    });
  }

  openCourseModal(modalRef: any) {
    this.data.getCurriculums();
    this.data.curriculumsSub.subscribe(list => {
      if(list.length != 0) {
        this.curriculums = list;        
        this.initialiseForm();
        this.modalService.open(modalRef, {
          size: 'lg',
          keyboard: false,
          backdrop: 'static'
        });
      }
    })
  }

  submitForm(form: FormGroup) {
    let values = { ...form.value };
    let courseObj: Course | any = { ...form.value };    
    
    delete courseObj['curriculum'];
    delete courseObj['term'];
    courseObj.curriculumId = values.curriculum['_id'];
    courseObj.curriculumName = values.curriculum['curriculumName'];
    courseObj.termId = values.term['_id'];
    courseObj.termName = values.term['termName'];
    courseObj.termNo = values.term['termNo'];

    this.httpClient.post(`${environment.serverUrl}/courses/add-course`, { ...courseObj })
    .toPromise()
    .then((value) => {
      // console.log(":>>> Value: ", value);
      this.modalService.dismissAll();
      this.toast.success("Course Added Successfully")
    }, (err) => {
      // console.log(">>> err: ", err);
      this.toast.error(err.error.message);
    });
  }

  curriculumTerms() {
    this.terms = this.courseForm?.get('curriculum')?.value?.terms || [];
  }

  compareCurriculumsById(c1: Curriculum, c2: Curriculum) {
    return c1 && c2 && c1._id === c2._id;
  }
}