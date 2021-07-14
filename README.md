# Ticketing

`Ticketing Hub` is a ticketing trading website that enable users sell and by tickets. The application includes front-end ticketing system and back-end management system, which is developed by ReactJS, NextJS, and NodeJS, deployed with Docker and Kubernetes.

The application is microservices-based

* **Auth Service**: handles user authentication and authorization
* **Tickets Service**: shows, creates, updates, and deletes tickets
* **Order Service**: shows, creates, and updates orders
* **Expiration Service**: monitors order creation, and cancels it after 15 min if it is not completed
* **Payment Service**: Handles payments using Stripe API

## Instruction

### Installation

#### Development Tools

| Tools              | Usage                         | Official Website                          |
| ------------------ | ----------------------------- | ----------------------------------------- |
| WebStorm           | Primary development IDE       | https://www.jetbrains.com/webstorm/       |
| Visual Studio Code | Secondary development IDE     | https://code.visualstudio.com/            |
| iterm2             | Terminal                      | https://iterm2.com/                       |
| Postman            | API testing                   | https://www.postman.com/                  |
| NPM JS             | Node pakcages management      | https://www.npmjs.com/                    |
| Docker Hub         | Container management          | https://hub.docker.com/                   |
| Docker Desktop     | Docker containers and K8s env | https://www.docker.com/                   |
| Github             | Version control               | https://github.com/                       |
| Google Chrome      | Browser                       | https://www.google.com/intl/en_ca/chrome/ |
| Typora             | Markdown editor               | https://typora.io/                        |



#### Development Environment

| Tools                 | Versioning Number | Download                                           |
| --------------------- | ----------------- | -------------------------------------------------- |
| Node.js               | 14.17.3           | https://nodejs.org/en/                             |
| React                 | 17.0.2            | https://reactjs.org/                               |
| Nest.js               | 11.0.1            | https://nextjs.org/                                |
| Docker Engine         | v20.10.7          | https://www.docker.com/                            |
| Kubernetes            | v1.21.2           | https://kubernetes.io/                             |
| K8s/ingress-nginx     | v0.47.0           | https://kubernetes.github.io/ingress-nginx/deploy/ |
| skaffold dev          | v2beta17          | https://skaffold.dev/                              |
| Mongo image           | 5                 | https://hub.docker.com/_/mongo                     |
| Redis image           | 6.2               | https://github.com/GoogleContainerTools/skaffold   |
| nats-streaming-server | 0.22              | https://hub.docker.com/_/nats-streaming            |

### Depolyment

1. Download and install Docker desktop, skaffold dev
2. Start docker and kubernetes
3. Navigate to the project root folder `ticketing/` where the `skaffold.yaml` is located
4. Run `skaffold run` on terminal, the skaffold will automatically deploy the application
5. Add `127.0.0.1 ticketing.dev` to `hosts` file
6. Go to `https://tickeing.dev` in browser

### Technologies

#### Frontend

| Technologies | Usage                                     | Official Website          |
| ------------ | ----------------------------------------- | ------------------------- |
| React        | Front-end Framework                       | https://reactjs.org/      |
| Nest.js      | React Fromework for server side rendering | https://nextjs.org/       |
| Bootstrap    | UI framework                              | https://getbootstrap.com/ |
| axios        | HTTP framework                            |                           |

#### Backend

| Technologies               | Usage                                       | Official Website                                          |
| -------------------------- | ------------------------------------------- | --------------------------------------------------------- |
| Node.js                    | JavaScript runtime engine                   | https://nodejs.org/en/                                    |
| Express.js                 | Web framework                               | https://expressjs.com/                                    |
| TypeScript                 | Back-end programming language               | https://www.typescriptlang.org/                           |
| MongoDB                    | No-SQL database                             | https://www.mongodb.com/                                  |
| Redis                      | In-memory database                          | https://redis.io/                                         |
| NATS Streaming Server      | Event bus                                   | https://docs.nats.io/nats-streaming-concepts/intro        |
| bcrypt                     | Password hashing                            | https://github.com/kelektiv/node.bcrypt.js                |
| cookie-session             | Cookie-based middleware                     | https://github.com/expressjs/cookie-session               |
| express-validator          | Express.js validator                        | https://express-validator.github.io/docs/                 |
| https-status-code          | HTTP status                                 | https://github.com/daanvanham/http-status-code            |
| jsonwebtoken               | JWT implementation                          | https://github.com/auth0/node-jsonwebtoken                |
| mongoose                   | MongoDB object modeling                     | https://mongoosejs.com/                                   |
| mongoose-update-if-current | Optimistic concurrency controls for MongoDB | https://github.com/eoin-obrien/mongoose-update-if-current |
| mongodb-memory-server      | MongoDB in-memory storage                   | https://github.com/nodkz/mongodb-memory-server            |
| jest                       | Testing framework                           | https://jestjs.io/                                        |
| supertest                  | Testing HTTP                                | https://github.com/visionmedia/supertest                  |
| dotenv                     | Load env variables                          | https://github.com/motdotla/dotenv                        |
| bull                       | Redis-based job queue                       | https://github.com/OptimalBits/bull                       |



## Roadmap

- Optimization with lodash package
- Cloud deployment using AWS or Azure
- Add more type checking
- Migrate client from JS to TS
- Change to GraphQL as front-end web api
- Enable database transaction
- Enhance and style UI
- Document project with Swagger-UI
- Use Wiston as logger
- Replace NATS with a more efficient and featured Event Broker -- Kafka or RabbitMQ
- Support OAuth2
