import Fastify from 'fastify';
import { API_PREFIX, SERVER_PORT } from '../endpoints';
import dbConnector from './db-connector';
import usersRoutes from './routes/users';

const fastify = Fastify({
  logger: true
});
fastify.register(dbConnector);
fastify.register(usersRoutes, { prefix: API_PREFIX});

fastify.listen(SERVER_PORT, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});