# Use a base image with Java
FROM openjdk:17-jdk-slim

# Set working directory inside the container
WORKDIR /app

# Copy the jar file into the container
COPY target/user-service-0.0.1-SNAPSHOT.jar user-service.jar

# Expose the port that the service will run on
EXPOSE 8000

# Command to run the service
ENTRYPOINT ["java", "-jar", "user-service.jar"]
