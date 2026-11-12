'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ClinicalHeader from '@/components/clinical/ClinicalHeader';
import ClinicalSidebar, { ClinicalTab } from '@/components/clinical/ClinicalSidebar';
import { UserRole, isModuleAllowed } from '@/lib/clinic-mgmt-logic';

// Public website components for patient portal view
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Departments from '@/components/Departments';
import DoctorSchedule from '@/components/DoctorSchedule';
import WhyMehregan from '@/components/WhyMehregan';
import PregnancyStoriesSection from '@/components/PregnancyStoriesSection';
import AboutClinic from '@/components/AboutClinic';
import FaqSection from '@/components/FaqSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { AuthUser } from '@/components/AuthModal';
import { Doctor } from '@/lib/clinic-data';

import {
  INITIAL_PATIENTS,
  INITIAL_QUEUE,
  INITIAL_ALERTS,
  INITIAL_EMBRYOLOGY_SAMPLES,
  INITIAL_SECURITY_LOGS,
  Patient,
  AppointmentQueueItem,
  MedicationAlert,
} from '@/lib/dr-zamanian-data';

// Dynamically import heavy administrative subviews with ssr: false for optimal client rendering
const DashboardView = dynamic(() => import('@/components/clinical/DashboardView'), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-xs text-slate-400">در حال بارگذاری داشبورد...</div>,
});
const PatientsEhrView = dynamic(() => import('@/components/clinical/PatientsEhrView'), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-xs text-slate-400">در حال بارگذاری پرونده‌ها...</div>,
});
const EmbryologyView = dynamic(() => import('@/components/clinical/EmbryologyView'), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-xs text-slate-400">در حال بارگذاری آزمایشگاه جنین‌شناسی...</div>,
});
const AppointmentsCalendarView = dynamic(() => import('@/components/clinical/AppointmentsCalendarView'), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-xs text-slate-400">در حال بارگذاری تقویم نوبت‌ها...</div>,
});
const MessagesView = dynamic(() => import('@/components/clinical/MessagesView'), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-xs text-slate-400">در حال بارگذاری پیام‌ها...</div>,
});
const TelegramBotView = dynamic(() => import('@/components/clinical/TelegramBotView'), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-xs text-slate-400">در حال بارگذاری ماژول ربات تلگرام...</div>,
});
const CmsView = dynamic(() => import('@/components/clinical/CmsView'), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-xs text-slate-400">در حال بارگذاری مدیریت محتوا...</div>,
});
const SuccessStoriesAdminView = dynamic(() => import('@/components/clinical/SuccessStoriesAdminView'), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-xs text-slate-400">در حال بارگذاری داستان‌های بارداری...</div>,
});
const WorkspaceHubView = dynamic(() => import('@/components/clinical/WorkspaceHubView'), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-xs text-slate-400">در حال بارگذاری هاب ابری...</div>,
});
const FinancialReportsView = dynamic(() => import('@/components/clinical/FinancialReportsView'), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-xs text-slate-400">در حال بارگذاری گزارش مالی...</div>,
});
const SecurityLogsView = dynamic(() => import('@/components/clinical/SecurityLogsView'), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-xs text-slate-400">در حال بارگذاری لاگ‌های امنیتی...</div>,
});
const SystemSettingsView = dynamic(() => import('@/components/clinical/SystemSettingsView'), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-xs text-slate-400">در حال بارگذاری تنظیمات سیستم...</div>,
});
const ClinicalNoteModal = dynamic(() => import('@/components/clinical/ClinicalNoteModal'), {
  ssr: false,
});
const AppointmentModal = dynamic(() => import('@/components/AppointmentModal'), {
  ssr: false,
});
const AuthModal = dynamic(() => import('@/components/AuthModal'), {
  ssr: false,
});

export default function ClinicalPortalClient() {
  // Mode toggle: Default is the public website (no admin link in public UI)
  const [isPublicWebsite, setIsPublicWebsite] = useState(true);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // RBAC Role State: Default 'SUPER_ADMIN' (دکتر زمانیان / مدیر ارشد)
  const [currentRole, setCurrentRole] = useState<UserRole>('SUPER_ADMIN');

  // State for clinical portal
  const [activeTab, setActiveTab] = useState<ClinicalTab>('dashboard');
  const [privacyMode, setPrivacyMode] = useState(true); // Default true for "م. ر." privacy mask
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [queue, setQueue] = useState<AppointmentQueueItem[]>(INITIAL_QUEUE);
  const [alerts, setAlerts] = useState<MedicationAlert[]>(INITIAL_ALERTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Clinical Note Modal
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [activeQueueItem, setActiveQueueItem] = useState<AppointmentQueueItem | null>(null);

  // Public portal appointment modal state
  const [isPublicApptOpen, setIsPublicApptOpen] = useState(false);
  const [selectedDoctorPublic, setSelectedDoctorPublic] = useState<Doctor | null>(null);
  const [selectedDeptPublic, setSelectedDeptPublic] = useState<string>('all');

  // Handlers for Clinical Portal
  const handleOpenClinicalNote = (item: AppointmentQueueItem) => {
    setActiveQueueItem(item);
    const pat = patients.find((p) => p.fileNumber === item.fileNumber) || null;
    setSelectedPatient(pat);
    setIsNoteModalOpen(true);
  };

  const handleUpdateQueueStatus = (id: string, newStatus: AppointmentQueueItem['status']) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'completed' as const } : a))
    );
  };

  const handleSelectPatientByFile = (fileNumber: string) => {
    const pat = patients.find((p) => p.fileNumber === fileNumber);
    if (pat) {
      setSelectedPatient(pat);
      setActiveTab('patients');
    }
  };

  const handleSaveClinicalNote = (_data: any) => {
    if (activeQueueItem) {
      setQueue((prev) =>
        prev.map((q) =>
          q.id === activeQueueItem.id ? { ...q, status: 'انجام شد' as const } : q
        )
      );
    }
  };

  const pendingAlertsCount = alerts.filter(
    (a) => a.type === 'HCG_TRIGGER' && a.status === 'pending'
  ).length;

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (!isModuleAllowed(activeTab, newRole)) {
      setActiveTab('dashboard');
    }
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (
      user.role === 'SUPER_ADMIN' ||
      user.role === 'RECEPTIONIST' ||
      user.role === 'CONTENT_EDITOR'
    ) {
      setCurrentRole(user.role);
      setIsPublicWebsite(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsPublicWebsite(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] flex flex-col font-sans">
      {isPublicWebsite ? (
        /* PUBLIC PATIENT-FACING WEBSITE (Zero admin links in public UI as requested) */
        <div className="min-h-screen flex flex-col">
          <Navbar
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
            onOpenAppointment={(doc) => {
              setSelectedDoctorPublic(doc || null);
              setIsPublicApptOpen(true);
            }}
          />
          <main className="flex-grow">
            <Hero
              onScrollToDoctors={() => {
                document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onScrollToAbout={() => {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <Departments
              onSelectDepartment={(deptId) => {
                setSelectedDeptPublic(deptId);
                document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <DoctorSchedule
              selectedDepartmentId={selectedDeptPublic}
              onSelectDepartmentId={setSelectedDeptPublic}
              onOpenAppointmentModal={(doc) => {
                setSelectedDoctorPublic(doc);
                setIsPublicApptOpen(true);
              }}
            />
            <WhyMehregan />
            <PregnancyStoriesSection />
            <AboutClinic />
            <FaqSection />
            <ContactSection />
          </main>
          <Footer />
          {isPublicApptOpen && (
            <AppointmentModal
              isOpen={isPublicApptOpen}
              onClose={() => setIsPublicApptOpen(false)}
              selectedDoctor={selectedDoctorPublic}
            />
          )}
        </div>
      ) : (
        /* DR. ZAMANIAN CLINICAL MANAGEMENT SYSTEM & EHR PORTAL (The Wireframe) */
        <div className="min-h-screen flex flex-col">
          {/* Top Header matching wireframe */}
          <ClinicalHeader
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
            privacyMode={privacyMode}
            onTogglePrivacy={() => setPrivacyMode(!privacyMode)}
            patients={patients}
            onSelectPatient={(p) => {
              setSelectedPatient(p);
              setActiveTab('patients');
            }}
            pendingAlertsCount={pendingAlertsCount}
            onOpenAlerts={() => setActiveTab('dashboard')}
            onToggleMode={() => setIsPublicWebsite(true)}
            onLogout={handleLogout}
            isPublicSiteVisible={false}
          />

          {/* Main Workspace: Sidebar + Content */}
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Sidebar with Dynamic RBAC */}
            <ClinicalSidebar
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
              waitingPatientsCount={queue.filter((q) => q.status === 'منتظر').length}
              embryoLabCount={INITIAL_EMBRYOLOGY_SAMPLES.length}
              criticalAlertsCount={pendingAlertsCount}
            />

            {/* Main Content Area */}
            <main className="flex-1 p-4 sm:p-7 max-w-[1500px]">
              {/* Access Denied Guard if url/tab not allowed for current role */}
              {!isModuleAllowed(activeTab, currentRole) ? (
                <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3">
                  <h3 className="text-base font-black text-rose-800">
                    دسترسی غیرمجاز (۴۰۳ - Forbidden)
                  </h3>
                  <p className="text-xs text-rose-600">
                    نقش فعلی شما مجوز دسترسی به این بخش را ندارد. لطفاً از طریق منوی بالا به حساب مدیر کل تغییر نقش دهید.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2 bg-[#2C5E8A] text-white text-xs font-bold rounded-xl"
                  >
                    بازگشت به داشبورد
                  </button>
                </div>
              ) : (
                <>
                  {activeTab === 'dashboard' && (
                    <DashboardView
                      queue={queue}
                      alerts={alerts}
                      samples={INITIAL_EMBRYOLOGY_SAMPLES}
                      patients={patients}
                      privacyMode={privacyMode}
                      onOpenClinicalNote={handleOpenClinicalNote}
                      onUpdateQueueStatus={handleUpdateQueueStatus}
                      onAcknowledgeAlert={handleAcknowledgeAlert}
                      onSelectPatientByFile={handleSelectPatientByFile}
                    />
                  )}

                  {activeTab === 'patients' && (
                    <PatientsEhrView
                      patients={patients}
                      privacyMode={privacyMode}
                      selectedPatient={selectedPatient}
                      onSelectPatient={setSelectedPatient}
                    />
                  )}

                  {activeTab === 'embryology' && (
                    <EmbryologyView samples={INITIAL_EMBRYOLOGY_SAMPLES} />
                  )}

                  {activeTab === 'calendar' && (
                    <AppointmentsCalendarView
                      queue={queue}
                      privacyMode={privacyMode}
                      onOpenNote={handleOpenClinicalNote}
                    />
                  )}

                  {activeTab === 'messages' && (
                    <MessagesView currentRole={currentRole} />
                  )}

                  {activeTab === 'telegram' && <TelegramBotView />}

                  {activeTab === 'cms' && (
                    <CmsView currentRole={currentRole} />
                  )}

                  {activeTab === 'success-stories' && (
                    <SuccessStoriesAdminView currentRole={currentRole} />
                  )}

                  {activeTab === 'workspace' && <WorkspaceHubView />}

                  {activeTab === 'financial' && <FinancialReportsView />}

                  {activeTab === 'security' && (
                    <SecurityLogsView logs={INITIAL_SECURITY_LOGS} />
                  )}

                  {activeTab === 'settings' && <SystemSettingsView />}
                </>
              )}
            </main>
          </div>

          {/* Clinical Note Modal for [ثبت شرح حال] */}
          {isNoteModalOpen && (
            <ClinicalNoteModal
              isOpen={isNoteModalOpen}
              onClose={() => setIsNoteModalOpen(false)}
              item={activeQueueItem}
              patient={selectedPatient}
              privacyMode={privacyMode}
              onSaveNote={handleSaveClinicalNote}
            />
          )}
        </div>
      )}

      {/* Login & Register Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}
