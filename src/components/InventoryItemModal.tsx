
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface InventoryItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemToEdit?: any;
    onSave: () => void;
}

export function InventoryItemModal({ isOpen, onClose, itemToEdit, onSave }: InventoryItemModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: 0,
        min_stock: 0,
        unit: 'unidade'
    });

    useEffect(() => {
        if (itemToEdit) {
            setFormData({
                name: itemToEdit.name || itemToEdit.item || '',
                category: itemToEdit.category || '',
                quantity: itemToEdit.quantity || 0,
                min_stock: itemToEdit.min_stock || itemToEdit.minStock || 0,
                unit: itemToEdit.unit || 'unidade'
            });
        } else {
            setFormData({
                name: '',
                category: '',
                quantity: 0,
                min_stock: 0,
                unit: 'unidade'
            });
        }
    }, [itemToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (itemToEdit?.id && typeof itemToEdit.id === 'string' && itemToEdit.id.length > 10) {
                // Update existing item
                const { error } = await supabase
                    .from('inventory')
                    .update({
                        name: formData.name,
                        category: formData.category,
                        quantity: formData.quantity,
                        min_stock: formData.min_stock,
                        unit: formData.unit
                    })
                    .eq('id', itemToEdit.id);

                if (error) throw error;
                toast.success('Item atualizado com sucesso!');
            } else {
                // Insert new item
                const { error } = await supabase
                    .from('inventory')
                    .insert([
                        {
                            name: formData.name,
                            category: formData.category,
                            quantity: formData.quantity,
                            min_stock: formData.min_stock,
                            unit: formData.unit
                        }
                    ]);

                if (error) throw error;
                toast.success('Item adicionado ao estoque!');
            }

            onSave();
            onClose();
        } catch (error: any) {
            console.error('Erro ao salvar item:', error);
            toast.error('Erro ao salvar item: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{itemToEdit ? 'Editar Item' : 'Novo Item de Estoque'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Item</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Colírio Hipromelose"
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
                                <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Colírios">Colírios</SelectItem>
                                <SelectItem value="Lentes">Lentes</SelectItem>
                                <SelectItem value="Escritório">Escritório</SelectItem>
                                <SelectItem value="Centro Cirúrgico">Centro Cirúrgico</SelectItem>
                                <SelectItem value="Consultório">Consultório</SelectItem>
                                <SelectItem value="Limpeza">Limpeza</SelectItem>
                                <SelectItem value="Outros">Outros</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantidade Atual</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="0"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="min_stock">Estoque Mínimo</Label>
                            <Input
                                id="min_stock"
                                type="number"
                                min="0"
                                value={formData.min_stock}
                                onChange={(e) => setFormData({ ...formData, min_stock: parseInt(e.target.value) || 0 })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="unit">Unidade de Medida</Label>
                        <Input
                            id="unit"
                            placeholder="Ex: frasco, par, folha, caixa"
                            value={formData.unit}
                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-medical-primary hover:bg-medical-primary/90" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {itemToEdit ? 'Salvar Alterações' : 'Adicionar Item'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
