const report = require('multiple-cucumber-html-reporter');
const path = require('path');

report.generate({
  jsonDir: './test-results/',
  reportPath: './test-results/',
  reportName: 'TodoMVC Test Report',
  pageTitle: 'TodoMVC - Execution Report',
  displayDuration: true,
  displayReportTime: true,
  openReportInBrowser: false,
  metadata: {
    browser: {
      name: 'chrome',
      version: 'latest'
    },
    device: 'Local Machine',
    platform: {
      name: process.platform,
      version: process.version
    }
  },
  customData: {
    title: 'Execution Information',
    data: [
      { label: 'Project', value: 'TodoMVC Automation Framework' },
      { label: 'Framework', value: 'Playwright + Cucumber + POM' },
      { label: 'Date', value: new Date().toLocaleString('en-US') },
      { label: 'Environment', value: 'Test' }
    ]
  }
});

console.log('📊 HTML report generated at: test-results/index.html');
