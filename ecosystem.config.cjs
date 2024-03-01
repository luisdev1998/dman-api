module.exports = {
    apps : [{
      name: "dmanapi",
      script: "index.js",
      node_args: "-r dotenv/config",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
  };