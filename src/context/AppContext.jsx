import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as gistApi from '../services/gistApi';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve essere usato dentro AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Stato utente corrente
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // Dati dal database
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [dayVisits, setDayVisits] = useState([]);
  const [activities, setActivities] = useState([]);
  const [scheduledActivities, setScheduledActivities] = useState([]);
  
  // Stato UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carica tutti i dati dal Gist
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const db = await gistApi.readDatabase();
      setUsers(db.users || []);
      setBookings(db.bookings || []);
      setDayVisits(db.dayVisits || []);
      setActivities(db.activities || []);
      setScheduledActivities(db.scheduledActivities || []);
    } catch (err) {
      setError('Errore nel caricamento dei dati');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carica dati all'avvio
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Salva utente corrente in localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // === FUNZIONI UTENTE ===

  const login = (user) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerUser = async (userData) => {
    const newUser = await gistApi.addUser(userData);
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const updateCurrentUser = async (userData) => {
    if (!currentUser) return;
    const updated = await gistApi.updateUser(currentUser.id, userData);
    if (updated) {
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setCurrentUser(updated);
    }
    return updated;
  };

  // === FUNZIONI PRENOTAZIONI ===

  const addBooking = async (bookingData) => {
    const newBooking = await gistApi.addBooking({
      ...bookingData,
      userId: currentUser.id,
    });
    setBookings((prev) => [...prev, newBooking]);
    return newBooking;
  };

  const updateBooking = async (bookingId, bookingData) => {
    const updated = await gistApi.updateBooking(bookingId, bookingData);
    if (updated) {
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    }
    return updated;
  };

  const deleteBooking = async (bookingId) => {
    await gistApi.deleteBooking(bookingId);
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  const getBookingsForBed = (bedId, night) => {
    return bookings.filter((b) => b.bedId === bedId && b.night === night);
  };

  const getBookingsForUser = (userId) => {
    return bookings.filter((b) => b.userId === userId);
  };

  const getAvailableSpots = (bedId, night, bedPosti) => {
    const bedBookings = getBookingsForBed(bedId, night);
    const occupiedSpots = bedBookings.reduce((sum, b) => sum + (b.spots || 1), 0);
    return bedPosti - occupiedSpots;
  };

  // === FUNZIONI VISITE GIORNALIERE ===

  const addDayVisit = async (visitData) => {
    const newVisit = await gistApi.addDayVisit({
      ...visitData,
      userId: currentUser.id,
    });
    setDayVisits((prev) => {
      // Rimuovi visite duplicate
      const filtered = prev.filter(
        (v) => !(v.userId === newVisit.userId && v.date === newVisit.date && v.period === newVisit.period)
      );
      return [...filtered, newVisit];
    });
    return newVisit;
  };

  const deleteDayVisit = async (visitId) => {
    await gistApi.deleteDayVisit(visitId);
    setDayVisits((prev) => prev.filter((v) => v.id !== visitId));
  };

  const getDayVisitsForUser = (userId) => {
    return dayVisits.filter((v) => v.userId === userId);
  };

  const getDayVisitsForDate = (date) => {
    return dayVisits.filter((v) => v.date === date);
  };

  // === FUNZIONI ATTIVITÀ ===

  const addActivity = async (activityData) => {
    const newActivity = await gistApi.addActivity({
      ...activityData,
      userId: currentUser.id,
    });
    setActivities((prev) => [...prev, newActivity]);
    return newActivity;
  };

  const toggleActivityLike = async (activityId) => {
    if (!currentUser) return;
    const updated = await gistApi.toggleLike(activityId, currentUser.id);
    if (updated) {
      setActivities((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    }
    return updated;
  };

  const deleteActivity = async (activityId) => {
    await gistApi.deleteActivity(activityId);
    setActivities((prev) => prev.filter((a) => a.id !== activityId));
    setScheduledActivities((prev) => prev.filter((sa) => sa.activityId !== activityId));
  };

  // === FUNZIONI ATTIVITÀ SCHEDULATE ===

  const scheduleActivity = async (activityId, scheduleData) => {
    const newScheduled = await gistApi.addScheduledActivity({
      activityId,
      ...scheduleData,
    });
    setScheduledActivities((prev) => [...prev, newScheduled]);
    return newScheduled;
  };

  const updateScheduledActivity = async (scheduledId, scheduleData) => {
    const updated = await gistApi.updateScheduledActivity(scheduledId, scheduleData);
    if (updated) {
      setScheduledActivities((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    }
    return updated;
  };

  const deleteScheduledActivity = async (scheduledId) => {
    await gistApi.deleteScheduledActivity(scheduledId);
    setScheduledActivities((prev) => prev.filter((s) => s.id !== scheduledId));
  };

  // === HELPER ===

  const getUserById = (userId) => {
    return users.find((u) => u.id === userId);
  };

  const isAdmin = currentUser?.isAdmin || false;

  const value = {
    // Stato
    currentUser,
    users,
    bookings,
    dayVisits,
    activities,
    scheduledActivities,
    loading,
    error,
    isAdmin,

    // Funzioni utente
    login,
    logout,
    registerUser,
    updateCurrentUser,
    getUserById,

    // Funzioni prenotazioni
    addBooking,
    updateBooking,
    deleteBooking,
    getBookingsForBed,
    getBookingsForUser,
    getAvailableSpots,

    // Funzioni visite
    addDayVisit,
    deleteDayVisit,
    getDayVisitsForUser,
    getDayVisitsForDate,

    // Funzioni attività
    addActivity,
    toggleActivityLike,
    deleteActivity,

    // Funzioni schedule
    scheduleActivity,
    updateScheduledActivity,
    deleteScheduledActivity,

    // Utilità
    loadData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
