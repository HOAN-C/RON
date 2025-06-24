import { ThemeProvider } from 'styled-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { theme } from './styles/theme';

// Pages
import MainPage from './pages/Main/MainPage';
import LobbyPage from './pages/Lobby/LobbyPage';
import GamePage from './pages/Game/GamePage';
import Layout from './layout/Layout';
import styled from 'styled-components';
import { useEffect } from 'react';

const AppContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App() {
  useEffect(() => {
    const unlockAudio = () => {
      const audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      window.removeEventListener('click', unlockAudio);
    };

    window.addEventListener('click', unlockAudio);
  }, []);
  return (
    <AppContainer>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<MainPage />} />
              <Route path="/lobby/:code" element={<LobbyPage />} />
              <Route path="/game/:code" element={<GamePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AppContainer>
  );
}

export default App;
