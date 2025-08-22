FROM ubuntu:latest

COPY admin .
COPY frontend .

RUN apt-get update && \
    apt-get install -y nodejs npm

RUN cd admin && \
    npm install && \
    npm run dev && \
    cd ../frontend && \
    npm install && \
    npm run dev