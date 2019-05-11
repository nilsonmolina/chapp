module.exports = {
  apps: [{
    name: 'chapp-1',
    script: 'server.js',
    instance_var: 'INSTANCE_ID',
    instances: 1,
    autorestart: true,
    max_memory_restart: '300M',
    watch: false,
    output: './logs/output-1.log',
    error: './logs/error-1.log',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 5000,
    },
  }, {
    name: 'chapp-2',
    script: 'server.js',
    instance_var: 'INSTANCE_ID',
    instances: 1,
    autorestart: true,
    max_memory_restart: '300M',
    watch: false,
    output: './logs/output-2.log',
    error: './logs/error-2.log',
    env: {
      NODE_ENV: 'production',
      PORT: 5001,
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 5001,
    },
  }],
};


// module.exports = {
//   apps : [{
//     name: 'chapp',
//     script: 'server.js',

//     // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
//     args: 'one two',
//     instances: 1,
//     autorestart: true,
//     watch: false,
//     max_memory_restart: '1G',
//     env: {
//       NODE_ENV: 'development'
//     },
//     env_production: {
//       NODE_ENV: 'production'
//     }
//   }],

//   deploy : {
//     production : {
//       user : 'node',
//       host : '212.83.163.1',
//       ref  : 'origin/master',
//       repo : 'git@github.com:repo.git',
//       path : '/var/www/production',
//       'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
//     }
//   }
// };
