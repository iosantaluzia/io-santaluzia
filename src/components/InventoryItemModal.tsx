
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Info } from 'lucide-react';

const COMMON_LENS_BRANDS = [
    { label: 'ISERT 151 Esférica', prefix: 'Lente ISERT 151 Esférica' },
    { label: 'Vivinex Gemetric (Multifocal)', prefix: 'Lente Vivinex Gemetric Asférica Multifocal' },
    { label: 'Vivinex Impress (Monofocal)', prefix: 'Lente Vivinex Impress Asférica Monofocal' },
];

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

                    {formData.category === 'Lentes' && !itemToEdit && (
                        <div className="space-y-2 p-3 bg-bege-principal/5 rounded-md border border-bege-principal/20">
                            <Label className="text-marrom-acentuado text-xs flex items-center gap-1 font-semibold">
                                <Info className="h-3 w-3" /> Lentes cadastradas:
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
                                <div className="col-span-2 flex gap-2 mt-1">
                                    <Input
                                        placeholder="Cadastrar nova marca..."
                                        className="h-8 text-xs bg-white border-bege-principal/20 focus-visible:ring-bege-principal"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const target = e.target as HTMLInputElement;
                                                if (target.value.trim()) {
                                                    setFormData({ ...formData, name: `Lente ${target.value.trim()} ` });
                                                    target.value = '';
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Item</Label>
                        <Input
                            id="name"
                            placeholder={formData.category === 'Lentes' ? "Ex: Lente ... +20.00" : "Ex: Colírio Hipromelose"}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        {formData.category === 'Lentes' && (
                            <p className="text-[10px] text-gray-400 italic">Dica: Inclua a marca e o grau (ex: +22.50)</p>
                        )}
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
