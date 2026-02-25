import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, RefreshCw, User, Palette, Scissors, Smile, Shirt, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const ControlGrid = ({ options, current, onChange }: { options: { id: string, label: string }[], current: string, onChange: (val: string) => void }) => (
    <div className="grid grid-cols-2 gap-2 mt-2 font-inter">
        {options.map((opt) => (
            <button
                key={opt.id}
                onClick={() => onChange(opt.id)}
                className={`px-3 py-2 text-xs rounded-xl border transition-all text-left flex items-center justify-between group ${current === opt.id
                    ? 'border-bege-principal bg-bege-principal/10 text-bege-principal font-bold ring-1 ring-bege-principal/20'
                    : 'border-gray-100 hover:border-bege-principal/30 text-gray-500 bg-white hover:bg-gray-50'
                    }`}
            >
                <span className="truncate">{opt.label}</span>
                {current === opt.id && <Check className="h-3.5 w-3.5 flex-shrink-0" />}
            </button>
        ))}
    </div>
);

const CompactColorPicker = ({ label, current, onChange }: { label: string, current: string, onChange: (val: string) => void }) => {
    const [tempColor, setTempColor] = useState(current);

    // Sincronizar tempColor quando o 'current' do pai muda (ex: randomize)
    useEffect(() => {
        setTempColor(current);
    }, [current]);

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-bege-principal/30 transition-all font-inter">
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
                <span className="text-xs font-mono text-gray-500">#{tempColor.toUpperCase()}</span>
            </div>

            <div className="flex items-center gap-3">
                {tempColor.toLowerCase() !== current.toLowerCase() && (
                    <button
                        onClick={() => onChange(tempColor)}
                        className="bg-bege-principal text-white p-1.5 rounded-lg shadow-sm hover:scale-110 transition-all animate-in fade-in zoom-in"
                        title="Confirmar cor"
                    >
                        <Check className="h-4 w-4" />
                    </button>
                )}

                <div className="relative h-12 w-12 rounded-xl border-4 border-white shadow-md overflow-hidden hover:scale-110 transition-transform cursor-pointer">
                    <input
                        type="color"
                        value={`#${tempColor.startsWith('#') ? tempColor : `#${tempColor}`}`}
                        onInput={(e) => {
                            const val = (e.target as HTMLInputElement).value.replace('#', '');
                            setTempColor(val);
                            onChange(val); // Preview instantâneo no avatar enquando arrasta
                        }}
                        onChange={(e) => {
                            const val = (e.target as HTMLInputElement).value.replace('#', '');
                            onChange(val);
                        }}
                        className="absolute inset-[-8px] h-20 w-20 cursor-pointer border-none bg-transparent"
                    />
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ backgroundColor: tempColor.startsWith('#') ? tempColor : `#${tempColor}` }}
                    />
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Palette className="h-4 w-4 text-white drop-shadow-md" />
                    </div>
                </div>
            </div>
        </div>
    );
};
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Configurações do estilo Micah de Micah Lanier (DiceBear v7)
const MICAH_OPTIONS = {
    gender: [
        { id: 'masculine', label: 'Masculino' },
        { id: 'feminine', label: 'Feminino' }
    ],
    baseColor: [
        { id: 'f9c9b6', label: 'Clara', hex: '#f9c9b6' },
        { id: 'ac6651', label: 'Média', hex: '#ac6651' },
        { id: '77311d', label: 'Escura', hex: '#77311d' }
    ],
    hair: [
        { id: 'dannyPhantom', label: 'Danny', gender: 'masculine' },
        { id: 'dougFunny', label: 'Doug', gender: 'masculine' },
        { id: 'fonze', label: 'Fonzie', gender: 'masculine' },
        { id: 'mrClean', label: 'Careca', gender: 'masculine' },
        { id: 'mrT', label: 'Moicano', gender: 'masculine' },
        { id: 'full', label: 'Cheio', gender: 'feminine' },
        { id: 'pixie', label: 'Curto', gender: 'feminine' },
        { id: 'turban', label: 'Turbante', gender: 'feminine' }
    ],
    hairColor: [
        { id: '191919', label: 'Preto', hex: '#191919' },
        { id: '71472d', label: 'Castanho', hex: '#71472d' },
        { id: 'f2f2f2', label: 'Platinado', hex: '#f2f2f2' },
        { id: 'ffd11b', label: 'Loiro', hex: '#ffd11b' },
        { id: '70bdff', label: 'Azul', hex: '#70bdff' },
        { id: '8136ff', label: 'Roxo', hex: '#8136ff' },
        { id: 'ff6e6e', label: 'Rosa', hex: '#ff6e6e' }
    ],
    eyebrows: [
        { id: 'eyelashesUp', label: 'Cílios Cima' },
        { id: 'eyelashesDown', label: 'Cílios Baixo' },
        { id: 'up', label: 'Levantadas' },
        { id: 'down', label: 'Baixas' }
    ],
    eyes: [
        { id: 'eyes', label: 'Padrão' },
        { id: 'eyesShadow', label: 'Sombreado' },
        { id: 'round', label: 'Redondos' },
        { id: 'smiling', label: 'Sorrindo' },
        { id: 'smilingShadow', label: 'Sorrindo Sombr.' }
    ],
    nose: [
        { id: 'curve', label: 'Curvo' },
        { id: 'pointed', label: 'Pontudo' },
        { id: 'tound', label: 'Redondo' }
    ],
    mouth: [
        { id: 'laughing', label: 'Rindo' },
        { id: 'nervous', label: 'Nervoso' },
        { id: 'pucker', label: 'Biquinho' },
        { id: 'sad', label: 'Triste' },
        { id: 'smile', label: 'Sorriso' },
        { id: 'smirk', label: 'Sarcástico' },
        { id: 'surprised', label: 'Surpreso' },
        { id: 'frown', label: 'Bravo' }
    ],
    facialHair: [
        { id: 'none', label: 'Nenhum' },
        { id: 'beard', label: 'Barba' },
        { id: 'scruff', label: 'Cavanhaque' }
    ],
    glasses: [
        { id: 'none', label: 'Nenhum' },
        { id: 'round', label: 'Redondo' },
        { id: 'square', label: 'Quadrado' }
    ],
    earrings: [
        { id: 'none', label: 'Nenhum' },
        { id: 'hoop', label: 'Argola' },
        { id: 'stud', label: 'Ponto' }
    ],
    shirt: [
        { id: 'collared', label: 'Gola Polo' },
        { id: 'crew', label: 'Simples' },
        { id: 'open', label: 'Aberta' }
    ],
    backgroundColor: [
        { id: 'b6e3f4', label: 'Azul', hex: '#b6e3f4' },
        { id: 'c0aede', label: 'Roxo', hex: '#c0aede' },
        { id: 'd1d4f9', label: 'Indigo', hex: '#d1d4f9' },
        { id: 'ffd5dc', label: 'Rosa', hex: '#ffd5dc' },
        { id: 'ffdfbf', label: 'Laranja', hex: '#ffdfbf' },
        { id: 'e2e8f0', label: 'Cinza', hex: '#e2e8f0' }
    ],
    // Cores padrão para seletores rápidos
    palettes: {
        eyes: ['000000', '4a3000', '2c5a2e', '1e3a5f', '77311d'],
        details: ['000000', '77311d', 'ac6651', 'f9c9b6', 'ffffff'],
        shirt: ['ffffff', '191919', 'e2e8f0', '70bdff', 'ff6e6e', '8136ff']
    }
};

interface AvatarPickerProps {
    currentAvatarUrl?: string | null;
    onAvatarSelect: (url: string) => void;
}

export function AvatarPicker({ currentAvatarUrl, onAvatarSelect }: AvatarPickerProps) {
    const { appUser } = useAuth();

    // Estados para cada parâmetro
    const [seed, setSeed] = useState(appUser?.username || Math.random().toString(36).substring(7));
    const [gender, setGender] = useState('masculine');
    const [baseColor, setBaseColor] = useState(MICAH_OPTIONS.baseColor[0].id);
    const [hair, setHair] = useState(MICAH_OPTIONS.hair[0].id);
    const [hairColor, setHairColor] = useState(MICAH_OPTIONS.hairColor[0].id);
    const [eyebrows, setEyebrows] = useState(MICAH_OPTIONS.eyebrows[0].id);
    const [eyes, setEyes] = useState(MICAH_OPTIONS.eyes[0].id);
    const [nose, setNose] = useState(MICAH_OPTIONS.nose[0].id);
    const [mouth, setMouth] = useState(MICAH_OPTIONS.mouth[2].id);
    const [facialHair, setFacialHair] = useState(MICAH_OPTIONS.facialHair[0].id);
    const [glasses, setGlasses] = useState(MICAH_OPTIONS.glasses[0].id);
    const [earrings, setEarrings] = useState(MICAH_OPTIONS.earrings[0].id);
    const [shirt, setShirt] = useState(MICAH_OPTIONS.shirt[1].id);
    const [backgroundColor, setBackgroundColor] = useState(MICAH_OPTIONS.backgroundColor[0].id);

    // Novas cores v9
    const [eyebrowsColor, setEyebrowsColor] = useState('000000');
    const [eyesColor, setEyesColor] = useState('000000');
    const [facialHairColor, setFacialHairColor] = useState('000000');
    const [glassesColor, setGlassesColor] = useState('000000');
    const [mouthColor, setMouthColor] = useState('000000');
    const [shirtColor, setShirtColor] = useState('ffffff');

    const [isGenerating, setIsGenerating] = useState(false);

    // Carregar configurações do avatar atual quando fornecido
    useEffect(() => {
        if (currentAvatarUrl && currentAvatarUrl.includes('dicebear.com')) {
            try {
                const url = new URL(currentAvatarUrl);
                const params = url.searchParams;

                if (params.get('seed')) setSeed(params.get('seed')!);
                if (params.get('baseColor')) setBaseColor(params.get('baseColor')!);
                if (params.get('hair')) setHair(params.get('hair')!);
                if (params.get('hairColor')) setHairColor(params.get('hairColor')!);
                if (params.get('eyebrows')) setEyebrows(params.get('eyebrows')!);
                if (params.get('eyebrowsColor')) setEyebrowsColor(params.get('eyebrowsColor')!);
                if (params.get('eyes')) setEyes(params.get('eyes')!);
                if (params.get('eyesColor')) setEyesColor(params.get('eyesColor')!);
                if (params.get('nose')) setNose(params.get('nose')!);
                if (params.get('mouth')) setMouth(params.get('mouth')!);
                if (params.get('mouthColor')) setMouthColor(params.get('mouthColor')!);
                if (params.get('facialHair')) setFacialHair(params.get('facialHair')!);
                if (params.get('facialHairColor')) setFacialHairColor(params.get('facialHairColor')!);
                if (params.get('glasses')) setGlasses(params.get('glasses')!);
                if (params.get('glassesColor')) setGlassesColor(params.get('glassesColor')!);
                if (params.get('earrings')) setEarrings(params.get('earrings')!);
                if (params.get('shirt')) setShirt(params.get('shirt')!);
                if (params.get('shirtColor')) setShirtColor(params.get('shirtColor')!);
                if (params.get('backgroundColor')) setBackgroundColor(params.get('backgroundColor')!);
            } catch (e) {
                console.error('Erro ao processar URL do avatar:', e);
            }
        }
    }, [currentAvatarUrl]);

    // URL computada com todos os parâmetros filtrados para Micah (DiceBear v9)
    const avatarUrl = `https://api.dicebear.com/9.x/micah/svg?seed=${seed}` +
        `&baseColor=${baseColor}` +
        `&hair=${hair}` +
        `&hairColor=${hairColor}` +
        `&eyebrows=${eyebrows}` +
        `&eyebrowsColor=${eyebrowsColor}` +
        `&eyes=${eyes}` +
        `&eyesColor=${eyesColor}` +
        `&nose=${nose}` +
        `&mouth=${mouth}` +
        `&mouthColor=${mouthColor}` +
        `&shirt=${shirt}` +
        `&shirtColor=${shirtColor}` +
        `&backgroundColor=${backgroundColor}` +
        (facialHair !== 'none' ? `&facialHair=${facialHair}&facialHairColor=${facialHairColor}` : '') +
        (glasses !== 'none' ? `&glasses=${glasses}&glassesColor=${glassesColor}` : '') +
        (earrings !== 'none' ? `&earrings=${earrings}` : '');

    const handleRandomize = () => {
        setIsGenerating(true);
        const randomFrom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)].id;

        setBaseColor(randomFrom(MICAH_OPTIONS.baseColor));
        const filteredHair = MICAH_OPTIONS.hair.filter(h => h.gender === gender);
        setHair(randomFrom(filteredHair));
        setHairColor(randomFrom(MICAH_OPTIONS.hairColor));
        setEyebrows(randomFrom(MICAH_OPTIONS.eyebrows));
        setEyes(randomFrom(MICAH_OPTIONS.eyes));
        setNose(randomFrom(MICAH_OPTIONS.nose));
        setMouth(randomFrom(MICAH_OPTIONS.mouth));
        setFacialHair(randomFrom(MICAH_OPTIONS.facialHair));
        setGlasses(randomFrom(MICAH_OPTIONS.glasses));
        setEarrings(randomFrom(MICAH_OPTIONS.earrings));
        setShirt(randomFrom(MICAH_OPTIONS.shirt));
        setBackgroundColor(randomFrom(MICAH_OPTIONS.backgroundColor));

        // Randomizar cores hex
        const randomHex = () => Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        setEyebrowsColor(randomHex());
        setEyesColor(randomHex());
        setFacialHairColor(randomHex());
        setGlassesColor(randomHex());
        setMouthColor(randomHex());
        setShirtColor(randomHex());

        //setSeed(Math.random().toString(36).substring(7));

        setTimeout(() => setIsGenerating(false), 300);
    };

    const handleGenderChange = (newGender: string) => {
        setGender(newGender);
        const filteredHair = MICAH_OPTIONS.hair.filter(h => h.gender === newGender);
        setHair(filteredHair[0].id);
    };

    const handleSave = () => {
        onAvatarSelect(avatarUrl);
        toast.success('Avatar atualizado!');
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 p-6 bg-white min-h-[500px]">
            {/* Esquerda: Preview Estático e Fixo */}
            <div className="flex flex-col items-center gap-6 w-full md:w-64 flex-shrink-0">
                <div className="sticky top-0 space-y-6">
                    <div className="relative">
                        <div className={`w-48 h-48 md:w-56 md:h-56 rounded-[3rem] overflow-hidden border-[8px] border-gray-50 shadow-2xl transition-all duration-500 bg-white ${isGenerating ? 'scale-95 opacity-50 blur-[2px]' : 'scale-100 opacity-100'}`}>
                            <img
                                src={avatarUrl}
                                alt="Seu Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button
                            onClick={handleRandomize}
                            className="absolute -bottom-2 -right-2 bg-bege-principal text-white p-4 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-white"
                            title="Misturar tudo"
                        >
                            <RefreshCw className={`h-6 w-6 ${isGenerating ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={handleSave}
                            className="w-full bg-bege-principal hover:bg-marrom-acentuado text-white py-8 rounded-2xl shadow-lg shadow-bege-principal/30 font-bold text-lg"
                        >
                            <Check className="h-6 w-6 mr-2" /> Finalizar
                        </Button>
                        <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
                            Ilustrações por Micah Lanier
                        </p>
                    </div>
                </div>
            </div>

            {/* Direita: Controles em Abas */}
            <div className="flex-1 min-w-0">
                <Tabs defaultValue="identity" className="w-full">
                    <TabsList className="grid grid-cols-4 bg-gray-100/50 p-1.5 rounded-2xl mb-8">
                        <TabsTrigger value="identity" className="rounded-xl py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <User className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Identidade</span>
                        </TabsTrigger>
                        <TabsTrigger value="hair" className="rounded-xl py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <Scissors className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Cabelo</span>
                        </TabsTrigger>
                        <TabsTrigger value="face" className="rounded-xl py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <Smile className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Expressão</span>
                        </TabsTrigger>
                        <TabsTrigger value="style" className="rounded-xl py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <Shirt className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Estilo</span>
                        </TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-[380px] md:h-[450px] pr-4">
                        <TabsContent value="identity" className="m-0 mt-2 space-y-8 pb-4">
                            <section>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Sparkles className="h-3 w-3 text-bege-principal" /> Gênero Base
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {MICAH_OPTIONS.gender.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleGenderChange(opt.id)}
                                            className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${gender === opt.id
                                                ? 'border-bege-principal bg-bege-principal/5 text-bege-principal font-bold'
                                                : 'border-gray-50 hover:border-gray-200 text-gray-500 bg-white'
                                                }`}
                                        >
                                            <div className={`p-2 rounded-full ${gender === opt.id ? 'bg-bege-principal/20' : 'bg-gray-50'}`}>
                                                <User className="h-5 w-5" />
                                            </div>
                                            <span className="text-sm">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Tom de Pele</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {MICAH_OPTIONS.baseColor.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setBaseColor(opt.id)}
                                            style={{ backgroundColor: opt.hex }}
                                            className={`h-10 w-10 rounded-full border-2 transition-all flex items-center justify-center shadow-sm ${baseColor === opt.id
                                                ? 'border-bege-principal scale-110 shadow-md ring-2 ring-bege-principal/20'
                                                : 'border-white hover:scale-110'
                                                }`}
                                            title={opt.label}
                                        >
                                            {baseColor === opt.id && <Check className="h-5 w-5 text-white drop-shadow-md" />}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <CompactColorPicker label="Cor de Fundo" current={backgroundColor} onChange={setBackgroundColor} />
                            </section>
                        </TabsContent>

                        <TabsContent value="hair" className="m-0 mt-2 space-y-8 pb-4">
                            <section>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Estilo de Corte</h3>
                                <ControlGrid options={MICAH_OPTIONS.hair.filter(h => h.gender === gender)} current={hair} onChange={setHair} />
                            </section>
                            <section>
                                <CompactColorPicker label="Cor do Cabelo" current={hairColor} onChange={setHairColor} />
                            </section>
                        </TabsContent>

                        <TabsContent value="face" className="m-0 mt-2 space-y-8 pb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <section className="space-y-6">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Olhos</h3>
                                    <ControlGrid options={MICAH_OPTIONS.eyes} current={eyes} onChange={setEyes} />
                                </section>
                                <section className="space-y-6">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Mural de Sorrisos</h3>
                                    <ControlGrid options={MICAH_OPTIONS.mouth} current={mouth} onChange={setMouth} />
                                </section>
                                <section className="space-y-6">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Sobrancelhas</h3>
                                    <ControlGrid options={MICAH_OPTIONS.eyebrows} current={eyebrows} onChange={setEyebrows} />
                                </section>
                                <section>
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Nariz</h3>
                                    <ControlGrid options={MICAH_OPTIONS.nose} current={nose} onChange={setNose} />
                                </section>
                            </div>
                        </TabsContent>

                        <TabsContent value="style" className="m-0 mt-2 space-y-8 pb-4">
                            <section className="space-y-6">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Vestimenta</h3>
                                <ControlGrid options={MICAH_OPTIONS.shirt} current={shirt} onChange={setShirt} />
                                <CompactColorPicker label="Cor do Traje" current={shirtColor} onChange={setShirtColor} />
                            </section>
                            <section>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 font-bold">Barba / Detalhes Faciais</h3>
                                <ControlGrid options={MICAH_OPTIONS.facialHair} current={facialHair} onChange={setFacialHair} />
                            </section>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <section>
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Óculos</h3>
                                    <ControlGrid options={MICAH_OPTIONS.glasses} current={glasses} onChange={setGlasses} />
                                </section>
                                <section>
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Acessórios</h3>
                                    <ControlGrid options={MICAH_OPTIONS.earrings} current={earrings} onChange={setEarrings} />
                                </section>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </div>
        </div>
    );
}
