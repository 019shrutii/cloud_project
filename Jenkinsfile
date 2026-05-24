pipeline {
    agent any
    options {
        skipDefaultCheckout()
        timestamps()
        ansiColor('xterm')
    }

    environment {
        DOCKER_REGISTRY = "docker.io"
        DOCKER_REPO = "yourdockerusername/spendwise-frontend"
        IMAGE_TAG = "latest"
        KUBE_NAMESPACE = "default"
        GIT_CREDENTIALS_ID = "github-credentials"

        DOCKER_CREDENTIALS_ID = "docker-registry-credentials"
        KUBE_CONFIG_CREDENTIALS_ID = "kubeconfig-credentials"
    }

    stages {

        stage('Checkout') {
            steps {
                script {
                    checkout([$class: 'GitSCM',
                        branches: [[name: env.BRANCH_NAME ? env.BRANCH_NAME : '*/master']],
                        userRemoteConfigs: [[url: 'https://github.com/019shrutii/cloud_project.git', credentialsId: env.GIT_CREDENTIALS_ID]]
                    ])
                }
            }
        }

        stage('Prepare') {
            steps {
                script {
                    env.IMAGE_FULL_NAME = "${env.DOCKER_REGISTRY}/${env.DOCKER_REPO}:${env.IMAGE_TAG}"
                    echo "Using image name: ${env.IMAGE_FULL_NAME}"
                }
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build frontend') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Login Docker') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: DOCKER_CREDENTIALS_ID,
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh "echo $PASS | docker login -u $USER --password-stdin"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${env.IMAGE_FULL_NAME} ./Spendwise-frontend"
            }
        }

        stage('Push Image') {
            steps {
                sh "docker push ${env.IMAGE_FULL_NAME}"
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([file(credentialsId: env.KUBE_CONFIG_CREDENTIALS_ID, variable: 'KUBECONFIG')]) {
                    sh """
                        export KUBECONFIG=$KUBECONFIG
                        kubectl apply -f k8s/
                        kubectl set image deployment/frontend frontend=${env.IMAGE_FULL_NAME} -n ${KUBE_NAMESPACE}
                    """
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
