import React, { forwardRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppointmentSlotItem } from './AppointmentSlotItem';
import { ScheduleBlockModal } from './ScheduleBlockModal';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

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
    const [hideFreeSlots, setHideFreeSlots] = useState(false);

    // Gerar horários padrão: 07:30 às 17:30 (intervalos de 30 min)
    const standardTimes: string[] = [];
    for (let h = 7; h <= 17; h++) {
        if (h === 7) {
            standardTimes.push('07:30');
        } else {
            standardTimes.push(`${h.toString().padStart(2, '0')}:00`);
            standardTimes.push(`${h.toString().padStart(2, '0')}:30`);
        }
    }

    // Organizar/Interpolar agendamentos nos horários
    const groupedSlots: Record<string, AppointmentSlot[]> = {};
    timeSlots.forEach(slot => {
        if (!groupedSlots[slot.time]) groupedSlots[slot.time] = [];
        groupedSlots[slot.time].push(slot);
    });

    const allTimesSet = new Set([...standardTimes, ...Object.keys(groupedSlots)]);
    const sortedTimes = Array.from(allTimesSet).sort();

    const displaySlots: AppointmentSlot[] = [];
    sortedTimes.forEach(time => {
        if (groupedSlots[time] && groupedSlots[time].length > 0) {
            displaySlots.push(...groupedSlots[time]);
        } else if (standardTimes.includes(time)) {
            // Gerar o slot de horário vazio
            displaySlots.push({
                time,
                name: 'Horário Livre',
                status: 'available',
                consultationId: `available-${time}` // mock id to prevent react key warning
            });
        }
    });

    const finalDisplaySlots = hideFreeSlots
        ? displaySlots.filter(s => s.status !== 'available')
        : displaySlots;

    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-cinza-escuro">{doctorName}</h3>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setHideFreeSlots(!hideFreeSlots)}
                        className={`h-9 w-9 transition-all ${hideFreeSlots
                                ? 'bg-bege-principal/10 border-bege-principal text-bege-principal shadow-sm'
                                : 'text-gray-400 hover:text-bege-principal'
                            }`}
                        title={hideFreeSlots ? "Mostrar horários livres" : "Ocultar horários livres"}
                    >
                        {hideFreeSlots ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
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
                ) : finalDisplaySlots.length > 0 ? (
                    finalDisplaySlots.map((slot, idx) => (
                        <AppointmentSlotItem
                            key={slot.consultationId || `${slot.time}-${idx}`}
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
                        <p className="text-sm">Nenhuma faixa de horário para hoje</p>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
});

DoctorAgendaList.displayName = "DoctorAgendaList";
