FROM eclipse-temurin:17-jdk AS build

WORKDIR /workspace

COPY gradle gradle
COPY gradlew gradlew
COPY build.gradle build.gradle
COPY settings.gradle settings.gradle
COPY src src

RUN chmod +x gradlew && ./gradlew bootJar --no-daemon

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /workspace/build/libs/assettrackr-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
