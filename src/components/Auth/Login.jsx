import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Users, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Card, Avatar } from '../Common';
import { getDisplayName } from '../../utils/helpers';
import { setGithubToken } from '../../services/gistApi';
import AvatarPicker from './AvatarPicker';

// Chiave admin (offuscata)
const _k = [105, 112, 101, 114, 120].map((c) => String.fromCharCode(c)).join('');

const Login = () => {
  const { users, login, registerUser, loading } = useApp();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState('select'); // 'select' | 'register'
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    avatarType: 'dicebear',
    avatarId: 'adventurer',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setAdminPassword('');
    setAdminToken('');
    setPasswordError(false);
    setTokenError(false);
  };

  const handleLogin = () => {
    if (!selectedUser) return;
    // Se è l'admin, richiedi password e token
    if (selectedUser.isAdmin) {
      if (adminPassword !== _k) {
        setPasswordError(true);
        return;
      }
      if (!adminToken.trim()) {
        setTokenError(true);
        return;
      }
      // Salva il token in sessionStorage per le operazioni di scrittura
      setGithubToken(adminToken.trim());
    }
    login(selectedUser);
    navigate('/');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.nome.trim() || !formData.cognome.trim()) return;
    
    setSubmitting(true);
    try {
      await registerUser(formData);
      navigate('/');
    } catch (error) {
      console.error('Errore registrazione:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarChange = (avatarType, avatarId) => {
    setFormData((prev) => ({ ...prev, avatarType, avatarId }));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Benvenuto!</h1>
        <p className="text-gray-600">Entra per prenotare il tuo posto al weekend in montagna</p>
      </div>

      {/* Toggle Mode */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setMode('select')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
            mode === 'select' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Sono già registrato</span>
        </button>
        <button
          onClick={() => setMode('register')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
            mode === 'register' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <UserPlus className="w-5 h-5" />
          <span>Prima volta</span>
        </button>
      </div>

      {mode === 'select' ? (
        /* Selezione utente esistente */
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold">Seleziona il tuo nome</h2>
          </Card.Header>
          <Card.Body>
            {users.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nessun utente registrato. Registrati per primo!
              </p>
            ) : (
              <div className="grid gap-2 max-h-80 overflow-y-auto">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      selectedUser?.id === user.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Avatar user={user} size="md" />
                    <div className="text-left">
                      <p className="font-medium text-gray-800">
                        {getDisplayName(user)}
                      </p>
                      {user.isAdmin && (
                        <span className="text-xs text-blue-600 font-medium">Admin</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card.Body>
          {/* Password admin */}
          {selectedUser?.isAdmin && (
            <Card.Body className="pt-0">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password admin
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    passwordError ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Inserisci la password"
                />
                {passwordError && (
                  <p className="text-sm text-red-600 mt-1">Password errata</p>
                )}
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Token GitHub
                </label>
                <input
                  type="password"
                  value={adminToken}
                  onChange={(e) => {
                    setAdminToken(e.target.value);
                    setTokenError(false);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    tokenError ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="ghp_..."
                />
                {tokenError && (
                  <p className="text-sm text-red-600 mt-1">Token richiesto per le operazioni admin</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Necessario per salvare le modifiche</p>
              </div>
            </Card.Body>
          )}

          <Card.Footer>
            <Button
              onClick={handleLogin}
              disabled={!selectedUser}
              className="w-full"
              size="lg"
            >
              <span>Entra</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card.Footer>
        </Card>
      ) : (
        /* Registrazione */
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold">Registrati</h2>
          </Card.Header>
          <form onSubmit={handleRegister}>
            <Card.Body className="space-y-6">
              {/* Nome e Cognome */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Il tuo nome"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cognome
                  </label>
                  <input
                    type="text"
                    value={formData.cognome}
                    onChange={(e) => setFormData((prev) => ({ ...prev, cognome: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Il tuo cognome"
                    required
                  />
                </div>
              </div>

              {/* Avatar Picker */}
              <AvatarPicker
                avatarType={formData.avatarType}
                avatarId={formData.avatarId}
                userName={`${formData.nome} ${formData.cognome}`}
                onChange={handleAvatarChange}
              />
            </Card.Body>
            <Card.Footer>
              <Button
                type="submit"
                loading={submitting}
                disabled={!formData.nome.trim() || !formData.cognome.trim()}
                className="w-full"
                size="lg"
              >
                <span>Registrati</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Card.Footer>
          </form>
        </Card>
      )}
    </div>
  );
};

export default Login;
