import { useState } from 'react';
import WorkoutList from './WorkoutList';
import WorkoutTypeList from './WorkoutTypeList';

const TabContainer = () => {
  const [activeTab, setActiveTab] = useState<'workouts' | 'types'>('workouts');

  return (
    <div className="tab-container">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'workouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('workouts')}
        >
          Workouts
        </button>
        <button 
          className={`tab ${activeTab === 'types' ? 'active' : ''}`}
          onClick={() => setActiveTab('types')}
        >
          Workout Types
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'workouts' ? <WorkoutList /> : <WorkoutTypeList />}
      </div>
    </div>
  );
};

export default TabContainer;