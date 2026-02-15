module.exports = {
  default: {
    // Feature directories
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    requireModule: ['ts-node/register'],
    
    // Output format
    format: [
      'progress-bar',
      'html:test-results/cucumber-report.html',
      'json:test-results/cucumber-report.json',
      '@cucumber/pretty-formatter'
    ],
    
    // Execution options
    parallel: 1, // Number of parallel workers
    retry: 0, // Number of retries on failure
    
    // Feature file name format
    publishQuiet: true,
  }
};
