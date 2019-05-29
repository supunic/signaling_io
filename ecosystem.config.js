module.exports = {
  apps : [{
    name: 'signaling_io',
    script: 'index.js',
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      key: '~/.ssh/id_rsa',
      user : 'seiyaendo',
      host : '160.16.124.99',
      port : '50830',
      ref  : 'origin/master',
      repo : 'https://github.com/supunic/signaling_io.git',
      path : '/var/www/signaling_ws',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};

