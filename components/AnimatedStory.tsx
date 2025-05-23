import React, { useState } from 'react';

const storyPanels = [
	{
		text: "Hi, I'm Thelma! Peek into my world - in a fun way!",
		choices: [{ label: 'Next', next: 1 }]
	},
	{
		text: "I'm an aspiring AI/ML engineer, but I also love being creative with code.",
		choices: [
			{ label: 'Show me your projects!', next: 2 },
			{ label: 'Tell me more about you', next: 3 }
		]
	},
	{
		text: "Here's a peek at my favorite projects!",
		choices: [
			{ label: 'Go to Projects', link: '/projects' },
			{ label: 'Back', next: 1 }
		]
	},
	{
		text: "I enjoy building meaningful things with technology.",
		choices: [
			{ label: 'Contact you', link: '/contact' },
			{ label: 'Back', next: 1 }
		]
	}
];

// Simple mascot SVG (cartoon face, waving hand)
function Mascot() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
			<svg width="80" height="80" viewBox="0 0 80 80" style={{ display: 'block' }}>
				{/* Face */}
				<circle cx="40" cy="40" r="32" fill="#fde047" stroke="#222" strokeWidth="3" />
				{/* Eyes */}
				<ellipse cx="30" cy="38" rx="5" ry="7" fill="#222" />
				<ellipse cx="50" cy="38" rx="5" ry="7" fill="#222" />
				{/* Smile */}
				<path d="M28 52 Q40 62 52 52" stroke="#222" strokeWidth="3" fill="none" />
				{/* Waving hand */}
				<g>
					<ellipse cx="65" cy="25" rx="7" ry="12" fill="#fde047" stroke="#222" strokeWidth="2" transform="rotate(-20 65 25)">
						<animateTransform attributeName="transform" type="rotate" from="-20 65 25" to="20 65 25" dur="0.7s" repeatCount="indefinite" direction="alternate" />
					</ellipse>
					{/* Fingers */}
					<ellipse cx="65" cy="13" rx="2.2" ry="5" fill="#fde047" stroke="#222" strokeWidth="1.2" />
					<ellipse cx="70" cy="16" rx="2.2" ry="5" fill="#fde047" stroke="#222" strokeWidth="1.2" />
					<ellipse cx="60" cy="16" rx="2.2" ry="5" fill="#fde047" stroke="#222" strokeWidth="1.2" />
				</g>
			</svg>
		</div>
	);
}

export default function AnimatedStory() {
	const [panel, setPanel] = useState(0);
	return (
		<div>
			<Mascot />
			<div style={{ minHeight: 80, marginBottom: 24 }}>{storyPanels[panel].text}</div>
			<div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
				{storyPanels[panel].choices.map((choice, i) =>
					choice.link ? (
						<a key={i} href={choice.link} style={{
							background: '#fde047', color: '#222', borderRadius: 12, padding: '0.5em 1.2em', fontWeight: 700, textDecoration: 'none', boxShadow: '0 2px 8px #0003', fontFamily: 'Fredoka One, cursive', fontSize: '1.1rem', cursor: 'pointer', border: '2px solid #fff', outline: '2px solid #222', transition: 'background 0.2s'
						}}>{choice.label}</a>
					) : (
						<button key={i} onClick={() => setPanel(choice.next)} style={{
							background: '#fde047', color: '#222', borderRadius: 12, padding: '0.5em 1.2em', fontWeight: 700, boxShadow: '0 2px 8px #0003', fontFamily: 'Fredoka One, cursive', fontSize: '1.1rem', cursor: 'pointer', border: '2px solid #fff', outline: '2px solid #222', transition: 'background 0.2s'
						}}>{choice.label}</button>
					)
				)}
			</div>
		</div>
	);
}
