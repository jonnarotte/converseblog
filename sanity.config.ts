'use client'

import { defineConfig } from 'sanity'
import { visionTool } from '@sanity/vision'

import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: schema,
  plugins: [
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
