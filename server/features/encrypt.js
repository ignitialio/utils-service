const QuickEncrypt = require('quick-encrypt')

class Encrypt {
  constructor(options) {
    this._description = {
      name: 'encrypt',
      icon: 'assets/icons/encrypt-icon.png',
      description: 'Manage RSA Public-Private Keypairs, encrypt/decrypt data'
    }
  }

  generate(size) {
    return new Promise((resolve, reject) => {
      let keys = QuickEncrypt.generate(2048)
      resolve(keys)
    })
  }

  encrypt(message, publicKey) {
    return new Promise((resolve, reject) => {
      let encrypted = QuickEncrypt.encrypt(message, publicKey)
      resolve(encrypted)
    })
  }

  decrypt(message, privateKey) {
    return new Promise((resolve, reject) => {
      let encrypted = QuickEncrypt.decrypt(message, privateKey)
      resolve(encrypted)
    })
  }
}

module.exports = Encrypt
