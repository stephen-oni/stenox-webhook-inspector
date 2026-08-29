import React, { useState } from 'react';
import { uploadProfilePhoto } from '../services/api';
import { authService } from '../services/auth';
import { User, Camera, CheckCircle, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState(() => {
    return authService.getUser() || JSON.parse(localStorage.getItem('stenox_user') || 'null');
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(user?.profile_picture_url || null);
  const [statusMsg, setStatusMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
      setStatusMsg('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!photo) return;

    setLoading(true);
    setStatusMsg('');
    setIsError(false);

    const formData = new FormData();
    formData.append('file', photo);

    try {
      const res = await uploadProfilePhoto(formData);
      const newPicUrl = res.data.profile_picture_url;
      const updatedUser = { ...user, profile_picture_url: newPicUrl };

      setUser(updatedUser);
      setPreview(newPicUrl);
      setPhoto(null);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('stenox_user', JSON.stringify(updatedUser));
      setStatusMsg('Avatar updated successfully.');
    } catch (err) {
      setIsError(true);
      setStatusMsg(err.response?.data?.detail || 'Upload failed. Verify image constraints.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">Account Details</h2>

        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-emerald-500 overflow-hidden flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-slate-500" />
              )}
            </div>
            <label
              htmlFor="photo-upload"
              className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 rounded-full cursor-pointer hover:bg-emerald-500 text-white shadow transition-colors"
            >
              <Camera className="w-4 h-4" />
            </label>
            <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
          </div>

          <div>
            <h3 className="font-semibold text-white text-lg">{user?.full_name || 'Operator'}</h3>
            <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
            <p className="text-xs text-emerald-400 mt-1 font-mono">
              Endpoint ID: {user?.endpoint_id || 'Not Assigned'}
            </p>
          </div>
        </div>

        {photo && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 rounded mb-6 transition-colors disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Save New Profile Avatar'}
          </button>
        )}

        {statusMsg && (
          <div
            className={`flex items-center gap-2 text-xs font-mono p-3 rounded mb-6 border ${
              isError
                ? 'text-red-400 bg-red-950/60 border-red-900'
                : 'text-emerald-400 bg-emerald-950/60 border-emerald-900'
            }`}
          >
            {isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            <span>{statusMsg}</span>
          </div>
        )}

        <div className="border-t border-slate-700 pt-6 space-y-3 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Environment</span>
            <span className="text-white font-mono">SteNox Enterprise Cloud (3-Tier)</span>
          </div>
          <div className="flex justify-between">
            <span>Ingress Route</span>
            <span className="text-white font-mono">
              {user?.endpoint_id ? `/api/collect/${user.endpoint_id}` : 'None'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}