import { writable } from 'svelte/store';
import { User } from './User.js';

export const currUser = writable(new User());

export const page = writable(0);