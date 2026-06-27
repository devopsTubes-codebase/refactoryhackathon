# Docker & CI/CD Setup - Codebase Wiki

## Docker Setup

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Local Development dengan Docker Compose

1. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env dan isi semua required variables
```

2. **Build dan run semua services**
```bash
docker-compose up -d
```

3. **Check logs**
```bash
docker-compose logs -f
```

4. **Stop services**
```bash
docker-compose down
```

5. **Rebuild setelah code changes**
```bash
docker-compose up -d --build
```

### Build Docker Images Manual

**Frontend:**
```bash
docker build -t codebase-wiki-frontend:latest -f apps/web/Dockerfile .
```

**Backend:**
```bash
docker build -t codebase-wiki-backend:latest -f apps/api/Dockerfile .
```

### Struktur Dockerfile

```
tubes/
├── apps/
│   ├── web/
│   │   └── Dockerfile          # Frontend (Next.js 14)
│   └── api/
│       └── Dockerfile          # Backend (Node.js)
├── docker-compose.yml          # Local development stack
└── .dockerignore              # Files to exclude from build
```

## CI/CD Pipeline

### GitHub Actions Workflow

Pipeline otomatis akan berjalan saat:
- Push ke branch `main` atau `dev`
- Pull request ke `main` atau `dev`

### Pipeline Steps

1. **Build and Push** (parallel untuk frontend & backend)
   - Checkout code
   - Setup Docker Buildx
   - Login ke Docker Hub
   - Build image dengan tags:
     - `latest` (untuk branch main)
     - `<branch>-<sha>` (untuk tracking)
   - Push ke Docker Hub

2. **Update K8s Manifests** (hanya untuk main branch)
   - Checkout repo `codebase-wiki-k8s`
   - Update image tags di deployment manifests
   - Commit & push changes
   - ArgoCD akan auto-sync deployment baru

3. **Notify**
   - Report pipeline status

### Required GitHub Secrets

Setup secrets di repository Settings → Secrets and variables → Actions:

| Secret | Deskripsi |
|--------|-----------|
| `DOCKER_USERNAME` | Docker Hub username (hshinosa) |
| `DOCKER_PASSWORD` | Docker Hub password atau access token |
| `GH_PAT` | GitHub Personal Access Token dengan repo write access ke `codebase-wiki-k8s` |

### Docker Hub Images

- **Frontend**: `hshinosa/codebase-wiki-frontend`
- **Backend**: `hshinosa/codebase-wiki-backend`

### Image Tags

- `latest` - Latest stable dari main branch
- `main-<sha>` - Specific commit dari main
- `dev-<sha>` - Development builds
- `pr-<number>` - Pull request builds

### Manual Trigger

```bash
# Trigger workflow via GitHub CLI
gh workflow run ci-cd.yml
```

## Troubleshooting

### Build gagal di Docker Compose

```bash
# Clear cache dan rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Database connection error

```bash
# Check database health
docker-compose ps
docker-compose logs database

# Reset database
docker-compose down -v
docker-compose up -d database
```

### Image tidak ter-push ke Docker Hub

1. Verify Docker Hub credentials di GitHub Secrets
2. Check workflow logs: `Actions` tab di GitHub
3. Pastikan image name format benar: `username/image:tag`

### ArgoCD tidak auto-sync

1. Check apakah GH_PAT valid dan punya write access
2. Verify workflow berhasil update manifests di `codebase-wiki-k8s`
3. Check ArgoCD sync policy di `argocd/application.yaml`

## Monitoring

### Container Metrics

Prometheus akan scrape metrics dari:
- Backend: `http://backend:4000/metrics`
- PostgreSQL: default postgres_exporter
- Container stats: cAdvisor

### Health Checks

- Backend: `http://backend:4000/api/health`
- Frontend: Next.js default health endpoint
- Database: `pg_isready`

## Best Practices

1. **Always test locally** dengan docker-compose sebelum push
2. **Use .dockerignore** untuk mempercepat build
3. **Multi-stage builds** untuk image size yang lebih kecil
4. **Cache layers** dengan proper COPY order
5. **Non-root user** untuk security
6. **Health checks** untuk production readiness
