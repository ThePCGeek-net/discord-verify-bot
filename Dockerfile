FROM node:16.18.0-alpine

WORKDIR /opt/app
COPY . /opt/app/
CMD [ "npm", "run", "start" ]
