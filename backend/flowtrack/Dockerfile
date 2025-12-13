# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copiar arquivos do Maven primeiro (cache de dependencias)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar codigo fonte
COPY src ./src

# Build da aplicacao
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Criar usuario nao-root
RUN addgroup -S spring && adduser -S spring -G spring

# Copiar JAR do builder
COPY --from=builder /app/target/*.jar app.jar

# Mudar para usuario nao-root
USER spring:spring

EXPOSE 8080

# Variaveis de ambiente serao passadas via docker-compose
ENTRYPOINT ["java", "-jar", "app.jar"]
