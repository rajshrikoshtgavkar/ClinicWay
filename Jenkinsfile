// pipeline {
//     agent any

//     environment {
//         APP_HOST = '13.211.153.181'   // replace
//         APP_USER = 'ubuntu'
//     }

//     stages {
//         stage('Checkout') {
//             steps { checkout scm }
//         }

//         // stage('Backend: build & test') {
//         //     steps {
//         //         dir('backend') {
//         //             sh 'mvn -B clean package'
//         //         }
//         //     }
//         // }

//         stage('Backend: build') {
//             steps {
//                 dir('backend') {
//                     sh 'mvn -B clean package -DskipTests'
//                 }
//             }
//         }

//         // stage('Frontend: build & test') {
//         //     steps {
//         //         dir('frontend') {
//         //             sh 'npm ci'
//         //             sh 'CI=true npm test -- --watchAll=false'
//         //             sh 'REACT_APP_API_URL=/api npm run build'
//         //         }
//         //     }
//         // }

//         stage('Frontend: build') {
//             steps {
//                 dir('frontend') {
//                     sh 'npm ci'
//                     sh 'npm run build'
//                 }
//             }
//         }

//         stage('Deploy') {
//             steps {
//                 sshagent(credentials: ['app-server-ssh']) {
//                     sh '''
//                         SSH="ssh -o StrictHostKeyChecking=no"

//                         # upload new jar and frontend
//                         scp -o StrictHostKeyChecking=no backend/target/*.jar \
//                             $APP_USER@$APP_HOST:/opt/myapp/app-new.jar
//                         rsync -avz --delete -e "$SSH" frontend/build/ \
//                             $APP_USER@$APP_HOST:/var/www/myapp/

//                         # swap jar (keep previous for rollback) and restart
//                         $SSH $APP_USER@$APP_HOST '
//                             [ -f /opt/myapp/app.jar ] && cp /opt/myapp/app.jar /opt/myapp/app-prev.jar
//                             mv /opt/myapp/app-new.jar /opt/myapp/app.jar
//                             sudo systemctl restart myapp
//                         '
//                     '''
//                 }
//             }
//         }

//         stage('Health check') {
//             steps {
//                 sshagent(credentials: ['app-server-ssh']) {
//                     sh '''
//                         sleep 20
//                         ssh -o StrictHostKeyChecking=no $APP_USER@$APP_HOST \
//                             "systemctl is-active myapp"
//                     '''
//                 }
//             }
//         }
//     }

//     post {
//         success { echo 'Deployed successfully' }
//         failure { echo 'Pipeline failed. Check the console output.' }
//     }
// }

pipeline {
    agent any

    environment {
        APP_HOST = '13.211.153.181'
        APP_USER = 'ec2-user'
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Backend: build') {
            steps {
                dir('backend') {
                    sh 'mvn -B clean package -DskipTests'
                }
            }
        }

        stage('Frontend: build') {
            steps {
                dir('frontend') {
                    sh 'npm ci --no-audit --no-fund'
                    sh 'NODE_OPTIONS=--max-old-space-size=1024 NEXT_PUBLIC_API_URL=/api npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                sshagent(credentials: ['app-server-ssh']) {
                    sh '''
                        SSH="ssh -o StrictHostKeyChecking=no"

                        scp -o StrictHostKeyChecking=no backend/target/*.jar \
                            $APP_USER@$APP_HOST:/opt/myapp/app-new.jar

                        rsync -avz --delete -e "$SSH" frontend/out/ \
                            $APP_USER@$APP_HOST:/var/www/myapp/

                        $SSH $APP_USER@$APP_HOST '
                            if [ -f /opt/myapp/app.jar ]; then cp /opt/myapp/app.jar /opt/myapp/app-prev.jar; fi
                            mv /opt/myapp/app-new.jar /opt/myapp/app.jar
                            sudo systemctl restart myapp
                        '
                    '''
                }
            }
        }

        stage('Health check') {
            steps {
                sshagent(credentials: ['app-server-ssh']) {
                    sh '''
                        sleep 30
                        ssh -o StrictHostKeyChecking=no $APP_USER@$APP_HOST \
                            "systemctl is-active myapp"
                    '''
                }
            }
        }
    }

    post {
        success { echo 'Deployed successfully' }
        failure { echo 'Pipeline failed. Check the console output.' }
    }
}