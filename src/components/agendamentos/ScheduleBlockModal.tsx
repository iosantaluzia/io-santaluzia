import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ptBR } from 'date-fns/locale';
import { Lock } from 'lucide-react';

interface ScheduleBlockModalProps {
    doctorName: string;
    onBlock: (date: Date, startTime: string, endTime: string, reason: string) => void;
    initialDate?: Date;
}

export function ScheduleBlockModal({ doctorName, onBlock, initialDate }: ScheduleBlockModalProps) {
    const [dates, setDates] = useState<Date[] | undefined>([new Date()]);
    const [startTime, setStartTime] = useState("08:00");
    const [endTime, setEndTime] = useState("18:00");
    const [isAllDay, setIsAllDay] = useState(false);
    const [reason, setReason] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open && initialDate) {
            setDates([initialDate]);
        }
    }, [open, initialDate]);

    const handleSave = () => {
        if (dates && dates.length > 0) {
            const start = isAllDay ? "00:00" : startTime;
            const end = isAllDay ? "23:59" : endTime;

            if (start && end) {
                dates.forEach(date => {
                    onBlock(date, start, end, reason);
                });
                setOpen(false);
                setReason("");
                // Reset to single date today for next opening or keep selection? 
                // Better reset
                setDates([new Date()]);
                setIsAllDay(false);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-gray-600 hover:text-red-600 hover:border-red-200 ml-auto">
                    <Lock className="h-4 w-4 text-red-500" />
                    Bloquear Horário
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Bloquear Agenda - {doctorName}</DialogTitle>
                    <DialogDescription>
                        Selecione as datas e horários para realizar o bloqueio.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2 items-center">
                        <Label className="self-start">Datas</Label>
                        <div className="border rounded-md p-2 bg-white w-full flex justify-center">
                            <Calendar
                                key={initialDate?.toISOString() || 'default'}
                                mode="multiple"
                                selected={dates}
                                onSelect={setDates}
                                locale={ptBR}
                                initialFocus
                                defaultMonth={dates?.[0]}
                            />
                        </div>
                        <p className="text-xs text-gray-500 self-start">
                            {dates?.length || 0} dias selecionados
                        </p>
                    </div>

                    <div className="flex items-end gap-3">
                        {!isAllDay && (
                            <>
                                <div className="flex-1 flex flex-col gap-2">
                                    <Label htmlFor="startTime">Início</Label>
                                    <Input
                                        id="startTime"
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <Label htmlFor="endTime">Fim</Label>
                                    <Input
                                        id="endTime"
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                        <div className="flex items-center space-x-2 pb-3">
                            <Checkbox
                                id="allDay"
                                checked={isAllDay}
                                onCheckedChange={(checked) => setIsAllDay(checked === true)}
                            />
                            <Label htmlFor="allDay" className="cursor-pointer whitespace-nowrap">Dia todo</Label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="reason">Motivo (Opcional)</Label>
                        <Input
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Ex: Reunião, Ausência..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700 text-white">Bloquear</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
