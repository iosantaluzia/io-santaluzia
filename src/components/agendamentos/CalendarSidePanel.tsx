import React from 'react';
import { ChevronRight, Plus, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarSidePanelProps {
    monthName: string;
    calendarDays: (Date | null)[];
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    goToPreviousMonth: () => void;
    goToNextMonth: () => void;
    getAppointmentsInfo: (date: Date | null) => { hasAny: boolean; hasMatheus: boolean; hasFabiola: boolean; hasBlock: boolean; hasPatients: boolean };
    getCalendarColor: (date: Date | null) => string;
    shouldShowDot: (date: Date | null) => boolean;
    formatDate: (date: Date) => string;
    setShowAppointmentForm: (show: boolean) => void;
}

const CustomLockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={className}>
        <path fill="#424242" d="M24,4c-5.5,0-10,4.5-10,10v4h4v-4c0-3.3,2.7-6,6-6s6,2.7,6,6v4h4v-4C34,8.5,29.5,4,24,4z" />
        <path fill="#FB8C00" d="M36,44H12c-2.2,0-4-1.8-4-4V22c0-2.2,1.8-4,4-4h24c2.2,0,4,1.8,4,4v18C40,42.2,38.2,44,36,44z" />
        <path fill="#C76E00" d="M24 28A3 3 0 1 0 24 34A3 3 0 1 0 24 28Z" />
    </svg>
);

export function CalendarSidePanel({
    monthName,
    calendarDays,
    selectedDate,
    setSelectedDate,
    goToPreviousMonth,
    goToNextMonth,
    getAppointmentsInfo,
    getCalendarColor,
    shouldShowDot,
    formatDate,
    setShowAppointmentForm
}: CalendarSidePanelProps) {
    return (
        <div className="w-full lg:w-1/3 flex flex-col p-4 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <Button onClick={goToPreviousMonth} variant="ghost" size="icon">
                    <ChevronRight className="h-5 w-5 rotate-180" />
                </Button>
                <h3 className="text-lg font-semibold text-cinza-escuro capitalize">{monthName}</h3>
                <Button onClick={goToNextMonth} variant="ghost" size="icon">
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
            <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2">
                <span>Dom</span>
                <span>Seg</span>
                <span>Ter</span>
                <span>Qua</span>
                <span>Qui</span>
                <span>Sex</span>
                <span>Sáb</span>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
                {calendarDays.map((day, index) => {
                    const isToday = day && day.toDateString() === new Date().toDateString();
                    const isSelected = day && selectedDate.toDateString() === day.toDateString() && !isToday;
                    const apptsInfo = getAppointmentsInfo(day);
                    const isOtherMonth = day && day.getMonth() !== selectedDate.getMonth();
                    const calendarColor = getCalendarColor(day);

                    let textColor = '';
                    if (!isToday && !isSelected) {
                        if (isOtherMonth) {
                            textColor = 'text-gray-400';
                        } else if (calendarColor) {
                            textColor = calendarColor;
                        } else {
                            textColor = 'text-cinza-escuro';
                        }
                    }

                    // Tooltip logic
                    let title = 'Sem agendamentos';
                    if (apptsInfo.hasAny) {
                        const doctors = [];
                        if (apptsInfo.hasMatheus) doctors.push('Dr. Matheus');
                        if (apptsInfo.hasFabiola) doctors.push('Dra. Fabíola');
                        title = `Agendamentos: ${doctors.join(' e ')}`;
                    }
                    if (apptsInfo.hasBlock) {
                        if (apptsInfo.hasPatients) {
                            title += ' (CONFLITO: Bloqueio com Agendamentos)';
                        } else {
                            title = 'Dia Bloqueado';
                        }
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => day && setSelectedDate(day)}
                            className={`p-2 rounded-full text-sm relative flex flex-col items-center justify-center min-h-[40px] aspect-square
                ${day ? 'hover:bg-gray-100' : 'cursor-default'}
                ${isToday ? 'bg-marrom-acentuado text-white font-semibold' : ''}
                ${isSelected ? 'bg-medical-primary text-white font-semibold' : ''}
                ${textColor}
              `}
                            disabled={!day}
                            title={title}
                        >
                            <span className="leading-none">{day ? day.getDate() : ''}</span>

                            {/* Pontos de agendamento (existente) - mostra se não bloqueado */}
                            {shouldShowDot(day) && !isToday && !isSelected && !apptsInfo.hasBlock && (
                                <span className="absolute bottom-1 w-1.5 h-1.5 bg-marrom-acentuado rounded-full"></span>
                            )}
                            {shouldShowDot(day) && (isSelected || isToday) && !apptsInfo.hasBlock && (
                                <span className="absolute bottom-1 w-1.5 h-1.5 bg-white rounded-full"></span>
                            )}

                            {/* Ícone de bloqueio ou conflito */}
                            {apptsInfo.hasBlock && apptsInfo.hasPatients && (
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
                                    <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                </div>
                            )}
                            {apptsInfo.hasBlock && !apptsInfo.hasPatients && (
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
                                    <CustomLockIcon className="w-3.5 h-3.5" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
            <div className="mt-4 flex items-center justify-start gap-3">
                <p className="text-left text-gray-600 font-semibold">
                    Agendamentos em: {formatDate(selectedDate || new Date())}
                </p>
                <Button
                    onClick={() => setSelectedDate(new Date())}
                    size="sm"
                    className="h-6 text-xs bg-medical-primary hover:bg-marrom-acentuado text-white hover:text-white"
                >
                    Hoje
                </Button>
            </div>

            <Button
                onClick={() => setShowAppointmentForm(true)}
                className="mt-4 bg-medical-primary hover:bg-marrom-acentuado"
            >
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
            </Button>
        </div>
    );
}
