import { getDiceBearUrl, isEmojiAvatar, PRESET_AVATARS } from '../../data/avatars';
import { getInitials, stringToColor } from '../../utils/helpers';

const Avatar = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-3xl',
  };

  const sizePixels = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  };

  if (!user) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gray-300 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-500">?</span>
      </div>
    );
  }

  const { nome, cognome, avatarType, avatarId } = user;
  const fullName = `${nome} ${cognome}`;

  // Avatar emoji preimpostato
  if (isEmojiAvatar(avatarType)) {
    const preset = PRESET_AVATARS.find((a) => a.id === avatarId);
    const emoji = preset?.emoji || '👤';
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-sm ${className}`}
        title={fullName}
      >
        <span>{emoji}</span>
      </div>
    );
  }

  // Avatar DiceBear
  if (avatarType === 'dicebear') {
    const url = getDiceBearUrl(fullName, avatarId, sizePixels[size] * 2);
    return (
      <img
        src={url}
        alt={fullName}
        title={fullName}
        className={`${sizeClasses[size]} rounded-full object-cover shadow-sm ${className}`}
      />
    );
  }

  // Fallback: iniziali con colore
  const initials = getInitials(nome, cognome);
  const bgColor = stringToColor(fullName);

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-semibold shadow-sm ${className}`}
      style={{ backgroundColor: bgColor }}
      title={fullName}
    >
      {initials}
    </div>
  );
};

export default Avatar;
