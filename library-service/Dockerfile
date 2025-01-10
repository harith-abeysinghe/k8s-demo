# Use a base image with Java
FROM openjdk:17-jdk-slim

# Set working directory inside the container
WORKDIR /app

# Copy the jar file into the container
COPY target/library-service-0.0.1-SNAPSHOT.jar library-service.jar

# Expose the port that the service will run on
EXPOSE 8002

# Command to run the service
ENTRYPOINT ["java", "-jar", "library-service.jar"]
