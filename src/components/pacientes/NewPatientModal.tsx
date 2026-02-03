import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface NewPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    formData: {
        name: string;
        cpf: string;
        date_of_birth: string;
        phone: string;
        email: string;
        address: string;
        emergency_contact: string;
        emergency_phone: string;
        medical_history: string;
        allergies: string;
        medications: string;
    };
    onInputChange: (field: string, value: string) => void;
}

export function NewPatientModal({
    isOpen,
    onClose,
    onSubmit,
    formData,
    onInputChange
}: NewPatientModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Novo Paciente
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Dados Básicos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Nome Completo *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => onInputChange('name', e.target.value)}
                                placeholder="Nome do paciente"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                                id="cpf"
                                value={formData.cpf}
                                onChange={(e) => onInputChange('cpf', e.target.value)}
                                placeholder="000.000.000-00"
                                maxLength={14}
                            />
                        </div>

                        <div>
                            <Label htmlFor="date_of_birth">Data de Nascimento</Label>
                            <Input
                                id="date_of_birth"
                                type="date"
                                value={formData.date_of_birth}
                                onChange={(e) => onInputChange('date_of_birth', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => onInputChange('phone', e.target.value)}
                                placeholder="(00) 00000-0000"
                                maxLength={15}
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => onInputChange('email', e.target.value)}
                                placeholder="email@exemplo.com"
                            />
                        </div>

                        <div>
                            <Label htmlFor="address">Endereço</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => onInputChange('address', e.target.value)}
                                placeholder="Rua, número, bairro"
                            />
                        </div>
                    </div>

                    {/* Contato de Emergência */}
                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Contato de Emergência</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="emergency_contact">Nome do Contato</Label>
                                <Input
                                    id="emergency_contact"
                                    value={formData.emergency_contact}
                                    onChange={(e) => onInputChange('emergency_contact', e.target.value)}
                                    placeholder="Nome do contato de emergência"
                                />
                            </div>

                            <div>
                                <Label htmlFor="emergency_phone">Telefone de Emergência</Label>
                                <Input
                                    id="emergency_phone"
                                    value={formData.emergency_phone}
                                    onChange={(e) => onInputChange('emergency_phone', e.target.value)}
                                    placeholder="(00) 00000-0000"
                                    maxLength={15}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Informações Médicas */}
                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Informações Médicas</h4>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="medical_history">Histórico Médico</Label>
                                <Textarea
                                    id="medical_history"
                                    value={formData.medical_history}
                                    onChange={(e) => onInputChange('medical_history', e.target.value)}
                                    placeholder="Histórico médico do paciente..."
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="allergies">Alergias</Label>
                                <Textarea
                                    id="allergies"
                                    value={formData.allergies}
                                    onChange={(e) => onInputChange('allergies', e.target.value)}
                                    placeholder="Alergias conhecidas..."
                                    rows={2}
                                />
                            </div>

                            <div>
                                <Label htmlFor="medications">Medicações</Label>
                                <Textarea
                                    id="medications"
                                    value={formData.medications}
                                    onChange={(e) => onInputChange('medications', e.target.value)}
                                    placeholder="Medicações em uso..."
                                    rows={2}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                            Cadastrar Paciente
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
