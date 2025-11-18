@echo off
echo 🛑 Eoullim Docker 환경 중지
echo ================================

echo 📦 컨테이너 중지 및 제거 중...
docker-compose down

echo 🧹 사용하지 않는 이미지 정리 중...
docker image prune -f

echo ✅ Docker 환경이 정리되었습니다.
pause