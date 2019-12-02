const yaml = require('yaml')

class YAML {
  constructor(options) {
    this._description = {
      name: 'yaml',
      icon: 'assets/icons/yaml-icon.png',
      description: 'YAML parse and stringify'
    }
  }

  parse(str, options) {
    return new Promise((resolve, reject) => {
      try {
        resolve(yaml.parse(str, options))
      } catch (err) {
        reject(err)
      }
    })
  }

  stringify(value, options) {
    return new Promise((resolve, reject) => {
      try {
        resolve(yaml.stringify(value, options))
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = YAML
