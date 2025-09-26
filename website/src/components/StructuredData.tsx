'use client'

import { organizationSchema, softwareApplicationSchema, serviceSchema } from '@/lib/seo'

interface StructuredDataProps {
  schema: 'organization' | 'software' | 'service' | 'custom'
  customSchema?: object
}

export default function StructuredData({ schema, customSchema }: StructuredDataProps) {
  let schemaData

  switch (schema) {
    case 'organization':
      schemaData = organizationSchema
      break
    case 'software':
      schemaData = softwareApplicationSchema
      break
    case 'service':
      schemaData = serviceSchema
      break
    case 'custom':
      schemaData = customSchema
      break
    default:
      return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData)
      }}
    />
  )
}
