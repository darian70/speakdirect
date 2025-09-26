import type { Metadata } from 'next'
import AgentsClient from './AgentsClient'

export const metadata: Metadata = {
  title: 'Agents — SpeakDirect',
  description: 'Agent catalog across voice, chat, SMS, and email. Search and filter by channel and industry.',
}

export default function AgentsPage() {
  return (
    <div className="section-padding">
      <div className="max-width container-padding">
        <AgentsClient />
      </div>
    </div>
  )
}
