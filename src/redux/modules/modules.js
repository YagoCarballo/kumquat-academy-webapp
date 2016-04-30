import distinctColors from 'distinct-colors';

const LOAD = 'kumquat-academy/modules/LOAD';
const LOAD_SUCCESS = 'kumquat-academy/modules/LOAD_SUCCESS';
const LOAD_FAIL = 'kumquat-academy/modules/LOAD_FAIL';
const EDIT_COLOR = 'kumquat-academy/modules/EDIT_COLOR';
const EDIT_ICON = 'kumquat-academy/modules/EDIT_ICON';
const LOAD_ICONS = 'kumquat-academy/modules/LOAD_ICONS';
const LOAD_ICONS_SUCCESS = 'kumquat-academy/modules/LOAD_ICONS_SUCCESS';
const LOAD_ICONS_FAIL = 'kumquat-academy/modules/LOAD_ICONS_FAIL';
const FIND_RAW = 'kumquat-academy/modules/FIND_RAW';
const FIND_RAW_SUCCESS = 'kumquat-academy/modules/FIND_RAW_SUCCESS';
const FIND_RAW_FAIL = 'kumquat-academy/modules/FIND_RAW_FAIL';
const SAVE = 'kumquat-academy/modules/SAVE';
const SAVE_SUCCESS = 'kumquat-academy/modules/SAVE_SUCCESS';
const SAVE_FAIL = 'kumquat-academy/modules/SAVE_FAIL';

function generatePalette() {
  const colorPalette = [];
  const rawPalette = distinctColors({
    count: 255,
    hueMin: 0,
    chromaMin: 50,
    lightMin: 30,
    quality: 50
  });

  for (const color of rawPalette) {
    colorPalette.push(color.hex());
  }

  return colorPalette;
}

const colorPalette = generatePalette();
const initialState = {
  loaded: false,
  raw: {
    loaded: false,
    list: []
  },
  iconsLoaded: false,
  list: {},
  icons: [],
  defaultIcon: 0,
  editing: {
    icon: 'fa-book',
    color: colorPalette[0]
  },
  colorPalette: colorPalette
};

function parseModules(list) {
  const output = {};
  for (const module of list) {
    output[module.code] = module;
  }
  return output;
}

export default function modules(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        list: parseModules(action.result.modules)
      };
    case LOAD_FAIL:
      return {
        ...state,
        raw: {
          ...state.raw,
          loading: false,
          loaded: false,
          error: action.error,
          list: {}
        }
      };
    case FIND_RAW:
      return {
        ...state,
        raw: {
          ...state.raw,
          loading: true
        }
      };
    case FIND_RAW_SUCCESS:
      return {
        ...state,
        raw: {
          ...state.raw,
          loading: false,
          loaded: true,
          list: action.result.modules
        }
      };
    case FIND_RAW_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
        list: []
      };
    case EDIT_COLOR:
      return {
        ...state,
        editing: {
          ...state.editing,
          color: action.color
        }
      };
    case EDIT_ICON:
      return {
        ...state,
        editing: {
          ...state.editing,
          icon: action.icon
        }
      };
    case LOAD_ICONS:
      return {
        ...state,
        iconsLoading: true,
        icons: []
      };
    case LOAD_ICONS_FAIL:
      return {
        ...state,
        iconsLoading: false,
        iconsLoaded: false,
        error: action.error,
        icons: [],
        defaultIcon: 0
      };
    case LOAD_ICONS_SUCCESS:
      const randomIcon = Math.floor((Math.random() * action.result.icons.length));
      return {
        ...state,
        iconsLoading: false,
        iconsLoaded: true,
        icons: action.result.icons,
        defaultIcon: randomIcon,
        editing: {
          ...state.editing,
          icon: action.result.icons[randomIcon]
        }
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.modules && globalState.modules.loaded;
}

export function isRawLoaded(globalState) {
  return globalState.modules && globalState.modules.raw.loaded;
}

export function areIconsLoaded(globalState) {
  return globalState.modules && globalState.modules.loaded && globalState.modules.iconsLoaded;
}

export function loadModules() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/api/v1/modules')
  };
}

export function findRawModules(query, page) {
  return {
    types: [FIND_RAW, FIND_RAW_SUCCESS, FIND_RAW_FAIL],
    promise: (client) => client.get('/api/v1/modules/raw?q=' + (query || '') + '&page=' + (page || 0))
  };
}

export function loadIcons() {
  return {
    types: [LOAD_ICONS, LOAD_ICONS_SUCCESS, LOAD_ICONS_FAIL],
    promise: (client) => client.get('/icons.json', { toWebApp: true })
  };
}

export function create(module) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) => client.put('/api/v1/module', {
      data: {
        title: module.title,
        description: module.description,
        duration: parseInt(module.duration, 10),
        icon: module.icon,
        color: module.color
      }
    })
  };
}

export function editColor(color) {
  return { type: EDIT_COLOR, color };
}

export function editIcon(icon) {
  return { type: EDIT_ICON, icon };
}
