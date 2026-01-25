import { Handle, Position } from '@xyflow/react'
import { motion } from 'framer-motion'

interface CrabNodeProps {
  data: { active: boolean }
}

export function CrabNode({ data }: CrabNodeProps) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={data.active ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <div className="text-6xl select-none">🦀</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-cyan-500! w-3! h-3! border-2! border-gray-900!"
      />
    </motion.div>
  )
}
