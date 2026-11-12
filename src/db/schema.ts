import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (integrates with Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').notNull().default('PATIENT'), // SUPER_ADMIN, RECEPTIONIST, CONTENT_EDITOR, PATIENT
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Patients table
export const patients = pgTable('patients', {
  id: serial('id').primaryKey(),
  fileNumber: text('file_number').notNull().unique(), // e.g. #1042
  nationalId: text('national_id').notNull(),
  fullName: text('full_name').notNull(),
  partnerName: text('partner_name'),
  phone: text('phone').notNull(),
  treatmentType: text('treatment_type').notNull(), // IVF, ICSI, FROZEN_EMBRYO, etc.
  cyclePhase: text('cycle_phase').notNull(), // پایش فولیکول, پانکچر, انتقال جنین
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Appointment Queue table
export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  patientId: integer('patient_id').references(() => patients.id),
  fileNumber: text('file_number').notNull(),
  patientName: text('patient_name').notNull(),
  visitType: text('visit_type').notNull(),
  status: text('status').notNull().default('منتظر'),
  date: text('date').notNull(),
  time: text('time').notNull(),
  doctorName: text('doctor_name').notNull().default('دکتر مرضیه زمانیان'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Pregnancy Stories & Wall of Hope table
export const pregnancyStories = pgTable('pregnancy_stories', {
  id: serial('id').primaryKey(),
  patientInitials: text('patient_initials').notNull(),
  city: text('city').notNull(),
  infertilityDuration: text('infertility_duration').notNull(),
  treatmentType: text('treatment_type').notNull(),
  babyName: text('baby_name').notNull(),
  babyBirthDate: text('baby_birth_date'),
  photoUrl: text('photo_url'),
  quote: text('quote').notNull(),
  storyText: text('story_text'),
  writtenConsentObtained: boolean('written_consent_obtained').default(true).notNull(),
  consentArchiveCode: text('consent_archive_code'),
  doctorNote: text('doctor_note'),
  published: boolean('published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relational Definitions
export const patientsRelations = relations(patients, ({ many }) => ({
  appointments: many(appointments),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
}));
