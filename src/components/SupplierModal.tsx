
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Supplier {
    id: string;
    name: string;
    category: string;
    contactPerson: string;
    phone: string;
    email: string;
    status: 'Ativo' | 'Inativo';
    lastQuotation?: string;
    notes?: string;
}

interface SupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    supplierToEdit?: Supplier | null;
    onSave: (supplier: Supplier) => void;
}

export function SupplierModal({ isOpen, onClose, supplierToEdit, onSave }: SupplierModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Omit<Supplier, 'id'>>({
        name: '',
        category: '',
        contactPerson: '',
        phone: '',
        email: '',
        status: 'Ativo',
        notes: ''
    });

    useEffect(() => {
        if (supplierToEdit) {
            setFormData({
                name: supplierToEdit.name,
                category: supplierToEdit.category,
                contactPerson: supplierToEdit.contactPerson,
                phone: supplierToEdit.phone,
                email: supplierToEdit.email,
                status: supplierToEdit.status,
                notes: supplierToEdit.notes || ''
            });
        } else {
            setFormData({
                name: '',
                category: '',
                contactPerson: '',
                phone: '',
                email: '',
                status: 'Ativo',
                notes: ''
            });
        }
    }, [supplierToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            const supplierData: Supplier = {
                id: supplierToEdit?.id || Math.random().toString(36).substr(2, 9),
                ...formData,
                lastQuotation: supplierToEdit?.lastQuotation
            };

            onSave(supplierData);
            onClose();
            toast.success(supplierToEdit ? 'Fornecedor atualizado!' : 'Fornecedor cadastrado!');
        } catch (error) {
            toast.error('Erro ao salvar fornecedor');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Medicamentos', 'Colírios', 'Lentes de Contato', 'IOL', 'Equipamentos', 'Escritório', 'Centro Cirúrgico', 'Limpeza'];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{supplierToEdit ? 'Editar Fornecedor' : 'Novo Fornecedor'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="name">Nome da Empresa</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Categoria</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: 'Ativo' | 'Inativo') => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ativo">Ativo</SelectItem>
                                    <SelectItem value="Inativo">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactPerson">Pessoa de Contato</Label>
                        <Input
                            id="contactPerson"
                            value={formData.contactPerson}
                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Observações</Label>
                        <Input
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-medical-primary hover:bg-medical-primary/90" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {supplierToEdit ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
