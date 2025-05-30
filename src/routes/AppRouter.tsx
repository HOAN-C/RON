import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import Home from '../pages/Home';
import ReadyPage from '../pages/ReadyPage';
import GamePage from '../pages/GamePage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<div>로딩 중...</div>}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/ready/:code"
          element={
            <Suspense fallback={<div>로딩 중...</div>}>
              <ReadyPage />
            </Suspense>
          }
        />
        <Route
          path="/game/:code"
          element={
            <Suspense fallback={<div>로딩 중...</div>}>
              <GamePage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRouter;
