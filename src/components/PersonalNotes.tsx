import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Save, X, GripVertical, Palette, Type, List, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Note {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    color: string;
    x: number;
    y: number;
    w: number;
    h: number;
    fontSize: 'small' | 'medium' | 'large';
    textColor: string;
    hasCheckboxes: boolean;
}

const NOTE_COLORS = [
    { name: 'Amarelo', value: '#FEF3C7', border: '#FCD34D' },
    { name: 'Azul', value: '#DBEAFE', border: '#93C5FD' },
    { name: 'Rosa', value: '#FCE7F3', border: '#F9A8D4' },
    { name: 'Verde', value: '#D1FAE5', border: '#6EE7B7' },
    { name: 'Roxo', value: '#E0E7FF', border: '#A5B4FC' },
    { name: 'Laranja', value: '#FED7AA', border: '#FDBA74' },
    { name: 'Branco', value: '#FFFFFF', border: '#D1D5DB' },
    { name: 'Cinza', value: '#F3F4F6', border: '#9CA3AF' },
    { name: 'Vermelho', value: '#FEE2E2', border: '#FCA5A5' },
];

const TEXT_COLORS = [
    { name: 'Preto', value: '#1F2937' },
    { name: 'Cinza', value: '#6B7280' },
    { name: 'Azul', value: '#2563EB' },
    { name: 'Verde', value: '#059669' },
    { name: 'Vermelho', value: '#DC2626' },
    { name: 'Roxo', value: '#7C3AED' },
];

const FONT_SIZES = {
    small: { label: 'Pequeno', class: 'text-xs' },
    medium: { label: 'Médio', class: 'text-sm' },
    large: { label: 'Grande', class: 'text-base' },
};

export function PersonalNotes() {
    const { appUser } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [gridWidth, setGridWidth] = useState(1200);
    const gridContainerRef = useRef<HTMLDivElement>(null);

    // Calcular largura do container
    useEffect(() => {
        const updateWidth = () => {
            if (gridContainerRef.current) {
                setGridWidth(gridContainerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // Detectar cliques fora da nota em edição para cancelar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (editingNoteId && gridContainerRef.current) {
                const target = event.target as HTMLElement;
                // Verificar se o clique foi fora da nota em edição
                const editingNote = gridContainerRef.current.querySelector(`[data-note-id="${editingNoteId}"]`);
                if (editingNote && !editingNote.contains(target)) {
                    handleCancelEdit();
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editingNoteId]);

    // Carregar notas do localStorage quando o componente montar
    useEffect(() => {
        if (!appUser?.username) return;

        const storageKey = `personal-notes-${appUser.username}`;
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsedNotes = JSON.parse(saved);
                // Adicionar valores padrão para notas antigas
                const notesWithDefaults = parsedNotes.map((note: Note) => ({
                    ...note,
                    fontSize: note.fontSize || 'medium',
                    textColor: note.textColor || '#1F2937',
                    hasCheckboxes: note.hasCheckboxes || false,
                }));
                setNotes(notesWithDefaults);
            }
        } catch (error) {
            console.error('Erro ao carregar notas:', error);
        }
    }, [appUser?.username]);

    // Salvar notas no localStorage quando mudarem
    const saveNotes = (updatedNotes: Note[]) => {
        if (!appUser?.username) return;

        const storageKey = `personal-notes-${appUser.username}`;
        try {
            localStorage.setItem(storageKey, JSON.stringify(updatedNotes));
            setNotes(updatedNotes);
        } catch (error) {
            console.error('Erro ao salvar notas:', error);
            toast.error('Erro ao salvar nota');
        }
    };

    const handleAddNote = () => {
        const maxY = notes.length > 0 ? Math.max(...notes.map(n => n.y + n.h)) : 0;
        const randomColor = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];

        const newNote: Note = {
            id: Date.now().toString(),
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            color: randomColor.value,
            x: 0,
            y: maxY,
            w: 2,
            h: 2,
            fontSize: 'medium',
            textColor: '#1F2937',
            hasCheckboxes: false,
        };

        const updatedNotes = [...notes, newNote];
        saveNotes(updatedNotes);

        // Entrar automaticamente no modo de edição
        setEditingNoteId(newNote.id);
        setEditContent('');

        toast.success('Nova nota criada!');
    };

    const handleEditNote = (noteId: string) => {
        const note = notes.find(n => n.id === noteId);
        if (note) {
            setEditingNoteId(noteId);
            setEditContent(note.content);
        }
    };

    const handleSaveEdit = () => {
        if (!editContent.trim()) {
            toast.error('A nota não pode estar vazia');
            return;
        }

        const updatedNotes = notes.map(note =>
            note.id === editingNoteId
                ? { ...note, content: editContent.trim(), updatedAt: new Date().toISOString() }
                : note
        );

        saveNotes(updatedNotes);
        setEditingNoteId(null);
        setEditContent('');
        toast.success('Nota atualizada com sucesso!');
    };

    const handleCancelEdit = () => {
        setEditingNoteId(null);
        setEditContent('');
    };

    const handleDeleteNote = (noteId: string) => {
        const updatedNotes = notes.filter(note => note.id !== noteId);
        saveNotes(updatedNotes);
        toast.success('Nota deletada com sucesso!');
    };

    const handleChangeNoteColor = (noteId: string, newColor: string) => {
        const updatedNotes = notes.map(note =>
            note.id === noteId
                ? { ...note, color: newColor, updatedAt: new Date().toISOString() }
                : note
        );
        saveNotes(updatedNotes);
    };

    const handleChangeTextColor = (noteId: string, newColor: string) => {
        const updatedNotes = notes.map(note =>
            note.id === noteId
                ? { ...note, textColor: newColor, updatedAt: new Date().toISOString() }
                : note
        );
        saveNotes(updatedNotes);
    };

    const handleChangeFontSize = (noteId: string, newSize: 'small' | 'medium' | 'large') => {
        const updatedNotes = notes.map(note =>
            note.id === noteId
                ? { ...note, fontSize: newSize, updatedAt: new Date().toISOString() }
                : note
        );
        saveNotes(updatedNotes);
    };

    const handleToggleCheckboxes = (noteId: string) => {
        const updatedNotes = notes.map(note =>
            note.id === noteId
                ? { ...note, hasCheckboxes: !note.hasCheckboxes, updatedAt: new Date().toISOString() }
                : note
        );
        saveNotes(updatedNotes);
    };

    const handleLayoutChange = (layout: Layout[]) => {
        const updatedNotes = notes.map(note => {
            const layoutItem = layout.find(l => l.i === note.id);
            if (layoutItem) {
                return {
                    ...note,
                    x: layoutItem.x,
                    y: layoutItem.y,
                    w: layoutItem.w,
                    h: layoutItem.h,
                };
            }
            return note;
        });
        saveNotes(updatedNotes);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getBorderColor = (color: string) => {
        const colorObj = NOTE_COLORS.find(c => c.value === color);
        return colorObj ? colorObj.border : '#FCD34D';
    };

    const renderNoteContent = (note: Note) => {
        if (!note.hasCheckboxes) {
            return note.content;
        }

        // Renderizar com checkboxes
        const lines = note.content.split('\n');
        return (
            <div className="space-y-1">
                {lines.map((line, index) => (
                    <div key={index} className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            className="mt-0.5 rounded border-gray-400 cursor-pointer"
                            onChange={(e) => {
                                // Aqui você pode adicionar lógica para salvar o estado dos checkboxes
                                e.stopPropagation();
                            }}
                        />
                        <span>{line}</span>
                    </div>
                ))}
            </div>
        );
    };

    const layout: Layout[] = notes.map(note => ({
        i: note.id,
        x: note.x,
        y: note.y,
        w: note.w,
        h: note.h,
        minW: 1,
        minH: 1,
    }));

    return (
        <div className="bg-gray-200/40 border border-dashed border-gray-300 py-6 px-6 rounded-[1.9rem] min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-cinza-escuro">Minhas Notas</h2>
                <Button
                    onClick={handleAddNote}
                    size="sm"
                    className="bg-bege-principal hover:bg-marrom-acentuado text-white"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Nota
                </Button>
            </div>

            {/* Grid de notas adesivas */}
            {notes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-sm">Nenhuma nota ainda.</p>
                    <p className="text-xs mt-1">Clique em "Nova Nota" para começar.</p>
                </div>
            ) : (
                <div ref={gridContainerRef} className="w-full">
                    <GridLayout
                        className="layout"
                        layout={layout}
                        cols={6}
                        rowHeight={100}
                        width={gridWidth}
                        onLayoutChange={handleLayoutChange}
                        isDraggable={true}
                        isResizable={true}
                        compactType={null}
                        preventCollision={false}
                        containerPadding={[0, 0]}
                        margin={[10, 10]}
                        isBounded={true}
                    >
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                data-note-id={note.id}
                                className="rounded-lg shadow-lg border-2 transition-all hover:shadow-xl"
                                style={{
                                    backgroundColor: note.color,
                                    borderColor: getBorderColor(note.color),
                                }}
                            >
                                <div className="h-full flex flex-col p-3">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-2">
                                        <GripVertical className="h-4 w-4 text-gray-500 cursor-move flex-shrink-0" />

                                        <div className="flex gap-1 flex-shrink-0">
                                            {/* Mostrar ferramentas de formatação apenas no modo de edição */}
                                            {editingNoteId === note.id && (
                                                <>
                                                    {/* Cor da nota */}
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <button
                                                                className="p-1.5 hover:bg-black/10 rounded transition-colors"
                                                                title="Cor da nota"
                                                            >
                                                                <Palette className="h-3.5 w-3.5 text-gray-700" />
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-2" align="end">
                                                            <div className="space-y-2">
                                                                <p className="text-xs font-medium text-gray-700">Cor da nota</p>
                                                                <div className="grid grid-cols-3 gap-2">
                                                                    {NOTE_COLORS.map((color) => (
                                                                        <button
                                                                            key={color.value}
                                                                            onClick={() => handleChangeNoteColor(note.id, color.value)}
                                                                            className="w-8 h-8 rounded-md border-2 hover:scale-110 transition-transform"
                                                                            style={{
                                                                                backgroundColor: color.value,
                                                                                borderColor: color.border,
                                                                            }}
                                                                            title={color.name}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>

                                                    {/* Cor do texto */}
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <button
                                                                className="p-1.5 hover:bg-black/10 rounded transition-colors"
                                                                title="Cor do texto"
                                                            >
                                                                <Type className="h-3.5 w-3.5 text-gray-700" />
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-2" align="end">
                                                            <div className="space-y-2">
                                                                <p className="text-xs font-medium text-gray-700">Cor do texto</p>
                                                                <div className="grid grid-cols-3 gap-2">
                                                                    {TEXT_COLORS.map((color) => (
                                                                        <button
                                                                            key={color.value}
                                                                            onClick={() => handleChangeTextColor(note.id, color.value)}
                                                                            className="w-8 h-8 rounded-md border-2 hover:scale-110 transition-transform"
                                                                            style={{
                                                                                backgroundColor: color.value,
                                                                            }}
                                                                            title={color.name}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>

                                                    {/* Tamanho da fonte */}
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <button
                                                                className="p-1.5 hover:bg-black/10 rounded transition-colors"
                                                                title="Tamanho da fonte"
                                                            >
                                                                <span className="text-xs font-bold">A</span>
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-2" align="end">
                                                            <div className="space-y-1">
                                                                <p className="text-xs font-medium text-gray-700 mb-2">Tamanho</p>
                                                                {Object.entries(FONT_SIZES).map(([key, { label }]) => (
                                                                    <button
                                                                        key={key}
                                                                        onClick={() => handleChangeFontSize(note.id, key as 'small' | 'medium' | 'large')}
                                                                        className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-xs ${note.fontSize === key ? 'bg-gray-200 font-bold' : ''
                                                                            }`}
                                                                    >
                                                                        {label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>

                                                    {/* Toggle checkboxes */}
                                                    <button
                                                        onClick={() => handleToggleCheckboxes(note.id)}
                                                        className={`p-1.5 hover:bg-black/10 rounded transition-colors ${note.hasCheckboxes ? 'bg-black/20' : ''
                                                            }`}
                                                        title="Lista com checkboxes"
                                                    >
                                                        <List className="h-3.5 w-3.5 text-gray-700" />
                                                    </button>
                                                </>
                                            )}

                                            <button
                                                onClick={() => handleDeleteNote(note.id)}
                                                className="p-1 hover:bg-red-100 rounded transition-colors"
                                                title="Deletar nota"
                                            >
                                                <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Conteúdo */}
                                    {editingNoteId === note.id ? (
                                        <div className="flex-1 flex flex-col">
                                            <Textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className={`flex-1 mb-2 resize-none bg-transparent border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${FONT_SIZES[note.fontSize || 'medium'].class}`}
                                                style={{
                                                    color: note.textColor,
                                                }}
                                                autoFocus
                                            />
                                            <div className="flex gap-1 justify-end">
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="p-1.5 hover:bg-black/10 rounded transition-colors"
                                                    title="Cancelar"
                                                >
                                                    <X className="h-4 w-4 text-gray-700" />
                                                </button>
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="p-1.5 hover:bg-green-100 rounded transition-colors"
                                                    title="Salvar"
                                                >
                                                    <Save className="h-4 w-4 text-green-700" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="flex-1 flex flex-col cursor-pointer"
                                            onClick={() => handleEditNote(note.id)}
                                        >
                                            <div
                                                className={`${FONT_SIZES[note.fontSize || 'medium'].class} whitespace-pre-wrap flex-1 overflow-auto mb-2`}
                                                style={{ color: note.textColor }}
                                            >
                                                {renderNoteContent(note)}
                                            </div>
                                            <span className="text-xs text-gray-600 mt-auto">
                                                {formatDate(note.updatedAt)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </GridLayout>
                </div>
            )}
        </div>
    );
}
