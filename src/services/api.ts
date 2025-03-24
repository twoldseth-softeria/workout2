// API Service for workout app
const API_BASE_URL = 'https://workout1.restapi.cloud/api';

// Types based on API spec
export interface WorkoutType {
  id: string;
  sequence: number;
  name: string;
}

export interface Workout {
  id: string;
  sequence: number;
  date: string;
  minutes: number;
  workoutType: WorkoutType;
}

export interface WorkoutCreateRequest {
  date: string;
  minutes: number;
  workoutType: WorkoutType;
}

// API functions for workout types
export const fetchWorkoutTypes = async (): Promise<WorkoutType[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workoutType`);
    if (!response.ok) {
      throw new Error(`Error fetching workout types: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch workout types:', error);
    throw error;
  }
};

export const createWorkoutType = async (name: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workoutType`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    
    if (!response.ok) {
      throw new Error(`Error creating workout type: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to create workout type:', error);
    throw error;
  }
};

export const deleteWorkoutType = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workoutType/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting workout type: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to delete workout type:', error);
    throw error;
  }
};

export const updateWorkoutType = async (id: string, name: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workoutType/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    
    if (!response.ok) {
      throw new Error(`Error updating workout type: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to update workout type:', error);
    throw error;
  }
};

// API functions for workouts
export const fetchWorkouts = async (): Promise<Workout[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workoutLog`);
    if (!response.ok) {
      throw new Error(`Error fetching workouts: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch workouts:', error);
    throw error;
  }
};

export const createWorkout = async (workout: WorkoutCreateRequest): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workoutLog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workout),
    });
    
    if (!response.ok) {
      throw new Error(`Error creating workout: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to create workout:', error);
    throw error;
  }
};

export const deleteWorkout = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workoutLog/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting workout: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to delete workout:', error);
    throw error;
  }
};

export const updateWorkout = async (id: string, workout: WorkoutCreateRequest): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workoutLog/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workout),
    });
    
    if (!response.ok) {
      throw new Error(`Error updating workout: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to update workout:', error);
    throw error;
  }
};