const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const promMid = require('express-prometheus-middleware');
const Prometheus = require('prom-client');
const packageJson = require('./package.json');
const fs = require('fs');
const { PushService, IdentityManagementService, MetricsService, MobileServicesMap } = require('./mobile-services-info');

const app = express();

app.use(bodyParser.json());

// prometheus metrics endpoint
app.use(
  promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5]
  })
);

const port = process.env.PORT || 4000;
const configPath = process.env.MOBILE_SERVICES_CONFIG_FILE || '/etc/mdc/servicesConfig.json';
const DEFAULT_SERVICES = {
  services: [
    {
      type: IdentityManagementService.type,
      url: `https://${process.env.IDM_URL || process.env.OPENSHIFT_HOST}`
    },
    {
      type: PushService.type,
      url: `https://${process.env.UPS_URL || process.env.OPENSHIFT_HOST}`
    },
    {
      type: MetricsService.type,
      url: `https://${process.env.METRICS_URL || process.env.OPENSHIFT_HOST}`
    }
  ]
};

// metric endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', Prometheus.register.contentType);
  res.end(Prometheus.register.metrics());
});

// Dynamic configuration for openshift API calls
app.get('/api/server_config.js', (req, res) => {
  res.send(getConfigData(req));
});

app.get('/api/mobileservices', (req, res) => {
  getServices(configPath).then(servicesJson => {
    res.json({
      items: servicesJson
    });
  });
});

app.get('/about', (_, res) => {
  res.json({
    version: packageJson.version || 'Not Available'
  });
});

function getConfigData(req) {
  const { OPENSHIFT_USER_TOKEN, OPENSHIFT_USER_NAME, OPENSHIFT_USER_EMAIL, OPENSHIFT_MDC_NAMESPACE } = process.env;
  let userToken = OPENSHIFT_USER_TOKEN;
  let userName = OPENSHIFT_USER_NAME || 'testuser';
  let userEmail = OPENSHIFT_USER_EMAIL || 'testuser@localhost';
  const mdcNamespace = OPENSHIFT_MDC_NAMESPACE || 'myproject';

  if (process.env.NODE_ENV === 'production') {
    userToken = req.get('X-Forwarded-Access-Token');
    userName = req.get('X-Forwarded-User');
    userEmail = req.get('X-Forwarded-Email');
  }

  return `window.OPENSHIFT_CONFIG = {
    mdcNamespace: '${mdcNamespace}',
    masterUri: 'https://${process.env.OPENSHIFT_HOST}',
    wssMasterUri: 'wss://${process.env.OPENSHIFT_HOST}',
    user: {
      accessToken: '${userToken}',
      name: '${userName}',
      email: '${userEmail}'
    }
  };`;
}

function getServices(servicesConfigPath) {
  return new Promise(resolve => {
    if (fs.existsSync(servicesConfigPath)) {
      fs.readFile(servicesConfigPath, (err, data) => {
        if (err) {
          console.error(`Failed to read service config file ${servicesConfigPath}, mock data will be used`);
          return resolve(DEFAULT_SERVICES);
        }
        return resolve(JSON.parse(data));
      });
    }
    console.warn(`can not find service config file at ${servicesConfigPath}, mock data will be used`);
    return resolve(DEFAULT_SERVICES);
  })
    .then(servicesUrls => servicesUrls.services)
    .then(services =>
      services.map(service => {
        const serviceInfo = MobileServicesMap[service.type];
        if (serviceInfo) {
          return { ...serviceInfo, ...service };
        }
        return service;
      })
    );
}

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'build')));
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

function run() {
  const { OPENSHIFT_HOST, OPENSHIFT_USER_TOKEN } = process.env;
  if (!OPENSHIFT_HOST) {
    console.error('OPENSHIFT_HOST environment variable is not set');
    process.exit(1);
  }
  if (!OPENSHIFT_USER_TOKEN && process.env.NODE_ENV !== 'production') {
    console.error(
      'The app is running non-production mode and requires OPENSHIFT_USER_TOKEN environment variable to be set'
    );
    process.exit(1);
  }
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

run();
