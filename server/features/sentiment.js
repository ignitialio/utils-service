const SentimentKlass = require('sentiment')

class Sentiment {
  constructor(options) {
    this._sentiment = new SentimentKlass()
    this._description = {
      name: 'sentiment',
      icon: 'assets/icons/sentiment-icon.png',
      description: 'Sentiment analysis'
    }
  }

  analyse(...args) {
    return new Promise((resolve, reject) => {
      resolve(this._sentiment.analyse(args))
    })
  }

  registerLanguage(languageCode, language) {
    return new Promise((resolve, reject) => {
      resolve(this._sentiment.registerLanguage(languageCode, language))
    })
  }
}

module.exports = Sentiment
