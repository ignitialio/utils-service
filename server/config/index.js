const fs = require('fs')
const path = require('path')
const YAML = require('yaml')

function envBrowseAndReplace(config) {
  for (let prop in config) {
    if (typeof config[prop] !== 'string' && typeof config[prop] !== 'number') {
      config[prop] = envBrowseAndReplace(config[prop])
    } else {
      if (typeof config[prop] === 'string') {
        let envVarMatch = config[prop].match(/env\((.*?)\)/)
        if (envVarMatch) {
          config[prop] = process.env[envVarMatch[1]]
        }
      }
    }
  }

  return config
}

let generatedConfigPath = path.join(process.cwd(), 'server', 'config', 'generated', 'config.json')
if (fs.existsSync(generatedConfigPath)) {
  let config = JSON.parse(fs.readFileSync(generatedConfigPath, 'utf8'))
  config = envBrowseAndReplace(config)
  console.log('WARNING: using YAML configuration')
  module.exports = config
  return
}

console.log('WARNING: generated file [' + generatedConfigPath + '] does not exist. switch to env config')

// REDIS configuration
// -----------------------------------------------------------------------------
const IIOS_REDIS_PORT = process.env.IIOS_REDIS_PORT ? parseInt(process.env.IIOS_REDIS_PORT) : 6379
const IIOS_REDIS_DB = process.env.IIOS_REDIS_DB ? parseInt(process.env.IIOS_REDIS_DB) : 0
const IIOS_REDIS_ACCESSDB = process.env.IIOS_REDIS_ACCESSDB || 1
let IIOS_REDIS_SENTINELS

if (process.env.IIOS_REDIS_SENTINELS) {
  IIOS_REDIS_SENTINELS = []
  let sentinels = process.env.IIOS_REDIS_SENTINELS.split(',')
  for (let s of sentinels) {
    IIOS_REDIS_SENTINELS.push({ host: s.split(':')[0], port: s.split(':')[1] })
  }
}

// Main configuration structure
// -----------------------------------------------------------------------------
module.exports = {
  /* service name */
  name: process.env.IIOS_SERVICE_NAME || 'utils',
  /* service namesapce */
  namespace: process.env.IIOS_NAMESPACE || 'ignitialio',
  /* heartbeat */
  heartbeatPeriod: 5000,
  /* PUB/SUB/KV connector */
  connector: {
    /* redis server connection */
    redis: {
      /* encoder to be used for packing/unpacking raw messages */
      encoder: process.env.IIOS_ENCODER || 'bson',
      master: process.env.IIOS_REDIS_MASTER || 'mymaster',
      sentinels: IIOS_REDIS_SENTINELS,
      host: process.env.IIOS_REDIS_HOST,
      port: IIOS_REDIS_PORT,
      db: IIOS_REDIS_DB
    },
  },
  /* access control: if present, acces control enabled */
  accesscontrol: {
    /* access control namespace */
    namespace: process.env.IIOS_NAMESPACE || 'ignitialio',
    /* grants for current service: auto-fill */
    grants: {
      _priviledged_: {
        'create:any': [ '*' ],
        'read:any': [ '*' ],
        'update:any': [ '*' ],
        'delete:any': [ '*' ]
      },
      admin: {
        'create:any': [ '*' ],
        'read:any': [ '*' ],
        'update:any': [ '*' ],
        'delete:any': [ '*' ]
      },
      user: {
        'read:any': [ '*' ],
        'update:any': [ '*' ],
        'delete:any': [ '*' ]
      },
      anonymous: {
        'read:any': [ '*' ]
      }
    },
    /* connector configuration: optional, default same as global connector, but
       on DB 1 */
    connector: {
      /* redis server connection */
      redis: {
        encoder: process.env.IIOS_ENCODER || 'bson',
        master: process.env.IIOS_REDIS_MASTER || 'mymaster',
        sentinels: IIOS_REDIS_SENTINELS,
        host: process.env.IIOS_REDIS_HOST,
        port: IIOS_REDIS_PORT,
        db: IIOS_REDIS_ACCESSDB
      }
    }
  },
  /* HTTP server declaration */
  server: {
    /* server host */
    host: process.env.IIOS_SERVER_HOST,
    /* server port */
    port: process.env.IIOS_SERVER_PORT,
    /* path to statically serve (at least one asset for icons for example) */
    path: process.env.IIOS_SERVER_PATH_TO_SERVE || './dist',
    /* indicates that service is behind an HTTPS proxy */
    https: false,
  },
  /* features specifics or defaults */
  features: {
    mailer: {
      schemas: {
        config: {
          title: 'SMTP server',
          type: 'object',
          properties: {
            host: {
              title: 'Host',
              type: 'string',
              _meta: {
                type: null,
                i18n: {
                  'Host': [ 'Hôte' ]
                }
              }
            },
            port: {
              title: 'Port',
              type: 'integer',
              _meta: {
                type: null,
                i18n: {
                  'Port': [ 'Port' ]
                }
              }
            },
            secure: {
              title: 'Secure',
              type: 'boolean',
              _meta: {
                type: null,
                i18n: {
                  'Secure': [ 'Sécurisé' ]
                }
              }
            },
            auth: {
              title: 'Credentials',
              type: 'object',
              properties: {
                user: {
                  title: 'Username',
                  type: 'string',
                  _meta: {
                    type: null,
                    i18n: {
                      'Username': [ 'Nom d\'utilisateur' ]
                    }
                  }
                },
                pass: {
                  title: 'Password',
                  type: 'string',
                  _meta: {
                    type: 'password',
                    i18n: {
                      'Password': [ 'Mot de passe' ]
                    }
                  }
                },
              },
              _meta: {
                type: null,
                i18n: {
                  'Credentials': [ 'Autorisations' ]
                }
              }
            },
            logger: {
              title: 'Logger',
              type: 'boolean',
              _meta: {
                type: null
              }
            },
            debug: {
              title: 'Debug',
              type: 'boolean',
              _meta: {
                type: null
              }
            }
          },
          _meta: {
            type: null,
            i18n: {
              'SMTP server': [ 'Serveur SMTP' ]
            }
          }
        },
        input: {
          title: 'Email data',
          type: 'object',
          properties: {
            from: {
              title: 'Sender address',
              type: 'string',
              _meta: {
                type: 'email-with-name',
                i18n: {
                  'Sender address': [ 'Addresse de l\'envoyeur' ]
                }
              }
            },
            to: {
              title: 'Receivers',
              type: 'array',
              items: {
                title: 'Receiver',
                type: 'string',
                _meta: {
                  type: 'email-with-name',
                  i18n: {
                    'Receiver': [ 'Destinataire' ]
                  }
                }
              },
              _meta: {
                type: 'email-with-name',
                i18n: {
                  'Receivers': [ 'Destinataires' ]
                }
              }
            },
            subject: {
              title: 'Subject',
              type: 'string',
              _meta: {
                type: null,
                i18n: {
                  'Subject': [ 'Sujet' ]
                }
              }
            },
            text: {
              title: 'Plain text body',
              type: 'string',
              _meta: {
                type: null,
                i18n: {
                  'Plain text body': [ 'Corps en texte plein' ]
                }
              }
            },
            html: {
              title: 'HTML body',
              type: 'string',
              _meta: {
                type: 'html',
                i18n: {
                  'HTML body': [ 'Corps HTML' ]
                }
              }
            }
          },
          _meta: {
            type: null,
            i18n: {
              'Email data': [ 'Données du courriel' ]
            }
          }
        }
      },
      /* default mailer feature config */
      config: {
        host: 'mail.ignitial.fr', /* SMTP host */
        port: 25, /* SMTP port */
        secure: false, /* true for 465, false for other ports */
        auth: {
          user: '', /* SMTP server user account */
          pass: '' /* SMTP server user password */
        },
        logger: false,
        debug: false
      }
    }
  },
  /* options published through discovery mechanism */
  publicOptions: {
    /* declares component injection */
    uiComponentInjection: true,
    /* service description */
    description: {
      /* service icon */
      icon: 'assets/utils-64.png',
      /* Internationalization: see Ignitial.io Web App */
      i18n: {
        'Utils': [
          'Utilitaires'
        ],
        'Utilities': [ 'Utilitaires' ],
        'Provides utilities services':  [
          'Fournit des services utilitaires'
        ],
        'Insert here your own UI components': [
          'Insérer ici vos propres composants'
        ],
        'Utils Service view': [
          'Vue du service Utils'
        ],
        'Send email': [
          'Envoi de courriel'
        ],
        'Utility': [
          'Utilitaire'
        ]
      },
      /* eventually any other data */
      title: 'My amazing component',
      info: 'Provides uber crazy services'
    },
    /* domain related public options: could be any JSON object*/
    myPublicOption: {
      someOptions: {}
    }
  }
}
