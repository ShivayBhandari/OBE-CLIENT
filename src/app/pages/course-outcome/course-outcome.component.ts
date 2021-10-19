import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BLOOM_LEVELS, DELIVERY_METHODS } from 'src/app/models/constants';
import { Course } from 'src/app/models/course';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-course-outcome',
  templateUrl: './course-outcome.component.html',
  styleUrls: ['./course-outcome.component.css']
})
export class CourseOutcomeComponent implements OnInit, OnDestroy {

  courseId: string | undefined;
  courseModel: Course | undefined;
  courseSub: Subscription | undefined;

  bloomLevels: any;
  bloomLevelKeys: any;
  deliveryMethods: any;

  courseOutcomeForm: FormGroup | undefined;

  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(res => this.courseId = res['courseId']);

    this.bloomLevels = BLOOM_LEVELS;
    this.bloomLevelKeys = Object.keys(BLOOM_LEVELS);
    this.deliveryMethods = DELIVERY_METHODS;

    this.data.getCourses();
    this.courseSub = this.data.coursessSub.subscribe(res => {
      if(res.length != 0) {
        this.courseModel = res.find(x => x._id === this.courseId);        
      }
    })

  }

  initialisedForm(coObj = null) {
    if(coObj === null) {
      this.courseOutcomeForm = this.fb.group({
        curriculumId: [this.courseModel?.curriculumId],
        curriculumName: [this.courseModel?.curriculumName],
        termId: [this.courseModel?.termId],
        termName: [this.courseModel?.termName],
        termNo: [this.courseModel?.termNo],
        courseTitle: [this.courseModel?.courseTitle],
        courseId: [this.courseModel?._id],
        coCode: [null],
        coCodeStatement: [null],
        deliveryMethods: [null],
        cognitiveDomain: [null]
      });
    }
  }

  openCourseOutcomeModal(modalRef: any, coObj = null) {
    this.initialisedForm(coObj);
    this.modalService.open(modalRef);
  }

  submitForm(form: FormGroup) {

  }

  ngOnDestroy() {
    this.courseSub?.unsubscribe();
  }

}
