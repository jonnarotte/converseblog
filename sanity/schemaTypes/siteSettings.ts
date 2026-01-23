import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'organizationName',
      title: 'Organization Name',
      type: 'string',
      initialValue: 'Converze',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        {
          name: 'twitter',
          type: 'url',
          title: 'Twitter/X',
        },
        {
          name: 'linkedin',
          type: 'url',
          title: 'LinkedIn',
        },
        {
          name: 'github',
          type: 'url',
          title: 'GitHub',
        },
        {
          name: 'instagram',
          type: 'url',
          title: 'Instagram',
        },
      ],
    }),
    defineField({
      name: 'appLinks',
      title: 'App Download Links',
      type: 'object',
      fields: [
        {
          name: 'playStore',
          type: 'url',
          title: 'Google Play Store',
        },
        {
          name: 'appStore',
          type: 'url',
          title: 'Apple App Store',
        },
      ],
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal Links',
      type: 'object',
      fields: [
        {
          name: 'privacyPolicy',
          type: 'url',
          title: 'Privacy Policy URL',
        },
        {
          name: 'termsOfService',
          type: 'url',
          title: 'Terms of Service URL',
        },
      ],
    }),
  ],
})
