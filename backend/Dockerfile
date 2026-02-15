FROM eclipse-temurin:17-jre-alpine

# Устанавливаем ffmpeg
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Копируем jar файл
COPY build/libs/*.jar app.jar

# Копируем application.properties если он есть в resources
# Но он уже внутри jar, так что это не обязательно

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]


