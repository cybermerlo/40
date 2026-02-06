import { Bed, Tent } from 'lucide-react';
import { COMFORT_LEVELS } from '../../data/beds';

const ComfortBadge = ({ comfort, showLabel = true, size = 'md' }) => {
  const level = COMFORT_LEVELS[comfort];
  
  if (!level) return null;

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const Icon = level.id === 'standard' ? Bed : Tent;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${level.color} ${sizes[size]}`}
      title={level.description}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{level.label}</span>}
    </span>
  );
};

export default ComfortBadge;
