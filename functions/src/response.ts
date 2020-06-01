
export function setResponse(res: any):any {

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', '*');
    //res.set('mode', 'no-cors');
    res.status(200);

    return res;
}

export function userExist(db:any, id:string):boolean {

    let exist:boolean = false;

    let docRef:any = db.collection("USERS").doc(id);

    let doc:any = docRef.get();

    if(doc.exist) {
        exist = true;
    }

    return exist;
}