const ml = require('ml-modules')
const SVM = ml.SVM
const KNN = ml.KNN
const RBF = ml.RBF
const RANDF = ml.RANDF
const LOGREG = ml.LOGREG
const NN = ml.NN

class ML {
  constructor(options) {
    this._description = {
      name: 'ml',
      icon: 'assets/icons/ml-icon.png',
      description: 'Machine learning basic algorithms'
    }
  }

  // set up the environment
  // train
  // store results
  train(algo, data, labels) {
    return new Promise((resolve, reject) => {
      try {
        ml[algo].train(data, labels)
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }

  // returns predicted value
  predict(algo, point) {
    return new Promise((resolve, reject) => {
      try {
        ml[algo].train(point)
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }

  // returns predicted class
  predictClass(algo, point) {
    return new Promise((resolve, reject) => {
      try {
        ml[algo].predictClass(point)
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }

  // returns an object to be used by the "ui" class
  getOptions(module) {
    return new Promise((resolve, reject) => {
      try {
        ml[algo].getOptions()
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }

  // set the options
  setOptions(algo, options) {
    return new Promise((resolve, reject) => {
      try {
        ml[algo].setOptions(options)
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = ML
