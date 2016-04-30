import Cookie from 'react-cookie';

const LOAD = 'kumquat-academy/auth/LOAD';
const LOAD_SUCCESS = 'kumquat-academy/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'kumquat-academy/auth/LOAD_FAIL';

const LOGIN = 'kumquat-academy/auth/LOGIN';
const LOGIN_SUCCESS = 'kumquat-academy/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'kumquat-academy/auth/LOGIN_FAIL';

const LOGOUT = 'kumquat-academy/auth/LOGOUT';
const LOGOUT_SUCCESS = 'kumquat-academy/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'kumquat-academy/auth/LOGOUT_FAIL';

const FORGOT = 'kumquat-academy/auth/FORGOT';
const FORGOT_FAIL = 'kumquat-academy/auth/FORGOT_FAIL';
const FORGOT_SUCCESS = 'kumquat-academy/auth/FORGOT_SUCCESS';

const PASSWORD_CHANGE = 'kumquat-academy/auth/PASSWORD_CHANGE';
const PASSWORD_CHANGE_FAIL = 'kumquat-academy/auth/PASSWORD_CHANGE_FAIL';
const PASSWORD_CHANGE_SUCCESS = 'kumquat-academy/auth/PASSWORD_CHANGE_SUCCESS';

const initialState = {
  loaded: false,
  error: null
};

export default function reducer(state = initialState, action = {}) {
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
        user: action.result.user
      };
    case LOAD_FAIL:
      Cookie.remove('token');
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        user: action.result.user
      };
    case LOGIN_FAIL:
      Cookie.remove('token');
      return {
        ...state,
        loggingIn: false,
        user: null,
        accessToken: null,
        loginError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      Cookie.remove('token');
      return {
        ...state,
        loggingOut: false,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    case FORGOT:
      return {
        ...state,
        resetingPassword: true
      };
    case FORGOT_SUCCESS:
      return {
        ...state,
        resetingPassword: false,
        result: action.result
      };
    case FORGOT_FAIL:
      return {
        ...state,
        resetingPassword: false,
        error: action.error
      };
    case PASSWORD_CHANGE:
      return {
        ...state,
        changingPassword: true
      };
    case PASSWORD_CHANGE_SUCCESS:
      return {
        ...state,
        changingPassword: false,
        result: action.result
      };
    case PASSWORD_CHANGE_FAIL:
      return {
        ...state,
        changingPassword: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  const token = Cookie.load('token');
  let output = {
    type: LOAD_FAIL,
    error: 'Not Logged In'
  };

  if (token) {
    output = {
      types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
      promise: (client) => client.get('/api/v1/auth/info')
    };
  }

  return output;
}

export function login(user) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/api/v1/auth/sign-in', {
      data: {
        username: user.username,
        password: user.password
      }
    })
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.get('/api/v1/auth/logout')
  };
}

export function forgotPassword(email) {
  return {
    types: [FORGOT, FORGOT_SUCCESS, FORGOT_FAIL],
    promise: (client) => client.get('/api/v1/password/' + email + '/reset')
  };
}

export function changePassword(token, password) {
  return {
    types: [FORGOT, FORGOT_SUCCESS, FORGOT_FAIL],
    promise: (client) => client.post('/api/v1/password/reset/' + token, {
      data: {
        password: password
      }
    })
  };
}
