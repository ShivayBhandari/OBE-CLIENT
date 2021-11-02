import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { Assessments } from 'src/app/models/assessments';
import { Course } from 'src/app/models/course';
import { Curriculum } from 'src/app/models/curriculum';
import { Term } from 'src/app/models/term';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-imports-marks',
  templateUrl: './imports-marks.component.html',
  styleUrls: ['./imports-marks.component.css']
})
export class ImportsMarksComponent implements OnInit {

  curriculums: Curriculum[] | undefined = [];
  terms: Term[] | undefined = [];
  courses: Course[] = [];
  tempCourses: Course[] = [];

  selectedCurriculum: Curriculum | null = null;
  selectedTerm: Term | null = null;
  selectedCourse: Course | null = null;

  listSub: Subscription | undefined;

  fetching: boolean = false;
  updation: boolean = false;
  loader: boolean = false;
  assessments: Assessments[] = [];
  constructor(
    private dataService: DataService,
    private httpClient: HttpClient,
    private toast: ToastrService
  ) { }

  async ngOnInit(): Promise<any> {
    this.dataService.getCourses();
    this.dataService.getCurriculums();
    this.listSub = await combineLatest([this.dataService.curriculumsSub, this.dataService.coursessSub])
      .subscribe(([curriculums, courses]) => {
        if (curriculums.length !== 0) this.curriculums = curriculums;
        if (courses.length !== 0) this.tempCourses = courses;
      });
  }

  curriculumSelection(value: Curriculum) {
    this.selectedCurriculum = value;
    this.terms = value?.terms || [];
  }

  termselection(value: Term) {
    this.selectedTerm = value;
    this.courses = this.tempCourses.filter(x => x.curriculumId === this.selectedCurriculum?._id && x.termId === value._id) || [];
  }

  courseSelection(value: Course) {
    this.selectedCourse = value;
    this.httpClient.get<{ assessments: Assessments[] }>(`${environment.serverUrl}/assessments/${value._id}`, {
      headers: this.dataService.httpHeaders
    })
      .toPromise()
      .then((value) => {
        // console.log(">>> Value: ", value.assessments);
        this.assessments = [...value.assessments];
      }, (err) => {
        console.log(">>> error: ", err);
      })
  }

  downloadExcel(assessment: Assessments | undefined) {
    let array: any[] = ["Student Name", "URN", "CRN"];
    assessment?.questions?.forEach((e) => array.push(`Q${e.questionNo} [${e.maximumMarks}]`)); 
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([array]);
    const workbook: XLSX.WorkBook = { Sheets: { 'qrcodes': worksheet }, SheetNames: ['qrcodes'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(data, `${assessment?.courseTitle?.trim().replace(/ /g, "_").toLowerCase()}_${assessment?.assessmentName?.split(" ").join("")}_${new DatePipe('en-US').transform(new Date(), 'yyyyMMdd')}.xlsx`);
  }

  inDevelopment() {
    this.toast.success("In Development", "Coming Soon...");
  }

}
