pipeline {
    agent {
        docker {
            image 'node:current-alpine3.12'
            args '-p 3000:3000'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'chmod +x ./jenkins/scripts/kill.sh' 
                sh './jenkins/scripts/kill.sh' 
                sh 'npm install'
            }
        }
        stage('Deploy') { 
            steps {
                sh 'chmod +x ./jenkins/scripts/deliver.sh' 
                sh './jenkins/scripts/deliver.sh' 
                input message: 'Finished using the web site? (Click "Proceed" to continue)'
            }
        }
    }
}