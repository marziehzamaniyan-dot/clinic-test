import test from 'node:test';
import assert from 'node:assert/strict';
import { DOCTORS } from './clinic-data';
import { filterDoctors, getClinicOpenStatus, generateTrackingCode } from './clinic-logic';

test('filterDoctors returns all doctors when no filter is provided', () => {
  const all = filterDoctors(DOCTORS, { day: 'all', departmentId: 'all', searchQuery: '' });
  assert.equal(all.length, DOCTORS.length);
  assert.equal(all[0].id, 'dr-zamanian');
});

test('filterDoctors filters correctly by day of week', () => {
  // Test doctor who has shifts on 'شنبه' (Dr. Zamanian has shifts on Saturday, Sunday, Tuesday)
  const satDoctors = filterDoctors(DOCTORS, { day: 'شنبه' });
  assert.equal(satDoctors.length, 1);
  assert.ok(satDoctors[0].name.includes('مرضیه زمانیان'));

  // Test Sunday 'یکشنبه'
  const sunDoctors = filterDoctors(DOCTORS, { day: 'یکشنبه' });
  assert.equal(sunDoctors.length, 1);
  assert.ok(sunDoctors[0].name.includes('زمانیان'));
});

test('filterDoctors filters correctly by departmentId', () => {
  const ivfDoctors = filterDoctors(DOCTORS, { departmentId: 'infertility-ivf' });
  assert.equal(ivfDoctors.length, 1);
  assert.equal(ivfDoctors[0].name, 'دکتر مرضیه زمانیان');
});

test('filterDoctors searches by name, specialty, or council number', () => {
  const searchByName = filterDoctors(DOCTORS, { searchQuery: 'زمانیان' });
  assert.equal(searchByName.length, 1);
  assert.equal(searchByName[0].id, 'dr-zamanian');

  const searchBySpecialty = filterDoctors(DOCTORS, { searchQuery: 'ناباروری' });
  assert.equal(searchBySpecialty.length, 1);
  assert.equal(searchBySpecialty[0].id, 'dr-zamanian');

  const searchByCouncil = filterDoctors(DOCTORS, { searchQuery: '۸۹۷۰۲' });
  assert.equal(searchByCouncil.length, 1);
  assert.equal(searchByCouncil[0].id, 'dr-zamanian');
});

test('getClinicOpenStatus accurately determines open/closed times', () => {
  // Monday at 10:30 AM (open)
  const mondayMorning = new Date(2026, 10, 16, 10, 30); // 2026-11-16 is Monday
  const statusMon = getClinicOpenStatus(mondayMorning);
  assert.equal(statusMon.isOpen, true);

  // Friday at 11:00 AM (closed)
  const fridayNoon = new Date(2026, 10, 20, 11, 0); // 2026-11-20 is Friday
  const statusFri = getClinicOpenStatus(fridayNoon);
  assert.equal(statusFri.isOpen, false);
  assert.ok(statusFri.statusText.includes('تعطیل'));

  // Thursday at 18:00 PM (closed after 16:00)
  const thursdayEvening = new Date(2026, 10, 19, 18, 0); // 2026-11-19 is Thursday
  const statusThuLate = getClinicOpenStatus(thursdayEvening);
  assert.equal(statusThuLate.isOpen, false);
});

test('generateTrackingCode generates format MHG-xxxxx-xxxx', () => {
  const code = generateTrackingCode();
  assert.ok(code.startsWith('MHG-'));
  assert.equal(code.split('-').length, 3);
});
