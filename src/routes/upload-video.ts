import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";

import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import path from "node:path";

import { prisma } from "../lib/prisma";

const pipelineAsync = promisify(pipeline)

export async function uploadVideoRoute(app: FastifyInstance){
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25 // 25MB
    }
  })

  app.post('/videos', async (request, reply) => {
    const data = await request.file()

    if(!data){
      return reply.status(400).send({
        error: 'No file uploaded'
      })
    }

    const extension = path.extname(data.filename)

    if(extension !== '.mp3'){
      return reply.status(400).send({
        error: 'Invalid file type, only mp3 is allowed'
      })
    }

    const fileBaseBame = path.basename(data.filename, extension)
    const fileUploadName = `${fileBaseBame}-${randomUUID()}${extension}`
    const uploadDestination = path.join(__dirname, '..', '..', 'tmp', fileUploadName)

    await pipelineAsync(data.file, fs.createWriteStream(uploadDestination))

    const video = await prisma.video.create({
      data:{
        name: fileUploadName,
        path: uploadDestination,
      }
    })

    return {
      video
    }
  })
}