import { Link, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { AddChannelPage } from './pages/AddChannelPage';

export function App() {
  return (
    <div>
      <nav className="sticky top-0 z-10 flex gap-4 border-b border-zinc-800 bg-zinc-950/95 p-3 text-sm">
        <Link to="/" className="rounded bg-zinc-800 px-3 py-1">Home</Link>
        <Link to="/search" className="rounded bg-zinc-800 px-3 py-1">Search</Link>
        <Link to="/add-channel" className="rounded bg-zinc-800 px-3 py-1">Add Channel</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/add-channel" element={<AddChannelPage />} />
      </Routes>
    </div>
  );
}
