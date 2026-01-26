import { memo, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { motion } from 'framer-motion'
import {
  Loader2,
  CheckCircle,
  XCircle,
  Wrench,
  MessageSquare,
  MessageCircle,
  Bot,
} from 'lucide-react'
import type { MonitorAction } from '~/integrations/clawdbot'

interface ActionNodeProps {
  data: MonitorAction
  selected?: boolean
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const stateConfig: Record<
  MonitorAction['type'],
  {
    icon: typeof Loader2
    color: string
    iconColor: string
    animate: boolean
  }
> = {
  delta: {
    icon: Loader2,
    color: 'border-blue-500 bg-blue-500/10',
    iconColor: 'text-blue-400',
    animate: true,
  },
  final: {
    icon: CheckCircle,
    color: 'border-green-500 bg-green-500/10',
    iconColor: 'text-green-400',
    animate: false,
  },
  aborted: {
    icon: XCircle,
    color: 'border-orange-500 bg-orange-500/10',
    iconColor: 'text-orange-400',
    animate: false,
  },
  error: {
    icon: XCircle,
    color: 'border-red-500 bg-red-500/10',
    iconColor: 'text-red-400',
    animate: false,
  },
  tool_call: {
    icon: Wrench,
    color: 'border-purple-500 bg-purple-500/10',
    iconColor: 'text-purple-400',
    animate: false,
  },
  tool_result: {
    icon: MessageSquare,
    color: 'border-cyan-500 bg-cyan-500/10',
    iconColor: 'text-cyan-400',
    animate: false,
  },
}

const eventTypeLabels: Record<MonitorAction['eventType'], { label: string; icon: typeof MessageCircle }> = {
  chat: { label: 'Chat', icon: MessageCircle },
  agent: { label: 'Agent', icon: Bot },
  system: { label: 'System', icon: MessageSquare },
}

export const ActionNode = memo(function ActionNode({
  data,
  selected,
}: ActionNodeProps) {
  const [expanded, setExpanded] = useState(false)
  const state = stateConfig[data.type]
  const eventInfo = eventTypeLabels[data.eventType || 'chat']
  const StateIcon = state.icon
  const EventIcon = eventInfo.icon

  // Safely get content as string
  const contentStr = typeof data.content === 'string'
    ? data.content
    : data.content != null
      ? JSON.stringify(data.content)
      : null

  const truncatedContent = contentStr
    ? contentStr.length > 100
      ? contentStr.slice(0, 100) + '...'
      : contentStr
    : null

  const fullContent = contentStr

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => setExpanded(!expanded)}
      className={`
        px-3 py-2 rounded-md border min-w-[180px] max-w-[300px] cursor-pointer
        ${state.color}
        ${selected ? 'ring-2 ring-white/50' : ''}
      `}
    >
      <Handle type="target" position={Position.Top} className="bg-gray-500! w-2! h-2!" />

      {/* Header: Event type + state */}
      <div className="flex items-center gap-2 mb-1">
        <EventIcon size={14} className="text-gray-400" />
        <span className="text-xs font-medium text-gray-200">
          {eventInfo.label} Event
        </span>
        <StateIcon
          size={12}
          className={`${state.iconColor} ${state.animate ? 'animate-spin' : ''} ml-auto`}
        />
      </div>

      {/* Timestamp */}
      <div className="text-[10px] text-gray-500 mb-1">
        {formatTime(data.timestamp)}
      </div>

      {data.toolName && (
        <div className="text-xs text-purple-300 mb-1 font-mono">
          🔧 {data.toolName}
        </div>
      )}

      {truncatedContent && (
        <div className="text-[11px] text-gray-300 leading-tight whitespace-pre-wrap">
          {expanded ? fullContent : truncatedContent}
        </div>
      )}

      {expanded && data.toolArgs != null && (
        <pre className="mt-2 text-[10px] text-gray-400 bg-black/30 p-1 rounded overflow-auto max-h-32">
          {JSON.stringify(data.toolArgs, null, 2) as string}
        </pre>
      )}

      <Handle type="source" position={Position.Bottom} className="bg-gray-500! w-2! h-2!" />
    </motion.div>
  )
})
