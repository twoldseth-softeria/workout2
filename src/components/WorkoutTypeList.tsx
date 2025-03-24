import { useState, useEffect } from 'react';
import { 
  WorkoutType,
  fetchWorkoutTypes, 
  createWorkoutType, 
  updateWorkoutType, 
  deleteWorkoutType 
} from '../services/api';

interface WorkoutTypeFormProps {
  workout: WorkoutType | null;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

const WorkoutTypeForm = ({ workout, onSubmit, onCancel }: WorkoutTypeFormProps) => {
  const [name, setName] = useState(workout ? workout.name : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="workout-type-form">
      <h3>{workout ? 'Edit Workout Type' : 'Add Workout Type'}</h3>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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

const WorkoutTypeList = () => {
  const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingWorkoutType, setEditingWorkoutType] = useState<WorkoutType | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const loadWorkoutTypes = async () => {
    try {
      setLoading(true);
      const types = await fetchWorkoutTypes();
      setWorkoutTypes(types);
      setError(null);
    } catch (err) {
      setError('Failed to load workout types. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkoutTypes();
  }, []);

  const handleAddWorkoutType = async (name: string) => {
    try {
      await createWorkoutType(name);
      await loadWorkoutTypes();
      setIsFormVisible(false);
    } catch (err) {
      setError('Failed to add workout type. Please try again.');
    }
  };

  const handleUpdateWorkoutType = async (name: string) => {
    if (!editingWorkoutType) return;
    
    try {
      await updateWorkoutType(editingWorkoutType.id, name);
      await loadWorkoutTypes();
      setEditingWorkoutType(null);
      setIsFormVisible(false);
    } catch (err) {
      setError('Failed to update workout type. Please try again.');
    }
  };

  const handleDeleteWorkoutType = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this workout type?')) return;
    
    try {
      await deleteWorkoutType(id);
      await loadWorkoutTypes();
    } catch (err) {
      setError('Failed to delete workout type. Please try again.');
    }
  };

  const handleEditClick = (workoutType: WorkoutType) => {
    setEditingWorkoutType(workoutType);
    setIsFormVisible(true);
  };

  const handleFormSubmit = (name: string) => {
    if (editingWorkoutType) {
      handleUpdateWorkoutType(name);
    } else {
      handleAddWorkoutType(name);
    }
  };

  const handleCancelForm = () => {
    setEditingWorkoutType(null);
    setIsFormVisible(false);
  };

  const handleAddClick = () => {
    setEditingWorkoutType(null);
    setIsFormVisible(true);
  };

  if (loading && workoutTypes.length === 0) {
    return <div className="loading">Loading workout types...</div>;
  }

  return (
    <div className="workout-type-list-container">
      <div className="header">
        <h2>Workout Types</h2>
        <button className="btn primary" onClick={handleAddClick}>
          Add New Type
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isFormVisible && (
        <WorkoutTypeForm
          workout={editingWorkoutType}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {workoutTypes.length === 0 && !loading ? (
        <p className="no-data">No workout types found. Add your first one!</p>
      ) : (
        <ul className="workout-type-list">
          {workoutTypes.map((workoutType) => (
            <li key={workoutType.id} className="workout-type-item">
              <span className="name">{workoutType.name}</span>
              <div className="actions">
                <button 
                  className="btn icon edit" 
                  title="Edit"
                  onClick={() => handleEditClick(workoutType)}
                >
                  Edit
                </button>
                <button 
                  className="btn icon delete" 
                  title="Delete"
                  onClick={() => handleDeleteWorkoutType(workoutType.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkoutTypeList;