import React from 'react';
import { User, Phone, Mail, MapPin, Clock, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatCurrencyInput } from '@/utils/currency';

interface AppointmentFormFieldsProps {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
    availableTimes: string[];
    paymentMethodPopoverOpen: boolean;
    setPaymentMethodPopoverOpen: (open: boolean) => void;
}

export function AppointmentFormFields({
    formData,
    handleInputChange,
    availableTimes,
    paymentMethodPopoverOpen,
    setPaymentMethodPopoverOpen
}: AppointmentFormFieldsProps) {
    return (
        <div className="col-span-8 space-y-2">
            {/* Primeira linha: Nome e CPF */}
            <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                    <Label htmlFor="name" className="text-xs font-medium leading-tight">Nome Completo *</Label>
                    <div className="relative mt-0.5">
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Nome do paciente"
                            className="pl-7 h-8 text-xs"
                            required
                        />
                        <User className="h-3 w-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>
                <div>
                    <Label htmlFor="cpf" className="text-xs font-medium leading-tight">CPF</Label>
                    <Input
                        id="cpf"
                        value={formData.cpf}
                        onChange={(e) => handleInputChange('cpf', e.target.value)}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className="h-8 text-xs mt-0.5"
                    />
                </div>
            </div>

            {/* Segunda linha: Data Nascimento e Telefone */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <Label htmlFor="date_of_birth" className="text-xs font-medium leading-tight">Data Nascimento</Label>
                    <Input
                        id="date_of_birth"
                        type="text"
                        value={formData.date_of_birth}
                        onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length > 8) value = value.slice(0, 8);
                            if (value.length >= 5) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4);
                            } else if (value.length >= 3) {
                                value = value.slice(0, 2) + '/' + value.slice(2);
                            }
                            handleInputChange('date_of_birth', value);
                        }}
                        placeholder="dd/mm/aaaa"
                        maxLength={10}
                        className="h-8 text-xs mt-0.5"
                    />
                </div>
                <div>
                    <Label htmlFor="phone" className="text-xs font-medium leading-tight">Telefone *</Label>
                    <div className="relative mt-0.5">
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="(00) 00000-0000"
                            className="pl-7 h-8 text-xs"
                            maxLength={15}
                            required
                        />
                        <Phone className="h-3 w-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>
            </div>

            {/* Terceira linha: Médico e Horário */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <Label htmlFor="doctor" className="text-xs font-medium leading-tight">Médico *</Label>
                    <Select value={formData.doctor} onValueChange={(value) => handleInputChange('doctor', value)}>
                        <SelectTrigger className="h-8 text-xs mt-0.5">
                            <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="matheus">Dr. Matheus</SelectItem>
                            <SelectItem value="fabiola">Dra. Fabíola</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="time" className="text-xs font-medium leading-tight">Horário *</Label>
                    <div className="relative mt-0.5">
                        <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                            <SelectTrigger className="pl-7 h-8 text-xs">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableTimes.map(time => (
                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Clock className="h-3 w-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Quarta linha: Tipo de Agendamento e Valor Pago */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <Label htmlFor="appointmentType" className="text-xs font-medium leading-tight">Tipo de Agendamento *</Label>
                    <Select value={formData.appointmentType} onValueChange={(value) => handleInputChange('appointmentType', value)}>
                        <SelectTrigger className="h-8 text-xs mt-0.5">
                            <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="consulta">Consulta</SelectItem>
                            <SelectItem value="retorno">Retorno</SelectItem>
                            <SelectItem value="exame">Exame</SelectItem>
                            <SelectItem value="convenio">Convênio</SelectItem>
                            <SelectItem value="pagamento_honorarios">Pagamento de Honorários</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    {formData.appointmentType === 'convenio' ? (
                        <>
                            <Label htmlFor="convenio" className="text-xs font-medium leading-tight">Selecionar Convênio *</Label>
                            <Select
                                value={formData.payment_method}
                                onValueChange={(value) => {
                                    handleInputChange('payment_method', value);
                                    handleInputChange('amount', '0'); // Convênios não têm valor na hora
                                }}
                            >
                                <SelectTrigger className="h-8 text-xs mt-0.5 w-full">
                                    <SelectValue placeholder="Selecione o convênio" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Unimed">Unimed</SelectItem>
                                    <SelectItem value="Unimed 279">Unimed 279</SelectItem>
                                    <SelectItem value="Unimed Intercâmbio">Unimed Intercâmbio</SelectItem>
                                </SelectContent>
                            </Select>
                        </>
                    ) : (
                        <>
                            <Label htmlFor="amount" className="text-xs font-medium leading-tight">Valor Pago (R$)</Label>
                            <div className="flex items-end gap-2 mt-0.5">
                                <div className="relative flex-1">
                                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">R$</span>
                                    <Input
                                        id="amount"
                                        type="text"
                                        value={formData.amount}
                                        onChange={(e) => {
                                            const formatted = formatCurrencyInput(e.target.value);
                                            handleInputChange('amount', formatted);
                                        }}
                                        placeholder="0,00"
                                        className="h-8 text-xs pl-7 pr-24"
                                        inputMode="numeric"
                                    />
                                    <Popover open={paymentMethodPopoverOpen} onOpenChange={setPaymentMethodPopoverOpen}>
                                        <PopoverTrigger asChild>
                                            <button
                                                type="button"
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs hover:text-gray-700 flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 z-10"
                                            >
                                                <span className="text-xs truncate max-w-[120px]">
                                                    {formData.payment_method || 'Meio de Pagamento'}
                                                </span>
                                                <ChevronDown className="h-3 w-3 flex-shrink-0" />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-48 p-1 z-50" align="end">
                                            <div className="flex flex-col">
                                                {['Dinheiro', 'Pix', 'Cartão de Crédito', 'Cheque', 'Débito'].map(method => (
                                                    <button
                                                        key={method}
                                                        type="button"
                                                        onClick={() => {
                                                            handleInputChange('payment_method', method);
                                                            setPaymentMethodPopoverOpen(false);
                                                        }}
                                                        className="text-left px-3 py-2 text-xs hover:bg-gray-100 rounded-sm transition-colors"
                                                    >
                                                        {method}
                                                    </button>
                                                ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="flex items-center gap-1.5 pb-0.5">
                                    <Checkbox
                                        id="payment_received"
                                        checked={formData.payment_received}
                                        onCheckedChange={(checked) => handleInputChange('payment_received', checked === true)}
                                        className="h-3.5 w-3.5"
                                    />
                                    <Label htmlFor="payment_received" className="text-xs font-normal cursor-pointer leading-tight whitespace-nowrap">
                                        Pago
                                    </Label>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Campos Opcionais - Movidos para baixo */}
            <div className="border-t pt-2 mt-2">
                <h4 className="text-xs font-medium text-gray-600 mb-1.5">Informações Adicionais (Opcionais)</h4>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label htmlFor="email" className="text-xs font-medium leading-tight">Email</Label>
                        <div className="relative mt-0.5">
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="email@exemplo.com"
                                className="pl-7 h-8 text-xs"
                            />
                            <Mail className="h-3 w-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="address" className="text-xs font-medium leading-tight">Endereço</Label>
                        <div className="relative mt-0.5">
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                placeholder="Rua, número, bairro"
                                className="pl-7 h-8 text-xs"
                            />
                            <MapPin className="h-3 w-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                        <Label htmlFor="cep" className="text-xs font-medium leading-tight">CEP</Label>
                        <Input
                            id="cep"
                            value={formData.cep}
                            onChange={(e) => handleInputChange('cep', e.target.value)}
                            placeholder="00000-000"
                            maxLength={9}
                            className="h-8 text-xs mt-0.5"
                        />
                    </div>
                    <div>
                        <Label htmlFor="city" className="text-xs font-medium leading-tight">Cidade</Label>
                        <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder="Cidade"
                            className="h-8 text-xs mt-0.5"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
