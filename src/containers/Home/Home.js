import React, { Component } from 'react';

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss');
    // require the logo image both from client and server
    const logoImage = require('./kumquat.png');
    return (
      <div className={'appContent ' + styles.home}>
        <div className={styles.masthead}>
          <div className="container">
            <div className={styles.logo}>
              <p>
                <img src={logoImage}/>
              </p>
            </div>
            <h1>Kumquat Academy</h1>

            <h2>Learning Platform</h2>
          </div>
        </div>

        <div className="container">
          <br />
          <h3>Features demonstrated in this project</h3>

          <dl>
            <dt>Assignment Managements</dt>
            <dd>
              Create assignments at your own pace and enable them whenever you are ready, you will be able to keep
              track of all the assignments you created as well as the progress of your student's as they submit or
              complete each bit of the assignment (for assignments built with multiple steps).
              <br />
              Your students will also be able to easily see the available assignments, when they are due and ask any
              question they have throught he system.
            </dd>
            <dt>Schedule Managements</dt>
            <dd>
              With the schedule management you will be able to enter when the lectures are every week, and that will be
              synced to your student's calendars and your own. Making it really easy to keep track of the lectures and
              last minute changes.
            </dd>
            <dt>Student Managements</dt>
            <dd>
              Easily manage all your students, you will be able to keep track of their assignments, enter their grades
              so they can get an estimate of the final grade as they advance thought the semester, and doing that the
              system will try to raise alerts whenever it detects that a student are starting to have difficulties.
            </dd>
            <dt>Timeline</dt>
            <dd>
              All the assignments, lectures, notifications and events will be displayed in a timeline so is easier to
              keep track when things are happening.
            </dd>
          </dl>

          <h3>This platform is built with the following technologies:</h3>

          <h4>API</h4>
          <ul>
            <li><a href="https://golang.org/" target="_blank">Golang</a>{' '} used to build the API.</li>
            <li><a href="https://goji.io/" target="_blank">Goji</a>{' '} used to handle the HTTP Requests in go.</li>
            <li><a href="https://github.com/dvsekhvalnov/jose2go" target="_blank">Jose2Go</a>{' '} used to create secure sessions following the JSON Web tokens standard.</li>
            <li><a href="https://github.com/franela/goblin" target="_blank">Goblin</a>{' '} used for unit tests.</li>
            <li><a href="https://github.com/jinzhu/gorm" target="_blank">GORM</a>{' '} used for database abstraction, for future support to different SQL Databases.</li>
          </ul>
          <h4>Webapp</h4>
          <ul>
            <li>
              <a href="https://github.com/erikras/react-redux-universal-hot-example" target="_blank">React Redux Universal Hot Example</a>
              {' '} used as a base template to start the project.
            </li>
            <li>
              <del>Isomorphic</del>
              {' '}
              <a href="https://medium.com/@mjackson/universal-javascript-4761051b7ae9">Universal</a> rendering
            </li>
            <li>Both client and server make calls to load data from separate API server</li>
            <li><a href="https://github.com/facebook/react" target="_blank">React</a></li>
            <li><a href="https://github.com/rackt/react-router" target="_blank">React Router</a></li>
            <li><a href="http://expressjs.com" target="_blank">Express</a></li>
            <li><a href="http://babeljs.io" target="_blank">Babel</a> for ES6 and ES7 magic</li>
            <li><a href="http://webpack.github.io" target="_blank">Webpack</a> for bundling</li>
            <li><a href="http://webpack.github.io/docs/webpack-dev-middleware.html" target="_blank">Webpack Dev Middleware</a>
            </li>
            <li><a href="https://github.com/glenjamin/webpack-hot-middleware" target="_blank">Webpack Hot Middleware</a></li>
            <li><a href="https://github.com/rackt/redux" target="_blank">Redux</a>'s futuristic <a
              href="https://facebook.github.io/react/blog/2014/05/06/flux.html" target="_blank">Flux</a> implementation
            </li>
            <li><a href="https://github.com/gaearon/redux-devtools" target="_blank">Redux Dev Tools</a> for next
              generation DX (developer experience).
              Watch <a href="https://www.youtube.com/watch?v=xsSnOQynTHs" target="_blank">Dan Abramov's talk</a>.
            </li>
            <li><a href="https://github.com/rackt/redux-router" target="_blank">Redux Router</a> Keep
              your router state in your Redux store
            </li>
            <li><a href="http://eslint.org" target="_blank">ESLint</a> to maintain a consistent code style</li>
            <li><a href="https://github.com/erikras/redux-form" target="_blank">redux-form</a> to manage form state
              in Redux
            </li>
            <li><a href="https://github.com/erikras/multireducer" target="_blank">multireducer</a> combine several
              identical reducer states into one key-based reducer</li>
            <li><a href="https://github.com/webpack/style-loader" target="_blank">style-loader</a> and <a
              href="https://github.com/jtangelder/sass-loader" target="_blank">sass-loader</a> to allow import of
              stylesheets
            </li>
            <li><a href="https://github.com/shakacode/bootstrap-sass-loader" target="_blank">bootstrap-sass-loader</a> and <a
              href="https://github.com/gowravshekar/font-awesome-webpack" target="_blank">font-awesome-webpack</a> to customize Bootstrap and FontAwesome
            </li>
            <li><a href="http://socket.io/">socket.io</a> for real-time communication</li>
          </ul>

          <h3>From the author</h3>

          <p>
            This platform is currently being developed as the honours project for my degree at the University of Dundee.
            My goal is to release the code at the end of the project on GitHub. Any feedback is welcome.
          </p>

          <p>Thanks for taking the time to check this project out.</p>

          <p>– Yago Carballo</p>
        </div>
      </div>
    );
  }
}
