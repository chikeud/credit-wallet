export interface Identity {
    "id": number,
    "applicant": {
        "firstname": string,
        "lastname": string
    },
    "summary": {
        "bvn_check": {
            "status": string,
            "fieldMatches": {
                "firstname": boolean,
                "lastname": boolean
            }
        }
    },
    "status": {
        "state": string,
        "status": string
    },
    "bvn": {
        "bvn": string,
        "firstname": string,
        "lastname": string,
        "birthdate": string,
        "gender": string,
        "phone": string,
        "photo": string
    }
}