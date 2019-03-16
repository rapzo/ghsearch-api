FROM node:lts-jessie-slim

RUN mkdir -p /srv/ghsearch-api
WORKDIR /srv/ghsearch-api

ARG token
ENV GITHUB_API_TOKEN $token

CMD ["node", "service.js"]

EXPOSE 3000
