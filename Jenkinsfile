podTemplate(
    label: 'builder',
    containers: [
        containerTemplate(name: 'docker', image: 'docker:dind', privileged: true)
    ]
) {
    node('builder') {
        stage('Checkout') {
            checkout scm
        }
        stage('Build and Run Docker') {
            container('docker') {
                // Docker 데몬 시작
                sh 'dockerd &'
                
                // Docker 데몬이 시작될 때까지 대기
                sh 'while ! docker info > /dev/null 2>&1; do sleep 1; done'

                // Docker 이미지 빌드
                sh 'docker build -t myapp .'

                // Docker 컨테이너 실행
                sh 'docker run myapp'
            }
        }
    }
}
