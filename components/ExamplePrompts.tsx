import React from 'react';
import { AppMode } from '../types';

interface ExamplePromptsProps {
  mode: AppMode;
  onSelect: (prompt: string) => void;
}

const PROMPTS = {
  [AppMode.PATIENT]: [
    { title: "Explain a finding", prompt: "My report mentions 'mild diffuse cerebral atrophy'. What does that mean in simple terms?" },
    { title: "Compare imaging types", prompt: "What is the difference between a CT scan with and without contrast?" },
    { title: "Define a term", prompt: "What are 'osteophytes' in a knee X-ray report?" },
    { title: "Ask about a procedure", prompt: "What should I expect during a PET scan?" },
  ],
  [AppMode.PROFESSIONAL]: [
    { title: "Generate a classic case", prompt: "Generate a case study of an acute appendicitis on an abdominal CT." },
    { title: "Create a challenging case", prompt: "Create a difficult case of a glioma mimicking an abscess on brain MRI for resident training." },
    { title: "Request discussion points", prompt: "Provide key discussion points on distinguishing types of spinal fractures." },
    { title: "Simulate a scenario", prompt: "Generate a case study of a pulmonary embolism found incidentally on a trauma scan." },
  ]
};

const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ mode, onSelect }) => {
  const prompts = PROMPTS[mode];

  return (
    <div className="my-8 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-3 max-w-3xl mx-auto">
        {prompts.map(({ title, prompt }) => (
          <button
            key={title}
            onClick={() => onSelect(prompt)}
            className="p-4 bg-white border border-gray-200 rounded-lg text-left hover:bg-gray-50/80 hover:border-gray-300 transition-all duration-200 shadow-sm"
          >
            <p className="font-semibold text-sm text-slate-700">{title}</p>
            <p className="text-sm text-slate-500 mt-1">{prompt}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePrompts;
