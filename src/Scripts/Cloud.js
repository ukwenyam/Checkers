export function invokeFunction(load) {
    return new Promise((resolve, reject) => {

        const url = "https://us-central1-checker-io.cloudfunctions.net/" + load.func;
        load = new URLSearchParams(load).toString();

        fetch(url, {
            method: 'POST',
            body: load,
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
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