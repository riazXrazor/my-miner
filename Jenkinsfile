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
                sh 'npm install'
            }
        }
        stage('Deliver') { 
            steps {
                sh 'chmod +x ./jenkins/scripts/deliver.sh' 
                sh './jenkins/scripts/deliver.sh' 
                input message: 'Finished using the web site? (Click "Proceed" to continue)'
                sh 'chmod +x ./jenkins/scripts/kill.sh' 
                sh './jenkins/scripts/kill.sh' 
            }
        }
    }
    post { 
                success {  
                    dir('.') {
                            sh 'npm run stop app.js'
                            sh 'npm run delete app.js'
                            sh 'pm2 start app.js'
                        }
                }
    }
}