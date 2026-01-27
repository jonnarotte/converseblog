import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'userSession',
  title: 'User Session',
  type: 'document',
  fields: [
    defineField({
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
      description: 'Unique session identifier',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startedAt',
      title: 'Started At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastActivity',
      title: 'Last Activity',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'theme',
      title: 'Theme Preference',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
      },
    }),
    defineField({
      name: 'userAgent',
      title: 'User Agent',
      type: 'string',
      description: 'Browser/device information',
    }),
    defineField({
      name: 'ipAddress',
      title: 'IP Address',
      type: 'string',
      description: 'IP address (for analytics)',
    }),
    defineField({
      name: 'referrer',
      title: 'Referrer',
      type: 'string',
      description: 'Where the user came from',
    }),
    defineField({
      name: 'pagesVisited',
      title: 'Pages Visited',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of pages visited in this session',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this session is currently active',
    }),
  ],
  preview: {
    select: {
      sessionId: 'sessionId',
      startedAt: 'startedAt',
      theme: 'theme',
      isActive: 'isActive',
    },
    prepare({ sessionId, startedAt, theme, isActive }) {
      const date = startedAt ? new Date(startedAt).toLocaleDateString() : 'No date'
      const shortId = sessionId ? sessionId.substring(0, 8) : 'No ID'
      return {
        title: `Session ${shortId}`,
        subtitle: `${theme || 'No theme'} • ${date} • ${isActive ? 'Active' : 'Inactive'}`,
      }
    },
  },
})
