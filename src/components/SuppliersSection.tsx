
import React, { useState } from 'react';
import {
    Users,
    Plus,
    Search,
    Mail,
    Phone,
    ExternalLink,
    Edit2,
    Trash2,
    MoreVertical,
    Building2,
    Tag,
    MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

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

const MOCK_SUPPLIERS: Supplier[] = [
    {
        id: '1',
        name: 'Alcon Lab',
        category: 'Medicamentos e Lentes',
        contactPerson: 'Ricardo Silva',
        phone: '(11) 98765-4321',
        email: 'contato@alcon.com.br',
        status: 'Ativo',
        lastQuotation: '2024-02-15',
        notes: 'Fornecedor principal de lentes IOL e viscoelásticos.'
    },
    {
        id: '2',
        name: 'Johnson & Johnson Vision',
        category: 'Lentes e Equipamentos',
        contactPerson: 'Amanda Costa',
        phone: '(11) 97654-3210',
        email: 'amanda.costa@jjvision.com',
        status: 'Ativo',
        lastQuotation: '2024-02-10',
        notes: 'Lentes intraoculares premium.'
    },
    {
        id: '3',
        name: 'Papelaria Central',
        category: 'Escritório',
        contactPerson: 'José Pereira',
        phone: '(27) 3322-1100',
        email: 'vendas@papelariacentral.com.br',
        status: 'Ativo',
        lastQuotation: '2024-01-20',
        notes: 'Papel A4, toners e materiais de escritório geral.'
    },
    {
        id: '4',
        name: 'MedHouse Distribuidora',
        category: 'Centro Cirúrgico',
        contactPerson: 'Fernanda Lima',
        phone: '(27) 99988-7766',
        email: 'fernanda@medhouse.com.br',
        status: 'Ativo',
        lastQuotation: '2024-02-22',
        notes: 'Materiais descartáveis e fios de sutura.'
    },
    {
        id: '5',
        name: 'Limpeza Total Ltda',
        category: 'Limpeza',
        contactPerson: 'Marcos Santos',
        phone: '(27) 3200-4455',
        email: 'marcos@limpezatotal.com',
        status: 'Inativo',
        lastQuotation: '2023-11-05',
        notes: 'Cotação muito alta na última vez.'
    }
];

export function SuppliersSection() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);

    const categories = ['Todos', 'Medicamentos e Lentes', 'Lentes e Equipamentos', 'Escritório', 'Centro Cirúrgico', 'Limpeza'];

    const filteredSuppliers = suppliers.filter(supplier => {
        const matchesCategory = selectedCategory === 'Todos' || supplier.category === selectedCategory;
        const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleDelete = (id: string) => {
        if (confirm('Deseja realmente remover este fornecedor?')) {
            setSuppliers(prev => prev.filter(s => s.id !== id));
            toast.success('Fornecedor removido com sucesso');
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-cinza-escuro tracking-tight">Fornecedores</h2>
                    <p className="text-gray-500">Gerencie seus contatos e parceiros comerciais</p>
                </div>
                <Button className="bg-medical-primary text-white hover:bg-medical-primary/90 shadow-lg shadow-medical-primary/20">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Fornecedor
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <Card className="bg-gradient-to-br from-white to-gray-50 border-none shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total de Parceiros</p>
                            <p className="text-2xl font-black text-cinza-escuro">{suppliers.length}</p>
                        </div>
                        <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-white to-gray-50 border-none shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Categorias Ativas</p>
                            <p className="text-2xl font-black text-cinza-escuro">{new Set(suppliers.map(s => s.category)).size}</p>
                        </div>
                        <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center">
                            <Tag className="h-5 w-5 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-white to-gray-50 border-none shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Novas Cotações (Mês)</p>
                            <p className="text-2xl font-black text-cinza-escuro">12</p>
                        </div>
                        <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Pesquisar por nome, contato ou categoria..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-medical-primary/20"
                        />
                    </div>
                    <div className="flex bg-gray-50 p-1 rounded-2xl overflow-x-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${selectedCategory === cat
                                        ? 'bg-white text-medical-primary shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSuppliers.length === 0 ? (
                        <div className="col-span-full py-12 text-center">
                            <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium">Nenhum fornecedor encontrado.</p>
                        </div>
                    ) : (
                        filteredSuppliers.map((supplier) => (
                            <Card key={supplier.id} className="group hover:shadow-md transition-all border-gray-100 overflow-hidden relative">
                                <div className={`absolute top-0 left-0 w-1 h-full ${supplier.status === 'Ativo' ? 'bg-green-500' : 'bg-gray-300'
                                    }`} />

                                <CardContent className="p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-cinza-escuro line-clamp-1">{supplier.name}</h4>
                                                <Badge variant="secondary" className="text-[10px] font-bold bg-gray-100 text-gray-600 border-none">
                                                    {supplier.category}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium capitalize flex items-center gap-1">
                                                <Users className="h-3 w-3" /> {supplier.contactPerson}
                                            </p>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-cinza-escuro">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="gap-2">
                                                    <Edit2 className="h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 text-red-600" onClick={() => handleDelete(supplier.id)}>
                                                    <Trash2 className="h-4 w-4" /> Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                        <a
                                            href={`tel:${supplier.phone}`}
                                            className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 hover:bg-medical-primary/5 transition-colors group/link"
                                        >
                                            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                                <Phone className="h-4 w-4 text-medical-primary" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-600 group-hover/link:text-medical-primary transition-colors">
                                                {supplier.phone}
                                            </span>
                                        </a>

                                        <a
                                            href={`mailto:${supplier.email}`}
                                            className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 hover:bg-medical-primary/5 transition-colors group/link"
                                        >
                                            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                                <Mail className="h-4 w-4 text-medical-primary" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-600 group-hover/link:text-medical-primary transition-colors truncate">
                                                {supplier.email}
                                            </span>
                                        </a>
                                    </div>

                                    {supplier.notes && (
                                        <div className="bg-gray-50/50 p-3 rounded-xl border border-dashed border-gray-100">
                                            <p className="text-xs text-gray-500 italic line-clamp-2">"{supplier.notes}"</p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-[10px]">
                                        <span className="text-gray-400">
                                            Última cotação: {supplier.lastQuotation ? new Date(supplier.lastQuotation).toLocaleDateString('pt-BR') : 'Sem registro'}
                                        </span>
                                        <Badge className={supplier.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>
                                            {supplier.status}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
