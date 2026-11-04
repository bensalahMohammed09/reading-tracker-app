# Stage 1 : Build and compile the application
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Restore dependencies first to leverage Docker layer caching
COPY ["ReadingTracker.API.csproj","./"]
RUN dotnet restore "./ReadingTracker.API.csproj"

# Copy the rest of the code and publish the release build 
COPY . .
RUN dotnet publish "ReadingTracker.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2 : Create the lightweight runtime image 
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Expose standard port .NET 
EXPOSE 8000

# Copy only the compiled binaries from the build stage
COPY --from=build /app/publish .

# Define the entry point for the container
ENTRYPOINT ["dotnet", "ReadingTracker.API.dll"]