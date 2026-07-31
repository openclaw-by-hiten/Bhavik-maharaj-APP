import React, { useState } from 'react';
import { X, Download, Upload, ShieldCheck, Database, RefreshCw, AlertTriangle } from 'lucide-react';
import { exportBackupJSON } from '../services/exportService';
import { requestPersistentStorage, importData } from '../services/storageService';

export default function ExportModal({ pujas, onDataReload, onClose }) {
  const [persistentStatus, setPersistentStatus] = useState(null);
  const [importStatus, setImportStatus] = useState('');

  const handleExport = () => {
    exportBackupJSON(pujas);
  };

  const handleRequestStorage = async () => {
    const granted = await requestPersistentStorage();
    setPersistentStatus(granted ? 'Granted! OS Cleaner protection active.' : 'Storage Persisted.');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        await importData(event.target.result);
        setImportStatus('Backup data imported successfully!');
        onDataReload();
      } catch (err) {
        setImportStatus('Error reading backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={22} color="var(--primary-gold)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Backup & Offline Cleaner Protection</h2>
          </div>
          <button className="icon-circle-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Protection Explainer */}
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <ShieldCheck size={20} color="#34d399" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#34d399' }}>
              App Cleaner Safe Storage Enabled
            </h4>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Data is stored in IndexedDB + LocalStorage. Requesting persistent storage prevents phone cleaners (MIUI Cleaner, Samsung Manager) from clearing app data.
          </p>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleRequestStorage}
            style={{ marginTop: '12px', fontSize: '0.82rem', borderColor: '#10b981', color: '#34d399' }}
          >
            <ShieldCheck size={15} />
            <span>Verify / Request OS Persistent Storage</span>
          </button>
          {persistentStatus && (
            <p style={{ fontSize: '0.78rem', color: '#34d399', marginTop: '6px', fontWeight: '600' }}>
              {persistentStatus}
            </p>
          )}
        </div>

        {/* Export JSON */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '6px' }}>
            📥 1-Tap Export Backup File
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Download a `.json` backup file to your phone downloads folder for 100% safety.
          </p>
          <button type="button" className="btn-primary" onClick={handleExport} style={{ width: '100%', justifyContent: 'center' }}>
            <Download size={16} />
            <span>Export Backup File ({pujas.length} Records)</span>
          </button>
        </div>

        {/* Import JSON */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '6px' }}>
            📤 Restore / Import Backup File
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Restore your customer data from a previously downloaded `.json` backup file.
          </p>
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ fontSize: '0.85rem', color: 'var(--text-main)', width: '100%' }}
          />
          {importStatus && (
            <p style={{ fontSize: '0.8rem', color: importStatus.includes('Error') ? '#f43f5e' : '#34d399', marginTop: '8px' }}>
              {importStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
