import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { LangProvider } from './hooks/useLang';

const Home = lazy(() => import('./pages/Home'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OTPPage = lazy(() => import('./pages/OTPPage'));
const TrackingPage = lazy(() => import('./pages/TrackingPage'));

function PageLoader() {
  return (
    <div className="page-loader">
      <div className="loader-ring" />
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/otp" element={<OTPPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="*" element={
                <div className="not-found">
                  <h2>404 – Page not found</h2>
                  <a href="/">Go Home</a>
                </div>
              } />
            </Routes>
          </Suspense>
        </main>
        <footer className="footer">
          <p>© 2024 Prajapati Mart · Fast delivery in minutes · Faridabad, Haryana</p>
        </footer>
      </BrowserRouter>
    </LangProvider>
  );
}
