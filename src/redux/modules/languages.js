/**
 * Created by yagocarballo on 01/01/2016.
 */
import Cookie from 'react-cookie';

const LOAD = 'kumquat-academy/languages/LOAD';
const LOAD_SUCCESS = 'kumquat-academy/languages/LOAD_SUCCESS';
const LOAD_FAIL = 'kumquat-academy/languages/LOAD_FAIL';

const initialState = {
  loaded: false,
  translation: {
    locale: 'en',
    messages: {}
  }
};

export default function languages(state = initialState, action = {}) {
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
        translation: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
        translation: {
          locale: 'en',
          messages: {}
        }
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  const locale = Cookie.load('locale');
  return (globalState.languages.translation.messages.length > 0)
    && globalState.languages.loaded
    && (globalState.languages.translation.locale !== locale);
}

export function load() {
  const locale = Cookie.load('locale');
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/locale-data/' + (locale || 'en.json'), { toWebApp: true })
  };
}

export function changeLocale(locale) {
  Cookie.save('locale', locale);
  return load();
}
