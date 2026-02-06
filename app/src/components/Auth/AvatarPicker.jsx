import { useState } from 'react';
import { PRESET_AVATARS, DICEBEAR_STYLES, getDiceBearUrl } from '../../data/avatars';

const AvatarPicker = ({ avatarType, avatarId, userName, onChange }) => {
  const [tab, setTab] = useState(avatarType === 'preset' ? 'preset' : 'dicebear');

  const handlePresetSelect = (presetId) => {
    onChange('preset', presetId);
  };

  const handleDiceBearSelect = (styleId) => {
    onChange('dicebear', styleId);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Scegli il tuo avatar
      </label>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setTab('dicebear')}
          className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
            tab === 'dicebear' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Avatar Generato
        </button>
        <button
          type="button"
          onClick={() => setTab('preset')}
          className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
            tab === 'preset' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Emoji Montagna
        </button>
      </div>

      {tab === 'dicebear' ? (
        /* DiceBear Styles */
        <div>
          <p className="text-sm text-gray-500 mb-3">
            Scegli uno stile - l'avatar sarà generato dal tuo nome
          </p>
          <div className="grid grid-cols-5 gap-2">
            {DICEBEAR_STYLES.map((style) => {
              const url = getDiceBearUrl(userName || 'Ospite', style.id, 80);
              const isSelected = avatarType === 'dicebear' && avatarId === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleDiceBearSelect(style.id)}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  title={style.label}
                >
                  <img
                    src={url}
                    alt={style.label}
                    className="w-12 h-12 mx-auto rounded-full"
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Preset Emojis */
        <div>
          <p className="text-sm text-gray-500 mb-3">
            Scegli un'emoji a tema montagna
          </p>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto">
            {PRESET_AVATARS.map((preset) => {
              const isSelected = avatarType === 'preset' && avatarId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`p-2 rounded-lg border-2 transition-all text-2xl ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 scale-110'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  title={preset.label}
                >
                  {preset.emoji}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center gap-3">
        <div className="flex-shrink-0">
          {avatarType === 'dicebear' ? (
            <img
              src={getDiceBearUrl(userName || 'Ospite', avatarId, 80)}
              alt="Avatar preview"
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-3xl">
              {PRESET_AVATARS.find((p) => p.id === avatarId)?.emoji || '👤'}
            </div>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-800">{userName || 'Il tuo nome'}</p>
          <p className="text-sm text-gray-500">Anteprima del tuo profilo</p>
        </div>
      </div>
    </div>
  );
};

export default AvatarPicker;
