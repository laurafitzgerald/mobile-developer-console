const framework = docsVersion => ({
  icon: '/img/cordova.png',
  title: 'Cordova',
  steps: [
    {
      introduction:
        "Create file `mobile-services.json` in your app's source folder and copy contents from the right panel into it."
    },
    {
      introduction:
        'Install the Core AeroGear module, the module manages and binds all services together on the client side.',
      commands: [
        'Open a terminal and navigate to your appplication project root folder.',
        ['Install AeroGear Core package, from the terminal, execute:', '```npm install @aerogear/app```']
      ]
    },
    {
      introduction: 'Initialize AeroGear Core module',
      commands: [
        [
          'To init, load the content from `mobile-services.json` file, and pass it to init:',
          `\`\`\`js 
          import { init } from "@aerogear/app";
          const appConfig = require("./mobile-services.json");
          init(appConfig);`
        ]
      ]
    }
  ],
  services: {
    keycloak: {
      serviceLogoUrl: '/img/keycloak.png',
      serviceName: 'Identity Management',
      serviceDescription: 'Identity Management - Identity and Access Management',
      setupText: 'Identity Management SDK setup',
      docsLink: `https://docs.aerogear.org/aerogear/${docsVersion}/identity-management.html#setup`,
      steps: [
        {
          introduction:
            'Execute following commands in your project directory to install all necessary NPM packages needed for the Identity Management service:',
          commands: [['Install the AeroGear Auth package from NPM', '```npm install @aerogear/auth```']]
        }
      ]
    },
    push: {
      serviceLogoUrl: '/img/push.png',
      serviceName: 'Push Notifications',
      serviceDescription: 'Installs a metrics service based on Prometheus and Grafana',
      setupText: 'Push SDK setup',
      docsLink: `https://docs.aerogear.org/aerogear/${docsVersion}/push-notifications.html#setup`,
      steps: [
        {
          introduction:
            'Execute following commands in your project directory to install all necessary NPM packages needed for the Push Notifications service:',
          commands: [
            ['Install Cordova plugin for push', '```cordova plugin add @aerogear/cordova-plugin-aerogear-push```'],
            [
              'Install Unified Push Server package needed for Device registration',
              '```npm install --save @aerogear/push```'
            ]
          ]
        }
      ]
    },
    metrics: {
      serviceLogoUrl: '/img/metrics.png',
      serviceName: 'Mobile Metrics',
      serviceDescription: 'Installs a metrics service based on Prometheus and Grafana',
      setupText: 'Mobile Metrics SDK setup',
      docsLink: `https://docs.aerogear.org/aerogear/${docsVersion}/mobile-metrics.html#setup`,
      steps: [
        {
          introduction:
            "Metrics is included in all SDK modules, if you already use a component from the AeroGear SDK in your app. You'll need only to install this NPM package to enable it:",
          commands: [
            ['Install Metrics Cordova plugin', '```cordova plugin add @aerogear/cordova-plugin-aerogear-metrics```']
          ]
        }
      ]
    },
    sync: {
      serviceLogoUrl: '/img/sync.svg',
      serviceName: 'Sync',
      serviceDescription: 'Sync service blabla',
      setupText: 'Sync SDK setup',
      docsLink: `https://docs.aerogear.org/aerogear/${docsVersion}/data-sync.html#setup`,

      steps: [
        {
          introduction:
            'Execute following commands in your project directory to install all necessary NPM packages needed for the Sync service:',
          commands: [
            [
              // TODO this needs to be updated after releasing Sync for JS Cordova
            ]
          ]
        }
      ]
    }
  }
});
export default framework;
