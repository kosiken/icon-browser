/* eslint-disable no-console */
import fatstifyStatic from '@fastify/static'
import fastifyView from '@fastify/view'
import Fastify, { FastifyInstance } from 'fastify'
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'

const server: FastifyInstance = Fastify({})
server.register(fastifyView, {
  engine: {
    ejs: require('ejs')
  },
  root: path.join(__dirname, 'views')
})

const filesDir = process.argv[2]
if (!filesDir) {
  console.log('Cannot find files directory')
  process.exit(1)
}
if (!fs.existsSync(filesDir)) {
  console.log('Files directory does not exist')
  process.exit(1)
}
const publicPath = path.join(process.cwd(), filesDir)
console.log('Public path is: ', publicPath)
server.register(fatstifyStatic, {
  prefix: '/public/',
  root: publicPath
})
server.get('/', async (request, reply) => {
  try {
    // Read the list of SVG files
    const files = await fsPromises.readdir(publicPath)
    const svgFiles = files.filter((file) => file.endsWith('.svg'))

    // Pass the file names to the EJS template
    return reply.view('index.ejs', { svgFiles })
  } catch (err) {
    console.error('Error reading SVG directory:', err)
    reply.code(500).send('Error loading SVG files')
  }
})

const start = async () => {
  try {
    await server.listen({ port: 3000 })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
