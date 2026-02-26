
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
import { SupplierModal } from './SupplierModal';

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
        category: 'Medicamentos',
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
        category: 'IOL',
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

    const categories = ['Todos', 'Medicamentos', 'Colírios', 'Lentes de Contato', 'IOL', 'Equipamentos', 'Escritório', 'Centro Cirúrgico', 'Limpeza'];

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

    const handleSaveSupplier = (supplierData: Supplier) => {
        if (editingSupplier) {
            setSuppliers(prev => prev.map(s => s.id === supplierData.id ? supplierData : s));
        } else {
            setSuppliers(prev => [supplierData, ...prev]);
        }
        setIsModalOpen(false);
        setEditingSupplier(null);
    };

    const getCategoryStyles = (category: string) => {
        const styles: Record<string, { bar: string, badge: string, img: string }> = {
            'Medicamentos': {
                bar: 'bg-blue-500',
                badge: 'bg-blue-50 text-blue-600',
                img: '/uploads/pills.png'
            },
            'Colírios': {
                bar: 'bg-cyan-500',
                badge: 'bg-cyan-50 text-cyan-600',
                img: '/uploads/eyedrops.png'
            },
            'Lentes de Contato': {
                bar: 'bg-indigo-500',
                badge: 'bg-indigo-50 text-indigo-600',
                img: '/uploads/lens.png'
            },
            'IOL': {
                bar: 'bg-violet-500',
                badge: 'bg-violet-50 text-violet-600',
                img: '/uploads/IOL.png'
            },
            'Equipamentos': {
                bar: 'bg-sky-500',
                badge: 'bg-sky-50 text-sky-600',
                img: '/uploads/oftalmoscopio.png'
            },
            'Escritório': {
                bar: 'bg-orange-500',
                badge: 'bg-orange-50 text-orange-600',
                img: '/uploads/escritorio.png'
            },
            'Centro Cirúrgico': {
                bar: 'bg-red-500',
                badge: 'bg-red-50 text-red-600',
                img: '/uploads/centrocirurgico.png'
            },
            'Limpeza': {
                bar: 'bg-emerald-500',
                badge: 'bg-emerald-50 text-emerald-600',
                img: '/uploads/limpeza.png'
            },
        };
        return styles[category] || {
            bar: 'bg-gray-400',
            badge: 'bg-gray-100 text-gray-600',
            img: '/uploads/building.png'
        };
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-cinza-escuro">Fornecedores</h2>
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
                <div className="flex flex-col gap-6 mb-6">
                    <div className="flex justify-between items-center bg-gray-50/50 -mx-4 -mt-4 p-4 border-b border-gray-100 rounded-t-3xl">
                        <h3 className="text-xl font-bold text-cinza-escuro tracking-tight flex items-center gap-2">
                            <Building2 className="h-6 w-6 text-marrom-acentuado" />
                            Gestão de Parceiros
                        </h3>
                        <Button
                            className="bg-medical-primary text-white shadow-sm hover:bg-medical-primary/90"
                            onClick={() => {
                                setEditingSupplier(null);
                                setIsModalOpen(true);
                            }}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Novo Fornecedor
                        </Button>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full">
                        <div className="relative group transition-all duration-300 ease-in-out w-full md:w-32 md:focus-within:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-marrom-acentuado transition-colors" />
                            <Input
                                placeholder="Pesquisar"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all h-9 text-sm ${searchTerm ? 'md:w-72' : ''}`}
                            />
                        </div>

                        <div className="flex flex-nowrap bg-gray-100 p-1 rounded-lg w-full md:flex-1 overflow-x-auto no-scrollbar gap-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-all whitespace-nowrap ${selectedCategory === cat
                                        ? 'bg-marrom-acentuado text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {cat === 'Todos' ? 'Todos' : cat}
                                </button>
                            ))}
                        </div>

                        {selectedCategory !== 'Todos' && (
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setSelectedCategory('Todos');
                                    setSearchTerm('');
                                }}
                                className="text-gray-500 hover:text-medical-primary font-medium text-xs gap-2 shrink-0"
                            >
                                <Building2 className="h-4 w-4" />
                                Categorias
                            </Button>
                        )}
                    </div>
                </div>

                <div className={`${selectedCategory === 'Todos' && searchTerm === '' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
                    {selectedCategory === 'Todos' && searchTerm === '' ? (
                        categories.filter(c => c !== 'Todos').map((cat) => {
                            const style = getCategoryStyles(cat);
                            const count = suppliers.filter(s => s.category === cat).length;
                            return (
                                <Card
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className="group flex flex-col items-center justify-center p-4 cursor-pointer transition-all border-gray-100 bg-white active:scale-95 overflow-hidden min-h-[180px]"
                                >
                                    <div className="flex items-center justify-center w-full mb-3">
                                        <div className="relative h-28 w-28 md:h-32 md:w-32 flex items-center justify-center transition-colors duration-500">
                                            <img
                                                src={style.img}
                                                alt={cat}
                                                className="h-22 w-22 md:h-26 md:w-26 object-contain group-hover:scale-110 transition-transform duration-500 z-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center px-1">
                                        <h3 className="text-sm font-black text-cinza-escuro tracking-tight leading-tight line-clamp-2">{cat}</h3>
                                        <div className="flex items-center justify-center gap-1 mt-1.5">
                                            <span className="text-xs font-bold text-gray-400">
                                                {count} {count === 1 ? 'item' : 'itens'}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    ) : (
                        <>
                            {filteredSuppliers.length === 0 ? (
                                <div className="col-span-full py-12 text-center">
                                    <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users className="h-8 w-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-medium">Nenhum fornecedor encontrado.</p>
                                </div>
                            ) : (
                                filteredSuppliers.map((supplier) => {
                                    const categoryStyle = getCategoryStyles(supplier.category);
                                    return (
                                        <Card key={supplier.id} className="group hover:shadow-md transition-all border-gray-100 overflow-hidden relative">
                                            <CardContent className="p-5 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex gap-4 items-start">
                                                        <div className="h-12 w-12 flex items-center justify-center shrink-0">
                                                            <img src={categoryStyle.img} alt={supplier.category} className="h-10 w-10 object-contain" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex flex-col gap-1">
                                                                <h4 className="font-bold text-cinza-escuro line-clamp-1">{supplier.name}</h4>
                                                                <Badge variant="outline" className={`text-[10px] font-bold border-gray-200 text-gray-400 bg-transparent w-fit`}>
                                                                    {supplier.category}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-xs text-gray-400 font-medium capitalize flex items-center gap-1">
                                                                <Users className="h-3 w-3" /> {supplier.contactPerson}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-cinza-escuro">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem className="gap-2" onClick={() => {
                                                                setEditingSupplier(supplier);
                                                                setIsModalOpen(true);
                                                            }}>
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
                                    );
                                })
                            )}
                        </>
                    )}
                </div>
            </div>
            <SupplierModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingSupplier(null);
                }}
                supplierToEdit={editingSupplier}
                onSave={handleSaveSupplier}
            />
        </div>
    );
}
