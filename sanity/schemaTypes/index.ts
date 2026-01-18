import { type SchemaTypeDefinition } from 'sanity'
import { post } from './post'
import { about } from './about'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, about],
}
