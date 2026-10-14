import React, { useEffect, useState } from 'react';
import { StorageEngine, ProjectAction } from '../data/storageEngine';

/** Scoped task editor backed by the same state read by TED and Aiden. */
export const ProjectActionsPanel: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [actions, setActions] = useState<ProjectAction[]>(() => StorageEngine.getProjectActions(projectId));
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('TED');
  const [dueDate, setDueDate] = useState('');
  const [syncResult, setSyncResult] = useState('Not verified with cloud');
  const [syncing, setSyncing] = useState(false);
  const sync = async () => {
    setSyncing(true);
    try {
      const result = await StorageEngine.syncWithCloud();
      setSyncResult(result.success ? `Cloud response: ${result.status}` : `Cloud sync unavailable: ${result.status}`);
      if (result.success) refresh();
    } catch { setSyncResult('Cloud sync failed'); }
    finally { setSyncing(false); }
  };
  const refresh = () => setActions(StorageEngine.getProjectActions(projectId));
  useEffect(() => {
    refresh();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'ocg_lab_os_state_v2') refresh();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [projectId]);
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !owner.trim()) return;
    StorageEngine.saveProjectAction({ id: crypto.randomUUID(), projectId, title: title.trim(), owner: owner.trim(), status: 'TODO', dueDate: dueDate || undefined, updatedAt: new Date().toISOString() });
    setTitle(''); setDueDate(''); refresh();
  };
  const updateStatus = (action: ProjectAction, status: ProjectAction['status']) => {
    StorageEngine.saveProjectAction({ ...action, status }); refresh();
  };
  return <section className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
    <h3 className="text-sm text-white font-semibold">Project Actions <span className="text-slate-400">({actions.length})</span></h3>
    <p className="text-xs text-amber-300">Saved in this browser. Cloud sync requires founder authentication.</p>
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" disabled={syncing} onClick={sync} className="text-xs rounded-lg border border-cyan-700 px-3 py-2 text-cyan-200 disabled:opacity-50">{syncing ? 'Checking cloud...' : 'Check cloud sync'}</button>
      <span role="status" className="text-xs text-slate-300">{syncResult}</span>
    </div>
    <form onSubmit={add} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
      <input aria-label="Task title" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Next action" className="sm:col-span-2 bg-slate-900 text-white border border-slate-700 rounded-lg p-2 text-xs" />
      <input aria-label="Task owner" required value={owner} onChange={e => setOwner(e.target.value)} placeholder="Owner" className="bg-slate-900 text-white border border-slate-700 rounded-lg p-2 text-xs" />
      <input aria-label="Task due date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="bg-slate-900 text-white border border-slate-700 rounded-lg p-2 text-xs" />
      <button type="submit" className="sm:col-span-4 bg-cyan-700 text-white rounded-lg p-2 text-xs font-semibold">Add task</button>
    </form>
    <div className="space-y-2" aria-live="polite">
      {actions.length === 0 && <p className="text-xs text-slate-400">No tasks recorded for this project.</p>}
      {actions.map(action => <div key={action.id} className="flex items-center justify-between gap-3 border border-slate-800 rounded-lg p-3">
        <div className="min-w-0"><p className="text-sm text-white break-words">{action.title}</p><p className="text-xs text-slate-400">{action.owner}{action.dueDate ? ' · Due ' + action.dueDate : ''}</p></div>
        <select aria-label={'Status for ' + action.title} value={action.status} onChange={e => updateStatus(action, e.target.value as ProjectAction['status'])} className="bg-slate-900 text-white rounded-lg p-2 text-xs">
          <option value="TODO">To do</option><option value="IN_PROGRESS">In progress</option><option value="BLOCKED">Blocked</option><option value="DONE">Done</option>
        </select>
      </div>)}
    </div>
  </section>;
};
