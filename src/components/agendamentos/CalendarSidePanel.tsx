import React from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarSidePanelProps {
    monthName: string;
    calendarDays: (Date | null)[];
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    goToPreviousMonth: () => void;
    goToNextMonth: () => void;
    getAppointmentsInfo: (date: Date | null) => { hasAny: boolean; hasMatheus: boolean; hasFabiola: boolean };
    getCalendarColor: (date: Date | null) => string;
    shouldShowDot: (date: Date | null) => boolean;
    formatDate: (date: Date) => string;
    setShowAppointmentForm: (show: boolean) => void;
}

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

                    return (
                        <button
                            key={index}
                            onClick={() => day && setSelectedDate(day)}
                            className={`p-2 rounded-full text-sm relative flex flex-col items-center justify-center
                ${day ? 'hover:bg-gray-100' : 'cursor-default'}
                ${isToday ? 'bg-marrom-acentuado text-white font-semibold' : ''}
                ${isSelected ? 'bg-medical-primary text-white font-semibold' : ''}
                ${textColor}
              `}
                            disabled={!day}
                            title={
                                apptsInfo.hasAny
                                    ? `Agendamentos: ${apptsInfo.hasMatheus ? 'Dr. Matheus' : ''}${apptsInfo.hasMatheus && apptsInfo.hasFabiola ? ' e ' : ''}${apptsInfo.hasFabiola ? 'Dra. Fabíola' : ''}`
                                    : 'Sem agendamentos'
                            }
                        >
                            {day ? day.getDate() : ''}
                            {shouldShowDot(day) && !isToday && !isSelected && (
                                <span className="absolute bottom-1 w-1.5 h-1.5 bg-marrom-acentuado rounded-full"></span>
                            )}
                            {shouldShowDot(day) && (isSelected || isToday) && (
                                <span className="absolute bottom-1 w-1.5 h-1.5 bg-white rounded-full"></span>
                            )}
                        </button>
                    );
                })}
            </div>
            <div className="mt-4 flex items-center justify-start gap-3">
                <p className="text-left text-gray-600 font-semibold">
                    Agendamentos para: {formatDate(selectedDate)}
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
