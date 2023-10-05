FROM node:18.18 AS deps

WORKDIR /app

ENV DATABASE_URL=file:./db.sqlite

ARG SSH_KEY64
ARG WS_URL="/ws"

RUN npm config set shell sh

COPY package.json package-lock.json* prisma ./

RUN mkdir /root/.ssh && (echo "$SSH_KEY64" | base64 -d > /root/.ssh/id_rsa) && \
	ssh-keyscan github.com > /root/.ssh/known_hosts && chmod 600 -R /root/.ssh && \
	yarn install --frozen-lockfile && yarn cache clean && \
	rm -rf /root/.ssh/

FROM node:18.18 AS runner
WORKDIR /app

# Commented out user parts for now, because of permission issues
#RUN addgroup --system --gid 1001 nodejs
#RUN adduser --system --uid 1001 nextjs

#COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=deps /app/node_modules ./node_modules
#COPY --chown=nextjs:nodejs . .
COPY . .

#RUN chown nextjs:nodejs /app

#USER nextjs

ARG WS_URL="/ws"

ENV APP_URL="http://localhost:3000"
ENV WS_URL="/ws"
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

EXPOSE 3000

VOLUME [ "/db" ]

ENV PORT 3000
ENV DATABASE_URL=file:/db/data.sqlite
ENV JWT_SECRET="this is not the jwt secret we're using"

CMD ["yarn", "docker:start"]
