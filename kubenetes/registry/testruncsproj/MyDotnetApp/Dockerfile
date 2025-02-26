# Use official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy .csproj and restore dependencies
COPY *.csproj .
RUN dotnet restore

# Copy everything and build the application
COPY . .
RUN dotnet publish -c Release -o out

# Use runtime image for the final container
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./

# Run the application
ENTRYPOINT ["dotnet", "MyDotnetApp.dll"]
