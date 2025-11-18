# 빌드 스테이지
FROM node:18-alpine AS builder
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./
RUN npm ci

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# 실행 스테이지 (nginx 사용)
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# 기본 nginx 설정 제거
RUN rm -rf ./*

# 빌드된 파일 복사
COPY --from=builder /app/build .

# 간단한 nginx 설정 생성
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]