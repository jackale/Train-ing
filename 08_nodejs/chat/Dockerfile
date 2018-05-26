FROM node

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY ./app/package.json /opt/app
RUN npm install --quiet

CMD [ "npm", "start" ]