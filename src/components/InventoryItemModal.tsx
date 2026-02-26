
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Info, Calendar as CalendarIcon, Trash2, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

const COMMON_LENS_BRANDS = [
    { label: 'ISERT 151 Esférica', prefix: 'Lente ISERT 151 Esférica' },
    { label: 'Vivinex Gemetric (Multifocal)', prefix: 'Lente Vivinex Gemetric Asférica Multifocal' },
    { label: 'Vivinex Impress (Monofocal)', prefix: 'Lente Vivinex Impress Asférica Monofocal' },
];

interface ExpirationBatch {
    date: string;
    quantity: number;
}

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
        unit: 'unidade',
        expirations: [] as ExpirationBatch[]
    });

    const [newBatch, setNewBatch] = useState<ExpirationBatch>({
        date: '',
        quantity: 0
    });

    useEffect(() => {
        if (itemToEdit) {
            setFormData({
                name: itemToEdit.name || itemToEdit.item || '',
                category: itemToEdit.category || '',
                quantity: itemToEdit.quantity || 0,
                min_stock: itemToEdit.min_stock || itemToEdit.minStock || 0,
                unit: itemToEdit.unit || 'unidade',
                expirations: Array.isArray(itemToEdit.expirations) ? itemToEdit.expirations : []
            });
        } else {
            setFormData({
                name: '',
                category: '',
                quantity: 0,
                min_stock: 0,
                unit: 'unidade',
                expirations: []
            });
        }
    }, [itemToEdit, isOpen]);

    // Lógica de auto-categorização para IOL
    useEffect(() => {
        const name = formData.name.toLowerCase();
        if (name.includes('isert') || name.includes('vivinex') || name.includes('impress')) {
            if (formData.category !== 'IOL') {
                setFormData(prev => ({ ...prev, category: 'IOL' }));
            }
        }
    }, [formData.name]);

    const handleAddBatch = () => {
        if (!newBatch.date) {
            toast.error('Informe uma data de validade.');
            return;
        }

        const updatedExpirations = [...formData.expirations, { ...newBatch, quantity: 0 }];

        setFormData({
            ...formData,
            expirations: updatedExpirations
        });

        setNewBatch({ date: '', quantity: 0 });
        toast.success('Validade adicionada!');
    };

    const handleRemoveBatch = (index: number) => {
        const updatedExpirations = formData.expirations.filter((_, i) => i !== index);

        setFormData({
            ...formData,
            expirations: updatedExpirations
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSave = {
                name: formData.name,
                category: formData.category,
                quantity: formData.quantity,
                min_stock: formData.min_stock,
                unit: formData.unit,
                expirations: formData.expirations
            };

            if (itemToEdit?.id && typeof itemToEdit.id === 'string' && itemToEdit.id.length > 10) {
                // Update existing item
                const { error } = await supabase
                    .from('inventory')
                    .update(dataToSave)
                    .eq('id', itemToEdit.id);

                if (error) throw error;
                toast.success('Item atualizado com sucesso!');
            } else {
                // Insert new item
                const { error } = await supabase
                    .from('inventory')
                    .insert([dataToSave]);

                if (error) throw error;
                toast.success('Item adicionado ao estoque!');
            }

            onSave();
            onClose();
        } catch (error: any) {
            console.error('Erro ao salvar item:', error);
            toast.error('Erro ao salvar item. Verifique se a coluna expirations foi criada no banco de dados.');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Colírios', 'Lentes', 'IOL', 'Escritório', 'Centro Cirúrgico', 'Consultório', 'Limpeza', 'Outros'];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{itemToEdit ? 'Editar Item' : 'Novo Item de Estoque'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {(formData.category === 'Lentes' || formData.category === 'IOL') && !itemToEdit && (
                        <div className="space-y-2 p-3 bg-bege-principal/5 rounded-md border border-bege-principal/20">
                            <Label className="text-marrom-acentuado text-xs flex items-center gap-1 font-semibold">
                                <Info className="h-3 w-3" /> Sugestões de Marcas:
                            </Label>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                {COMMON_LENS_BRANDS.map((brand) => (
                                    <Button
                                        key={brand.label}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="justify-start text-xs h-10 bg-white hover:bg-bege-principal/10 border-bege-principal/30 text-marrom-acentuado whitespace-normal text-left px-2 leading-tight"
                                        onClick={() => setFormData({ ...formData, name: brand.prefix + ' ' })}
                                    >
                                        {brand.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Item</Label>
                        <Input
                            id="name"
                            placeholder={(formData.category === 'Lentes' || formData.category === 'IOL') ? "Ex: Lente ... +20.00" : "Ex: Colírio Hipromelose"}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        {(formData.category === 'Lentes' || formData.category === 'IOL') && (
                            <p className="text-[10px] text-gray-400 italic">Dica: Inclua a marca e o grau (ex: +22.50)</p>
                        )}
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-4">
                        <Label className="text-sm font-bold mb-3 block">Gerenciar Lotes e Validades</Label>

                        <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-5 gap-2 items-end">
                                <div className="col-span-4 space-y-1">
                                    <Label htmlFor="batchDate" className="text-[10px] uppercase text-gray-500">Data de Validade</Label>
                                    <Input
                                        id="batchDate"
                                        type="date"
                                        value={newBatch.date}
                                        onChange={(e) => setNewBatch({ ...newBatch, date: e.target.value })}
                                        className="h-9 text-sm"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Button
                                        type="button"
                                        onClick={handleAddBatch}
                                        size="sm"
                                        className="w-full h-9 bg-marrom-acentuado hover:bg-marrom-acentuado/90 text-white"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {formData.expirations.length > 0 && (
                                <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1">
                                    {formData.expirations.map((batch, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 text-xs">
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-3 w-3 text-gray-400" />
                                                <span className="font-medium">
                                                    {batch.date ? format(new Date(batch.date + 'T12:00:00'), 'dd/MM/yyyy') : '-'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveBatch(idx)}
                                                    className="text-red-400 hover:text-red-600 p-1"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantidade Total</Label>
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

                    <DialogFooter className="pt-4 sticky bottom-0 bg-white">
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
