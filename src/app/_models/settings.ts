export class CaSetup {
    systemName: string;
    actualName: string;
    maxScore: number;
    status: string;
    Class: string;
    state = false;
}

export class Session {
    id: number;
    sessionName: string;
    firstTermStart: string;
    firstTermEnd: string;
    secondTermStart: string;
    secondTermEnd: string;
    thirdTermStart: string;
    thirdTermEnd: string;
    isCurrentSession: number;
    currentTerm: string;
} 