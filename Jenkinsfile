pipeline {
  agent any
  
  environment {
    TEST_ENV = 'staging'
    BROWSER = 'chrome'
    RECORD_VIDEO = 'true'
    HEADLESS = 'true'
  }
  
  stages {
    stage('Checkout') {
      steps {
        echo 'Checking out code...'
        checkout scm
      }
    }
    
    stage('Install Dependencies') {
      steps {
        echo 'Installing Node.js dependencies...'
        sh 'npm ci'
        echo 'Installing Playwright browsers...'
        sh 'npx playwright install --with-deps chromium firefox'
      }
    }
    
    stage('Run E2E Tests with Video') {
      steps {
        echo "Running tests on ${TEST_ENV} environment with ${BROWSER} browser"
        echo "Video recording: ${RECORD_VIDEO}"
        sh '''
          TEST_ENV=${TEST_ENV} \
          BROWSER=${BROWSER} \
          RECORD_VIDEO=${RECORD_VIDEO} \
          HEADLESS=${HEADLESS} \
          npm test
        '''
      }
    }
    
    stage('Generate HTML Report') {
      steps {
        echo 'Generating HTML test report...'
        sh 'npm run report:generate'
      }
    }
    
    stage('Publish Results') {
      steps {
        echo 'Publishing test results and artifacts...'
        
        // Publish HTML Report
        publishHTML([
          allowMissing: false,
          alwaysLinkToLastBuild: true,
          keepAll: true,
          reportDir: 'test-results',
          reportFiles: 'index.html',
          reportName: 'Cucumber Test Report',
          reportTitles: 'E2E Test Results'
        ])
        
        // Archive test results, videos and screenshots
        archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
        archiveArtifacts artifacts: 'test-results/videos/**/*.webm', allowEmptyArchive: true
        archiveArtifacts artifacts: 'test-results/screenshots/**/*.png', allowEmptyArchive: true
      }
    }
  }
  
  post {
    always {
      echo 'Cleaning up workspace...'
      // Archive cucumber JSON report
      archiveArtifacts artifacts: 'test-results/cucumber-report.json', allowEmptyArchive: true
    }
    
    success {
      echo '✅ Pipeline completed successfully!'
      echo "Test report available at: ${BUILD_URL}Cucumber_Test_Report/"
    }
    
    failure {
      echo '❌ Pipeline failed. Check logs and artifacts for details.'
      // You can add notifications here (email, Slack, etc.)
    }
    
    cleanup {
      echo 'Final cleanup...'
      cleanWs(
        deleteDirs: true,
        patterns: [[pattern: 'node_modules/**', type: 'EXCLUDE']]
      )
    }
  }
}
