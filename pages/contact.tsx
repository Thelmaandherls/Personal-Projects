export default function Contact() {
    return (
        <div className='min-h-screen bg-black text-white p-10'>
            <h2 className='test-4xl font-bold mb-6'>Let's Change The World</h2>
            <p className='text-lg mb-4'>I'm always open to new ideas and collaborations, especially ones that let me put my Masters in AI and ML to good use! If you have a project in mind or just want to chat, feel free to reach out!!</p>
            <p className='text-lg mb-4'>You can find me on:</p>
            <ul className='list-disc list-inside mb-4'>
                <li><a href="http://www.linkedin.com/in/thelma-o-b334211b9" className='text-blue-500 hover:underline'>LinkedIn</a></li>
                <li><a href="https://github.com/Thelmaandherls" className='text-blue-500 hover:underline'>GitHub</a></li>

            </ul>
            <p className='text-lg mb-4'>Or you can email me at: <a href="mailto:thelmaobirai@gmail.com" className='text-blue-500 hover:underline'>thelmaobirai@gmail.com</a></p>
            <p className='text-lg mb-4'>Or just fill in the form below (whatever works for you current social battery and boldness):</p>
            <form className='space-y-4'>
                <label className='block'>
                    Name: 
                    <input className='bg-zinc-800 w-full p-2 mt-1 rounded' required />
                </label>
                <label className='block'>
                    What doyou need?
                    <select className='bg-zinc-800 w-full p-2 mt-1 rounded'>
                        <option>A friend</option>
                        <option>General Job Related</option>
                        <option>Solve a problem: Websites, AI and ML, etc</option>
                        <option>Hackathon Partner</option>
                        <option>Accountability / work buddy</option>
                    </select>
                </label>
                <label className='block'>
                    Message:
                    <textarea className='bg-zinc-800 w-full p-2 mt-1 rounded' rows={4}></textarea>
                </label>
                <button type='submit' className='bg-green-500 hover:bg-green-600 px-4 py-2 rounded'></button>
            </form>
        </div>
    )
}