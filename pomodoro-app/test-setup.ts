// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: jest.fn().mockImplementation(() => true)
});

// Mock window.Audio
class AudioMock {
  play() {
    return Promise.resolve();
  }
}

global.Audio = AudioMock as any; 