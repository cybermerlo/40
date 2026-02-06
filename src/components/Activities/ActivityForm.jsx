import { useState } from 'react';
import { Lightbulb, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Card } from '../Common';

const ActivityForm = ({ onSuccess }) => {
  const { currentUser, addActivity } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !currentUser) return;

    setLoading(true);
    try {
      await addActivity({
        title: title.trim(),
        description: description.trim(),
      });
      setTitle('');
      setDescription('');
      onSuccess?.();
    } catch (error) {
      console.error('Errore creazione attività:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Card className="bg-gray-50">
        <Card.Body className="text-center py-6">
          <p className="text-gray-500">Accedi per proporre un'attività</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="font-semibold">Proponi un'attività</h3>
      </Card.Header>
      <form onSubmit={handleSubmit}>
        <Card.Body className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titolo
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Es: Ciaspolata al tramonto"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrizione (opzionale)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Aggiungi dettagli sulla tua proposta..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
        </Card.Body>
        <Card.Footer>
          <Button
            type="submit"
            loading={loading}
            disabled={!title.trim()}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            Proponi
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
};

export default ActivityForm;
