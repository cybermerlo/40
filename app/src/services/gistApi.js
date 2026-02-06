// Servizio per gestire il database su GitHub Gist

const GIST_ID = import.meta.env.VITE_GIST_ID;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GIST_FILENAME = 'database.json';

const GIST_API_URL = `https://api.github.com/gists/${GIST_ID}`;

// Struttura iniziale del database
const INITIAL_DATABASE = {
  users: [
    {
      id: 'admin-manuel',
      nome: 'Manuel',
      cognome: 'Berno',
      avatarType: 'dicebear',
      avatarId: 'adventurer',
      isAdmin: true,
      createdAt: new Date().toISOString(),
    },
  ],
  bookings: [],
  dayVisits: [],
  activities: [],
  scheduledActivities: [],
};

// Headers per le richieste API
const getHeaders = () => ({
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  'Content-Type': 'application/json',
  Accept: 'application/vnd.github.v3+json',
});

// Legge il database dal Gist
export const readDatabase = async () => {
  try {
    const response = await fetch(GIST_API_URL, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const gist = await response.json();
    const file = gist.files[GIST_FILENAME];

    if (!file || !file.content) {
      // Se il file non esiste, inizializza il database
      await writeDatabase(INITIAL_DATABASE);
      return INITIAL_DATABASE;
    }

    return JSON.parse(file.content);
  } catch (error) {
    console.error('Errore lettura Gist:', error);
    // In caso di errore, ritorna il database iniziale
    return INITIAL_DATABASE;
  }
};

// Scrive il database sul Gist
export const writeDatabase = async (data) => {
  try {
    const response = await fetch(GIST_API_URL, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        files: {
          [GIST_FILENAME]: {
            content: JSON.stringify(data, null, 2),
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Errore scrittura Gist:', error);
    throw error;
  }
};

// Genera un ID univoco
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// === USERS ===

export const getUsers = async () => {
  const db = await readDatabase();
  return db.users || [];
};

export const addUser = async (userData) => {
  const db = await readDatabase();
  const newUser = {
    id: generateId(),
    ...userData,
    isAdmin: false,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  await writeDatabase(db);
  return newUser;
};

export const updateUser = async (userId, userData) => {
  const db = await readDatabase();
  const index = db.users.findIndex((u) => u.id === userId);
  if (index !== -1) {
    db.users[index] = { ...db.users[index], ...userData };
    await writeDatabase(db);
    return db.users[index];
  }
  return null;
};

// === BOOKINGS ===

export const getBookings = async () => {
  const db = await readDatabase();
  return db.bookings || [];
};

export const addBooking = async (bookingData) => {
  const db = await readDatabase();
  const newBooking = {
    id: generateId(),
    ...bookingData,
    createdAt: new Date().toISOString(),
  };
  db.bookings.push(newBooking);
  await writeDatabase(db);
  return newBooking;
};

export const updateBooking = async (bookingId, bookingData) => {
  const db = await readDatabase();
  const index = db.bookings.findIndex((b) => b.id === bookingId);
  if (index !== -1) {
    db.bookings[index] = { ...db.bookings[index], ...bookingData };
    await writeDatabase(db);
    return db.bookings[index];
  }
  return null;
};

export const deleteBooking = async (bookingId) => {
  const db = await readDatabase();
  db.bookings = db.bookings.filter((b) => b.id !== bookingId);
  await writeDatabase(db);
};

// === DAY VISITS ===

export const getDayVisits = async () => {
  const db = await readDatabase();
  return db.dayVisits || [];
};

export const addDayVisit = async (visitData) => {
  const db = await readDatabase();
  // Rimuovi eventuali visite esistenti per lo stesso utente/giorno/periodo
  db.dayVisits = db.dayVisits.filter(
    (v) => !(v.userId === visitData.userId && v.date === visitData.date && v.period === visitData.period)
  );
  const newVisit = {
    id: generateId(),
    ...visitData,
    createdAt: new Date().toISOString(),
  };
  db.dayVisits.push(newVisit);
  await writeDatabase(db);
  return newVisit;
};

export const deleteDayVisit = async (visitId) => {
  const db = await readDatabase();
  db.dayVisits = db.dayVisits.filter((v) => v.id !== visitId);
  await writeDatabase(db);
};

// === ACTIVITIES ===

export const getActivities = async () => {
  const db = await readDatabase();
  return db.activities || [];
};

export const addActivity = async (activityData) => {
  const db = await readDatabase();
  const newActivity = {
    id: generateId(),
    ...activityData,
    likes: [],
    createdAt: new Date().toISOString(),
  };
  db.activities.push(newActivity);
  await writeDatabase(db);
  return newActivity;
};

export const updateActivity = async (activityId, activityData) => {
  const db = await readDatabase();
  const index = db.activities.findIndex((a) => a.id === activityId);
  if (index !== -1) {
    db.activities[index] = { ...db.activities[index], ...activityData };
    await writeDatabase(db);
    return db.activities[index];
  }
  return null;
};

export const toggleLike = async (activityId, userId) => {
  const db = await readDatabase();
  const activity = db.activities.find((a) => a.id === activityId);
  if (activity) {
    if (activity.likes.includes(userId)) {
      activity.likes = activity.likes.filter((id) => id !== userId);
    } else {
      activity.likes.push(userId);
    }
    await writeDatabase(db);
    return activity;
  }
  return null;
};

export const deleteActivity = async (activityId) => {
  const db = await readDatabase();
  db.activities = db.activities.filter((a) => a.id !== activityId);
  // Rimuovi anche le attività schedulate correlate
  db.scheduledActivities = db.scheduledActivities.filter((sa) => sa.activityId !== activityId);
  await writeDatabase(db);
};

// === SCHEDULED ACTIVITIES ===

export const getScheduledActivities = async () => {
  const db = await readDatabase();
  return db.scheduledActivities || [];
};

export const addScheduledActivity = async (scheduledData) => {
  const db = await readDatabase();
  const newScheduled = {
    id: generateId(),
    ...scheduledData,
    createdAt: new Date().toISOString(),
  };
  db.scheduledActivities.push(newScheduled);
  await writeDatabase(db);
  return newScheduled;
};

export const updateScheduledActivity = async (scheduledId, scheduledData) => {
  const db = await readDatabase();
  const index = db.scheduledActivities.findIndex((s) => s.id === scheduledId);
  if (index !== -1) {
    db.scheduledActivities[index] = { ...db.scheduledActivities[index], ...scheduledData };
    await writeDatabase(db);
    return db.scheduledActivities[index];
  }
  return null;
};

export const deleteScheduledActivity = async (scheduledId) => {
  const db = await readDatabase();
  db.scheduledActivities = db.scheduledActivities.filter((s) => s.id !== scheduledId);
  await writeDatabase(db);
};
