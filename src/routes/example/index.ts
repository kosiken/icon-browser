import { FastifyPluginAsync } from "fastify"
import { AppOptions } from "../../app"

const example: FastifyPluginAsync = async (fastify, opts: AppOptions): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    console.log(opts.ajv)

    return 'this is an example'
  })
}

export default example;
