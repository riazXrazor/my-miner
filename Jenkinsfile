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
                sh 'npm install -g pm2'
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
                            sh 'pm2 stop all'
                            sh 'pm2 delete all'
                            sh 'pm2 start app.js'
                            sh 'pm2 list'
                        }
                }
    }
}