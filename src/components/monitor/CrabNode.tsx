import { Handle, Position } from '@xyflow/react'
import { motion } from 'framer-motion'
import { CrabIdleAnimation } from '~/components/ani'

interface CrabNodeProps {
  data: { active: boolean }
}

export function CrabNode({ data }: CrabNodeProps) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={data.active ? { scale: [1, 1.08, 1] } : {}}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    >
      {/* Glow effect behind crab */}
      <motion.div
        className="absolute w-24 h-24 rounded-full bg-crab-500/30 blur-xl"
        animate={data.active ? { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] } : {}}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      />

      {/* Outer ring */}
      <div
        className={`absolute w-28 h-28 rounded-full border-2 ${
          data.active ? 'border-crab-500/40' : 'border-shell-700'
        }`}
        style={{
          boxShadow: data.active ? '0 0 20px rgba(239, 68, 68, 0.3)' : 'none',
        }}
      />

      {/* Animated crab */}
      <div className="relative z-10 crab-icon-glow">
        <CrabIdleAnimation className="w-20 h-20" />
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-crab-500! w-4! h-4! border-2! border-shell-900!"
        style={{
          boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
        }}
      />
    </motion.div>
  )
}
