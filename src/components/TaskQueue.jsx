import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical } from 'lucide-react';

const initialTasks = [
  { id: '1', title: 'Complete architecture mapping' },
  { id: '2', title: 'Design audio mixer UI' },
  { id: '3', title: 'Implement Pomodoro logic' },
];

export const TaskQueue = () => {
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <div className="w-full h-full p-6 bg-white/60 backdrop-blur-xl rounded-3xl shadow-soft border border-white/50 flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Priority Queue</h2>
      
      <Reorder.Group 
        axis="y" 
        values={tasks} 
        onReorder={setTasks} 
        className="flex flex-col gap-3 flex-grow overflow-y-auto pr-2 custom-scrollbar"
      >
        {tasks.map((task) => (
          <Reorder.Item
            key={task.id}
            value={task}
            id={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileDrag={{
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(19, 138, 254, 0.2)",
            }}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between cursor-grab relative overflow-hidden group transition-colors hover:border-focus-blue/30"
          >
            <div className="flex items-center gap-3 w-full">
              {/* Drag Handle */}
              <div className="text-gray-400 group-hover:text-focus-blue/80 transition-colors cursor-grab active:cursor-grabbing">
                  <GripVertical size={20} />
              </div>
              <span className="text-gray-700 font-medium truncate">{task.title}</span>
            </div>
            
            {/* Subtle interaction glow on drag */}
            <motion.div 
              className="absolute inset-0 border-2 border-transparent rounded-2xl pointer-events-none"
              whileDrag={{ borderColor: "rgba(19, 138, 254, 0.5)" }}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};
