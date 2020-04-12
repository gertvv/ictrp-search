FROM node:12

RUN apt-get update
RUN apt-get install -y libcap2-bin 
RUN setcap 'cap_net_bind_service=+ep' /usr/local/bin/node

RUN useradd -ms /bin/bash app

USER app
WORKDIR /home/app

COPY package.json /home/app/
COPY yarn.lock /home/app/
RUN yarn install

COPY . /home/app/
RUN yarn build

EXPOSE 80
CMD yarn run server 80
