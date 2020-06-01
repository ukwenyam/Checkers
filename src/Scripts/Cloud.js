import env from '../env.json';
import { currUser } from './Init.js';

export function invokeFunction(load) {
    return new Promise((resolve, reject) => {

        currUser.update(state => {
            load.id = state.email;
            return state;
        });

        const url = env.funcs + load.func;
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