# # Stage 1: Builder
# FROM golang:1.24.4 AS builder

# WORKDIR /app

# # Copy Go module files
# COPY go.mod go.sum ./
# RUN go mod download

# # Copy all Go source files (including server/cmd/main.go etc.)
# COPY . .

# # Build the Go binary from ./server/cmd or whatever your main.go path is
# # Adjust path if main is in a subfolder like /server/cmd
# RUN go build -o server ./cmd

# # ---- Stage 2: Slim image ----
# FROM debian:bullseye-slim

# # Copy the compiled binary
# COPY --from=builder /app/server /server

# # Copy config file if needed
# COPY ./config.yaml /config.yaml

# # Expose the ports (auth + maps)
# EXPOSE 8080
# EXPOSE 8081

# # Run the app
# ENTRYPOINT ["/server"]


# Stage 1: Builder
FROM golang:1.24.4 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# 🔧 Build static binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server ./cmd

# Stage 2: Minimal runtime image
FROM debian:bullseye-slim  
# this will now work, or you could even use `scratch`

COPY --from=builder /app/server /server
COPY ./config.yaml /config.yaml
COPY ./secret.yml /secret.yml

EXPOSE 8080
EXPOSE 8081

ENTRYPOINT ["/server"]
