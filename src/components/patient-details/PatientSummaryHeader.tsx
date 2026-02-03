
import React from 'react';
import { User, Phone, MessageCircle, Mail, Calendar, MapPin, Settings, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PatientSummaryHeaderProps {
    isEditing: boolean;
    editingPatient: any;
    setEditingPatient: (data: any) => void;
    patient: any;
    setIsEditing: (val: boolean) => void;
    handleSave: () => void;
    handleCancel: () => void;
    saving: boolean;
    openWhatsApp: (phone: string) => void;
}

export const PatientSummaryHeader = ({
    isEditing,
    editingPatient,
    setEditingPatient,
    patient,
    setIsEditing,
    handleSave,
    handleCancel,
    saving,
    openWhatsApp
}: PatientSummaryHeaderProps) => {
    return (
        <div className={`relative ${isEditing ? 'space-y-2' : 'space-y-3'}`}>
            {/* Botão de Editar */}
            <div className="absolute top-0 right-0 z-10">
                {!isEditing ? (
                    <Button
                        onClick={() => setIsEditing(true)}
                        className="h-8 px-3 bg-marrom-acentuado hover:bg-white text-white hover:text-marrom-acentuado border border-transparent hover:border-marrom-acentuado transition-colors flex items-center gap-2"
                    >
                        <Settings className="h-4 w-4" />
                        <span className="text-sm font-medium">Editar</span>
                    </Button>
                ) : (
                    <div className="flex gap-1">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="h-8 w-8 p-0 bg-marrom-acentuado hover:bg-white text-white hover:text-marrom-acentuado border border-transparent hover:border-marrom-acentuado transition-colors disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                        </Button>
                        <Button
                            onClick={handleCancel}
                            disabled={saving}
                            className="h-8 w-8 p-0 bg-marrom-acentuado hover:bg-white text-white hover:text-marrom-acentuado border border-transparent hover:border-marrom-acentuado transition-colors disabled:opacity-50"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {!isEditing ? (
                <>
                    <div className="flex items-start gap-3">
                        <User className="h-4 w-4 text-gray-600 mt-1" />
                        <div>
                            <p className="font-semibold text-marrom-acentuado">{editingPatient.name || patient.name}</p>
                            {(editingPatient.cpf || patient.cpf) && (
                                <p className="text-sm text-gray-600">CPF: {editingPatient.cpf || patient.cpf}</p>
                            )}
                        </div>
                    </div>

                    {(editingPatient.phone || patient.phone) && (
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-gray-600" />
                            <p className="text-sm text-gray-700">{editingPatient.phone || patient.phone}</p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => openWhatsApp(editingPatient.phone || patient.phone || '')}
                                className="h-7 px-2 text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                                title="Abrir WhatsApp"
                            >
                                <MessageCircle className="h-3.5 w-3.5 mr-1" />
                                WhatsApp
                            </Button>
                        </div>
                    )}

                    {(editingPatient.email || patient.email) && (
                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-gray-600" />
                            <p className="text-sm text-gray-700">{editingPatient.email || patient.email}</p>
                        </div>
                    )}

                    {(editingPatient.date_of_birth || patient.birthDate) && (
                        <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <p className="text-sm text-gray-700">
                                Data de Nascimento: {
                                    editingPatient.date_of_birth
                                        ? new Date(editingPatient.date_of_birth).toLocaleDateString('pt-BR')
                                        : patient.birthDate
                                }
                            </p>
                        </div>
                    )}

                    {(editingPatient.address || editingPatient.cep || editingPatient.city || patient.address) && (
                        <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 text-gray-600 mt-1" />
                            <div className="text-sm text-gray-700">
                                {editingPatient.address && <p>{editingPatient.address}</p>}
                                {(editingPatient.cep || editingPatient.city) && (
                                    <p className="text-gray-600">
                                        {editingPatient.cep && `CEP: ${editingPatient.cep}`}
                                        {editingPatient.cep && editingPatient.city && ' • '}
                                        {editingPatient.city}
                                    </p>
                                )}
                                {!editingPatient.address && !editingPatient.cep && !editingPatient.city && patient.address && (
                                    <p>{patient.address}</p>
                                )}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="space-y-2 pr-20"> {/* pr-20 para não sobrepor botões */}
                    <div>
                        <label className="text-[10px] font-bold text-marrom-acentuado uppercase">Nome</label>
                        <Input
                            value={editingPatient.name}
                            onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                            className="h-8 text-sm"
                            placeholder="Nome completo"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[10px] font-bold text-marrom-acentuado uppercase">CPF</label>
                            <Input
                                value={editingPatient.cpf}
                                onChange={(e) => setEditingPatient({ ...editingPatient, cpf: e.target.value })}
                                className="h-8 text-sm"
                                placeholder="000.000.000-00"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-marrom-acentuado uppercase">Nascimento</label>
                            <Input
                                type="date"
                                value={editingPatient.date_of_birth}
                                onChange={(e) => setEditingPatient({ ...editingPatient, date_of_birth: e.target.value })}
                                className="h-8 text-sm"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[10px] font-bold text-marrom-acentuado uppercase">Telefone</label>
                            <Input
                                value={editingPatient.phone}
                                onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                                className="h-8 text-sm"
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-marrom-acentuado uppercase">Email</label>
                            <Input
                                value={editingPatient.email}
                                onChange={(e) => setEditingPatient({ ...editingPatient, email: e.target.value })}
                                className="h-8 text-sm"
                                placeholder="email@exemplo.com"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                            <label className="text-[10px] font-bold text-marrom-acentuado uppercase">Endereço</label>
                            <Input
                                value={editingPatient.address}
                                onChange={(e) => setEditingPatient({ ...editingPatient, address: e.target.value })}
                                className="h-8 text-sm"
                                placeholder="Rua, número, bairro"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-marrom-acentuado uppercase">CEP</label>
                            <Input
                                value={editingPatient.cep}
                                onChange={(e) => setEditingPatient({ ...editingPatient, cep: e.target.value })}
                                className="h-8 text-sm"
                                placeholder="00000-000"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
