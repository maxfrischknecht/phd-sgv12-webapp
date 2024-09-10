// /lib/store.js
import { writable } from 'svelte/store';

export const panelVisible = writable(false);
export const imageIdsStore = writable([]);
export const viewVisualization = writable(true);