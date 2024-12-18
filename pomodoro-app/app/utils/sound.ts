export const playSound = (type: 'complete' | 'start' = 'complete') => {
    const sounds = {
        complete: '/sounds/complete.mp3',
        start: '/sounds/start.mp3'
    };
    
    const audio = new Audio(sounds[type]);
    audio.play().catch(console.error);
}; 