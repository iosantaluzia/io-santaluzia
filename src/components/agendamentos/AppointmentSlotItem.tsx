import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';
import { translateStatus, getStatusColor, appointmentTypeLabels } from '@/utils/statusUtils';

// PopoverContent customizado sem portal para ficar contido no container
const ContainedPopoverContent = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "end", sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
            "z-50 w-56 rounded-md border bg-popover p-2 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
        )}
        {...props}
    />
));
ContainedPopoverContent.displayName = "ContainedPopoverContent";

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

import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

// ... (imports)

interface AppointmentSlotItemProps {
    slot: AppointmentSlot;
    onPatientClick: (slot: AppointmentSlot) => void;
    onUpdateStatus: (consultationId: string, newStatus: string) => Promise<void>;
    openStatusPopover: string | null;
    setOpenStatusPopover: (id: string | null) => void;
    onRemoveBlock?: (consultationId: string) => void;
}

export function AppointmentSlotItem({
    slot,
    onPatientClick,
    onUpdateStatus,
    openStatusPopover,
    setOpenStatusPopover,
    onRemoveBlock
}: AppointmentSlotItemProps) {
    const handleStatusClick = (e: React.MouseEvent, status: string) => {
        e.stopPropagation();
        if (slot.consultationId) {
            onUpdateStatus(slot.consultationId, status);
        }
    };

    if (slot.status === 'blocked') {
        return (
            <div className="flex justify-between items-center p-3 mb-2 bg-gray-100 rounded-md shadow-sm border border-gray-200 opacity-80">
                <div className="flex-1">
                    <p className="font-medium text-gray-800">{slot.time}</p>
                    <p className="text-sm font-semibold text-red-600">Horário Bloqueado</p>
                    {slot.observations && (
                        <p className="text-xs text-gray-500 italic mt-1">{slot.observations}</p>
                    )}
                </div>
                {onRemoveBlock && slot.consultationId && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveBlock(slot.consultationId!);
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div
            onClick={() => onPatientClick(slot)}
            className="flex justify-between items-center p-3 mb-2 bg-white rounded-md shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors relative"
        >
            <div className="flex-1">
                <p className="font-medium text-gray-800">{slot.time}</p>
                <p className="text-sm text-gray-600 hover:text-medical-primary transition-colors">{slot.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                    {slot.appointmentType && (
                        <p className="text-xs text-gray-500">
                            {appointmentTypeLabels[slot.appointmentType] || slot.appointmentType}
                        </p>
                    )}
                    {slot.observations && (
                        <p className="text-xs text-gray-600 italic truncate max-w-[150px]" title={slot.observations}>
                            📝 {slot.observations}
                        </p>
                    )}
                </div>
            </div>
            {slot.consultationId ? (
                <div className="relative overflow-visible" onClick={(e) => e.stopPropagation()}>
                    <Popover
                        open={openStatusPopover === slot.consultationId}
                        onOpenChange={(open) => setOpenStatusPopover(open ? slot.consultationId! : null)}
                        modal={false}
                    >
                        <PopoverTrigger asChild>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer flex items-center justify-center group-hover:justify-between gap-0 group-hover:gap-1 transition-all duration-200 hover:scale-105 ${getStatusColor(slot.status)} group`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenStatusPopover(openStatusPopover === slot.consultationId ? null : slot.consultationId!);
                                }}
                            >
                                <span className="transition-all duration-200">{translateStatus(slot.status)}</span>
                                <ChevronDown className="h-3 w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-200 flex-shrink-0 overflow-hidden" />
                            </span>
                        </PopoverTrigger>
                        <ContainedPopoverContent
                            className="w-56 p-2"
                            onClick={(e) => e.stopPropagation()}
                            side="bottom"
                            align="end"
                            sideOffset={4}
                        >
                            <div className="space-y-2">
                                {[
                                    { label: 'Agendado', value: 'Agendado', statusVal: 'scheduled' },
                                    { label: 'Aguardando', value: 'Aguardando', statusVal: 'pending' },
                                    { label: 'Cancelado', value: 'Cancelado', statusVal: 'cancelled' },
                                    { label: 'Remarcado', value: 'Remarcado', statusVal: 'rescheduled' },
                                    { label: 'Realizado', value: 'Realizado', statusVal: 'completed' }
                                ].map((item) => (
                                    <button
                                        key={item.statusVal}
                                        onClick={(e) => handleStatusClick(e, item.value)}
                                        className="w-full flex items-center justify-center hover:scale-105 transition-transform duration-150"
                                    >
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(item.statusVal)}`}>
                                            {item.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </ContainedPopoverContent>
                    </Popover>
                </div>
            ) : (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(slot.status)}`}>
                    {translateStatus(slot.status)}
                </span>
            )}
        </div>
    );
}
