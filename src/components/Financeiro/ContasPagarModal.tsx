import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Plus, Calendar, User, Building2, Trash2, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ContasPagarModalProps {
    onClose: () => void;
    isInline?: boolean;
}

interface Expense {
    id: string;
    description: string;
    amount: number;
    due_date: string;
    category: string;
    doctor_name: string;
    status: 'pending' | 'paid';
    created_at: string;
}

export function ContasPagarModal({ onClose, isInline = false }: ContasPagarModalProps) {
    const [loading, setLoading] = useState(false);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [filterDoctor, setFilterDoctor] = useState('all');

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [doctor, setDoctor] = useState('clinic');
    const [category, setCategory] = useState('Outros');

    useEffect(() => {
        fetchExpenses();
    }, [filterDoctor]);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const mockExpenses: Expense[] = [
                { id: '1', description: 'Aluguel Sala', amount: 2500, due_date: '2026-03-10', category: 'Infraestrutura', doctor_name: 'clinic', status: 'pending', created_at: new Date().toISOString() },
                { id: '2', description: 'Limpeza e Conservação', amount: 800, due_date: '2026-03-05', category: 'Serviços', doctor_name: 'clinic', status: 'paid', created_at: new Date().toISOString() },
                { id: '3', description: 'Insumos Cirúrgicos', amount: 1200, due_date: '2026-03-15', category: 'Insumos', doctor_name: 'matheus', status: 'pending', created_at: new Date().toISOString() },
            ];

            setExpenses(mockExpenses.filter(e => filterDoctor === 'all' || e.doctor_name === filterDoctor));
        } catch (error) {
            console.error('Erro ao buscar despesas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddExpense = () => {
        if (!description || !amount || !dueDate) {
            toast.error('Preencha os campos obrigatórios');
            return;
        }
        const newExpense: Expense = {
            id: Math.random().toString(36).substr(2, 9),
            description,
            amount: parseFloat(amount),
            due_date: dueDate,
            category,
            doctor_name: doctor,
            status: 'pending',
            created_at: new Date().toISOString()
        };
        setExpenses([newExpense, ...expenses]);
        setIsAdding(false);
        resetForm();
        toast.success('Lançamento realizado');
    };

    const resetForm = () => {
        setDescription('');
        setAmount('');
        setDueDate('');
        setDoctor('clinic');
        setCategory('Outros');
    };

    const toggleStatus = (id: string) => {
        setExpenses(expenses.map(e =>
            e.id === id ? { ...e, status: e.status === 'pending' ? 'paid' : 'pending' } : e
        ));
    };

    const content = (
        <div className={cn("flex flex-col h-full bg-white rounded-lg", !isInline && "max-h-[90vh]")}>
            <div className="flex justify-between items-center p-6 border-b">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Wallet className="h-6 w-6 text-yellow-600" />
                        Contas a Pagar
                    </h2>
                    <p className="text-sm text-gray-500">
                        Controle de pagamentos, prazos e registros da clínica e médicos.
                    </p>
                </div>
                <Button variant="ghost" onClick={onClose} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6 gap-4">
                    <Select value={filterDoctor} onValueChange={setFilterDoctor}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Responsável" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="clinic">Clínica</SelectItem>
                            <SelectItem value="matheus">Dr. Matheus</SelectItem>
                            <SelectItem value="fabiola">Dra. Fabíola</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={() => setIsAdding(!isAdding)} className="bg-yellow-600 hover:bg-yellow-700">
                        {isAdding ? 'Cancelar' : <><Plus className="h-4 w-4 mr-2" /> Novo Lançamento</>}
                    </Button>
                </div>

                {isAdding && (
                    <div className="bg-gray-50 p-4 rounded-lg border mb-6 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="col-span-2">
                                <Label>Descrição *</Label>
                                <Input value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <div>
                                <Label>Valor *</Label>
                                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
                            </div>
                            <div>
                                <Label>Vencimento *</Label>
                                <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleAddExpense} className="bg-green-600">Salvar</Button>
                        </div>
                    </div>
                )}

                <div className="border rounded-md">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Vencimento</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Responsável</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{expense.description}</span>
                                            <span className="text-xs text-gray-400 uppercase">{expense.category}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {format(new Date(expense.due_date), "dd/MM/yyyy")}
                                    </TableCell>
                                    <TableCell className="text-sm font-semibold text-cinza-escuro">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense.amount)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[10px]">
                                            {expense.doctor_name === 'clinic' ? 'Clínica' : expense.doctor_name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <button onClick={() => toggleStatus(expense.id)}>
                                            {expense.status === 'paid' ? (
                                                <Badge className="bg-green-100 text-green-800 border-none">Pago</Badge>
                                            ) : (
                                                <Badge className="bg-yellow-100 text-yellow-800 border-none">Pendente</Badge>
                                            )}
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="text-red-500">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );

    if (isInline) return content;

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                {content}
            </DialogContent>
        </Dialog>
    );
}
