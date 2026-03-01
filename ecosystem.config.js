module.exports = {
  apps: [
    {
      name: 'caneiq-backend',
      script: './backend/src/index.js',
      cwd: '/app',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/app/logs/backend-error.log',
      out_file: '/app/logs/backend-out.log',
      log_file: '/app/logs/backend-combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    },
    {
      name: 'caneiq-ai-module',
      script: 'python3',
      args: 'main.py',
      cwd: '/app/ai-module',
      instances: 1,
      exec_mode: 'fork',
      env: {
        FLASK_ENV: 'production',
        BACKEND_URL: 'http://localhost:3001',
        SIMULATION_MODE: 'true'
      },
      error_file: '/app/logs/ai-module-error.log',
      out_file: '/app/logs/ai-module-out.log',
      log_file: '/app/logs/ai-module-combined.log',
      time: true,
      max_memory_restart: '1G'
    },
    {
      name: 'caneiq-edge-simulation',
      script: 'node',
      args: 'index.js',
      cwd: '/app/edge-simulation',
      instances: 1,
      exec_mode: 'fork',
      env: {
        BACKEND_URL: 'http://localhost:3001',
        SIMULATION_INTERVAL: '2000'
      },
      error_file: '/app/logs/edge-simulation-error.log',
      out_file: '/app/logs/edge-simulation-out.log',
      log_file: '/app/logs/edge-simulation-combined.log',
      time: true,
      max_memory_restart: '512M'
    }
  ],
  
  deploy: {
    production: {
      user: 'caneiq',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:caneiq/platform.git',
      path: '/var/www/caneiq',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
