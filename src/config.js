require('babel/polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  port: process.env.PORT,
  apiPort: process.env.APIPORT,
  app: {
    title: 'Kumquat Academy',
    description: 'Kumquat Academy - Learning Platform',
    meta: {
      charSet: 'utf-8',
      property: {
        'og:site_name': 'Kumquat Academy',
        'og:image': 'https://kumquat.academy/logo.jpg',
        'og:locale': 'en_US',
        'og:title': 'Kumquat Academy',
        'og:description': 'Kumquat Academy - Learning Platform.',
      }
    }
  }
}, environment);
