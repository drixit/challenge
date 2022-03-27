import Fastify from 'fastify';
import dbConnector from './db-connector';
import usersRoutes from './routes/users';

const fastify = Fastify({
  logger: true
});
fastify.register(dbConnector);
fastify.register(usersRoutes);

fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});