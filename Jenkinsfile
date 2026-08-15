pipeline {
    agent { label "enm-server-docker-agent" }

    options {
        disableConcurrentBuilds()
        timeout(time: 20, unit: "MINUTES")
        buildDiscarder(logRotator(numToKeepStr: "10"))
        skipDefaultCheckout(true)
    }

    environment {
        NODE_IMAGE = "node:24.11.1-alpine"
        PAGES_DEPLOY_HOOK_CREDENTIAL = "sooindustry-cloudflare-pages-deploy-hook"
        PRODUCTION_METADATA_URL = "https://sooindustrykorea.com/deployment.json"
    }

    stages {
        stage("Checkout") {
            steps {
                script {
                    def scmVars = checkout scm
                    env.GIT_COMMIT = scmVars.GIT_COMMIT ?: sh(
                        script: "git rev-parse HEAD",
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage("Verify static site") {
            steps {
                sh '''
                    set -eu
                    docker run --rm \
                      --user "$(id -u):$(id -g)" \
                      -e CI=true \
                      -e HOME=/tmp \
                      -e GIT_COMMIT="$GIT_COMMIT" \
                      -e BRANCH_NAME="$BRANCH_NAME" \
                      -v "$WORKSPACE:/workspace" \
                      -w /workspace/sooindustry-react \
                      "$NODE_IMAGE" \
                      sh -lc 'npm ci && npm run check'
                '''
            }
        }

        stage("Trigger Cloudflare production") {
            when {
                branch "main"
            }
            steps {
                withCredentials([string(
                    credentialsId: env.PAGES_DEPLOY_HOOK_CREDENTIAL,
                    variable: "CLOUDFLARE_PAGES_DEPLOY_HOOK"
                )]) {
                    sh '''
                        set -eu
                        set +x
                        curl --fail --silent --show-error \
                          --request POST \
                          --output "$WORKSPACE/cloudflare-deploy-response.json" \
                          "$CLOUDFLARE_PAGES_DEPLOY_HOOK"
                    '''
                }
            }
        }

        stage("Verify production commit") {
            when {
                branch "main"
            }
            steps {
                sh '''
                    set -eu
                    expected="$GIT_COMMIT"
                    attempt=1
                    while [ "$attempt" -le 60 ]; do
                      metadata="$(curl --fail --silent --show-error \
                        --connect-timeout 10 \
                        --max-time 20 \
                        "$PRODUCTION_METADATA_URL?commit=$expected" || true)"
                      case "$metadata" in
                        *"$expected"*)
                          printf 'production_commit=%s\n' "$expected"
                          exit 0
                          ;;
                      esac
                      sleep 10
                      attempt=$((attempt + 1))
                    done
                    printf 'Production did not expose commit %s within 10 minutes.\n' "$expected" >&2
                    exit 1
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: "cloudflare-deploy-response.json", allowEmptyArchive: true
        }
        failure {
            echo "Build or deployment failed for ${env.BRANCH_NAME} at ${env.GIT_COMMIT}"
        }
    }
}
