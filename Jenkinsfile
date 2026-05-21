pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "docker.io"
        DOCKER_REPO = "yourdockerusername/spendwise-frontend"
        IMAGE_TAG = "latest"
        IMAGE_FULL_NAME = "${DOCKER_REGISTRY}/${DOCKER_REPO}:${IMAGE_TAG}"
        KUBE_NAMESPACE = "default"
        DOCKER_CREDENTIALS_ID = "docker-registry-credentials"
        KUBE_CONFIG_CREDENTIALS_ID = "kubeconfig-credentials"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
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

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_FULL_NAME} ./Spendwise-frontend"
            }
        }

        stage('Login Docker') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: env.DOCKER_CREDENTIALS_ID,
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh "echo $PASS | docker login -u $USER --password-stdin"
                }
            }
        }

        stage('Push Image') {
            steps {
                sh "docker push ${IMAGE_FULL_NAME}"
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([file(credentialsId: env.KUBE_CONFIG_CREDENTIALS_ID, variable: 'KUBECONFIG')]) {
                    sh '''
                        export KUBECONFIG=$KUBECONFIG
                        kubectl apply -f k8s/
                        kubectl set image deployment/frontend frontend=${IMAGE_FULL_NAME} -n ${KUBE_NAMESPACE}
                    '''
                }
            }
        }
    }
}
