# Use an official JDK image
FROM openjdk:17-jdk-slim AS build

# Set working directory
WORKDIR /app

# Copy the project files
COPY . .

# Build the project (Maven wrapper)
RUN ./mvnw clean package -DskipTests

# Run stage
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port Render will assign
EXPOSE 8080

# Run the jar
CMD ["java", "-jar", "app.jar"]
