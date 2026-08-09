import { PrismaClient } from "@prisma/client";
import { BASE_DRUGS } from "./medicamentos-base";
import { BASE_DRUGS_2 } from "./medicamentos-base-2";
import { BASE_DRUGS_3 } from "./medicamentos-base-3";
import { MEDICAMENTOS_OFICIAIS } from "./medicamentos-oficiais";
import { INTERACTIONS_BASE } from "./interacoes-base";
import { INTERACTIONS_BASE_2 } from "./interacoes-base-2";

const ALL_INTERACTIONS_BASE = [...INTERACTIONS_BASE, ...INTERACTIONS_BASE_2];

// Junta os lotes e remove duplicados por princípio ativo (evita conflitos de chave única).
const _rawBase = [...BASE_DRUGS, ...BASE_DRUGS_2, ...BASE_DRUGS_3, ...MEDICAMENTOS_OFICIAIS];
const _seenAi = new Set<string>();
const ALL_BASE = _rawBase.filter((b) => {
  if (_seenAi.has(b.ai)) return false;
  _seenAi.add(b.ai);
  return true;
});

type Severity = "HIGH" | "MEDIUM" | "LOW";

// Usa a conexão direta (não-pooled) quando disponível — evita erros de
// prepared statement do PgBouncer ao popular o Postgres da nuvem (Neon).
const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.POSTGRES_URL_NON_POOLING ||
        process.env.DATABASE_URL_UNPOOLED ||
        process.env.DATABASE_URL,
    },
  },
});

type RAM = { frequency: string; reactions: string[] };
type DrugSeed = {
  name: string;
  activeIngredient: string;
  therapeuticClass: string;
  atcCode?: string;
  pregnancyCategory?: string;
  lactation?: string;
  renalAdjustment?: string;
  hepaticAdjustment?: string;
  geriatricNotes?: string;
  pediatricNotes?: string;
  standardPosology?: string;
  contraindications?: string;
  adverseReactions?: RAM[];
  foodInteractions?: string;
  labInteractions?: string;
  description?: string;
};

const drugs: DrugSeed[] = [
  {
    name: "Marevan",
    activeIngredient: "Varfarina",
    therapeuticClass: "Anticoagulante oral (antagonista da vitamina K)",
    atcCode: "B01AA03",
    pregnancyCategory: "X",
    lactation: "Compatível (excreção mínima); monitorar lactente",
    renalAdjustment: "Sem ajuste posológico fixo; monitorar INR (risco de sangramento maior na DRC)",
    hepaticAdjustment: "Reduzir dose; síntese de fatores de coagulação prejudicada aumenta o efeito",
    geriatricNotes: "Maior sensibilidade; iniciar com doses menores e titular pelo INR",
    pediatricNotes: "Dose individualizada por peso e INR; requer monitorização rigorosa",
    standardPosology: "Individualizada pelo INR (alvo usual 2,0-3,0). Início 2,5-5 mg/dia VO",
    contraindications: "Gestação; sangramento ativo; discrasias sanguíneas; hipertensão grave não controlada; cirurgia recente de SNC/olho",
    adverseReactions: [
      { frequency: "Comum", reactions: ["Sangramento (equimoses, gengivorragia, hematúria)"] },
      { frequency: "Incomum", reactions: ["Náusea", "diarreia", "elevação de transaminases"] },
      { frequency: "Raro", reactions: ["Necrose cutânea induzida por varfarina", "síndrome do dedo roxo"] },
    ],
    foodInteractions: "Alimentos ricos em vitamina K (folhosos verde-escuros) antagonizam o efeito — manter ingestão CONSTANTE, não eliminar. Álcool e suco de cranberry podem alterar o INR.",
    labInteractions: "Monitorar INR/TP regularmente. Alvo conforme indicação.",
    description: "Anticoagulante cumarínico. Janela terapêutica estreita e alta propensão a interações via CYP2C9 e ligação proteica.",
  },
  {
    name: "Ancoron",
    activeIngredient: "Amiodarona",
    therapeuticClass: "Antiarrítmico classe III",
    atcCode: "C01BD01",
    pregnancyCategory: "D",
    lactation: "Contraindicado (concentra no leite; risco tireoidiano ao lactente)",
    renalAdjustment: "Sem ajuste renal significativo (eliminação hepática)",
    hepaticAdjustment: "Usar com cautela; hepatotoxicidade dose-dependente",
    geriatricNotes: "Maior risco de bradicardia e disfunção tireoidiana",
    pediatricNotes: "Uso especializado; dose por peso sob monitorização",
    standardPosology: "Ataque 600-800 mg/dia VO por 1-4 semanas; manutenção 100-400 mg/dia",
    contraindications: "Bradicardia sinusal grave / BAV de 2º-3º grau sem marcapasso; disfunção tireoidiana; hipersensibilidade ao iodo; QT longo",
    adverseReactions: [
      { frequency: "Muito comum", reactions: ["Microdepósitos corneanos", "fotossensibilidade"] },
      { frequency: "Comum", reactions: ["Disfunção tireoidiana (hipo/hiper)", "bradicardia", "elevação de transaminases", "distúrbios GI"] },
      { frequency: "Raro", reactions: ["Fibrose/toxicidade pulmonar", "hepatite", "neuropatia", "torsades de pointes"] },
    ],
    foodInteractions: "Suco de toranja (grapefruit) inibe o CYP3A4 e aumenta a concentração — evitar.",
    labInteractions: "Monitorar TSH/T4L, transaminases, ECG (QT) e função pulmonar (Rx/prova de função).",
    description: "Antiarrítmico com meia-vida muito longa (semanas). Inibe CYP3A4, CYP2C9, CYP2D6 e P-glicoproteína — fonte de múltiplas interações graves.",
  },
  {
    name: "Renitec",
    activeIngredient: "Enalapril",
    therapeuticClass: "Inibidor da ECA (IECA)",
    atcCode: "C09AA02",
    pregnancyCategory: "D",
    lactation: "Compatível em doses usuais; preferir alternativas no neonato prematuro",
    renalAdjustment: "ClCr <30: iniciar 2,5 mg/dia e titular; monitorar K+ e creatinina",
    hepaticAdjustment: "Sem ajuste específico; ativação hepática do pró-fármaco pode estar reduzida",
    geriatricNotes: "Maior risco de hipotensão e hipercalemia; iniciar em dose baixa",
    pediatricNotes: "0,08 mg/kg/dia (máx inicial 5 mg); titular conforme resposta",
    standardPosology: "5-20 mg/dia VO (máx 40 mg/dia), 1-2 tomadas",
    contraindications: "Gestação; angioedema prévio por IECA; estenose bilateral de artéria renal; uso concomitante com alisquireno em diabéticos",
    adverseReactions: [
      { frequency: "Comum", reactions: ["Tosse seca", "hipotensão", "tontura", "hipercalemia"] },
      { frequency: "Incomum", reactions: ["Elevação de creatinina", "cefaleia", "fadiga"] },
      { frequency: "Raro", reactions: ["Angioedema", "neutropenia", "insuficiência renal aguda"] },
    ],
    foodInteractions: "Substitutos de sal contendo potássio (KCl) aumentam risco de hipercalemia — evitar.",
    labInteractions: "Monitorar potássio e creatinina 1-2 semanas após início/ajuste.",
    description: "Pró-fármaco convertido em enalaprilato. Reduz mortalidade na IC e nefroproteção.",
  },
  {
    name: "Aldactone",
    activeIngredient: "Espironolactona",
    therapeuticClass: "Diurético poupador de potássio (antagonista da aldosterona)",
    atcCode: "C03DA01",
    pregnancyCategory: "C",
    lactation: "Compatível (metabólito canrenona em baixa concentração)",
    renalAdjustment: "Evitar se ClCr <30 ou K+ elevado; alto risco de hipercalemia",
    hepaticAdjustment: "Usar com cautela na cirrose (risco de distúrbio hidroeletrolítico e encefalopatia)",
    geriatricNotes: "Monitorização estreita de potássio e função renal",
    pediatricNotes: "1-3 mg/kg/dia divididos; indicação por especialista",
    standardPosology: "25-100 mg/dia VO (IC: 12,5-50 mg/dia)",
    contraindications: "Hipercalemia; insuficiência renal grave; doença de Addison; uso com outros poupadores de potássio",
    adverseReactions: [
      { frequency: "Comum", reactions: ["Hipercalemia", "ginecomastia", "distúrbios menstruais"] },
      { frequency: "Incomum", reactions: ["Hiponatremia", "tontura", "elevação de creatinina"] },
      { frequency: "Raro", reactions: ["Agranulocitose", "hepatotoxicidade"] },
    ],
    foodInteractions: "Alimentos muito ricos em potássio e substitutos de sal — cautela (hipercalemia).",
    labInteractions: "Monitorar potássio, sódio e creatinina.",
    description: "Antagonista mineralocorticoide; reduz mortalidade na IC com fração reduzida.",
  },
  {
    name: "Glifage",
    activeIngredient: "Metformina",
    therapeuticClass: "Antidiabético oral (biguanida)",
    atcCode: "A10BA02",
    pregnancyCategory: "B",
    lactation: "Compatível; monitorar o lactente",
    renalAdjustment: "eGFR 30-45: máx 1000 mg/dia e não iniciar; eGFR <30: CONTRAINDICADO (risco de acidose láctica)",
    hepaticAdjustment: "Evitar na insuficiência hepática (risco de acidose láctica)",
    geriatricNotes: "Avaliar função renal periodicamente; não usar apenas creatinina",
    pediatricNotes: "≥10 anos: iniciar 500 mg/dia, máx 2000 mg/dia",
    standardPosology: "500-850 mg 2-3x/dia com refeições (máx 2550 mg/dia)",
    contraindications: "eGFR <30; acidose metabólica aguda; hipóxia tecidual; uso de contraste iodado (suspender temporariamente)",
    adverseReactions: [
      { frequency: "Muito comum", reactions: ["Diarreia", "náusea", "dor abdominal", "flatulência"] },
      { frequency: "Comum", reactions: ["Disgeusia (gosto metálico)"] },
      { frequency: "Raro", reactions: ["Deficiência de vitamina B12", "acidose láctica"] },
    ],
    foodInteractions: "Tomar com alimentos reduz efeitos GI. Álcool aumenta o risco de acidose láctica — evitar excesso.",
    labInteractions: "Monitorar função renal (eGFR), B12 (uso prolongado) e lactato se suspeita de acidose.",
    description: "Primeira linha no DM2; reduz produção hepática de glicose. Não causa hipoglicemia isolada.",
  },
  {
    name: "Digoxina",
    activeIngredient: "Digoxina",
    therapeuticClass: "Glicosídeo cardíaco (inotrópico)",
    atcCode: "C01AA05",
    pregnancyCategory: "C",
    lactation: "Compatível",
    renalAdjustment: "Reduzir dose e/ou intervalo conforme ClCr (eliminação renal); risco de intoxicação na DRC",
    hepaticAdjustment: "Sem ajuste específico",
    geriatricNotes: "Alta sensibilidade; preferir doses baixas (0,0625-0,125 mg/dia) e monitorar nível",
    pediatricNotes: "Dose por peso/idade com monitorização; janela estreita",
    standardPosology: "0,125-0,25 mg/dia VO; ajustar por nível sérico (alvo 0,5-0,9 ng/mL na IC)",
    contraindications: "Fibrilação ventricular; BAV de 2º-3º grau sem marcapasso; cardiomiopatia hipertrófica obstrutiva; intoxicação digitálica",
    adverseReactions: [
      { frequency: "Comum", reactions: ["Náusea", "vômito", "anorexia", "bradicardia"] },
      { frequency: "Incomum", reactions: ["Distúrbios visuais (halos amarelos/verdes)", "confusão"] },
      { frequency: "Raro", reactions: ["Arritmias graves (sinal de intoxicação)"] },
    ],
    foodInteractions: "Fibras/farelo em excesso reduzem a absorção — separar horários.",
    labInteractions: "Monitorar digoxinemia, potássio, magnésio e função renal (hipocalemia potencializa toxicidade).",
    description: "Substrato de P-glicoproteína; janela terapêutica estreita. Muitas interações elevam seu nível sérico.",
  },
  {
    name: "Cipro",
    activeIngredient: "Ciprofloxacino",
    therapeuticClass: "Antibacteriano fluoroquinolona",
    atcCode: "J01MA02",
    pregnancyCategory: "C",
    lactation: "Usar com cautela; preferir alternativas",
    renalAdjustment: "ClCr 30-50: 250-500 mg 12/12h; ClCr <30: 250-500 mg 18-24h",
    hepaticAdjustment: "Sem ajuste de rotina; cautela na hepatopatia grave",
    geriatricNotes: "Maior risco de tendinopatia, QT longo e efeitos no SNC",
    pediatricNotes: "Uso restrito (risco articular); indicações específicas por peso",
    standardPosology: "250-750 mg VO 12/12h conforme infecção",
    contraindications: "Hipersensibilidade a quinolonas; uso concomitante com tizanidina; história de tendinopatia por quinolona",
    adverseReactions: [
      { frequency: "Comum", reactions: ["Náusea", "diarreia", "cefaleia"] },
      { frequency: "Incomum", reactions: ["Prolongamento do QT", "elevação de transaminases", "tontura"] },
      { frequency: "Raro", reactions: ["Tendinite/ruptura do tendão de Aquiles", "convulsões", "neuropatia periférica"] },
    ],
    foodInteractions: "Laticínios e cátions (Ca, Fe, Mg, Zn, antiácidos) QUELAM o fármaco e reduzem a absorção — separar 2-6 h.",
    labInteractions: "Cautela com ECG (QT). Pode alterar glicemia em diabéticos.",
    description: "Inibidor de CYP1A2; prolonga QT. Fonte relevante de interações (varfarina, teofilina, tizanidina).",
  },
  {
    name: "Prozac",
    activeIngredient: "Fluoxetina",
    therapeuticClass: "Antidepressivo ISRS",
    atcCode: "N06AB03",
    pregnancyCategory: "C",
    lactation: "Preferir alternativas (meia-vida longa; acúmulo no lactente)",
    renalAdjustment: "Sem ajuste de rotina",
    hepaticAdjustment: "Reduzir dose ou espaçar (metabolismo hepático; meia-vida prolongada)",
    geriatricNotes: "Risco de hiponatremia (SIADH) e quedas",
    pediatricNotes: "≥8 anos (depressão/TOC): iniciar 10 mg/dia",
    standardPosology: "20 mg/dia VO (faixa 20-60 mg/dia)",
    contraindications: "Uso com IMAO (intervalo de 14 dias / 5 semanas após fluoxetina); uso com tioridazina/pimozida",
    adverseReactions: [
      { frequency: "Muito comum", reactions: ["Insônia", "cefaleia", "náusea"] },
      { frequency: "Comum", reactions: ["Disfunção sexual", "ansiedade", "sudorese", "anorexia"] },
      { frequency: "Raro", reactions: ["Síndrome serotoninérgica", "hiponatremia", "prolongamento do QT"] },
    ],
    foodInteractions: "Evitar álcool. Sem restrição alimentar significativa.",
    labInteractions: "Monitorar sódio em idosos; ECG se fatores de risco de QT.",
    description: "Inibidor potente de CYP2D6 e CYP2C19; meia-vida longa (metabólito norfluoxetina). Risco serotoninérgico em combinações.",
  },
  {
    name: "Zocor",
    activeIngredient: "Sinvastatina",
    therapeuticClass: "Hipolipemiante (estatina)",
    atcCode: "C10AA01",
    pregnancyCategory: "X",
    lactation: "Contraindicado",
    renalAdjustment: "ClCr <30: iniciar 5 mg/dia com cautela (maior risco de miopatia)",
    hepaticAdjustment: "Contraindicado na hepatopatia ativa; monitorar transaminases",
    geriatricNotes: "Maior risco de miopatia; evitar dose de 80 mg",
    pediatricNotes: "10-17 anos (hipercolesterolemia familiar): 10-40 mg/dia",
    standardPosology: "10-40 mg/dia VO à noite (máx 40 mg com o perfil de interações atual)",
    contraindications: "Gestação/lactação; hepatopatia ativa; uso com inibidores potentes de CYP3A4 (claritromicina, itraconazol, etc.)",
    adverseReactions: [
      { frequency: "Comum", reactions: ["Mialgia", "cefaleia", "distúrbios GI", "elevação de transaminases"] },
      { frequency: "Incomum", reactions: ["Elevação de CK"] },
      { frequency: "Raro", reactions: ["Miopatia/rabdomiólise", "hepatite", "neuropatia"] },
    ],
    foodInteractions: "Suco de toranja (grapefruit) inibe o CYP3A4 e aumenta muito a exposição — evitar.",
    labInteractions: "Monitorar transaminases (basal) e CK se sintomas musculares.",
    description: "Metabolizada por CYP3A4. Risco de rabdomiólise potencializado por inibidores de CYP3A4 e amiodarona.",
  },
  {
    name: "Klaricid",
    activeIngredient: "Claritromicina",
    therapeuticClass: "Antibacteriano macrolídeo",
    atcCode: "J01FA09",
    pregnancyCategory: "C",
    lactation: "Compatível com cautela",
    renalAdjustment: "ClCr <30: reduzir dose em 50%",
    hepaticAdjustment: "Cautela na hepatopatia grave",
    geriatricNotes: "Maior risco de QT longo e interações",
    pediatricNotes: "15 mg/kg/dia divididos 12/12h",
    standardPosology: "500 mg VO 12/12h por 7-14 dias",
    contraindications: "Uso com sinvastatina/lovastatina; QT longo; uso com ergotamínicos, pimozida, colchicina em disfunção renal/hepática",
    adverseReactions: [
      { frequency: "Comum", reactions: ["Náusea", "diarreia", "disgeusia", "dor abdominal"] },
      { frequency: "Incomum", reactions: ["Prolongamento do QT", "elevação de transaminases"] },
      { frequency: "Raro", reactions: ["Hepatotoxicidade", "torsades de pointes", "colite pseudomembranosa"] },
    ],
    foodInteractions: "Pode ser tomada com alimentos. Evitar toranja (efeito aditivo no CYP3A4).",
    labInteractions: "ECG (QT) se fatores de risco; transaminases se uso prolongado.",
    description: "Inibidor potente de CYP3A4 e da P-glicoproteína; prolonga QT. Interações graves com estatinas e digoxina.",
  },
  {
    name: "Losec",
    activeIngredient: "Omeprazol",
    therapeuticClass: "Inibidor da bomba de prótons (IBP)",
    atcCode: "A02BC01",
    pregnancyCategory: "C",
    lactation: "Compatível",
    renalAdjustment: "Sem ajuste",
    hepaticAdjustment: "Reduzir dose na hepatopatia grave (máx ~20 mg/dia)",
    geriatricNotes: "Uso prolongado: risco de hipomagnesemia, fraturas e B12 baixa",
    pediatricNotes: "1-16 anos por peso (5-20 mg/dia)",
    standardPosology: "20-40 mg/dia VO antes do café da manhã",
    contraindications: "Hipersensibilidade; uso com rilpivirina/atazanavir",
    adverseReactions: [
      { frequency: "Comum", reactions: ["Cefaleia", "diarreia", "dor abdominal", "flatulência"] },
      { frequency: "Incomum", reactions: ["Tontura", "elevação de transaminases"] },
      { frequency: "Raro", reactions: ["Hipomagnesemia", "nefrite intersticial", "colite por C. difficile"] },
    ],
    foodInteractions: "Tomar 30-60 min antes das refeições. Reduz a absorção de fármacos dependentes de pH ácido.",
    labInteractions: "Uso prolongado: monitorar magnésio e B12.",
    description: "Inibidor de CYP2C19 — reduz a ativação do clopidogrel. Preferir pantoprazol se antiagregação for essencial.",
  },
  {
    name: "Plavix",
    activeIngredient: "Clopidogrel",
    therapeuticClass: "Antiplaquetário (inibidor de P2Y12)",
    atcCode: "B01AC04",
    pregnancyCategory: "B",
    lactation: "Evitar (dados limitados)",
    renalAdjustment: "Sem ajuste de rotina",
    hepaticAdjustment: "Cautela na hepatopatia grave",
    geriatricNotes: "Maior risco de sangramento",
    pediatricNotes: "Uso não estabelecido de rotina",
    standardPosology: "75 mg/dia VO (ataque 300-600 mg conforme indicação)",
    contraindications: "Sangramento ativo (úlcera péptica, hemorragia intracraniana); hipersensibilidade",
    adverseReactions: [
      { frequency: "Comum", reactions: ["Sangramento", "hematomas", "dispepsia", "diarreia"] },
      { frequency: "Incomum", reactions: ["Rash", "prurido"] },
      { frequency: "Raro", reactions: ["Púrpura trombocitopênica trombótica (PTT)", "neutropenia"] },
    ],
    foodInteractions: "Toranja pode reduzir a ativação; relevância clínica limitada.",
    labInteractions: "Hemograma se suspeita de discrasia.",
    description: "Pró-fármaco ativado por CYP2C19 — inibidores desse CYP (ex.: omeprazol) reduzem sua eficácia.",
  },
  {
    name: "Tramal",
    activeIngredient: "Tramadol",
    therapeuticClass: "Analgésico opioide de ação central",
    atcCode: "N02AX02",
    pregnancyCategory: "C",
    lactation: "Evitar uso crônico",
    renalAdjustment: "ClCr <30: aumentar intervalo (12/12h) e reduzir dose",
    hepaticAdjustment: "Reduzir dose e espaçar (cirrose: 50 mg 12/12h)",
    geriatricNotes: ">75 anos: reduzir dose; risco de confusão e convulsão",
    pediatricNotes: "Não recomendado <12 anos (risco respiratório)",
    standardPosology: "50-100 mg VO 6/6h-8/8h (máx 400 mg/dia)",
    contraindications: "Intoxicação por álcool/hipnóticos/opioides; uso com IMAO; epilepsia não controlada",
    adverseReactions: [
      { frequency: "Muito comum", reactions: ["Náusea", "tontura"] },
      { frequency: "Comum", reactions: ["Cefaleia", "sonolência", "constipação", "boca seca", "sudorese"] },
      { frequency: "Raro", reactions: ["Convulsões", "síndrome serotoninérgica", "depressão respiratória"] },
    ],
    foodInteractions: "Evitar álcool (depressão do SNC).",
    labInteractions: "Sem monitorização laboratorial específica de rotina.",
    description: "Efeito serotoninérgico/noradrenérgico e ↓limiar convulsivo — risco de síndrome serotoninérgica com ISRS/ISRN.",
  },
  {
    name: "Zoloft",
    activeIngredient: "Sertralina",
    therapeuticClass: "Antidepressivo ISRS",
    atcCode: "N06AB06",
    pregnancyCategory: "C",
    lactation: "ISRS de preferência na amamentação (baixa transferência)",
    renalAdjustment: "Sem ajuste",
    hepaticAdjustment: "Reduzir dose na hepatopatia",
    geriatricNotes: "Risco de hiponatremia; iniciar em dose baixa",
    pediatricNotes: "≥6 anos (TOC): iniciar 25 mg/dia",
    standardPosology: "50 mg/dia VO (faixa 50-200 mg/dia)",
    contraindications: "Uso com IMAO ou pimozida",
    adverseReactions: [
      { frequency: "Muito comum", reactions: ["Náusea", "diarreia", "insônia"] },
      { frequency: "Comum", reactions: ["Disfunção sexual", "tremor", "sudorese", "tontura"] },
      { frequency: "Raro", reactions: ["Síndrome serotoninérgica", "hiponatremia", "sangramento (função plaquetária)"] },
    ],
    foodInteractions: "Evitar álcool.",
    labInteractions: "Monitorar sódio em idosos.",
    description: "ISRS com menor perfil de inibição de CYP; ainda assim, risco serotoninérgico em associações.",
  },
  {
    name: "AAS (Aspirina)",
    activeIngredient: "Ácido acetilsalicílico",
    therapeuticClass: "Antiplaquetário / AINE (salicilato)",
    atcCode: "B01AC06",
    pregnancyCategory: "C (D no 3º trimestre)",
    lactation: "Evitar doses analgésicas; dose antiplaquetária com cautela",
    renalAdjustment: "Evitar doses anti-inflamatórias na DRC (risco de LRA)",
    hepaticAdjustment: "Cautela na hepatopatia (sangramento)",
    geriatricNotes: "Maior risco de sangramento GI; associar gastroproteção se necessário",
    pediatricNotes: "Evitar em <16 anos com quadro viral (síndrome de Reye)",
    standardPosology: "Antiplaquetário: 75-100 mg/dia VO. Analgésico/antitérmico: 500-1000 mg 4/4-6/6h",
    contraindications: "Úlcera péptica ativa; discrasias hemorrágicas; hipersensibilidade a AINE; crianças com virose (Reye)",
    adverseReactions: [
      { frequency: "Comum", reactions: ["Dispepsia", "sangramento GI", "náusea"] },
      { frequency: "Incomum", reactions: ["Broncoespasmo (asmáticos)", "urticária"] },
      { frequency: "Raro", reactions: ["Hemorragia digestiva grave", "síndrome de Reye"] },
    ],
    foodInteractions: "Tomar com alimentos para reduzir irritação gástrica. Álcool aumenta risco de sangramento GI.",
    labInteractions: "Cautela com metotrexato (reduz excreção). Pode alterar uricemia.",
    description: "Inibição irreversível da COX-1 plaquetária. Sinergismo hemorrágico com anticoagulantes/antiplaquetários.",
  },
  {
    name: "Cozaar",
    activeIngredient: "Losartana",
    therapeuticClass: "Bloqueador do receptor de angiotensina (BRA)",
    atcCode: "C09CA01",
    pregnancyCategory: "D",
    lactation: "Evitar (dados limitados)",
    renalAdjustment: "Monitorar K+ e creatinina; cautela na estenose de artéria renal",
    hepaticAdjustment: "Reduzir dose inicial para 25 mg (metabolismo hepático)",
    geriatricNotes: "Risco de hipotensão e hipercalemia",
    pediatricNotes: "≥6 anos: 0,7 mg/kg/dia (máx 50 mg)",
    standardPosology: "50 mg/dia VO (faixa 25-100 mg/dia)",
    contraindications: "Gestação; uso com alisquireno em diabéticos; estenose bilateral de artéria renal",
    adverseReactions: [
      { frequency: "Comum", reactions: ["Tontura", "hipotensão", "hipercalemia"] },
      { frequency: "Incomum", reactions: ["Fadiga", "elevação de creatinina"] },
      { frequency: "Raro", reactions: ["Angioedema (raro)", "hepatotoxicidade"] },
    ],
    foodInteractions: "Substitutos de sal com potássio — cautela (hipercalemia).",
    labInteractions: "Monitorar potássio e creatinina.",
    description: "BRA sem tosse típica dos IECA; mesmo risco de hipercalemia e dano fetal.",
  },
  {
    name: "Hidantal",
    activeIngredient: "Fenitoína",
    therapeuticClass: "Anticonvulsivante (hidantoína)",
    atcCode: "N03AB02",
    pregnancyCategory: "D",
    lactation: "Compatível com monitorização do lactente",
    renalAdjustment: "Sem ajuste de dose; interpretar nível livre na hipoalbuminemia",
    hepaticAdjustment: "Reduzir dose (metabolismo hepático saturável)",
    geriatricNotes: "Metabolismo reduzido; monitorar nível sérico",
    pediatricNotes: "5 mg/kg/dia divididos; ajustar por nível",
    standardPosology: "300-400 mg/dia VO; alvo sérico 10-20 mcg/mL (livre 1-2 mcg/mL)",
    contraindications: "Bradicardia sinusal / BAV de 2º-3º grau; porfiria; hipersensibilidade a hidantoínas",
    adverseReactions: [
      { frequency: "Comum", reactions: ["Nistagmo", "ataxia", "hiperplasia gengival", "hirsutismo"] },
      { frequency: "Incomum", reactions: ["Rash", "anemia megaloblástica (folato)"] },
      { frequency: "Raro", reactions: ["Síndrome de Stevens-Johnson/DRESS", "hepatotoxicidade", "discrasias"] },
    ],
    foodInteractions: "Nutrição enteral reduz a absorção — pausar a dieta 1-2 h antes/depois.",
    labInteractions: "Monitorar nível sérico (cinética não linear), hemograma, função hepática.",
    description: "Indutor enzimático potente (CYP3A4/CYP2C9) e cinética saturável; nível fortemente alterado por inibidores como fluoxetina.",
  },
  {
    name: "Zyloric",
    activeIngredient: "Alopurinol",
    therapeuticClass: "Inibidor da xantina oxidase (hipouricemiante)",
    atcCode: "M04AA01",
    pregnancyCategory: "C",
    lactation: "Usar com cautela",
    renalAdjustment: "Reduzir dose conforme ClCr (ex.: ClCr 10-20: ~100-200 mg/dia)",
    hepaticAdjustment: "Cautela; monitorar transaminases",
    geriatricNotes: "Usar menor dose eficaz; maior risco de reações cutâneas",
    pediatricNotes: "Uso em hiperuricemia de malignidades por peso",
    standardPosology: "100-300 mg/dia VO (máx 800 mg/dia), após refeição",
    contraindications: "Hipersensibilidade; crise aguda de gota (não iniciar durante a crise)",
    adverseReactions: [
      { frequency: "Comum", reactions: ["Rash cutâneo", "náusea", "elevação de transaminases"] },
      { frequency: "Incomum", reactions: ["Crise de gota no início do tratamento"] },
      { frequency: "Raro", reactions: ["Síndrome de hipersensibilidade ao alopurinol (SJS/DRESS)", "discrasias"] },
    ],
    foodInteractions: "Tomar após as refeições; boa hidratação.",
    labInteractions: "Monitorar ácido úrico, função renal e hepática.",
    description: "Inibe a xantina oxidase — bloqueia a inativação de mercaptopurina/azatioprina (interação grave).",
  },
  {
    name: "Imuran",
    activeIngredient: "Azatioprina",
    therapeuticClass: "Imunossupressor (antimetabólito)",
    atcCode: "L04AX01",
    pregnancyCategory: "D",
    lactation: "Geralmente evitado; avaliar risco/benefício",
    renalAdjustment: "Reduzir dose na insuficiência renal",
    hepaticAdjustment: "Cautela; risco de hepatotoxicidade",
    geriatricNotes: "Maior risco de mielossupressão",
    pediatricNotes: "Dose por peso sob especialista",
    standardPosology: "1-3 mg/kg/dia VO; avaliar atividade da TPMT antes de iniciar",
    contraindications: "Hipersensibilidade; gravidez (relativo); deficiência grave de TPMT",
    adverseReactions: [
      { frequency: "Comum", reactions: ["Mielossupressão (leucopenia)", "náusea", "vômito"] },
      { frequency: "Incomum", reactions: ["Hepatotoxicidade", "pancreatite"] },
      { frequency: "Raro", reactions: ["Infecções oportunistas", "neoplasias (uso prolongado)"] },
    ],
    foodInteractions: "Tomar com alimentos reduz náusea.",
    labInteractions: "Monitorar hemograma frequentemente; TPMT antes de iniciar; transaminases.",
    description: "Metabolizada a 6-mercaptopurina; a inibição da xantina oxidase (alopurinol) causa acúmulo tóxico.",
  },
  {
    name: "Methotrexato",
    activeIngredient: "Metotrexato",
    therapeuticClass: "Antimetabólito / DMARD (antifolato)",
    atcCode: "L04AX03",
    pregnancyCategory: "X",
    lactation: "Contraindicado",
    renalAdjustment: "Reduzir/evitar conforme ClCr (eliminação renal; risco de toxicidade grave)",
    hepaticAdjustment: "Contraindicado na hepatopatia significativa",
    geriatricNotes: "Maior risco de toxicidade; monitorar função renal",
    pediatricNotes: "Uso oncológico/reumatológico por especialista",
    standardPosology: "Reumatologia: 7,5-25 mg VO/SC UMA VEZ POR SEMANA + ácido fólico",
    contraindications: "Gestação/lactação; hepatopatia/nefropatia grave; imunodeficiência; discrasias; etilismo",
    adverseReactions: [
      { frequency: "Comum", reactions: ["Estomatite", "náusea", "elevação de transaminases", "mielossupressão"] },
      { frequency: "Incomum", reactions: ["Alopecia", "fotossensibilidade"] },
      { frequency: "Raro", reactions: ["Pneumonite", "fibrose hepática", "toxicidade medular grave"] },
    ],
    foodInteractions: "Álcool aumenta hepatotoxicidade — evitar.",
    labInteractions: "Monitorar hemograma, transaminases e função renal periodicamente.",
    description: "Dose SEMANAL (erro de frequência é fatal). AINEs/salicilatos reduzem sua excreção e elevam a toxicidade.",
  },
  {
    name: "Carbolitium",
    activeIngredient: "Lítio",
    therapeuticClass: "Estabilizador do humor",
    atcCode: "N05AN01",
    pregnancyCategory: "D",
    lactation: "Geralmente contraindicado (toxicidade no lactente)",
    renalAdjustment: "Eliminação renal; reduzir dose e monitorar de perto (nefrotóxico)",
    hepaticAdjustment: "Sem ajuste hepático",
    geriatricNotes: "Janela estreita; usar litemia mais baixa e monitorar função renal/tireoide",
    pediatricNotes: "≥7 anos por peso sob especialista",
    standardPosology: "900-1200 mg/dia VO divididos; alvo litemia 0,6-1,0 mEq/L (aguda até 1,2)",
    contraindications: "Insuficiência renal grave; desidratação/depleção de sódio; doença cardiovascular instável",
    adverseReactions: [
      { frequency: "Comum", reactions: ["Tremor fino", "poliúria/polidipsia", "ganho de peso", "hipotireoidismo"] },
      { frequency: "Incomum", reactions: ["Diabetes insipidus nefrogênico", "acne"] },
      { frequency: "Raro", reactions: ["Intoxicação (ataxia, disartria, convulsões)", "nefropatia crônica"] },
    ],
    foodInteractions: "Manter ingestão CONSTANTE de sódio e líquidos; variações (dieta hipossódica, desidratação) alteram a litemia.",
    labInteractions: "Monitorar litemia, função renal, TSH, cálcio, sódio.",
    description: "Janela terapêutica muito estreita; IECA/BRA, tiazídicos e AINEs elevam a litemia por reduzir sua excreção renal.",
  },
  {
    name: "Clorana",
    activeIngredient: "Hidroclorotiazida",
    therapeuticClass: "Diurético tiazídico",
    atcCode: "C03AA03",
    pregnancyCategory: "B",
    lactation: "Compatível; doses altas podem reduzir lactação",
    renalAdjustment: "Pouco eficaz se ClCr <30 (preferir diurético de alça)",
    hepaticAdjustment: "Cautela na cirrose (risco de encefalopatia por distúrbio eletrolítico)",
    geriatricNotes: "Risco de hiponatremia e hipotensão postural",
    pediatricNotes: "1-2 mg/kg/dia por peso",
    standardPosology: "12,5-25 mg/dia VO pela manhã (máx 50 mg/dia)",
    contraindications: "Anúria; hipersensibilidade a sulfonamidas; hipopotassemia/hiponatremia graves",
    adverseReactions: [
      { frequency: "Comum", reactions: ["Hipopotassemia", "hiponatremia", "hiperuricemia", "tontura"] },
      { frequency: "Incomum", reactions: ["Hiperglicemia", "hipercalcemia", "disfunção erétil"] },
      { frequency: "Raro", reactions: ["Pancreatite", "reações cutâneas graves", "fotossensibilidade"] },
    ],
    foodInteractions: "Sem restrição relevante; atentar para reposição de potássio conforme orientação.",
    labInteractions: "Monitorar potássio, sódio, ácido úrico, glicemia e cálcio.",
    description: "Reduz a excreção renal de lítio (eleva a litemia) e causa distúrbios eletrolíticos que potencializam a toxicidade digitálica.",
  },
];

// Interações por par de princípios ativos
type InteractionSeed = {
  a: string;
  b: string;
  severity: Severity;
  mechanism: string;
  clinicalEffect: string;
  recommendation: string;
  reference?: string;
};

const interactions: InteractionSeed[] = [
  {
    a: "Varfarina", b: "Amiodarona", severity: "HIGH",
    mechanism: "Amiodarona inibe CYP2C9 e CYP3A4, reduzindo o metabolismo da varfarina.",
    clinicalEffect: "Aumento do INR e risco de sangramento grave (efeito pode durar semanas pela meia-vida longa da amiodarona).",
    recommendation: "Reduzir a dose da varfarina em ~30-50% ao iniciar amiodarona e monitorar INR de perto por semanas.",
    reference: "Stockley's; bula Anvisa",
  },
  {
    a: "Varfarina", b: "Ciprofloxacino", severity: "HIGH",
    mechanism: "Inibição do metabolismo (CYP1A2/CYP3A4) e alteração da flora intestinal produtora de vitamina K.",
    clinicalEffect: "Elevação do INR com risco aumentado de sangramento.",
    recommendation: "Monitorar INR durante e após o antibiótico; considerar ajuste temporário da varfarina.",
  },
  {
    a: "Varfarina", b: "Fluoxetina", severity: "HIGH",
    mechanism: "Inibição de CYP2C9 pela fluoxetina + efeito antiplaquetário serotoninérgico.",
    clinicalEffect: "Aumento do INR e do risco hemorrágico.",
    recommendation: "Monitorar INR; vigiar sinais de sangramento; considerar antidepressivo de menor interação.",
  },
  {
    a: "Varfarina", b: "Ácido acetilsalicílico", severity: "HIGH",
    mechanism: "Sinergismo: anticoagulação + inibição plaquetária irreversível + lesão de mucosa gástrica pelo AAS.",
    clinicalEffect: "Risco marcadamente elevado de hemorragia, especialmente digestiva.",
    recommendation: "Associar apenas com indicação firme; usar menor dose de AAS, gastroproteção e monitorização rigorosa.",
  },
  {
    a: "Amiodarona", b: "Digoxina", severity: "HIGH",
    mechanism: "Amiodarona inibe a P-glicoproteína e reduz o clearance renal da digoxina.",
    clinicalEffect: "Aumento dos níveis de digoxina (pode dobrar) — risco de intoxicação digitálica e arritmias.",
    recommendation: "Reduzir a dose de digoxina em ~50% e monitorar digoxinemia, ECG e potássio.",
  },
  {
    a: "Amiodarona", b: "Sinvastatina", severity: "HIGH",
    mechanism: "Amiodarona inibe o CYP3A4, elevando a concentração da sinvastatina.",
    clinicalEffect: "Aumento do risco de miopatia e rabdomiólise.",
    recommendation: "Limitar sinvastatina a 20 mg/dia (ou trocar por pravastatina/rosuvastatina); orientar sinais musculares.",
  },
  {
    a: "Amiodarona", b: "Claritromicina", severity: "HIGH",
    mechanism: "Efeito aditivo de prolongamento do intervalo QT + inibição do CYP3A4.",
    clinicalEffect: "Risco de torsades de pointes e arritmias ventriculares.",
    recommendation: "Evitar a associação; se inevitável, monitorar ECG (QT), potássio e magnésio.",
  },
  {
    a: "Sinvastatina", b: "Claritromicina", severity: "HIGH",
    mechanism: "Claritromicina é inibidor potente do CYP3A4, elevando muito a exposição à sinvastatina.",
    clinicalEffect: "Risco elevado de rabdomiólise (associação classicamente contraindicada).",
    recommendation: "Suspender a sinvastatina durante o curso do macrolídeo ou usar azitromicina.",
  },
  {
    a: "Ciprofloxacino", b: "Amiodarona", severity: "HIGH",
    mechanism: "Prolongamento aditivo do intervalo QT.",
    clinicalEffect: "Risco de arritmia ventricular / torsades de pointes.",
    recommendation: "Evitar; se necessário, monitorar ECG e corrigir distúrbios eletrolíticos.",
  },
  {
    a: "Fluoxetina", b: "Tramadol", severity: "HIGH",
    mechanism: "Efeito serotoninérgico aditivo + inibição do CYP2D6 (fluoxetina) e redução do limiar convulsivo.",
    clinicalEffect: "Síndrome serotoninérgica e maior risco de convulsões.",
    recommendation: "Evitar a associação; se usada, atentar para agitação, hipertermia, clônus, e usar menor dose.",
  },
  {
    a: "Sertralina", b: "Tramadol", severity: "HIGH",
    mechanism: "Efeito serotoninérgico aditivo.",
    clinicalEffect: "Risco de síndrome serotoninérgica e convulsões.",
    recommendation: "Evitar ou monitorar rigorosamente; considerar analgésico alternativo.",
  },
  {
    a: "Alopurinol", b: "Azatioprina", severity: "HIGH",
    mechanism: "Alopurinol inibe a xantina oxidase, bloqueando a inativação da 6-mercaptopurina (metabólito da azatioprina).",
    clinicalEffect: "Acúmulo tóxico com mielossupressão grave/pancitopenia.",
    recommendation: "Evitar; se essencial, reduzir a azatioprina em 66-75% e monitorar hemograma de perto.",
  },
  {
    a: "Metotrexato", b: "Ácido acetilsalicílico", severity: "HIGH",
    mechanism: "AAS/AINEs reduzem a secreção tubular renal do metotrexato e o deslocam da albumina.",
    clinicalEffect: "Aumento dos níveis de MTX com toxicidade hematológica e renal (grave em altas doses).",
    recommendation: "Evitar AINEs/AAS em dose analgésica com MTX; monitorar hemograma e função renal.",
  },
  {
    a: "Digoxina", b: "Claritromicina", severity: "HIGH",
    mechanism: "Inibição da P-glicoproteína pela claritromicina, reduzindo o clearance da digoxina.",
    clinicalEffect: "Elevação dos níveis de digoxina e risco de intoxicação.",
    recommendation: "Monitorar digoxinemia e ECG; considerar reduzir a dose de digoxina.",
  },
  {
    a: "Digoxina", b: "Espironolactona", severity: "MEDIUM",
    mechanism: "Espironolactona reduz a depuração da digoxina e pode interferir em imunoensaios; risco eletrolítico associado.",
    clinicalEffect: "Aumento dos níveis de digoxina; potencial toxicidade.",
    recommendation: "Monitorar digoxinemia e potássio; atenção a sinais de intoxicação.",
  },
  {
    a: "Enalapril", b: "Espironolactona", severity: "MEDIUM",
    mechanism: "Efeito aditivo de retenção de potássio (IECA + poupador de potássio).",
    clinicalEffect: "Hipercalemia (pode ser grave em DRC, diabéticos ou idosos).",
    recommendation: "Monitorar potássio e creatinina; evitar suplementos/substitutos de sal com potássio.",
  },
  {
    a: "Losartana", b: "Espironolactona", severity: "MEDIUM",
    mechanism: "Efeito aditivo de retenção de potássio (BRA + poupador de potássio).",
    clinicalEffect: "Hipercalemia.",
    recommendation: "Monitorar potássio e função renal periodicamente.",
  },
  {
    a: "Clopidogrel", b: "Omeprazol", severity: "MEDIUM",
    mechanism: "Omeprazol inibe o CYP2C19, reduzindo a conversão do clopidogrel em metabólito ativo.",
    clinicalEffect: "Possível redução do efeito antiplaquetário e maior risco trombótico.",
    recommendation: "Preferir pantoprazol; separar horários; usar IBP apenas com indicação clara.",
  },
  {
    a: "Enalapril", b: "Lítio", severity: "HIGH",
    mechanism: "IECA reduz a excreção renal de lítio.",
    clinicalEffect: "Aumento da litemia com risco de intoxicação (tremor, ataxia, confusão).",
    recommendation: "Monitorar litemia frequentemente e ajustar a dose de lítio; vigiar função renal.",
  },
  {
    a: "Hidroclorotiazida", b: "Lítio", severity: "HIGH",
    mechanism: "Tiazídicos reduzem a excreção renal de lítio (aumento da reabsorção proximal de sódio/lítio).",
    clinicalEffect: "Elevação da litemia e risco de intoxicação.",
    recommendation: "Evitar ou monitorar litemia de perto com ajuste de dose; manter hidratação e sódio estáveis.",
  },
  {
    a: "Fenitoína", b: "Fluoxetina", severity: "MEDIUM",
    mechanism: "Fluoxetina inibe o CYP2C9/CYP2C19, reduzindo o metabolismo da fenitoína (cinética saturável).",
    clinicalEffect: "Aumento do nível de fenitoína com risco de toxicidade (nistagmo, ataxia, sedação).",
    recommendation: "Monitorar nível sérico de fenitoína e sinais de toxicidade; ajustar dose.",
  },
  {
    a: "Ácido acetilsalicílico", b: "Clopidogrel", severity: "MEDIUM",
    mechanism: "Sinergismo antiplaquetário (COX-1 + P2Y12).",
    clinicalEffect: "Maior risco de sangramento — associação frequentemente intencional (dupla antiagregação).",
    recommendation: "Quando indicada, limitar a duração conforme protocolo e considerar gastroproteção.",
  },
];

// Sincroniza o catálogo base num banco JÁ populado: adiciona medicamentos
// que ainda não existem e NÃO sobrescreve os já cadastrados (preserva curadoria
// e dados do usuário). Idempotente — seguro para rodar em toda publicação.
async function syncBaseCatalog() {
  const existing = await prisma.drug.findMany({ select: { activeIngredient: true } });
  const have = new Set(existing.map((d) => d.activeIngredient));
  const missing = ALL_BASE.filter((b) => !have.has(b.ai));
  // Insere em lotes (evita limite de parâmetros do Postgres em grandes volumes).
  const CHUNK = 500;
  for (let i = 0; i < missing.length; i += CHUNK) {
    const batch = missing.slice(i, i + CHUNK);
    await prisma.drug.createMany({
      data: batch.map((b) => ({
        name: b.ai,
        activeIngredient: b.ai,
        therapeuticClass: b.tc,
        atcCode: b.atc ?? null,
        pregnancyCategory: b.preg ?? null,
        source: "MANUAL",
        reviewed: false,
      })),
    });
  }
  const total = await prisma.drug.count();
  console.log(`Catálogo sincronizado: +${missing.length} novos. Total no banco: ${total}.`);
}

// Adiciona interações que ainda não existem (sem apagar/duplicar), num banco já populado.
async function syncInteractions() {
  const drugs = await prisma.drug.findMany({ select: { id: true, activeIngredient: true } });
  const idByAi = new Map(drugs.map((d) => [d.activeIngredient, d.id]));
  const existing = await prisma.drugInteraction.findMany({ select: { drugAId: true, drugBId: true } });
  const havePair = new Set(existing.map((e) => [e.drugAId, e.drugBId].sort().join("|")));
  const toCreate: {
    drugAId: string; drugBId: string; severity: any;
    mechanism: string; clinicalEffect: string; recommendation: string; reference: string | null;
  }[] = [];
  const seen = new Set<string>();
  for (const it of ALL_INTERACTIONS_BASE) {
    const aId = idByAi.get(it.a);
    const bId = idByAi.get(it.b);
    if (!aId || !bId) continue; // fármaco ausente no catálogo — ignora
    const [x, y] = aId < bId ? [aId, bId] : [bId, aId];
    const key = `${x}|${y}`;
    if (seen.has(key) || havePair.has(key)) continue;
    seen.add(key);
    toCreate.push({
      drugAId: x, drugBId: y, severity: it.severity,
      mechanism: it.mechanism, clinicalEffect: it.clinicalEffect,
      recommendation: it.recommendation, reference: it.reference ?? null,
    });
  }
  if (toCreate.length > 0) await prisma.drugInteraction.createMany({ data: toCreate });
  const total = await prisma.drugInteraction.count();
  console.log(`Interações sincronizadas: +${toCreate.length} novas. Total: ${total}.`);
}

async function main() {
  // Proteção: só popula se o banco estiver vazio (evita apagar dados em
  // publicações futuras). Use SEED_FORCE=1 para forçar o repopulamento.
  const existing = await prisma.drug.count().catch(() => 0);
  if (existing > 0 && !process.env.SEED_FORCE) {
    console.log(`Banco já possui ${existing} medicamentos — fazendo apenas sincronização do catálogo e interações (sem apagar).`);
    await syncBaseCatalog();
    await syncInteractions();
    return;
  }

  console.log("Limpando dados anteriores...");
  await prisma.clinicalNote.deleteMany();
  await prisma.pharmaceuticalIntervention.deleteMany();
  await prisma.drugInteraction.deleteMany();
  await prisma.drug.deleteMany();

  console.log(`Inserindo ${drugs.length} medicamentos...`);
  const idByIngredient = new Map<string, string>();
  for (const d of drugs) {
    const created = await prisma.drug.create({
      data: {
        name: d.name,
        activeIngredient: d.activeIngredient,
        therapeuticClass: d.therapeuticClass,
        atcCode: d.atcCode,
        pregnancyCategory: d.pregnancyCategory,
        lactation: d.lactation,
        renalAdjustment: d.renalAdjustment,
        hepaticAdjustment: d.hepaticAdjustment,
        geriatricNotes: d.geriatricNotes,
        pediatricNotes: d.pediatricNotes,
        standardPosology: d.standardPosology,
        contraindications: d.contraindications,
        adverseReactions: d.adverseReactions ? JSON.stringify(d.adverseReactions) : null,
        foodInteractions: d.foodInteractions,
        labInteractions: d.labInteractions,
        description: d.description,
        source: "MANUAL",
        reviewed: true,
        reviewedBy: "Seed clínico curado",
      },
    });
    idByIngredient.set(d.activeIngredient, created.id);
  }

  console.log(`Inserindo catálogo base (DCB/RENAME)...`);
  let baseCount = 0;
  for (const b of ALL_BASE) {
    if (idByIngredient.has(b.ai)) continue; // já existe (curado)
    const created = await prisma.drug.create({
      data: {
        name: b.ai, // genérico (DCB) como nome de referência
        activeIngredient: b.ai,
        therapeuticClass: b.tc,
        atcCode: b.atc ?? null,
        pregnancyCategory: b.preg ?? null,
        source: "MANUAL",
        reviewed: false, // campos clínicos pendentes de curadoria
      },
    });
    idByIngredient.set(b.ai, created.id);
    baseCount++;
  }
  console.log(`  ${baseCount} medicamentos do catálogo base inseridos.`);

  console.log(`Inserindo interações...`);
  let count = 0;
  const seen = new Set<string>();
  for (const it of [...interactions, ...ALL_INTERACTIONS_BASE]) {
    const aId = idByIngredient.get(it.a);
    const bId = idByIngredient.get(it.b);
    if (!aId || !bId) {
      console.warn(`  ! Ignorada (fármaco ausente): ${it.a} x ${it.b}`);
      continue;
    }
    // normaliza par para evitar duplicidade A-B / B-A
    const [x, y] = aId < bId ? [aId, bId] : [bId, aId];
    const key = `${x}|${y}`;
    if (seen.has(key)) continue;
    seen.add(key);
    await prisma.drugInteraction.create({
      data: {
        drugAId: x,
        drugBId: y,
        severity: it.severity,
        mechanism: it.mechanism,
        clinicalEffect: it.clinicalEffect,
        recommendation: it.recommendation,
        reference: it.reference,
      },
    });
    count++;
  }
  console.log(`  ${count} interações inseridas.`);

  console.log("Inserindo exemplos de intervenção farmacêutica...");
  const varf = idByIngredient.get("Varfarina");
  await prisma.pharmaceuticalIntervention.create({
    data: {
      patientRef: "PAC-0001",
      drugId: varf,
      drugName: "Varfarina",
      prmType: "INTERACAO",
      description: "Paciente em uso de varfarina teve amiodarona prescrita; INR em elevação (4,8).",
      recommendation: "Sugerida redução de 50% na dose de varfarina e reavaliação do INR em 3 dias.",
      doctorAcceptance: "ACCEPTED",
      status: "MONITORING",
      author: "Farmacêutico clínico",
      notes: { create: [{ text: "Médico concordou; nova coleta de INR agendada.", author: "Farmacêutico clínico" }] },
    },
  });

  console.log("Seed concluído com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
