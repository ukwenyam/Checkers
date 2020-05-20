export function invokeFunction(load) {
    return new Promise((resolve, reject) => {

        const url = "https://us-central1-checker-io.cloudfunctions.net/" + load.func;
        load = new URLSearchParams(load).toString();

        fetch(url, {
            method: 'post',
            mode: 'cors',
            body: load,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            'Access-Control-Allow-Origin' : '*'
        })
        .then(res => 
            res.json()
        )
        .then(json => {
            resolve(json)
        })
        .catch(err => 
            reject(err)
        );
    });
}