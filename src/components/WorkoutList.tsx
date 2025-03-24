import { useState, useEffect } from 'react';
import { 
  Workout, 
  WorkoutType,
  WorkoutCreateRequest,
  fetchWorkouts, 
  fetchWorkoutTypes,
  createWorkout, 
  updateWorkout, 
  deleteWorkout 
} from '../services/api';

interface WorkoutFormProps {
  workout: Workout | null;
  workoutTypes: WorkoutType[];
  onSubmit: (workout: WorkoutCreateRequest) => void;
  onCancel: () => void;
}

const WorkoutForm = ({ workout, workoutTypes, onSubmit, onCancel }: WorkoutFormProps) => {
  const [date, setDate] = useState(workout ? workout.date : new Date().toISOString().split('T')[0]);
  const [minutes, setMinutes] = useState(workout ? workout.minutes : 30);
  const [workoutTypeId, setWorkoutTypeId] = useState(workout ? workout.workoutType.id : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedWorkoutType = workoutTypes.find(type => type.id === workoutTypeId);
    
    if (selectedWorkoutType) {
      onSubmit({
        date,
        minutes,
        workoutType: selectedWorkoutType
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="workout-form">
      <h3>{workout ? 'Edit Workout' : 'Add Workout'}</h3>
      
      <div className="form-group">
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="minutes">Duration (minutes):</label>
        <input
          type="number"
          id="minutes"
          value={minutes}
          min="1"
          onChange={(e) => setMinutes(parseInt(e.target.value))}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="workoutType">Workout Type:</label>
        <select
          id="workoutType"
          value={workoutTypeId}
          onChange={(e) => setWorkoutTypeId(e.target.value)}
          required
        >
          <option value="">Select a workout type</option>
          {workoutTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn primary">
          {workout ? 'Update' : 'Add'}
        </button>
        <button type="button" className="btn secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedWorkouts, fetchedWorkoutTypes] = await Promise.all([
        fetchWorkouts(),
        fetchWorkoutTypes()
      ]);
      
      setWorkouts(fetchedWorkouts);
      setWorkoutTypes(fetchedWorkoutTypes);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddWorkout = async (workout: WorkoutCreateRequest) => {
    try {
      await createWorkout(workout);
      await loadData();
      setIsFormVisible(false);
    } catch (err) {
      setError('Failed to add workout. Please try again.');
    }
  };

  const handleUpdateWorkout = async (workout: WorkoutCreateRequest) => {
    if (!editingWorkout) return;
    
    try {
      await updateWorkout(editingWorkout.id, workout);
      await loadData();
      setEditingWorkout(null);
      setIsFormVisible(false);
    } catch (err) {
      setError('Failed to update workout. Please try again.');
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;
    
    try {
      await deleteWorkout(id);
      await loadData();
    } catch (err) {
      setError('Failed to delete workout. Please try again.');
    }
  };

  const handleEditClick = (workout: Workout) => {
    setEditingWorkout(workout);
    setIsFormVisible(true);
  };

  const handleFormSubmit = (workout: WorkoutCreateRequest) => {
    if (editingWorkout) {
      handleUpdateWorkout(workout);
    } else {
      handleAddWorkout(workout);
    }
  };

  const handleCancelForm = () => {
    setEditingWorkout(null);
    setIsFormVisible(false);
  };

  const handleAddClick = () => {
    setEditingWorkout(null);
    setIsFormVisible(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading && workouts.length === 0) {
    return <div className="loading">Loading workouts...</div>;
  }

  return (
    <div className="workout-list-container">
      <div className="header">
        <h2>Workouts</h2>
        <button className="btn primary" onClick={handleAddClick}>
          Add New Workout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isFormVisible && (
        <WorkoutForm
          workout={editingWorkout}
          workoutTypes={workoutTypes}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {workouts.length === 0 && !loading ? (
        <p className="no-data">No workouts found. Add your first one!</p>
      ) : (
        <div className="workout-list">
          {workouts.map((workout) => (
            <div key={workout.id} className="workout-card">
              <div className="workout-info">
                <div className="workout-date">{formatDate(workout.date)}</div>
                <div className="workout-type">{workout.workoutType.name}</div>
                <div className="workout-duration">{workout.minutes} minutes</div>
              </div>
              <div className="workout-actions">
                <button 
                  className="btn icon edit" 
                  onClick={() => handleEditClick(workout)}
                >
                  Edit
                </button>
                <button 
                  className="btn icon delete" 
                  onClick={() => handleDeleteWorkout(workout.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutList;