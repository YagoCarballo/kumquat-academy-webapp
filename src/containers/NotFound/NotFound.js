import React, {Component} from 'react';
import { FormattedMessage } from 'react-intl';

export default class NotFound extends Component {
  render() {
    return (
      <div className="appContent container">
        <h1>
          <FormattedMessage
            id="errors.not-found.title"
            description="Title of the Not Found page."
            defaultMessage="Missing Page" />
        </h1>
        <p>
          <FormattedMessage
            id="errors.not-found.description"
            description="Description of the Not Found page."
            defaultMessage="The page you were looking for does not exist, at this moment." />
        </p>
        <p><b>
          <FormattedMessage
            id="errors.not-found.error"
            description="Error code in the Not Found Page."
            defaultMessage="Error {code}"
            values={{
              code: 404,
            }}/>
        </b></p>
      </div>
    );
  }
}
