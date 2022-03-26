import fp from 'fastify-plugin';
import fastifyMongo from 'fastify-mongodb';

async function dbConnector (fastify: any, options: any) {
  fastify.register(fastifyMongo, {
    url: 'mongodb://localhost:27017/test_database'
  });
}

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
export default fp(dbConnector);