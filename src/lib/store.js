// /lib/store.js
import { writable } from 'svelte/store';

// Navigation, Header
export const viewVisualization = writable(true);
export const headerHeight = writable(0);

// Set Interpretation, Meta Data
export const metaDataSetting = writable([])
export const dataInterpretationSetting = writable({})

// Visualization Data
export const currentData = writable([]);
export const currentKeyA = writable('');
export const currentKeyB = writable('');

// Panel, Object Viewer
export const panelVisible = writable(false);
export const objectViewerData = writable([]);
export const objectViewerLoading = writable(true)
export const objectViewerError = writable('')

