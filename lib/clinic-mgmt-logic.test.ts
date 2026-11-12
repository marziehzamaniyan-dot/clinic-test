import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_PATIENTS, INITIAL_QUEUE, INITIAL_ALERTS, INITIAL_EMBRYOLOGY_SAMPLES } from './dr-zamanian-data';
import {
  formatPatientDisplayName,
  searchPatients,
  filterQueue,
  calculateClinicalStats,
  getVisibleSidebarModules,
  isModuleAllowed,
} from './clinic-mgmt-logic';

test('formatPatientDisplayName correctly masks patient name for privacy', () => {
  // Privacy ON: "مریم رضایی" -> "م. ر."
  assert.equal(formatPatientDisplayName('مریم رضایی', true), 'م. ر.');
  // Privacy OFF: "مریم رضایی" -> "مریم رضایی"
  assert.equal(formatPatientDisplayName('مریم رضایی', false), 'مریم رضایی');
  // Single name
  assert.equal(formatPatientDisplayName('فاطمه', true), 'ف.');
});

test('searchPatients searches by fileNumber, nationalId, or name', () => {
  // Search by fileNumber
  const resFile = searchPatients(INITIAL_PATIENTS, '1042');
  assert.equal(resFile.length, 1);
  assert.equal(resFile[0].fullName, 'مریم رضایی');

  // Search by National ID
  const resNat = searchPatients(INITIAL_PATIENTS, '0459201128');
  assert.equal(resNat.length, 1);
  assert.equal(resNat[0].fullName, 'فاطمه حسینی');

  // Search by treatment type ICSI
  const resIcsi = searchPatients(INITIAL_PATIENTS, 'ICSI');
  assert.ok(resIcsi.length >= 2);
});

test('filterQueue accurately filters queue by status and search', () => {
  const waiting = filterQueue(INITIAL_QUEUE, { status: 'منتظر' });
  assert.ok(waiting.length >= 4);

  const search1042 = filterQueue(INITIAL_QUEUE, { query: '1042' });
  assert.equal(search1042.length, 1);
  assert.equal(search1042[0].visitType, 'پایش فولیکول');
});

test('calculateClinicalStats accurately computes clinical indicators', () => {
  const stats = calculateClinicalStats(INITIAL_QUEUE, INITIAL_ALERTS, INITIAL_EMBRYOLOGY_SAMPLES);
  assert.equal(stats.todayVisitsTotal, 42);
  assert.equal(stats.proceduresPunctureTransfer, 8);
  assert.equal(stats.pendingCriticalHcgAlerts, 3);
  assert.ok(stats.todayVisitsWaiting > 0);
});

test('getVisibleSidebarModules returns correct modules per role', () => {
  // Super Admin: Sees all 12 modules (including workspace, telegram, and success-stories)
  const superAdminModules = getVisibleSidebarModules('SUPER_ADMIN');
  assert.equal(superAdminModules.length, 12);
  assert.ok(superAdminModules.some(m => m.id === 'success-stories'));
  assert.ok(superAdminModules.some(m => m.id === 'workspace'));
  assert.ok(superAdminModules.some(m => m.id === 'telegram'));

  // Receptionist: Sees Dashboard, Calendar/Shifts, Contact Messages, Success Stories, Workspace, Telegram (6 modules)
  const receptionistModules = getVisibleSidebarModules('RECEPTIONIST');
  assert.equal(receptionistModules.length, 6);
  assert.ok(receptionistModules.some(m => m.id === 'calendar'));
  assert.ok(receptionistModules.some(m => m.id === 'messages'));
  assert.ok(receptionistModules.some(m => m.id === 'success-stories'));
  assert.ok(receptionistModules.some(m => m.id === 'workspace'));
  assert.ok(receptionistModules.some(m => m.id === 'telegram'));
  assert.ok(!receptionistModules.some(m => m.id === 'embryology'));
  assert.ok(!receptionistModules.some(m => m.id === 'financial'));
  assert.ok(!receptionistModules.some(m => m.id === 'security'));

  // Content Editor: Sees Dashboard, CMS, and Success Stories (3 modules)
  const editorModules = getVisibleSidebarModules('CONTENT_EDITOR');
  assert.equal(editorModules.length, 3);
  assert.ok(editorModules.some(m => m.id === 'cms'));
  assert.ok(editorModules.some(m => m.id === 'success-stories'));
  assert.ok(!editorModules.some(m => m.id === 'patients'));
  assert.ok(!editorModules.some(m => m.id === 'security'));
});

test('isModuleAllowed enforces boundaries strictly', () => {
  assert.equal(isModuleAllowed('security', 'SUPER_ADMIN'), true);
  assert.equal(isModuleAllowed('security', 'RECEPTIONIST'), false);
  assert.equal(isModuleAllowed('security', 'CONTENT_EDITOR'), false);

  assert.equal(isModuleAllowed('cms', 'CONTENT_EDITOR'), true);
  assert.equal(isModuleAllowed('cms', 'RECEPTIONIST'), false);

  assert.equal(isModuleAllowed('success-stories', 'SUPER_ADMIN'), true);
  assert.equal(isModuleAllowed('success-stories', 'CONTENT_EDITOR'), true);
  assert.equal(isModuleAllowed('success-stories', 'RECEPTIONIST'), true);

  assert.equal(isModuleAllowed('calendar', 'RECEPTIONIST'), true);
});

