# syntax=docker/dockerfile:1
FROM golang:alpine
COPY go.mod server.go .
COPY static ./static
COPY templates ./templates
RUN go build
ENV EXAMPLE_VAR=gojoe
EXPOSE 7002
CMD ["./gojoe"]
