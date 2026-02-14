module.exports = {
  apps: [{
    name: 'bongg-web',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    max_memory_restart: '512M',
    instances: 1,
    exec_mode: 'fork'
  }]
};
