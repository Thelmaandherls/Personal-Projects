import { DndContext, useDraggable } from '@dnd-kit/core';
import HoverCard from '../components/hovercard';

export default function About() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-10">
      <HoverCard title="About Me" description="A draggable about section with personality.">
        <button className="text-white underline">Hover over me</button>
      </HoverCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <DndContext>
          {['Learner', 'Coder', 'Dreamer'].map((role, i) => (
            <DraggableBox key={i} role={role} />
          ))}
        </DndContext>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Personal Summary</h2>
        <p className="text-lg leading-relaxed">
          I am a highly motivated and resourceful individual with a passion for learning, problem-solving, and making a meaningful impact through technology. My journey has been shaped by curiosity, resilience, and a commitment to excellence in everything I do. Coming from a challenging background as a first-generation student from a single-parent household, I have developed strong organizational skills, perseverance, and an unwavering drive to succeed against all odds.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          I hold an undergraduate degree in Neuroscience, where I achieved the prestigious Dean’s Award and the NeuroOscar mentorship accolade, as well as a master’s degree in Artificial Intelligence and Machine Learning, supported by the Google DeepMind Scholarship. These experiences have equipped me with a solid foundation in quantitative analysis, programming (Python and SQL), and data-driven problem-solving.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          Professionally, I have honed my skills through diverse internships and roles in asset management, consultancy, and research. My experiences include collaborating on systematic investment strategies, managing complex stakeholder relationships, and delivering impactful presentations to organizations such as HSBC and T. Rowe Price. I thrive in high-pressure environments where attention to detail, effective communication, and teamwork are paramount.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          Beyond academics and work, I am deeply committed to community initiatives. Notably, during the COVID-19 pandemic, I led a project to raise awareness about climate change by creating an art installation from recycled materials. This effort earned recognition from my local councillor and strengthened my collaboration and leadership abilities.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          I am drawn to environments that challenge me to push boundaries while fostering personal growth. With my innate persistence, collaborative mindset, and passion for leveraging technology to improve lives, I aim to contribute meaningfully to solving complex problems that safeguard people’s financial futures. My ultimate goal is to use my skills to bring hope and create lasting positive change through innovation.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          In my spare time, I do a lot of volunteering. I’ve volunteered in a range of roles ranging from: institutions for convicts detained under the mental health act, to art installations, and even sitting on boards for organisations such as Peabody. I’m also a very avid gym-goer! I hit the gym at least 4 times a week minimum, supplementing that with 1-hour walks on my rest days. Moreover, I am constantly learning and building new things: I’ve gotten into baking, teaching myself how to play the piano and sing, creating some personal projects such as a comedy series recommendation system using R, an AI research assistant, my personal portfolio, and a platform to help entry level individuals hopefully land their first role, all using AI&ML frameworks alongside some cloud, web, containerisation and versioning tools.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          As you can hopefully tell, I love learning, but what I’m truly passionate about is leveraging technology to improve lives.
        </p>
      </div>
    </div>
  );
}

function DraggableBox({ role }: { role: string }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: role,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bg-zinc-800 p-4 rounded-lg shadow-lg cursor-move"
    >
      <h3 className="text-3xl">{role}</h3>
      <p className="text-sm mt-2">Drag me around!</p>
    </div>
    );
}