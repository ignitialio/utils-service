const converter = require('xml-js')

class XML {
  constructor(options) {
    this._description = {
      name: 'xml',
      icon: 'assets/icons/xml-icon.png',
      description: 'XML document processing'
    }
  }

  xml2js(xml, options) {
    return new Promise((resolve, reject) => {
      options = options || {
        compact: true,
        spaces: 4
      }

      try {
        resolve(convert.xml2js(xml, options))
      } catch (err) {
        reject(err)
      }
    })
  }

  xml2json(xml, options) {
    return new Promise((resolve, reject) => {
      options = options || {
        compact: true,
        spaces: 4
      }

      try {
        resolve(convert.xml2json(xml, options))
      } catch (err) {
        reject(err)
      }
    })
  }

  js2xml(obj, options) {
    return new Promise((resolve, reject) => {
      options = options || {
        compact: true,
        spaces: 4
      }

      try {
        resolve(convert.js2xml(obj, options))
      } catch (err) {
        reject(err)
      }
    })
  }

  json2xml(obj, options) {
    return new Promise((resolve, reject) => {
      options = options || {
        compact: true,
        spaces: 4
      }

      try {
        resolve(convert.json2xml(obj, options))
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = XML
