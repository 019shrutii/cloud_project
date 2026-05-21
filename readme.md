# Cloud Native DevOps Project

This project demonstrates a cloud-native frontend application using:

- React
- Docker
- Kubernetes
- Jenkins
- Prometheus
- Grafana
- Terraform

Features:
- Containerized frontend
- Kubernetes deployment
- CI/CD pipeline
- Monitoring dashboard
- Infrastructure as Code

## Registry and Jenkins setup

- Update `jenkins/Jenkinsfile` environment variables:
  - `DOCKER_REGISTRY`
  - `DOCKER_REPO`
  - `IMAGE_TAG`
- Add Jenkins credentials:
  - `docker-registry-credentials` for Docker login
  - `kubeconfig-credentials` for Kubernetes access
- The frontend deployment manifest now uses a registry image placeholder so the pipeline can deploy the pushed image.
