import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'

import { getAllPromptsRoute } from './routes/get-all-prompts'
import { uploadVideoRoute } from './routes/upload-video'
import { createTranscriptionRoute } from './routes/create-transcription'
import { generateAiCompletitionRoute } from './routes/generate-ai-completition'

const port = process.env.PORT || 3333

const app = fastify()

app.register(fastifyCors, {
  origin: '*'
})

app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)
app.register(generateAiCompletitionRoute)

app.listen({
  port: Number(port),
  host: '0.0.0.0'
}).then(() => {
  console.log(`Server listening on port ${port}`)
})