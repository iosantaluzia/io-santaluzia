
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

interface EditAppointmentModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    patientName: string;
    editingAppointment: any;
    setEditingAppointment: (data: any) => void;
    availableTimes: string[];
    paymentMethodPopoverOpen: boolean;
    setPaymentMethodPopoverOpen: (open: boolean) => void;
    formatCurrencyInput: (val: string) => string;
    handleSaveAppointment: () => void;
    savingAppointment: boolean;
}

export const EditAppointmentModal = ({
    isOpen,
    onOpenChange,
    patientName,
    editingAppointment,
    setEditingAppointment,
    availableTimes,
    paymentMethodPopoverOpen,
    setPaymentMethodPopoverOpen,
    formatCurrencyInput,
    handleSaveAppointment,
    savingAppointment
}: EditAppointmentModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Agendamento</DialogTitle>
                    <DialogDescription>
                        Edite as informações do agendamento de {patientName}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Data e Horário */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Data do Agendamento *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal h-10"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {editingAppointment.date ? (
                                            format(editingAppointment.date, "PPP", { locale: ptBR })
                                        ) : (
                                            <span>Selecione a data</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                        mode="single"
                                        selected={editingAppointment.date}
                                        onSelect={(date) => {
                                            if (date) {
                                                setEditingAppointment({ ...editingAppointment, date });
                                            }
                                        }}
                                        initialFocus
                                        locale={ptBR}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <Label className="text-sm font-medium">Horário *</Label>
                            <Select
                                value={editingAppointment.time}
                                onValueChange={(value) => setEditingAppointment({ ...editingAppointment, time: value })}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Selecione o horário" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableTimes.map(time => (
                                        <SelectItem key={time} value={time}>{time}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Médico e Tipo de Agendamento */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Médico *</Label>
                            <Select
                                value={editingAppointment.doctor}
                                onValueChange={(value) => setEditingAppointment({ ...editingAppointment, doctor: value })}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Selecione o médico" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="matheus">Dr. Matheus</SelectItem>
                                    <SelectItem value="fabiola">Dra. Fabíola</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="text-sm font-medium">Tipo de Agendamento</Label>
                            <Select
                                value={editingAppointment.appointmentType}
                                onValueChange={(value) => setEditingAppointment({ ...editingAppointment, appointmentType: value })}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="consulta">Consulta</SelectItem>
                                    <SelectItem value="retorno">Retorno</SelectItem>
                                    <SelectItem value="exame">Exame</SelectItem>
                                    <SelectItem value="pagamento_honorarios">Pagamento de Honorários</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Valor e Status de Pagamento */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Valor Pago (R$)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                                <Input
                                    type="text"
                                    value={editingAppointment.amount}
                                    onChange={(e) => {
                                        const formatted = formatCurrencyInput(e.target.value);
                                        setEditingAppointment({ ...editingAppointment, amount: formatted });
                                    }}
                                    placeholder="0,00"
                                    className="pl-10 h-10"
                                    inputMode="numeric"
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium">Pagamento</Label>
                            <Select
                                value={editingAppointment.payment_received ? 'true' : 'false'}
                                onValueChange={(value) => setEditingAppointment({ ...editingAppointment, payment_received: value === 'true' })}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Status do pagamento" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Realizado</SelectItem>
                                    <SelectItem value="false">Pendente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Status do Agendamento */}
                    <div>
                        <Label className="text-sm font-medium">Status do Agendamento</Label>
                        <Select
                            value={editingAppointment.status}
                            onValueChange={(value) => setEditingAppointment({ ...editingAppointment, status: value })}
                        >
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="scheduled">Agendado</SelectItem>
                                <SelectItem value="pending">Aguardando Pagamento</SelectItem>
                                <SelectItem value="confirmed">Confirmado</SelectItem>
                                <SelectItem value="cancelled">Cancelado</SelectItem>
                                <SelectItem value="completed">Realizado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Observações */}
                    <div>
                        <Label className="text-sm font-medium">Observações</Label>
                        <Textarea
                            value={editingAppointment.observations}
                            onChange={(e) => setEditingAppointment({ ...editingAppointment, observations: e.target.value })}
                            placeholder="Observações sobre o agendamento..."
                            rows={3}
                            className="mt-1"
                        />
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            onClick={handleSaveAppointment}
                            disabled={savingAppointment || !editingAppointment.time || !editingAppointment.doctor}
                            className="flex-1 bg-medical-primary hover:bg-medical-primary/90"
                        >
                            {savingAppointment ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={savingAppointment}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
