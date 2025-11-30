pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        IMAGE_NAME     = "sooindustry-page"
        CONTAINER_NAME = "sooindustry-page"
        DOCKER_PORT    = "14825"
    }

    stages {
        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Docker Build") {
            steps {
                script {
                    def branchTag = env.BRANCH_NAME ?: "local"
                    env.FULL_IMAGE = "${IMAGE_NAME}:${branchTag}"

                    sh """
                      docker build \\
                        -t ${env.FULL_IMAGE} \\
                        .
                    """
                }
            }
        }

        stage("Deploy to Production") {
            when {
                branch "main"
            }
            steps {
                script {
                    def image = env.FULL_IMAGE ?: "${IMAGE_NAME}:${env.BRANCH_NAME}"

                    sh """
                      docker stop ${CONTAINER_NAME} || true
                      docker rm ${CONTAINER_NAME} || true

                      docker run -d \\
                        --name ${CONTAINER_NAME} \\
                        --restart unless-stopped \\
                        -p ${DOCKER_PORT}:14825 \\
                        ${image}
                    """
                }
            }
        }
    }

    post {
        failure {
            echo "Build/Deploy 실패 - BRANCH: ${env.BRANCH_NAME}"
        }
    }
}
