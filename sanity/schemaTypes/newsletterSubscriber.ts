import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'newsletterSubscriber',
  title: 'Newsletter Subscriber',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Unsubscribed', value: 'unsubscribed' },
          { title: 'Bounced', value: 'bounced' },
        ],
      },
      initialValue: 'active',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Where did this subscriber come from?',
      options: {
        list: [
          { title: 'Home Page', value: 'home' },
          { title: 'Blog Page', value: 'blog' },
          { title: 'Blog Post', value: 'post' },
          { title: 'Other', value: 'other' },
        ],
      },
      initialValue: 'other',
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
      description: 'IP address (for analytics, stored securely)',
    }),
  ],
  preview: {
    select: {
      email: 'email',
      status: 'status',
      subscribedAt: 'subscribedAt',
    },
    prepare({ email, status, subscribedAt }) {
      const date = subscribedAt ? new Date(subscribedAt).toLocaleDateString() : 'No date'
      return {
        title: email,
        subtitle: `${status} • ${date}`,
      }
    },
  },
  orderings: [
    {
      title: 'Subscribed Date, Newest',
      name: 'subscribedAtDesc',
      by: [{ field: 'subscribedAt', direction: 'desc' }],
    },
    {
      title: 'Subscribed Date, Oldest',
      name: 'subscribedAtAsc',
      by: [{ field: 'subscribedAt', direction: 'asc' }],
    },
  ],
})
