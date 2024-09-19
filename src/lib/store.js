// /lib/store.js
import { writable } from 'svelte/store';

export const panelVisible = writable(false);
export const objectViewerData = writable([]);
export const objectViewerLoading = writable(true)
export const objectViewerError = writable('')
export const viewVisualization = writable(true);

export const headerHeight = writable(0);

export const metaDataSetting = writable([])
export const dataInterpretationSetting = writable({})

export const currentData = writable([]);
export const currentKeyA = writable('');
export const currentKeyB = writable('');