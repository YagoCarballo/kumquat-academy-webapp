const INITIAL_ATTACHMENTS = 'kumquat-academy/attachments/INITIAL_ATTACHMENTS';

const UPLOAD = 'kumquat-academy/attachments/UPLOAD';
const UPLOAD_SUCCESS = 'kumquat-academy/attachments/UPLOAD_SUCCESS';
const UPLOAD_FAIL = 'kumquat-academy/attachments/UPLOAD_FAIL';
const UPLOAD_PROGRESS = 'kumquat-academy/attachments/UPLOAD_PROGRESS';

const REMOVE = 'kumquat-academy/attachments/REMOVE';
const REMOVE_SUCCESS = 'kumquat-academy/attachments/REMOVE_SUCCESS';
const REMOVE_FAIL = 'kumquat-academy/attachments/REMOVE_FAIL';

const initialState = {
  uploaded: false,
  progress: 0,
  uploads: {}
};


export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPLOAD:
      return {
        ...state,
        uploads: {
          ...state.uploads,
          [action.key]: {
            ...(state.uploads[action.key] || { list: {} }),
            uploading: true,
            uploaded: false,
            list: {
              ...((state.uploads[action.key] || { list: {} }).list || {}),
              [action.fileName]: action.tmpFile
            }
          }
        }
      };
    case UPLOAD_SUCCESS:
      return {
        ...state,
        uploads: {
          ...state.uploads,
          [action.key]: {
            ...state.uploads[action.key],
            uploading: false,
            uploaded: true,
            list: {
              ...state.uploads[action.key].list,
              [action.fileName]: {
                ...state.uploads[action.key].list[action.fileName],
                ...action.result.attachment,
                percentage: 100
              }
            }
          }
        }
      };
    case UPLOAD_FAIL:
      return {
        ...state,
        uploads: {
          ...state.uploads,
          [action.key]: {
            uploading: false,
            uploaded: false,
            list: {
              ...state.uploads[action.key].list,
              [action.fileName]: {
                percentage: 0
              }
            },
            error: action.result.error
          }
        }
      };
    case UPLOAD_PROGRESS:
      return {
        ...state,
        uploads: {
          ...state.uploads,
          [action.key]: {
            ...state.uploads[action.key],
            uploading: false,
            uploaded: true,
            list: {
              ...state.uploads[action.key].list,
              [action.fileName]: {
                ...state.uploads[action.key].list[action.fileName],
                percentage: action.progress
              }
            }
          }
        }
      };
    case REMOVE:
      return state;
    case REMOVE_SUCCESS:
      return {
        ...state,
        uploads: {
          ...state.uploads,
          [action.key]: {
            ...state.uploads[action.key],
            uploading: false,
            uploaded: true,
            list: {
              ...state.uploads[action.key].list,
              [action.fileName]: undefined
            }
          }
        }
      };
    case INITIAL_ATTACHMENTS:
      return {
        ...state,
        uploads: {
          ...state.uploads,
          [action.key]: {
            ...state.uploads[action.key],
            uploading: false,
            uploaded: true,
            list: {
              ...((state.uploads[action.key] || { list: {} }).list || {}),
              ...action.attachments
            }
          }
        }
      };
    case REMOVE_FAIL:
      return state;
    default:
      return state;
  }
}

export function upload(key, file, onProgress) {
  const formData = new FormData();

  // Append files to form data
  if (file instanceof File) { // is the item a File?
    formData.append('file', file);
  } else {
    return {
      type: UPLOAD_FAIL,
      result: {
        error: 'InvalidFile',
        message: 'The provided file is invalid.'
      }
    };
  }

  return {
    types: [UPLOAD, UPLOAD_SUCCESS, UPLOAD_FAIL],
    key: key,
    fileName: file.name,
    tmpFile: {
      id: 'new',
      name: file.name,
      type: file.type,
      url: file.preview,
      percentage: 0,
      rawFile: file
    },
    promise: (client) => client.put('/api/v1/' + key + '/attachment', {
      data: formData,
      onProgress: onProgress
    })
  };
}

export function setInitialAttachments(key, attachments) {
  return { type: INITIAL_ATTACHMENTS, key, attachments };
}

export function updateProgress(value, key, fileName) {
  return {
    type: UPLOAD_PROGRESS,
    key: key,
    fileName: fileName,
    progress: value
  };
}

export function remove(key, fileName, fileId) {
  return {
    types: [REMOVE, REMOVE_SUCCESS, REMOVE_FAIL],
    key: key,
    fileName: fileName,
    promise: (client) => client.del('/api/v1/' + key + '/attachment/' + fileId)
  };
}
