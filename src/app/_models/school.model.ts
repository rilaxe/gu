export class schoolModel
{
    id: number;
    schoolName: string;
    schoolCode: string;
    userName: string;
    password: string;
    confirmPassword: string;
    roleId: number;
    bannerPhoto: string;
    principalName: string;
    principalPhone: string;
    schoolLogo: string;
    schoolSignature: string;
    schoolState: string;
    schoolLga: string;
    address: string;
    website: string;
    email: string;
    phoneOne: string;
    phoneTwo: string;
    photoType: string;
    logo: File;
    banner: File;
    signature: File;
    aboutUs: string;
    currentSession: string;
}

export class studentDetails {
    id: number;
    surname: string;
    firstName: string;
    middleName: string;
    passport: File;
    classId: string;
    Class: string;
    status: string;
    statusR: string;
    sponsorType: string;
    sponsor: string;
    sponsorAddress: string;
    stateofOrigin: string;
    lga: string;
    sex: string;
    sponsorPhone: string;
    birthDate: string;
    nationality: string;
    religion: string;
    hometown: string;
    stateCee: string;
    typeofStudent: string;
    postHeld: string;
    disability: string;
    commentP: string;
    commentF: string;
    comment: string;
    yearOfGrad: string;
    session: string;
    admissionNo: string;
    dateAdmitted: string;
    graduatedYear: string;
    genoType: string;
    bloodGroup: string;
    guardianName: string;
    guardianAddress: string;
    guardianPhone: string;
    fatherName: string;
    fatherPhone: string;
    motherName: string;
    motherPhone: string;
    fatherOccp: string;
    motherOccp: string;
    parentAddress: string;
    house: string;
    schoolId: number;
    dateAdded: string;
    feesStatus: string;
    newStudent: string;
    email: string;
    sports: string;
    passportUrl: string;
    isResultBlocked: boolean;
}

export class Staff
{
    id: number;
    idCardNo: string;
    surname: string;
    otherNames: string;
    middleName: string;
    firstName: string;
    gender: string;
    passport: File;
    department: string;
    basicSalary: string;
    section: string;
    position: string;
    title: string;
    bank: string;
    accountNo: string;
    trustFundNo: string;
    fileNo: string;
    religion: string;
    photo: string;
    birthDate: string;
    created: string;
    state: string;
    lga: string;
    nationality: string;
    maritalStatus: string;
    homeAddress: string;
    schoolFileNo: string;
    refereeName: string;
    refereeAddress: string;
    refereePhone: string;
    phone: string;
    subjects: string;
    qualification: string;
    category: string;
    email: string;
    schoolId: number;
    dateEmployed: string;
    nokFullName: string;
    nokContactPhone: string;
    nokOccupation: string;
    nokRelationship: string;
    nokContactAddress: string;
    institution: string;
    courseOfStudy: string;
    yearAdmitted: string;
    yearGraduated: string;
    certificate: string;
    status: string;
}


export class Psycomotor {
    id: number;
    schoolId: number;
    studentId: number;
    admissionNo: number;
    classId: number;
    classLevel: string;
    term: string;
    sessions: string;
    skill: string;
    skillId: number;
    score: number;
}


export class OnlineSection {
    name: string;
    list: any[];
}

export class Result {
    id: number;
    studentId: number;
    schoolId: number;
    classes: string;
    classLevel: string;
    term: string;
    session: string;
    subject: string;
    ca1: number;
    ca2: number;
    ca3: number;
    ca4: number;
    ca5: number;
    ca6: number;
    ca7: number;
    ca8: number;
    ca9: number;
    ca10: number;
    ca11: number;
    ca12: number;
    ca13: number;
    ca14: number;
    ca15: number;
    exam: number;
    totalScore: number;
    grade: string;
    remark: string;
    position: string;
    subjectAverage: number;
    streamSubjectAverage: number;
    average: number;
    highestScore: number;
    lowestScore: number;
    streamHighestScore: number;
    streamLowestScore: number;
    positionInStream: string;
    studentPositionInClass: string;
    studentPositionInStream: string;
    locked: string;

}