import { cn } from '../../utils/helpers';

const Card = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-md overflow-hidden',
        hover && 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

Card.Header = ({ children, className = '' }) => (
  <div className={cn('px-6 py-4 border-b border-gray-100', className)}>
    {children}
  </div>
);

Card.Body = ({ children, className = '' }) => (
  <div className={cn('px-6 py-4', className)}>{children}</div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={cn('px-6 py-4 bg-gray-50 border-t border-gray-100', className)}>
    {children}
  </div>
);

export default Card;
