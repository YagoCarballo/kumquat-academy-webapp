import * as fs from 'fs';
import {sync as globSync} from 'glob';
import {sync as mkdirpSync} from 'mkdirp';

const MESSAGES_PATTERN = './build/messages/src/**/*.json';
const LANG_DIR = './build/lang/';

const defaultMessages = globSync(MESSAGES_PATTERN)
  .map((filename) => fs.readFileSync(filename, 'utf8'))
  .map((file) => JSON.parse(file))
  .reduce((collection, descriptors) => {
    descriptors.forEach(({id, defaultMessage}) => {
      if (collection.hasOwnProperty(id)) {
        throw new Error(`Duplicate message id: ${id}`);
      }

      collection[id] = defaultMessage;
    });

    return collection;
  }, {});

const languageObject = {
  locale: 'en',
  messages: defaultMessages,
};

mkdirpSync(LANG_DIR);
fs.writeFileSync(LANG_DIR + 'en.json', JSON.stringify(languageObject, null, 2));
