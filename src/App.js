import LoginPage from "../src/Pages/LoginPage"
import CreateAccountPage from "./Pages/CreateAccountPage";
import EventPage from "./Pages/EventPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/create" element={<CreateAccountPage />} />
          <Route path="/:username/events" element={<EventPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
