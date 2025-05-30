import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ReadyPage from '../pages/ReadyPage';
import GamePage from '../pages/GamePage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ready/:code" element={<ReadyPage />} />
        <Route path="/game/:code" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRouter;
