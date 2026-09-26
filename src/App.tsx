import { Route, Routes } from 'react-router-dom';
import { BookingModal } from './components/booking/BookingModal';
import { GalleryModal } from './components/gallery/GalleryModal';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { UiProvider } from './hooks/useUi';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RoomPage } from './pages/RoomPage';

export default function App() {
  return (
    <UiProvider>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cuartos/:lodgeId/:slug" element={<RoomPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <BookingModal />
      <GalleryModal />
    </UiProvider>
  );
}
