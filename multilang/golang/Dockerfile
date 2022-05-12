FROM golang:1.17 as builder
WORKDIR /app
COPY main.go go.mod go.sum ./
RUN go build -o cheqd_validator_status_checker .
ENTRYPOINT [ "./cheqd_validator_status_checker" ]
