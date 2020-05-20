
export function setResponse(res: any):any {

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', '*');
    res.status(200);

    return res;
}