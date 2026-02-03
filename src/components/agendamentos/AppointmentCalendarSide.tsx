import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ptBR } from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';

interface AppointmentCalendarSideProps {
    appointmentDate: Date;
    setAppointmentDate: (date: Date) => void;
    notes: string;
    onNotesChange: (notes: string) => void;
}

export function AppointmentCalendarSide({
    appointmentDate,
    setAppointmentDate,
    notes,
    onNotesChange
}: AppointmentCalendarSideProps) {
    return (
        <div className="col-span-4 flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-gray-700 leading-tight">Data do Agendamento *</Label>
            <div className="border rounded-lg p-3 bg-white flex-1 flex items-start justify-center min-h-[320px]">
                <Calendar
                    mode="single"
                    selected={appointmentDate}
                    onSelect={(date) => {
                        if (date) {
                            setAppointmentDate(date);
                        }
                    }}
                    className="scale-100"
                    locale={ptBR}
                />
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-8 text-xs"
                    >
                        <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                        {appointmentDate ? (
                            format(appointmentDate, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                            <span>Selecione</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        mode="single"
                        selected={appointmentDate}
                        onSelect={(date) => {
                            if (date) {
                                setAppointmentDate(date);
                            }
                        }}
                        initialFocus
                        locale={ptBR}
                    />
                </PopoverContent>
            </Popover>

            {/* Campo de Observações */}
            <div className="mt-2">
                <Label htmlFor="notes" className="text-xs font-medium leading-tight">Observações</Label>
                <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Informações adicionais sobre a consulta..."
                    rows={2}
                    className="text-sm mt-0.5"
                />
            </div>
        </div>
    );
}
