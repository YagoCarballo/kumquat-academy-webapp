import superagent from 'superagent';
import config from '../config';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path, toWebApp) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  if (__SERVER__) {
    if (toWebApp) {
      // Prepend host and port of the server to the path.
      return 'http://' + (process.env.HOST || 'localhost') + ':' + config.port + adjustedPath;
    }

    // Prepend host and port of the API server to the path.
    return 'http://' + (process.env.HOST || 'localhost') + ':' + config.apiPort + adjustedPath;
  }

  // Prepend `/api` to relative URL, to proxy to API server.
  return (toWebApp ? '' : '/api') + adjustedPath;
}

/*
 * This silly underscore is here to avoid a mysterious "ReferenceError: ApiClient is not defined" error.
 * See Issue #14. https://github.com/erikras/react-redux-universal-hot-example/issues/14
 *
 * Remove it at your own risk.
 */
class _ApiClient {
  constructor(req) {
    methods.forEach((method) =>
      this[method] = (path, { params, data, toWebApp, onProgress } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path, toWebApp));

        if (params) {
          request.query(params);
        }

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));
        }

        if (data) {
          request.send(data);
        }

        if (onProgress) {
          request.on('progress', onProgress);
        }

        request.end((err, { body } = {}) => err ? reject(body || err) : resolve(body));
      }));
  }
}

const ApiClient = _ApiClient;

export default ApiClient;
