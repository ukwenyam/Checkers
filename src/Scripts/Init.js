import { writable } from 'svelte/store';
import { User } from './User.js';
import io from 'socket.io-client'


const socket = io('http://localhost:4000');

console.log("cresting socket");
console.log(socket);

export const currSocket = writable(socket);

export const currUser = writable(new User());

export const page = writable(0);