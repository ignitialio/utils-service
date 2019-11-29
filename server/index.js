const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const Service = require('@ignitial/iio-services').Service
const config = require('./config')

class Utils extends Service {
  constructor(options) {
    super(options)

    this._features = {}

    try {
      let featuresPath = path.join(__dirname, 'features')
      let featuresFiles = fs.readdirSync(featuresPath)

      for (let feature of featuresFiles) {
        let featureName = path.basename(feature).replace('.js', '')
        let Klass = require(path.join(featuresPath, feature))
        this._features[featureName] =
          new Klass(this._options.features[featureName])

      }
    } catch (err) {
      this._dying(err, 'failed to initialize features')
    }
  }

  // get features list
  // ***************************************************************************
  features() {
    /* @_GET_ */
    return new Promise((resolve, reject) => {
      let features = {}
      for (let feature in this._options.features) {
        features[feature] = this._options.features[feature]._description || {
          name: feature,
          icon: 'assets/icons/feature-icon.png',
          description: 'Utility'
        }

        features[feature].icon =
          (this._options.server.https ? 'https://' : 'http://') +
          this._options.server.host + ':' + this._options.server.port +
          '/' + features[feature].icon
      }

      resolve(features)
    })
  }

  // get configuration and input/ouput parameters definitions for a given
  // feature or list all
  // ***************************************************************************
  parameters(featureName) {
    /* @_GET_ */
    return new Promise((resolve, reject) => {
      if (featureName) {
        if (this._features[featureName]) {
          resolve(this._options.features[featureName].schemas)
        } else {
          reject(new Error('feature not available'))
        }
      } else {
        let schemas = {}

        for (let feature in this._options.features) {
          schemas[feature] = this._options.features[feature].schemas
        }

        resolve(schemas)
      }
    })
  }

  // get configuration for a given feature (or all)
  // ***************************************************************************
  config(featureName) {
    /* @_GET_ */
    return new Promise((resolve, reject) => {
      if (featureName) {
        if (this._features[featureName]) {
          resolve(this._options.features[featureName].config)
        } else {
          reject(new Error('feature not available'))
        }
      } else {
        let config = {}

        for (let feature in this._options.features) {
          config[feature] = this._options.features[feature].config
        }

        resolve(config)
      }
    })
  }

  // calls execution of a given feature
  // ***************************************************************************
  call(featureName, method, ...args) {
    /* @_POST_ */
    return new Promise((resolve, reject) => {
      if (this._features[featureName]) {
        this._features[featureName][method](args).then(result => {
          resolve(result)
        }).catch(err => reject(err))
      } else {
        reject(new Error('feature not available'))
      }
    })
  }
}

// instantiate service with its configuration
const utils = new Utils(config)

utils._init().then(() => {
  console.log('service [' + utils.name + '] initialization done with options ',
    utils._options)
}).catch(err => {
  console.error('initialization failed', err)
  process.exit(1)
})
