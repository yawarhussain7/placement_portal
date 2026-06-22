import React, { useState } from 'react';
import { 
  FiCpu, FiShield, FiSliders, FiActivity, FiSave, FiLock, 
  FiUnlock, FiRefreshCw, FiDatabase, FiAlertCircle, FiCheckCircle 
} from 'react-icons/fi';

import MetricCard from './MetricCard';
import InputField from './InputField';
import SelectField from './SelectField';
import SwitchControl from './SwitchControl';

const SystemSettingsConsole = () => {
  const [coreEngine, setCoreEngine] = useState({
    minCgpa: '7.5',
    maxBacklogs: '0',
    intakeOpen: false,
    portalMode: 'ingestion',
    sessionExpiry: '45',
    twoFactorEnforced: true,
    autoBackupInterval: 'daily',
    alertOnAnomaly: true,
    alertOnUpload: true
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [consoleLog, setConsoleLog] = useState(null);

  const handleStateChange = (key, value) => {
    setCoreEngine(prev => ({ ...prev, [key]: value }));
  };

  const commitMasterConfig = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setConsoleLog({ type: 'success', text: 'Pipeline variables written to core state registry successfully.' });
      setTimeout(() => setConsoleLog(null), 3500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-gray-800 p-6 font-sans antialiased">
      
      {/* Header Orchestration Row */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-gray-900 rounded-lg text-white"><FiCpu className="w-4 h-4" /></span>
            <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">System Kernel Engine</h1>
          </div>
          <p className="text-xs font-semibold text-gray-400 mt-1">Global state machine parameters and automated cutoff thresholds.</p>
        </div>

        <button
          type="button"
          onClick={commitMasterConfig}
          disabled={isSyncing}
          className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl tracking-wide shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isSyncing ? <FiRefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FiSave className="w-3.5 h-3.5 text-[#22C55E]" />}
          Commit System States
        </button>
      </div>

      {/* Grid Canvas Workspace */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {consoleLog && (
          <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-3 transition-all ${
            consoleLog.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            {consoleLog.type === 'success' ? <FiCheckCircle className="text-[#22C55E] w-4 h-4" /> : <FiAlertCircle className="text-amber-500 w-4 h-4" />}
            <span>{consoleLog.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CRITERIA LOGIC PIPELINES */}
          <MetricCard title="Automated Eligibility Routing" description="Controls candidate filtering logic pipelines" icon={FiSliders}>
            <InputField 
              label="Minimum System CGPA Floor" 
              type="number" 
              step="0.01" 
              value={coreEngine.minCgpa} 
              onChange={(e) => handleStateChange('minCgpa', e.target.value)}
              badge="Strict Range" 
            />
            <SelectField 
              label="Max Allowed Active Backlogs" 
              value={coreEngine.maxBacklogs} 
              onChange={(e) => handleStateChange('maxBacklogs', e.target.value)}
              options={[
                { value: '0', label: 'Strictly Zero (0) Backlogs' },
                { value: '1', label: 'Allow Maximum 1 Backlog' },
                { value: '2', label: 'Allow Maximum 2 Backlogs' },
                { value: 'unlimited', label: 'No Backlog Verification Checks' }
              ]} 
            />
            <SwitchControl 
              variant="button"
              title="Candidate Input Pipeline"
              description="Freeze student database updates system-wide"
              checked={coreEngine.intakeOpen}
              onChange={(val) => handleStateChange('intakeOpen', val)}
              iconOn={FiUnlock}
              iconOff={FiLock}
              textOn="Intake Open"
              textOff="Writable Lock"
            />
          </MetricCard>

          {/* ACCESS CONTROLS & ENVIRONMENT */}
          <MetricCard title="Security & Session Guardrails" description="Session management and identity constraints" icon={FiShield}>
            <SelectField 
              label="Operational Kernel Mode" 
              value={coreEngine.portalMode} 
              onChange={(e) => handleStateChange('portalMode', e.target.value)}
              options={[
                { value: 'ingestion', label: 'Live Production Ingestion Mode' },
                { value: 'maintenance', label: 'Isolated System Maintenance Window' },
                { value: 'locked', label: 'Read-Only Administrative Vault Archive' }
              ]} 
            />
            <InputField 
              label="Admin Token Idle Timeout (Minutes)" 
              type="number" 
              value={coreEngine.sessionExpiry} 
              onChange={(e) => handleStateChange('sessionExpiry', e.target.value)} 
            />
            <div className="border-t border-gray-100 pt-3">
              <SwitchControl 
                variant="slider"
                title="Enforce Global Multi-Factor Auth"
                description="Mandatory hardware keys validation loops"
                checked={coreEngine.twoFactorEnforced}
                onChange={(val) => handleStateChange('twoFactorEnforced', val)}
              />
            </div>
          </MetricCard>

          {/* VOLATILE TASK CRON JOBS */}
          <MetricCard title="Routines & System Diagnostics" description="Cron configurations and pipeline alert matrix logs" icon={FiActivity}>
            <SelectField 
              label="Snapshot Backup Automation Matrix" 
              value={coreEngine.autoBackupInterval} 
              onChange={(e) => handleStateChange('autoBackupInterval', e.target.value)}
              options={[
                { value: 'hourly', label: 'Hourly Transaction Logs Cache' },
                { value: 'daily', label: 'Daily Encrypted Master Sync Snapshot' },
                { value: 'weekly', label: 'Weekly Redundant Offsite Storage' }
              ]} 
            />
            <div className="space-y-3 pt-1">
              <SwitchControl 
                variant="checkbox"
                title="Anomaly Event Warnings"
                description="Route alerts if validation profiles drop flags"
                checked={coreEngine.alertOnAnomaly}
                onChange={(val) => handleStateChange('alertOnAnomaly', val)}
              />
              <div className="border-t border-gray-50 pt-3">
                <SwitchControl 
                  variant="checkbox"
                  title="Ingestion Volume Event Webhooks"
                  description="Trigger webhook callbacks upon file uploads"
                  checked={coreEngine.alertOnUpload}
                  onChange={(val) => handleStateChange('alertOnUpload', val)}
                />
              </div>
            </div>
          </MetricCard>

        </div>

        {/* UTILITY MODULE ROW */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <FiDatabase className="text-[#22C55E]" /> Direct Server Hardware Operations
              </h4>
              <p className="text-[11px] text-gray-400 font-medium">Manually push isolated server micro-routines, purge working assets, or invalidate session logs.</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => handleStateChange('alertOnAnomaly', true)}
                className="px-3 py-2 border border-gray-200 hover:border-gray-900 text-gray-700 hover:text-gray-900 font-bold text-[11px] rounded-xl transition-all bg-white shadow-sm"
              >
                Force Master Snapshot Backup
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SystemSettingsConsole;