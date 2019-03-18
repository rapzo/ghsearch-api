FROM node:lts-jessie-slim

ARG GITHUB_API_TOKEN
ENV GITHUB_API_TOKEN $GITHUB_API_TOKEN
ENV PORT 80

COPY dist /srv/ghsearch-api
WORKDIR /srv/ghsearch-api

CMD ["node", "service.js"]

EXPOSE 80
