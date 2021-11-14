import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CO_CODE } from 'src/app/models/constants';
import { StudentAttainments } from 'src/app/models/student-attainments';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-co-attainment',
  templateUrl: './co-attainment.component.html',
  styleUrls: ['./co-attainment.component.css']
})
export class CoAttainmentComponent implements OnInit {

  tempFile: any = null;
  courseId: string | undefined;

  title: string | undefined;
  studentsAttainments: StudentAttainments[] = [];
  attainemntOutput: any[] = [];

  constructor(
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private dataService: DataService
  ) { }

  ngOnInit(): void {

    this.title = this.router.url.replace('/', "").split("/")[1].split("-").map(e => e.toUpperCase()).join(" ");
  }

  getStudentAttainments(courseId: string | undefined) {
    this.httpClient.get<{ attainments: StudentAttainments[] }>(
      `${environment.serverUrl}/attainments/${courseId}`,
      { headers: this.dataService.httpHeaders }
    ).toPromise()
    .then((value) => {
      let attainments: StudentAttainments[] = [ ...value.attainments ];
      let map:Map<number | undefined, any> = new Map<number | undefined, any>();

      attainments.forEach((std, idx) => {
        if(map.has(std.crn)) {
          // console.log(">>> Already Existed");
          let stdMap = { ...map.get(std?.crn) };  
          std.questions?.forEach((e, idx) => {
            stdMap.questions.push({
              ...e,
              "assessmentId": std.assessmentId,
              "assessmentName": std.assessmentName,
              "assessmentType": std.assessmentType
            });
          });
          delete stdMap?.assessmentId;
          delete stdMap?.assessmentName;
          delete stdMap?.assessmentType;   
          map.set(std.crn, { ...stdMap });
        } else {
          // console.log(">>> New Occurences");
          let obj = { ...std };
          obj.questions = obj.questions?.map(e => ({
            ...e,
            "assessmentId": std.assessmentId,
            "assessmentName": std.assessmentName,
            "assessmentType": std.assessmentType
          }));
          delete obj?.assessmentId;
          delete obj?.assessmentName;
          delete obj?.assessmentType;
          map.set(std.crn, { ...obj });
        }
      });
      map.forEach((value, key) => this.studentsAttainments.push({ ...value }));
      this.calculateDirectCOAttainemnt();
      
    }, (error) => {
      console.log(">>> error: ", error);
      
    })
  }

  calculateDirectCOAttainemnt() {
    console.log(">>> Student Attainment: ", this.studentsAttainments);
    let stdRecords = [...this.studentsAttainments];
    let benchMark = 60;
    let coCODEs = [ ...CO_CODE ];
    let CO_Object: any = {
      "CO1": { coCode: "CO1", count: 0, maximumMarks: 0, attainment: "Not Applicable", attainmentLevel: 0, attainmentType: "Very Low", attaimentPercentage: 0 },
      "CO2": { coCode: "CO2", count: 0, maximumMarks: 0, attainment: "Not Applicable", attainmentLevel: 0, attainmentType: "Very Low", attaimentPercentage: 0 },
      "CO3": { coCode: "CO3", count: 0, maximumMarks: 0, attainment: "Not Applicable", attainmentLevel: 0, attainmentType: "Very Low", attaimentPercentage: 0 },
      "CO4": { coCode: "CO4", count: 0, maximumMarks: 0, attainment: "Not Applicable", attainmentLevel: 0, attainmentType: "Very Low", attaimentPercentage: 0 },
      "CO5": { coCode: "CO5", count: 0, maximumMarks: 0, attainment: "Not Applicable", attainmentLevel: 0, attainmentType: "Very Low", attaimentPercentage: 0 },
      "CO6": { coCode: "CO6", count: 0, maximumMarks: 0, attainment: "Not Applicable", attainmentLevel: 0, attainmentType: "Very Low", attaimentPercentage: 0 }
    };
    let totalQuestions = stdRecords[0].questions?.length; // 19
    console.log(">>> Total Questions: ", totalQuestions);    

    coCODEs.forEach((code: any) => {
      CO_Object[code]['maximumMarks'] = stdRecords[0].questions?.filter(e => e.coCode === code).reduce((prev, next) => prev + (next.maximumMarks || 0), 0)
    });

    stdRecords.forEach((student, stdIdx) => {
      let A_Counter = 0;
      student.questions?.forEach((ques, quesIdx: number) => {
        if(ques.obtainedMarks === 'A') A_Counter++;
        if(ques.obtainedMarks === 'NA') student.questions[quesIdx].obtainedMarks = 'A';
      });
      if(A_Counter === totalQuestions) stdRecords.splice(stdIdx, 1);
    });    
    
    stdRecords.forEach((student, stdIdx) => {
      coCODEs.forEach((code, codeIdx) => {
        let questions = student.questions.filter(e => e.coCode === code && e.obtainedMarks !== 'A');
        let totalMarks = questions.reduce((prev, next) => prev + next.maximumMarks ,0);
        let obtainedMarks = questions.reduce((prev, next) => prev + (typeof next.obtainedMarks === 'string' ? 0 : next.obtainedMarks || 0), 0);
        let CO_AVG = Math.floor((obtainedMarks / totalMarks) * 100);
        if (CO_AVG >= benchMark) {
          CO_Object[code].count++;
        }
      });
    });
    
    coCODEs.forEach(CO => {
      if (CO_Object[CO].count != 0) {
        // let attaimentPercentage = Math.round((CO_Object[CO].count / stdRecords.length) * 100);
        let attaimentPercentage = Math.round((CO_Object[CO].count / stdRecords.length) * 100);
        CO_Object[CO].attaimentPercentage = (CO_Object[CO].count / stdRecords.length);

        if (attaimentPercentage >= 70) {
          CO_Object[CO].attainmentLevel = 3;
          CO_Object[CO].attainmentType = "High";
          CO_Object[CO].attainment = "Target Attained";
        }
        else if (attaimentPercentage >= 60) {
          CO_Object[CO].attainmentType = "Moderate";
          CO_Object[CO].attainmentLevel = 2;
          CO_Object[CO].attainment = "Target Attained";
        }
        else if (attaimentPercentage >= 50) {
          CO_Object[CO].attainmentLevel = 1;
          CO_Object[CO].attainmentType = "Low";
          CO_Object[CO].attainment = "Target Attained";
        }
        else {
          CO_Object[CO].attainment = "Target Not Attained";
        }
      }
    });

    console.log(CO_Object);
    this.attainemntOutput = Object.values(CO_Object) || [];
  }

}
