import TabContainer from './components/TabContainer';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Workout Tracker</h1>
        <p>Track and manage your workouts</p>
      </header>
      
      <main className="app-content">
        <TabContainer />
      </main>
      
      <footer className="app-footer">
        <p>Workout Tracker App © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;