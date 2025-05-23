import Link from 'next/link';

const projects = [
  {
    title: 'Portfolio Website',
    description: 'A personal portfolio website built with Next.js and Tailwind CSS.',
    link: 'https://github.com/yourusername/portfolio',
  },
  {
    title: 'Weather App',
    description: 'A weather forecasting app using React and OpenWeather API.',
    link: 'https://github.com/yourusername/weather-app',
  },
  {
    title: 'E-commerce Store',
    description: 'An e-commerce platform built with React, Redux, and Firebase.',
    link: 'https://github.com/yourusername/ecommerce-store',
  },
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">My Projects</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-4">{project.title}</h2>
            <p className="mb-4">{project.description}</p>
            <Link
              href={project.link}
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              View Project
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}