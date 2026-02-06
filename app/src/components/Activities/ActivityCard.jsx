import { useState } from 'react';
import { Heart, Trash2, Calendar, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar, Button } from '../Common';
import { formatDate } from '../../utils/helpers';

const ActivityCard = ({ activity, onSchedule }) => {
  const { currentUser, users, toggleActivityLike, deleteActivity, isAdmin } = useApp();
  const [loading, setLoading] = useState(false);

  const author = users.find((u) => u.id === activity.userId);
  const isLiked = activity.likes?.includes(currentUser?.id);
  const likeCount = activity.likes?.length || 0;
  const likedUsers = activity.likes
    ?.map((id) => users.find((u) => u.id === id))
    .filter(Boolean) || [];

  const handleLike = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await toggleActivityLike(activity.id);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Sei sicuro di voler eliminare questa proposta?')) return;
    await deleteActivity(activity.id);
  };

  const canDelete = currentUser?.id === activity.userId || isAdmin;

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar user={author} size="md" />
          <div>
            <h3 className="font-bold text-gray-800">{activity.title}</h3>
            <p className="text-sm text-gray-500">
              Proposto da {author?.nome || 'Anonimo'}
            </p>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 p-1"
            title="Elimina"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Descrizione */}
      {activity.description && (
        <p className="text-gray-600 mb-4">{activity.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {/* Like button e counter */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            disabled={loading || !currentUser}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
              isLiked
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
            <span className="font-medium">{likeCount}</span>
          </button>

          {/* Avatar dei like */}
          {likedUsers.length > 0 && (
            <div className="flex -space-x-1">
              {likedUsers.slice(0, 3).map((user) => (
                <Avatar key={user.id} user={user} size="xs" className="ring-2 ring-white" />
              ))}
              {likedUsers.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium ring-2 ring-white">
                  +{likedUsers.length - 3}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Admin: aggiungi al calendario */}
        {isAdmin && onSchedule && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSchedule(activity)}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Programma
          </Button>
        )}
      </div>

      {/* Data creazione */}
      <p className="text-xs text-gray-400 mt-3">
        {formatDate(activity.createdAt, 'dd MMM yyyy, HH:mm')}
      </p>
    </div>
  );
};

export default ActivityCard;
