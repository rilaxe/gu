import { Injectable } from '@angular/core';
import { Config, Menu } from '../bars/types';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/internal/operators/retry';

@Injectable({ providedIn: 'root' })
export class SchoolService {
    private num = 2;
    constructor(private http: HttpClient) {
    }

   
    listSchools() {
        return this.http.get<any>(`${environment.apiUrl}/school/listSchools`)
            .pipe(retry(this.num));
    }

    getSchoolById(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getSchoolById`, {params: {id: id}})
            .pipe(retry(this.num));
    }

    getSchoolData() {
        return this.http.get<any>(`${environment.apiUrl}/school/getSchoolData`)
            .pipe(retry(this.num));
    }

    updateSchool(profile: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/updateSchool`, profile)
            .pipe(retry(this.num));
    }


    registerStudentsBulk(profile: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/registerStudentsBulk`, profile)
            .pipe(retry(this.num));
    }

    registerStaffBulk(profile: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/registerStaffBulk`, profile)
            .pipe(retry(this.num));
    }

    saveClassLevel(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/createClassLevel`, data)
            .pipe(retry(this.num));
    }

    getSchoolLevel() {
        return this.http.get<any>(`${environment.apiUrl}/school/getSchoolLevel`)
            .pipe(retry(this.num));
    }
    getStaffList() {
        return this.http.get<any>(`${environment.apiUrl}/school/getStaffList`)
            .pipe(retry(this.num));
    }

    getSchoolClasses() {
        return this.http.get<any>(`${environment.apiUrl}/school/getSchoolClasses`)
            .pipe(retry(this.num));
    }

    deleteClassLevel(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/deleteClassLevel`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    saveClassName(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/CreateClassName`, data)
            .pipe(retry(this.num));
    }

    updateClassName(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/updateClassName`, data)
            .pipe(retry(this.num));
    }

    deleteClassName(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/deleteClassName`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    saveSubjects(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/createSubject`, data)
            .pipe(retry(this.num));
    }

    getSubjects() {
        return this.http.get<any>(`${environment.apiUrl}/school/getSubjects`)
            .pipe(retry(this.num));
    }

    deleteSubject(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/deleteSubject`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    updateSubject(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/updateSubject`, data)
            .pipe(retry(this.num));
    }


    saveGradeScale(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/createGradeScale`, data)
            .pipe(retry(this.num));
    }

    getGradeScale() {
        return this.http.get<any>(`${environment.apiUrl}/school/getGradeScale`)
            .pipe(retry(this.num));
    }



    getGradeScaleByCategory(levelId: number) {
        return this.http.get<any>(`${environment.apiUrl}/school/getGradeScaleByCategory`, {params: {levelId: levelId}})
            .pipe(retry(this.num));
    }

    deleteGradeScale(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/deleteGradeScale`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    deleteAutoComment(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/deleteAutoComment`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    updateGradeScale(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/updateGradeScale`, data)
            .pipe(retry(this.num));
    }

    updateAutoComment(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/updateAutoComment`, data)
            .pipe(retry(this.num));
    }

    updateCaSetup(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/updateGradeScale`, data)
            .pipe(retry(this.num));
    }

    saveCaSetup(data: any, category: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/createCAsetup`, data, {params: {category: category}})
            .pipe(retry(this.num));
    }

    saveSpecialCaSetup(data: any, category: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/createSpecialCAsetup`, data, {params: {category: category}})
            .pipe(retry(this.num));
    }

    getCASetup(category: string ) {
        return this.http.get<any>(`${environment.apiUrl}/school/getCASetup`, {params: {category: category}})
            .pipe(retry(this.num));
    }

    getSpecialCASetup(category: string ) {
        return this.http.get<any>(`${environment.apiUrl}/school/getSpecialCASetup`, {params: {category: category}})
            .pipe(retry(this.num));
    }

    saveMotor(name: string, maxScore: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/createPsycomotor`, '', {params: {name: name, maxScore: maxScore}})
            .pipe(retry(this.num));
    }

    getPsycomotor() {
        return this.http.get<any>(`${environment.apiUrl}/school/getPsycomotor`)
            .pipe(retry(this.num));
    }

    deletePsycomotor(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/deletePsycomotor`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    createSession(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/createSession`, data)
            .pipe(retry(this.num));
    }

    createTerm(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/createTerm`, data)
            .pipe(retry(this.num));
    }

    deleteTerm(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/deleteTerm`, data)
            .pipe(retry(this.num));
    }

    editTerm(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/editTerm`, data)
            .pipe(retry(this.num));
    }

    deleteSession(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/deleteSession`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    getSession() {
        return this.http.get<any>(`${environment.apiUrl}/school/getSession`)
            .pipe(retry(this.num));
    }

    setCurrentSession(id: number, sessionName: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/setCurrentSession`, '', {params: {id: id, sessionName: sessionName}})
            .pipe(retry(this.num));
    }

    getCurrentSession() {
        return this.http.get<any>(`${environment.apiUrl}/school/getCurrentSession`)
            .pipe(retry(this.num));
    }

    setTerm(term: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/SetCurrentTerm`, '', {params: {term: term}})
            .pipe(retry(this.num));
    }

    saveResumptiondate(session: string, sessionId: string, term: string, resumptionDate: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/saveResumptiondate`, '', {params: {session: session, sessionId: sessionId, term: term, resumptionDate: resumptionDate}})
            .pipe(retry(this.num));
    }

    getNextTerm(sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getNextTerm`, {params: {sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getClassNames() {
        return this.http.get<any>(`${environment.apiUrl}/school/getClassNames`)
            .pipe(retry(this.num));
    }

    getClassNamesBySchool(schoolId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getClassNamesBySchool`, {params: {schoolId: schoolId}})
            .pipe(retry(this.num));
    }

    getClassByLevel(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getClassByLevel`, {params: {currentClassLevelId: id}})
            .pipe(retry(this.num));
    }

    getClassLevels() {
        return this.http.get<any>(`${environment.apiUrl}/school/getClassLevels`)
            .pipe(retry(this.num));
    }

    getStudents(currentClass: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudents`, {params: {currentClass: currentClass}})
            .pipe(retry(this.num));
    }

    getStudentsBySession(classId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentsBySession`, {params: {classId: classId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getStudentById(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentById`, {params: {id: id}})
            .pipe(retry(this.num));
    }

    getStudentAndCatById(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentAndCatById`, {params: {id: id}})
            .pipe(retry(this.num));
    }

    getStudentByIdOnly() {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentByIdOnly`)
            .pipe(retry(this.num));
    }

    getStaffByIdOnly() {
        return this.http.get<any>(`${environment.apiUrl}/school/getStaffByIdOnly`)
            .pipe(retry(this.num));
    }

    getStudentsByLevel(currentClass: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentsByLevel`, {params: {currentClassLevelId: currentClass}})
            .pipe(retry(this.num));
    }

    getNoInClass(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/CountStudentsByClass`, {params: {id: id}})
            .pipe(retry(this.num));
    }

    getNoInClassBySession(classId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/CountStudentsInClassBySession`, {params: {classId: classId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getNoInClassBySessionClassId(classId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/CountStudentsBySessionClassId`, {params: {classId: classId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getNoInClassByAnnualSession(classId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/CountStudentsInClassByAnnualSession`, {params: {classId: classId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getNoInClassId(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/CountStudentsByClassId`, {params: {id: id}})
            .pipe(retry(this.num));
    }

    getAllStudents() {
        return this.http.get<any>(`${environment.apiUrl}/school/getAllStudents`)
            .pipe(retry(this.num));
    }

    getActiveStudents(pgi: string, size: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getActiveStudents`, {params: {pgi: pgi, size: size}})
            .pipe(retry(this.num));
    }

    getActiveStudentKeyup(term: string, pgi: string, size: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getActiveStudentKeyup`, {params: {term: term, pgi: pgi, size: size}})
            .pipe(retry(this.num));
    }

    getDeactivatedStudents() {
        return this.http.get<any>(`${environment.apiUrl}/school/getDeactivatedStudents`)
            .pipe(retry(this.num));
    }

    getAllGraduatedStudents() {
        return this.http.get<any>(`${environment.apiUrl}/school/getAllGraduatedStudent`)
            .pipe(retry(this.num));
    }

    getAllStaff() {
        return this.http.get<any>(`${environment.apiUrl}/school/getAllStaff`)
            .pipe(retry(this.num));
    }

    getAllDeactivatedStaff() {
        return this.http.get<any>(`${environment.apiUrl}/school/getAllDeactivatedStaff`)
            .pipe(retry(this.num));
    }

    getStaffById(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStaffById`, {params: {id: id}})
            .pipe(retry(this.num));
    }

    saveClassPlacement(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/saveClassPlacement`, data)
            .pipe(retry(this.num));
    }

    saveGraduateClassPlacement(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/saveGraduateClassPlacement`, data)
            .pipe(retry(this.num));
    }

    saveCoreSubject(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/saveCoreSubject`, data)
            .pipe(retry(this.num));
    }

    randomizePlacement(classId: string, destinationClassId: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/randomizePlacement`, '', {params: {classlevelId: classId, destinationClassLevelId: destinationClassId}})
            .pipe(retry(this.num));
    }

    normalizePlacement(classId: string, destinationClassId: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/normalizePlacement`, '', {params: {classlevelId: classId, destinationClassLevelId: destinationClassId}})
            .pipe(retry(this.num));
    }

    normalizeGraduatePlacement(classId: string, destinationClassId: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/normalizeGraduatePlacement`, '', {params: {classlevelId: classId, destinationClassLevelId: destinationClassId}})
            .pipe(retry(this.num));
    }

    finalizePlacement(classId: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/finalizePlacement`, '', {params: {classlevelId: classId}})
            .pipe(retry(this.num));
    }

    finalizeGraduatePlacement(classId: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/finalizeGraduatePlacement`, '', {params: {classlevelId: classId}})
            .pipe(retry(this.num));
    }

    savePsycomotorEntry(data: any, classId: string, sessionId: string, term: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/savePsycomotorEntry`, data, {params: {classId: classId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getStudentsPsycomotor(currentClass: string, currentSessionId: string, currentTerm: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentsPsycomotor`, {params: {currentClass: currentClass, sessionId: currentSessionId, term: currentTerm}})
            .pipe(retry(this.num));
    }

    getClassSubjects() {
        return this.http.get<any>(`${environment.apiUrl}/school/getClassSubjects`)
            .pipe(retry(this.num));
    }

    getSubjectByClass(classId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getSubjectByClass`, {params: {classId: classId}})
            .pipe(retry(this.num));
    }

    mySubjects() {
        return this.http.get<any>(`${environment.apiUrl}/school/MySubjects`)
            .pipe(retry(this.num));
    }

    getSubjectByLevel(classId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getSubjectByLevel`, {params: {classLevelId: classId}})
            .pipe(retry(this.num));
    }

    saveResultEntry(data: any, sessionId: string, term: string, subjectId: string, classId: string, className: string, shouldOverride: string) {
        if (shouldOverride == 'TRUE') {
            return this.http.post<any>(`${environment.apiUrl}/school/saveResultEntryBulk`, data, {params: {sessionId: sessionId, term: term, subjectId: subjectId, classId: classId, className: className, shouldOverride: shouldOverride}})
            .pipe(retry(this.num));
        } else {
            return this.http.post<any>(`${environment.apiUrl}/school/saveResultEntry`, data, {params: {sessionId: sessionId, term: term, subjectId: subjectId, classId: classId, className: className}})
            .pipe(retry(this.num));
        }
    }

    saveSpecialResultEntry(data: any, sessionId: string, term: string, subjectId: string, classId: string, className: string, examtype: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/saveSpecialResultEntry`, data, {params: {sessionId: sessionId, term: term, subjectId: subjectId, classId: classId, className: className, examtype: examtype}})
            .pipe(retry(this.num));
    }

    getResultEntryData(currentClassId: string, sessionId: string, term: string, subjectId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getResultEntryData`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, subjectId: subjectId}})
            .pipe(retry(this.num));
    }

    getResultsByClass(currentClassId: string, sessionId: string, term: string, subjectId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getResultsByClass`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, subjectId: subjectId}})
            .pipe(retry(this.num));
    }

    getSpecialResultsByClass(currentClassId: string, sessionId: string, term: string, subjectId: string, examtype: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getSpecialResultsByClass`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, subjectId: subjectId, examtype: examtype}})
            .pipe(retry(this.num));
    }

    getCaSetupByClass(classId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getCaSetupByClass`, {params: {classId: classId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }
    
    getSpecialCaSetupByClass(sessionId: string, term: string, examtype: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getSpecialCaSetupByClass`, {params: {sessionId: sessionId, term: term, examtype: examtype}})
            .pipe(retry(this.num));
    }

    testGetCaSetupByClass(category: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/testGetCaSetupByClass`, {params: {category: category}})
            .pipe(retry(this.num));
    }

    updateStudent(student: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/updateStudentPersonalProfile`, student)
            .pipe(retry(this.num));
    }

    updateStaff(student: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/updateStaffPersonalProfile`, student)
            .pipe(retry(this.num));
    }

    createStaffSubject(staff: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/createStaffSubject`, staff)
            .pipe(retry(this.num));
    }

    getStaffSubjects(staffId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStaffSubject`, {params: {id: staffId}})
            .pipe(retry(this.num));
    }

    deleteStaffSubjects(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/deleteStaffSubject`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    getResultsByStudent(currentClassId: string, sessionId: string, term: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getResultsPageSession`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, studentId: studentId}})
            .pipe(retry(this.num));
    }

    getSpecialResultsByStudent(currentClassId: string, sessionId: string, term: string, studentId: string, examtype: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getSpecialResultsPageSession`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, studentId: studentId, examtype: examtype}})
            .pipe(retry(this.num));
    }

    getResultsByStudentAll(currentClassId: string, sessionId: string, term: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getResultsPageAll`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, studentId: studentId}})
            .pipe(retry(this.num));
    }

    getResultsPageAllSession(currentClassId: string, sessionId: string, term: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getResultsPageAllSession`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, studentId: studentId}})
            .pipe(retry(this.num));
    }

    

    getAnnualResultsPage(currentClassId: string, sessionId: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getAnnualResultsPage`, {params: {currentClassId: currentClassId, sessionId: sessionId, studentId: studentId}})
            .pipe(retry(this.num));
    }
    

    getAnnualResultsPageSession(currentClassId: string, sessionId: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getAnnualResultsPageSession`, {params: {currentClassId: currentClassId, sessionId: sessionId, studentId: studentId}})
            .pipe(retry(this.num));
    }

    getAnnualResultsPagePrincipal(currentClassId: string, sessionId: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getAnnualResultsPagePrincipal`, {params: {currentClassId: currentClassId, sessionId: sessionId, studentId: studentId}})
            .pipe(retry(this.num));
    }

    getAnnualResultsPageAll(currentClassId: string, sessionId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getAnnualResultsPageAll`, {params: {currentClassId: currentClassId, sessionId: sessionId}})
            .pipe(retry(this.num));
    }

    getAnnualResultsPageAllSession(currentClassId: string, sessionId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getAnnualResultsPageAllSession`, {params: {currentClassId: currentClassId, sessionId: sessionId}})
            .pipe(retry(this.num));
    }

    getResultsAverageByClass(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getResultsAverageByClass`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getResultsAverageBySession(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getResultsAverageBySession`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getSpecialResultsAverageBySession(currentClassId: string, sessionId: string, term: string, examtype: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getSpecialResultsAverageBySession`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, examtype: examtype}})
            .pipe(retry(this.num));
    }

    getResultsAverageBySessionClassOnly(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getResultsAverageBySessionClassOnly`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getMidtermResultsAverageBySession(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getMidtermResultsAverageBySession`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }
    

    getResultsAverageBySessionAnnual(currentClassId: string, sessionId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getResultsAverageBySessionAnnual`, {params: {currentClassId: currentClassId, sessionId: sessionId}})
            .pipe(retry(this.num));
    }

    getAnnualResultsAverageByClass(currentClassId: string, sessionId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getAnnualResultsAverageByClass`, {params: {currentClassId: currentClassId, sessionId: sessionId}})
            .pipe(retry(this.num));
    }

    getMidtermResultsAverageBySessionForParent(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getMidtermResultsAverageBySessionForParent`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getResultsAverageByClassForParent(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getResultsAverageByClassForParent`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getGradeScaleByClass(classId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getGradeScaleByClass`, {params: {classId: classId}})
            .pipe(retry(this.num));
    }

    
    getPsycomotorByStudent(sessionId: string, term: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getPsycomotorByStudent`, {params: {sessionId: sessionId, term: term, studentId: studentId}})
            .pipe(retry(this.num));
    }

    getPsycomotorByStudentBulk(sessionId: string, term: string, classId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getPsycomotorByStudentBulk`, {params: {sessionId: sessionId, term: term, classId: classId}})
            .pipe(retry(this.num));
    }

    getPsycomotorByList(sessionId: string, term: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getPsycomotorByList`, {params: {sessionId: sessionId, term: term, studentId: studentId}})
            .pipe(retry(this.num));
    }

    getSkillList() {
        return this.http.get<any>(`${environment.apiUrl}/school/getSkillList`)
            .pipe(retry(this.num));
    }

    getPsycomotorByClass(sessionId: string, term: string, classId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getPsycomotorByStudent`, {params: {sessionId: sessionId, term: term, classId: classId}})
            .pipe(retry(this.num));
    }

    saveFormTeacherComment(data: any, currentClassId: string, sessionId: string, term: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/saveFormTeacherComment`, data, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    saveHostelSupervisorComment(data: any, currentClassId: string, sessionId: string, term: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/saveFormHostelComment`, data, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getResultsAverageByClassComment(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getResultsAverageByClassComment`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getAnnualResultsAverageByClassComment(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getAnnualResultsAverageByClassComment`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getResultsAverageByClassPrincipalComment(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getResultsAverageByClassPrincipalComment`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    saveFormPrincipalComment(data: any, currentClassId: string, sessionId: string, term: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/saveFormPrincipalComment`, data, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getMastersheetByClass(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getMastersheetByClass`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getMastersheetByClassFlex(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getMastersheetByClassFlex`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getAnnualMastersheetByClass(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getAnnualMastersheetByClass`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getAnnualMastersheetByClassFlex(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getAnnualMastersheetByClassFlex`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    createPublishByLevel(currentLevelId: string, currentLevel: string, sessionId: string, session: string, term: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/createPublishByLevel`, '', {params: {currentLevelId: currentLevelId, currentLevel: currentLevel, sessionId: sessionId, session: session, term: term}})
            .pipe(retry(this.num));
    }

    getPublishedResult() {
        return this.http.get<any>(`${environment.apiUrl}/school/getPublishedResult`)
            .pipe(retry(this.num));
    }

    deletePublishByLevel(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/deletePublishByLevel`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    getStudentResultComment(currentClassId: string, sessionId: string, term: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentResultComment`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, studentId: studentId}})
            .pipe(retry(this.num));
    }

    getStudentResultCommentByClass(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentResultCommentByClass`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getPopulationData() {
        return this.http.get<any>(`${environment.apiUrl}/school/getPopulationData`)
            .pipe(retry(this.num));
    }

    getGenderStat() {
        return this.http.get<any>(`${environment.apiUrl}/school/getGenderStat`)
            .pipe(retry(this.num));
    }

    getStudentResultsByClass(currentClassId: string, sessionId: string, term: string, subjectId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getResultsByClass`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, subjectId: subjectId}})
            .pipe(retry(this.num));
    }

    getStudentByClass(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentByClass`, {params: {classId: id}})
            .pipe(retry(this.num));
    }

    createDiscipline(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/createDiscipline`, data)
            .pipe(retry(this.num));
    }

    getDiscipline() {
        return this.http.get<any>(`${environment.apiUrl}/school/getDiscipline`)
            .pipe(retry(this.num));
    }

    deleteDiscipline(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/deleteDiscipline`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    getCoreSubjects(classId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getCoreSubjects`, {params: {classLevelId: classId}})
            .pipe(retry(this.num));
    }

    savePromotionAverage(failLimit: string, classId: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/createPromotionAverage`, '', {params: {failLimit: failLimit, classId: classId}})
            .pipe(retry(this.num));
    }

    savePromotionByCount(totalPass: string, classId: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/updatePromotionValue`, '', {params: {classId: classId, value: totalPass}})
            .pipe(retry(this.num));
    }

    getPromotionAverage(classId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getPromotionAverage`, {params: {classId: classId}})
            .pipe(retry(this.num));
    }

    getCoreSubjectsByClass(classId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getCoreSubjectsByClass`, {params: {classId: classId}})
            .pipe(retry(this.num));
    }

    updateCoreSubject(data: any, classId: string, coreMustPass: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/updateCoreSubject`, data, {params: {classId: classId, coreMustPass: coreMustPass}})
            .pipe(retry(this.num));
    }

    createPromotionSetting(settingsType: string, settingsValue: string, classId: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/createPromotionSetting`, '', {params: {settingsType: settingsType, settingsValue: settingsValue, classId: classId}})
            .pipe(retry(this.num));
    }

    getPromotionSetting(classId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getPromotionSetting`, {params: {classId: classId}})
            .pipe(retry(this.num));
    }

    getPromotionPositionAverageStudents(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getPromotionPositionAverageStudents`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getPromotionPositionAnnualAverageStudents(currentClassId: string, sessionId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getAnnualResultsAverageByClass`, {params: {currentClassId: currentClassId, sessionId: sessionId}})
            .pipe(retry(this.num));
    }

    getPromotionCoreSubject(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getPromotionCoreSubject`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getStudentPromotionCoreSubject(currentClassId: string, sessionId: string, term: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentPromotionCoreSubject`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, studentId: studentId}})
            .pipe(retry(this.num));
    }

    getPromotionAnnualCoreSubject(currentClassId: string, sessionId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getPromotionAnnualCoreSubject`, {params: {currentClassId: currentClassId, sessionId: sessionId}})
            .pipe(retry(this.num));
    }

    getStudentPromotionAnnualCoreSubject(currentClassId: string, sessionId: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentPromotionAnnualCoreSubject`, {params: {currentClassId: currentClassId, sessionId: sessionId, studentId: studentId}})
            .pipe(retry(this.num));
    }

    getPromotionByCount(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getPromotionByCount`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getPromotionByCountAnnual(currentClassId: string, sessionId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getPromotionByCountAnnual`, {params: {currentClassId: currentClassId, sessionId: sessionId}})
            .pipe(retry(this.num));
    }

    getStudentPromotionByCount(currentClassId: string, sessionId: string, term: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getPromotionByCount`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, studentId: studentId}})
            .pipe(retry(this.num));
    }

    getStudentPromotionByCountAnnual(currentClassId: string, sessionId: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getPromotionByCountAnnual`, {params: {currentClassId: currentClassId, sessionId: sessionId, studentId: studentId}})
            .pipe(retry(this.num));
    }

    checkResultPublication(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/checkResultPublication`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    blockStudentResult(id: string, reason: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/blockStudentResult`, '', {params: {id: id, reason: reason}})
            .pipe(retry(this.num));
    }

    unblockStudentResult(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/unblockStudentResult`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    getBillingData() {
        return this.http.get<any>(`${environment.apiUrl}/school/getBillingData`)
            .pipe(retry(this.num));
    }

    saveTemporaryPayment(plan: string, amount: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/saveTemporaryPayment`, '', {params: {plan: plan, amount: amount}})
            .pipe(retry(this.num));
    }

    savePayment(plan: string, amount: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/savePayment`, '', {params: {plan: plan, amount: amount}})
            .pipe(retry(this.num));
    }

    getAcademicRecordData(currentClassId: string, sessionId: string, term: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/academicRecordChartData`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, studentId: studentId}})
            .pipe(retry(this.num));
    }

    getAcademicAverage(currentClassId: string, sessionId: string, term: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getAcademicAverage`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, studentId: studentId}})
            .pipe(retry(this.num));
    }

    getAdminUser() {
        return this.http.get<any>(`${environment.apiUrl}/school/getAdminUser`)
            .pipe(retry(this.num));
    }

    updateAdminEmail(email: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/updateAdminEmail`, '', {params: {email: email, password: password}})
            .pipe(retry(this.num));
    }

    updateAdminPassword(adminPassword: string, newAdminPassword: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/updateAdminPassword`, '', {params: {adminPassword: adminPassword, newAdminPassword: newAdminPassword}})
            .pipe(retry(this.num));
    }

    addLoginField(fieldname: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/addLoginField`, '', {params: {fieldname: fieldname}})
            .pipe(retry(this.num));
    }
    
    removeLoginField(fieldname: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/removeLoginField`, '', {params: {fieldname: fieldname}})
            .pipe(retry(this.num));
    }
    addStaffLoginField(fieldname: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/addStaffLoginField`, '', {params: {fieldname: fieldname}})
            .pipe(retry(this.num));
    }

    removeStaffLoginField(fieldname: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/removeStaffLoginField`, '', {params: {fieldname: fieldname}})
            .pipe(retry(this.num));
    }

    getLoginFields() {
        return this.http.get<any>(`${environment.apiUrl}/school/getLoginFields`)
            .pipe(retry(this.num));
    }

    getStaffLoginFields() {
        return this.http.get<any>(`${environment.apiUrl}/school/getStaffLoginFields`)
            .pipe(retry(this.num));
    }

    deactivateAccount(id: string, reason: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/deactivateStudent`, '', {params: {id: id, reason: reason}})
            .pipe(retry(this.num));
    }

    activateAccount(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/activateStudent`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    deactivateStaff(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/deactivateStaff`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    activateStaff(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/activateStaff`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    updateSubjectOrder(value1: string, value2: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/updateSubjectOrder`, '', {params: {value1: value1, value2: value2}})
            .pipe(retry(this.num));
    }

    getElectiveSubjects() {
        return this.http.get<any>(`${environment.apiUrl}/school/getElectiveSubjects`)
        .pipe(retry(this.num));
    }

    enrollStudents(students: any, subjectId: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/enrollStudents`, students, {params: {subjectId: subjectId}})
            .pipe(retry(this.num));
    }

    removeEnrollStudents(students: any, subjectId: number) {
        return this.http.post<any>(`${environment.apiUrl}/school/removeEnrollStudents`, students, {params: {subjectId: subjectId}})
            .pipe(retry(this.num));
    }

    getFormTeacherClass() {
        return this.http.get<any>(`${environment.apiUrl}/school/getFormTeacherClass`)
            .pipe(retry(this.num));
    }

    createCalendarEvent(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/createCalendarEvent`, data)
            .pipe(retry(this.num));
    }

    getCalendarEvents() {
        return this.http.get<any>(`${environment.apiUrl}/school/getCalendarEvents`)
            .pipe(retry(this.num));
    }

    getCalendarEventsByTerm(term: string, sessionId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getCalendarEventsByTerm`, {params: {term: term, sessionId: sessionId}})
            .pipe(retry(this.num));
    }

    getUpcomingCalendarEvents() {
        return this.http.get<any>(`${environment.apiUrl}/school/getUpcomingCalendarEvents`)
            .pipe(retry(this.num));
    }

    deleteCalendarEvent(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/deleteCalendarEvent`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    saveAttendance(data: any, classId: string, sessionId: string, term: string, todayDate: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/saveAttendance`, data, {params: {classId: classId, sessionId: sessionId, term: term, today: todayDate}})
            .pipe(retry(this.num));
    }

    getAttendance(classId: string, sessionId: string, term: string, today: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getAttendance`, {params: {classId: classId, sessionId: sessionId, term: term, today: today}})
            .pipe(retry(this.num));
    }

    createBoardNotice(data: any, sessionId: string, term: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/createBoardNotice`, data, {params: {term: term, sessionId: sessionId}})
            .pipe(retry(this.num));
    }

    getNoticeboard() {
        return this.http.get<any>(`${environment.apiUrl}/school/getNoticeboard`)
            .pipe(retry(this.num));
    }

    editNotice(title: string, description: string, id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/EditNotice`, '', {params: {title: title, description: description, id: id}})
            .pipe(retry(this.num));
    }

    deleteNotice(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/DeleteNotice`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    obtain(blobUrl: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/Obtain`, '', { params: { blobUrl: blobUrl }, responseType: 'blob' as 'json', reportProgress: true, observe: 'events'});
    }

    getSubjectBest(levelId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getSubjectBest`, {params: {levelId: levelId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getSubjectBestAnnual(levelId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getSubjectBestAnnual`, {params: {levelId: levelId, sessionId: sessionId}})
            .pipe(retry(this.num));
    }

    getClassBest(levelId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getClassBest`, {params: {levelId: levelId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getClassBestAnnual(levelId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getClassBestAnnual`, {params: {levelId: levelId, sessionId: sessionId}})
            .pipe(retry(this.num));
    }
    

    getClasslevelBest(levelId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getClasslevelBest`, {params: {levelId: levelId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getClasslevelBestAnnual(levelId: string, sessionId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getClasslevelBestAnnual`, {params: {levelId: levelId, sessionId: sessionId}})
            .pipe(retry(this.num));
    }

    getStudentTermTotal(sessionId: string, term: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentTermTotal`, {params: {sessionId: sessionId, term: term, studentId: studentId}})
            .pipe(retry(this.num));
    }

    getStudentAnnualTotal(sessionId: string, term: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentAnnualTotal`, {params: {sessionId: sessionId, term: term, studentId: studentId}})
            .pipe(retry(this.num));
    }

    saveMidtermSettings(data: any, sessionId: string, term: string, category: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/createMidtermSettings`, data, {params: {sessionId: sessionId, term: term, category: category}})
            .pipe(retry(this.num));
    }

    getSchoolCategory() {
        return this.http.get<any>(`${environment.apiUrl}/school/getSchoolCategory`)
            .pipe(retry(this.num));
    }

    getMidtermResultsPageSession(currentClassId: string, sessionId: string, term: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getMidtermResultsPageSession`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, studentId: studentId}})
            .pipe(retry(this.num));
    }

    getMidtermMaxValue(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getMidtermMaxValue`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getBMIByClass(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getBMIByClass`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getEstimatedAttendanceByClass(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getEstimatedAttendanceByClass`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    saveWeekResultEntry(data: any, sessionId: string, week: string, term: string, subjectId: string, classId: string, className: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/saveWeeklyResultEntry`, data, {params: {sessionId: sessionId, term: term, week: week, subjectId: subjectId, classId: classId, className: className}})
            .pipe(retry(this.num));
    }

    updateWeeklyTestLouisville(data: any, sessionId: string, week: string, term: string, subjectId: string, classId: string, className: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/updateWeeklyTestLouisville`, data, {params: {sessionId: sessionId, term: term, week: week, subjectId: subjectId, classId: classId, className: className}})
            .pipe(retry(this.num));
    }

    getWeeklyResultsByClass(currentClassId: string, sessionId: string, term: string, week: string, subjectId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getWeeklyResultsByClass`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, week: week, subjectId: subjectId}})
            .pipe(retry(this.num));
    }

    getWeeklyMastersheetByClassOneSubject(currentClassId: string, sessionId: string, term: string, week: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getWeeklyMastersheetByClassOneSubject`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, week: week}})
            .pipe(retry(this.num));
    }

    getWeeklyMastersheetByClassAllSubject(currentClassId: string, sessionId: string, term: string, week: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getWeeklyMastersheetByClassAllSubject`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term, week: week}})
            .pipe(retry(this.num));
    }

    getWeeklyAnnualMastersheetByClassAllWeek(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getWeeklyAnnualMastersheetByClassAllWeek`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    obtainSignature(sessionId: string, term: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/obtainSignature`, '', { params: { sessionId: sessionId, term: term }, responseType: 'blob' as 'json', reportProgress: true, observe: 'events'});
    }

    obtainSignatureArray(sessionId: string, term: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/ObtainSignatureArray`, '', { params: { sessionId: sessionId, term: term }});
    }

    getSchoolLogo(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getSchoolLogo`, { params: { id: id }, responseType: 'blob' as 'json', reportProgress: true, observe: 'events'});
    }

    getStudentPhoto(url: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentPhoto`, { params: { url: url }, responseType: 'blob' as 'json', reportProgress: true, observe: 'events'});
    }

    getSchoolLogoArray(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getSchoolLogoArray`, { params: { id: id }});
    }

    getStudentPhotoArray(url: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentPhotoArray`, { params: { url: url }});
    }

    saveBMIEntry(data: any, sessionId: string, term: string, classId: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/saveBMIEntry`, data, {params: {sessionId: sessionId, term: term, classId: classId}})
            .pipe(retry(this.num));
    }

    getStudentBMI(sessionId: string, term: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentBMI`, {params: {sessionId: sessionId, term: term, studentId: studentId}})
            .pipe(retry(this.num));
    }

    saveEstimatedAttendanceEntry(data: any, sessionId: string, term: string, classId: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/saveEstimatedAttendanceEntry`, data, {params: {sessionId: sessionId, term: term, classId: classId}})
            .pipe(retry(this.num));
    }

    getStudentEstimatedAttendance(sessionId: string, term: string, studentId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentEstimatedAttendance`, {params: {sessionId: sessionId, term: term, studentId: studentId}})
            .pipe(retry(this.num));
    }


    matchStudentPlacement(student: any) {
        return this.http.post<any>(`http://localhost:5052/api/transition/matchStudentPlacement`, student)
            .pipe(retry(this.num));
    }

    addResultSettingClassArm(fieldId: string, fieldname: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/addResultSettingClassArm`, '', {params: {fieldId: fieldId, fieldname: fieldname}})
            .pipe(retry(this.num));
    }

    addMastersheetSettingClassArm(fieldId: string, fieldname: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/addMastersheetSettingClassArm`, '', {params: {fieldId: fieldId, fieldname: fieldname}})
            .pipe(retry(this.num));
    }

    updateAddResultPhoto(resphoto: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/updateAddResultPhoto`, '', {params: {resphoto: resphoto}})
            .pipe(retry(this.num));
    }

    updateAutoCommentOverride(comOverride: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/updateAutoCommentOverride`, '', {params: {comOverride: comOverride}})
            .pipe(retry(this.num));
    }

    getResultSettingClassArm() {
        return this.http.get<any>(`${environment.apiUrl}/school/getResultSettingClassArm`)
            .pipe(retry(this.num));
    }

    isResultPhoto() {
        return this.http.get<any>(`${environment.apiUrl}/school/isResultPhoto`)
            .pipe(retry(this.num));
    }

    getResultsAverageHostelSupervisorComment(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getResultsAverageHostelSupervisorComment`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getAnnualResultsAverageHostelSupervisorComment(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getAnnualResultsAverageHostelSupervisorComment`, {params: {currentClassId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    createHouse(name: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/createHouse`, '', {params: {name: name}})
            .pipe(retry(this.num));
    }

    getHouse() {
        return this.http.get<any>(`${environment.apiUrl}/school/getHouses`)
            .pipe(retry(this.num));
    }

    deleteHouse(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/deleteHouse`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    updateStudentHouse(data: any, currentClassId: string, sessionId: string, term: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/updateStudentHouse`, data, {params: {sessionId: sessionId, term: term, classId: currentClassId}})
            .pipe(retry(this.num));
    }

    getStudentHouse(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentHouse`, {params: {sessionId: sessionId, term: term, classId: currentClassId}})
            .pipe(retry(this.num));
    }

    getUnitStudentHouse(studentId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getUnitStudentHouse`, {params: {sessionId: sessionId, term: term, studentId: studentId}})
            .pipe(retry(this.num));
    }

    getStudentPhotosBytes(currentClassId: string, sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getStudentPhotosBytes`, {params: {classId: currentClassId, sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    getMyClassIdBySession(sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getMyClassIdBySession`, {params: {sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }

    

    getFormTeacher(currentClassId: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getFormTeacher`, {params: {currentClassId: currentClassId}})
            .pipe(retry(this.num));
    }

    getAutoComment() {
        return this.http.get<any>(`${environment.apiUrl}/school/getAutoComment`)
            .pipe(retry(this.num));
    }

    createAutoComment(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/createAutoComment`, data)
            .pipe(retry(this.num));
    }

    publishAutoComment(category: string, sessionId: string, term: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/publishAutoComment`, '', {params: {sessionId: sessionId, term: term, category: category}})
            .pipe(retry(this.num));
    }

    createAccessPin(pinamount: string, maxusage: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/createAccesspin`, '', {params: {pinamount: pinamount, maxusage: maxusage}})
            .pipe(retry(this.num));
    }

    getAccessPin() {
        return this.http.get<any>(`${environment.apiUrl}/school/getAccessPin`)
            .pipe(retry(this.num));
    }

    deleteAccessPin(id: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/deleteAccessPin`, '', {params: {id: id}})
            .pipe(retry(this.num));
    }

    getSurnamesByClass(schoolId: string, currentClassId: string, surname: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/getSurnamesByClass`, {params: {schoolId: schoolId, classId: currentClassId, surname: surname}})
            .pipe(retry(this.num));
    }

    getAvailableResult(sessionId: string, term: string) {
        return this.http.get<any>(`${environment.apiUrl}/school/AvailableResults`, {params: {sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }
    // getCalendarEvents(value: string) {
    //     return this.http.get<any>(`${environment.apiUrl}/school/getCalendarEvents`, {params: {id: id})
    //         .pipe(retry(this.num));
    // }

    getResultEntryAnalysis() {
        return this.http.get<any>(`${environment.apiUrl}/school/getResultEntryAnalysis`)
            .pipe(retry(this.num));
    }

    getResultEntryAnalysisByStaff() {
        return this.http.get<any>(`${environment.apiUrl}/school/getResultEntryAnalysisByStaff`)
            .pipe(retry(this.num));
    }
}