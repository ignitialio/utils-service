const random = require('random')

class Random {
  constructor(options) {
    this._description = {
      name: 'random',
      icon: 'assets/icons/random-icon.png',
      description: 'Random numbers generator based on npm:random lib'
    }
  }

  call(fct, ...args) {
    return new Promise((resolve, reject) => {
      if (random[fct]) {
        let result = random[fct].apply(random, args)
        resolve(result)
      } else {
        reject(new Error('function not available'))
      }
    })
  }
}

module.exports = Random
