# Use a base image with Java
FROM openjdk:17-jdk-slim

# Set working directory inside the container
WORKDIR /app

# Copy the jar file into the container
COPY target/order-service-0.0.1-SNAPSHOT.jar order-service.jar

# Expose the port that the service will run on
EXPOSE 8001

# Command to run the service
ENTRYPOINT ["java", "-jar", "order-service.jar"]
