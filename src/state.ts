import { writable } from 'svelte/store';

export const DEFAULT_SIZE = 50;

export const size = writable(DEFAULT_SIZE);
