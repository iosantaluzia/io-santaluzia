import React, { forwardRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppointmentSlotItem } from './AppointmentSlotItem';
import { ScheduleBlockModal } from './ScheduleBlockModal';

interface AppointmentSlot {
    time: string;
    name: string;
    status: string;
    cpf?: string;
    phone?: string;
    email?: string;
    address?: string;
    birthDate?: string;
    observations?: string;
    patientId?: string;
    appointmentDate?: string;
    appointmentType?: string;
    consultationId?: string;
}

interface DoctorAgendaListProps {
    doctorName: string;
    doctorPhoto: string;
    timeSlots: AppointmentSlot[];
    loading: boolean;
    onPatientClick: (slot: AppointmentSlot) => void;
    onUpdateStatus: (consultationId: string, newStatus: string) => Promise<void>;
    openStatusPopover: string | null;
    setOpenStatusPopover: (id: string | null) => void;
    onBlockSchedule: (date: Date, startTime: string, endTime: string, reason: string) => void;
    onRemoveBlock: (consultationId: string) => void;
    selectedDate: Date;
}

export const DoctorAgendaList = forwardRef<HTMLDivElement, DoctorAgendaListProps>(({
    doctorName,
    doctorPhoto,
    timeSlots,
    loading,
    onPatientClick,
    onUpdateStatus,
    openStatusPopover,
    setOpenStatusPopover,
    onBlockSchedule,
    onRemoveBlock,
    selectedDate
}, ref) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-cinza-escuro">{doctorName}</h3>
                <div className="flex items-center gap-2">
                    <ScheduleBlockModal
                        doctorName={doctorName}
                        onBlock={onBlockSchedule}
                        initialDate={selectedDate}
                    />
                    <img
                        src={doctorPhoto}
                        alt={doctorName}
                        className="w-12 h-12 object-cover rounded-full border-2 border-white shadow-sm bg-amber-50"
                    />
                </div>
            </div>
            <ScrollArea ref={ref} className="h-[350px]">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
                    </div>
                ) : timeSlots.length > 0 ? (
                    timeSlots.map((slot, idx) => (
                        <AppointmentSlotItem
                            key={slot.consultationId || idx}
                            slot={slot}
                            onPatientClick={onPatientClick}
                            onUpdateStatus={onUpdateStatus}
                            openStatusPopover={openStatusPopover}
                            setOpenStatusPopover={setOpenStatusPopover}
                            onRemoveBlock={onRemoveBlock}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-20 text-gray-500">
                        <p className="text-sm">Nenhum agendamento</p>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
});

DoctorAgendaList.displayName = "DoctorAgendaList";
