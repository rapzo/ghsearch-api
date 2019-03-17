FROM node:lts-jessie-slim

RUN mkdir -p /srv/ghsearch-api
WORKDIR /srv/ghsearch-api
COPY dist/ ./

ARG GITHUB_API_TOKEN
ENV GITHUB_API_TOKEN $GITHUB_API_TOKEN

CMD ["node", "service.js"]

EXPOSE 3000
