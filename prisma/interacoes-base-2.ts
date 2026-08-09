// Segundo lote de interações — mesmos critérios do primeiro: fatos consolidados
// e fontes abertas/oficiais (bulas Anvisa/FDA-DailyMed, dados abertos, literatura).
// NÃO reproduz bases proprietárias. Validar contra a fonte oficial antes do uso.
import type { InteractionSeedItem } from "./interacoes-base";

const REF = "Fatos consolidados; validar em bula (Anvisa/FDA-DailyMed) e referência clínica.";

export const INTERACTIONS_BASE_2: InteractionSeedItem[] = [
  // ===== ESTATINAS (mais inibidores CYP3A4/CYP2C9) =====
  { a: "Atorvastatina", b: "Fluconazol", severity: "MEDIUM", mechanism: "Inibição de CYP3A4.", clinicalEffect: "Maior risco de miopatia.", recommendation: "Monitorar sintomas musculares/CK; limitar dose.", reference: REF },
  { a: "Sinvastatina", b: "Fluconazol", severity: "HIGH", mechanism: "Inibição de CYP3A4.", clinicalEffect: "Miopatia/rabdomiólise.", recommendation: "Evitar; suspender a estatina durante o antifúngico.", reference: REF },
  { a: "Atorvastatina", b: "Diltiazem", severity: "MEDIUM", mechanism: "Inibição de CYP3A4.", clinicalEffect: "Maior exposição à atorvastatina; miopatia.", recommendation: "Monitorar; limitar dose.", reference: REF },
  { a: "Atorvastatina", b: "Ciclosporina", severity: "HIGH", mechanism: "Inibição de CYP3A4/OATP1B1.", clinicalEffect: "Risco elevado de miopatia/rabdomiólise.", recommendation: "Evitar; usar menor dose de estatina compatível.", reference: REF },
  { a: "Sinvastatina", b: "Colchicina", severity: "MEDIUM", mechanism: "Miotoxicidade aditiva.", clinicalEffect: "Miopatia.", recommendation: "Monitorar; cautela em idosos/DRC.", reference: REF },
  { a: "Colchicina", b: "Ciclosporina", severity: "HIGH", mechanism: "Ciclosporina inibe P-gp/CYP3A4, aumentando a colchicina.", clinicalEffect: "Toxicidade grave por colchicina.", recommendation: "Evitar; reduzir muito a dose se inevitável.", reference: REF },

  // ===== AZÓIS + SUBSTRATOS =====
  { a: "Itraconazol", b: "Midazolam", severity: "HIGH", mechanism: "Inibição potente de CYP3A4.", clinicalEffect: "Sedação prolongada/depressão respiratória.", recommendation: "Evitar midazolam oral; ajustar/monitorar.", reference: REF },
  { a: "Claritromicina", b: "Midazolam", severity: "HIGH", mechanism: "Inibição de CYP3A4.", clinicalEffect: "Sedação intensa e prolongada.", recommendation: "Evitar; preferir azitromicina.", reference: REF },
  { a: "Fluconazol", b: "Fenitoína", severity: "MEDIUM", mechanism: "Inibição de CYP2C9.", clinicalEffect: "↑nível de fenitoína; toxicidade.", recommendation: "Monitorar nível sérico.", reference: REF },
  { a: "Fluconazol", b: "Ciclosporina", severity: "HIGH", mechanism: "Inibição de CYP3A4.", clinicalEffect: "↑ciclosporina; nefrotoxicidade.", recommendation: "Monitorar nível e função renal.", reference: REF },
  { a: "Itraconazol", b: "Tacrolimo", severity: "HIGH", mechanism: "Inibição de CYP3A4.", clinicalEffect: "↑tacrolimo; nefro/neurotoxicidade.", recommendation: "Monitorar nível; ajustar dose.", reference: REF },
  { a: "Itraconazol", b: "Digoxina", severity: "MEDIUM", mechanism: "Inibição da P-glicoproteína.", clinicalEffect: "↑digoxina.", recommendation: "Monitorar digoxinemia.", reference: REF },

  // ===== INDUTOR: RIFAMPICINA / CARBAMAZEPINA / FENITOÍNA =====
  { a: "Rifampicina", b: "Sinvastatina", severity: "MEDIUM", mechanism: "Indução de CYP3A4.", clinicalEffect: "Redução do efeito hipolipemiante.", recommendation: "Monitorar lipídios; ajustar.", reference: REF },
  { a: "Rifampicina", b: "Glibenclamida", severity: "MEDIUM", mechanism: "Indução enzimática.", clinicalEffect: "Perda do controle glicêmico.", recommendation: "Monitorar glicemia; ajustar dose.", reference: REF },
  { a: "Rifampicina", b: "Quetiapina", severity: "MEDIUM", mechanism: "Indução de CYP3A4.", clinicalEffect: "Subterapêutico.", recommendation: "Ajustar dose; monitorar resposta.", reference: REF },
  { a: "Rifampicina", b: "Itraconazol", severity: "HIGH", mechanism: "Indução reduz o antifúngico; azol inibe a rifampicina.", clinicalEffect: "Falha antifúngica.", recommendation: "Evitar a associação.", reference: REF },
  { a: "Carbamazepina", b: "Quetiapina", severity: "MEDIUM", mechanism: "Indução de CYP3A4.", clinicalEffect: "Redução do efeito da quetiapina.", recommendation: "Ajustar dose.", reference: REF },
  { a: "Carbamazepina", b: "Varfarina", severity: "MEDIUM", mechanism: "Indução enzimática.", clinicalEffect: "↓INR (risco trombótico); ↑ao suspender.", recommendation: "Monitorar INR ao iniciar/suspender.", reference: REF },
  { a: "Carbamazepina", b: "Haloperidol", severity: "MEDIUM", mechanism: "Indução de CYP3A4.", clinicalEffect: "Redução do efeito antipsicótico.", recommendation: "Monitorar; ajustar dose.", reference: REF },
  { a: "Fenitoína", b: "Ciclosporina", severity: "MEDIUM", mechanism: "Indução enzimática reduz a ciclosporina.", clinicalEffect: "Subterapêutico; risco de rejeição.", recommendation: "Monitorar nível; ajustar.", reference: REF },
  { a: "Fenitoína", b: "Prednisona", severity: "MEDIUM", mechanism: "Indução acelera o metabolismo do corticoide.", clinicalEffect: "Redução do efeito do corticoide.", recommendation: "Ajustar dose do corticoide.", reference: REF },

  // ===== QT (novos pares) =====
  { a: "Haloperidol", b: "Ondansetrona", severity: "MEDIUM", mechanism: "Prolongamento aditivo do QT.", clinicalEffect: "Risco de arritmia.", recommendation: "Monitorar ECG em pacientes de risco.", reference: REF },
  { a: "Escitalopram", b: "Amiodarona", severity: "HIGH", mechanism: "QT aditivo.", clinicalEffect: "Torsades de pointes.", recommendation: "Evitar; monitorar ECG.", reference: REF },
  { a: "Domperidona", b: "Claritromicina", severity: "HIGH", mechanism: "Inibição de CYP3A4 + QT aditivo.", clinicalEffect: "Prolongamento do QT.", recommendation: "Evitar a associação.", reference: REF },
  { a: "Quetiapina", b: "Amiodarona", severity: "MEDIUM", mechanism: "QT aditivo.", clinicalEffect: "Prolongamento do QT.", recommendation: "Cautela; monitorar ECG.", reference: REF },
  { a: "Haloperidol", b: "Fluoxetina", severity: "MEDIUM", mechanism: "Fluoxetina inibe CYP2D6 (↑haloperidol) + QT.", clinicalEffect: "↑efeitos extrapiramidais/QT.", recommendation: "Monitorar; ajustar dose.", reference: REF },
  { a: "Azitromicina", b: "Amiodarona", severity: "HIGH", mechanism: "QT aditivo.", clinicalEffect: "Arritmia ventricular.", recommendation: "Evitar; monitorar ECG.", reference: REF },

  // ===== SEROTONINÉRGICOS / LINEZOLIDA =====
  { a: "Linezolida", b: "Fluoxetina", severity: "HIGH", mechanism: "Linezolida tem ação IMAO; efeito serotoninérgico aditivo.", clinicalEffect: "Síndrome serotoninérgica.", recommendation: "Evitar; respeitar intervalo de washout.", reference: REF },
  { a: "Linezolida", b: "Sertralina", severity: "HIGH", mechanism: "Ação IMAO + serotoninérgico.", clinicalEffect: "Síndrome serotoninérgica.", recommendation: "Evitar a associação.", reference: REF },
  { a: "Linezolida", b: "Tramadol", severity: "HIGH", mechanism: "Ação IMAO + serotoninérgico/convulsivo.", clinicalEffect: "Síndrome serotoninérgica; convulsões.", recommendation: "Evitar.", reference: REF },
  { a: "Sumatriptano", b: "Sertralina", severity: "MEDIUM", mechanism: "Efeito serotoninérgico aditivo.", clinicalEffect: "Risco de síndrome serotoninérgica.", recommendation: "Cautela; orientar sinais de alerta.", reference: REF },
  { a: "Escitalopram", b: "Tramadol", severity: "HIGH", mechanism: "Serotoninérgico + ↓limiar convulsivo.", clinicalEffect: "Síndrome serotoninérgica; convulsões.", recommendation: "Evitar; analgésico alternativo.", reference: REF },

  // ===== VARFARINA (novos) =====
  { a: "Varfarina", b: "Azitromicina", severity: "MEDIUM", mechanism: "Alteração da flora e possível efeito no INR.", clinicalEffect: "Possível ↑INR.", recommendation: "Monitorar INR.", reference: REF },
  { a: "Varfarina", b: "Paracetamol", severity: "MEDIUM", mechanism: "Uso regular de altas doses pode elevar o INR.", clinicalEffect: "↑INR (uso crônico de dose alta).", recommendation: "Monitorar INR se uso frequente de paracetamol.", reference: REF },
  { a: "Varfarina", b: "Alopurinol", severity: "MEDIUM", mechanism: "Inibição do metabolismo da varfarina.", clinicalEffect: "Possível ↑INR.", recommendation: "Monitorar INR.", reference: REF },
  { a: "Varfarina", b: "Levotiroxina sódica", severity: "MEDIUM", mechanism: "Aumento do catabolismo de fatores de coagulação (mais efeito anticoagulante).", clinicalEffect: "↑INR ao iniciar/ajustar levotiroxina.", recommendation: "Monitorar INR quando ajustar a tireoide.", reference: REF },
  { a: "Varfarina", b: "Prednisona", severity: "MEDIUM", mechanism: "Corticoide pode alterar resposta anticoagulante e lesar mucosa.", clinicalEffect: "Variação do INR; risco GI.", recommendation: "Monitorar INR; gastroproteção.", reference: REF },
  { a: "Varfarina", b: "Naproxeno", severity: "HIGH", mechanism: "AINE: antiagregação + lesão gástrica.", clinicalEffect: "Sangramento GI.", recommendation: "Evitar; preferir paracetamol.", reference: REF },

  // ===== BETABLOQUEADOR + BLOQUEADOR DE CÁLCIO (não di-hidropiridínico) =====
  { a: "Atenolol", b: "Verapamil", severity: "HIGH", mechanism: "Depressão aditiva da condução AV e inotropismo.", clinicalEffect: "Bradicardia, bloqueio AV, hipotensão.", recommendation: "Evitar; se necessário, monitorar ECG/FC.", reference: REF },
  { a: "Metoprolol", b: "Verapamil", severity: "HIGH", mechanism: "Bradicardia/bloqueio aditivos + inibição de CYP2D6.", clinicalEffect: "Bradicardia grave, hipotensão.", recommendation: "Evitar a associação.", reference: REF },
  { a: "Bisoprolol", b: "Diltiazem", severity: "MEDIUM", mechanism: "Depressão aditiva da condução AV.", clinicalEffect: "Bradicardia/bloqueio.", recommendation: "Monitorar FC/ECG.", reference: REF },
  { a: "Amiodarona", b: "Atenolol", severity: "MEDIUM", mechanism: "Bradicardia aditiva.", clinicalEffect: "Bradicardia/bloqueio.", recommendation: "Monitorar FC/ECG.", reference: REF },
  { a: "Amiodarona", b: "Diltiazem", severity: "MEDIUM", mechanism: "Depressão aditiva da condução.", clinicalEffect: "Bradicardia/bloqueio.", recommendation: "Monitorar ECG.", reference: REF },
  { a: "Digoxina", b: "Propafenona", severity: "MEDIUM", mechanism: "Propafenona reduz o clearance da digoxina.", clinicalEffect: "↑digoxina.", recommendation: "Reduzir digoxina; monitorar.", reference: REF },

  // ===== POTÁSSIO / RENAL (novos) =====
  { a: "Losartana", b: "Cloreto de potássio", severity: "HIGH", mechanism: "BRA + reposição de potássio.", clinicalEffect: "Hipercalemia.", recommendation: "Evitar; monitorar K+.", reference: REF },
  { a: "Enalapril", b: "Cloreto de potássio", severity: "HIGH", mechanism: "IECA + reposição de potássio.", clinicalEffect: "Hipercalemia.", recommendation: "Evitar; monitorar K+.", reference: REF },
  { a: "Espironolactona", b: "Diclofenaco", severity: "MEDIUM", mechanism: "AINE reduz função renal e potencializa hipercalemia.", clinicalEffect: "Hipercalemia/piora renal.", recommendation: "Evitar; monitorar K+/creatinina.", reference: REF },
  { a: "Lítio", b: "Diclofenaco", severity: "MEDIUM", mechanism: "AINE reduz excreção renal de lítio.", clinicalEffect: "↑litemia.", recommendation: "Evitar; monitorar litemia.", reference: REF },
  { a: "Furosemida", b: "Lítio", severity: "MEDIUM", mechanism: "Alteração da excreção renal de lítio.", clinicalEffect: "Variação da litemia.", recommendation: "Monitorar litemia.", reference: REF },

  // ===== ALFABLOQUEADOR + PDE5 / ANTI-HIPERTENSIVOS =====
  { a: "Tadalafila", b: "Doxazosina", severity: "MEDIUM", mechanism: "Vasodilatação aditiva.", clinicalEffect: "Hipotensão postural.", recommendation: "Iniciar com doses baixas; espaçar.", reference: REF },
  { a: "Sildenafila", b: "Doxazosina", severity: "MEDIUM", mechanism: "Vasodilatação aditiva.", clinicalEffect: "Hipotensão.", recommendation: "Cautela; espaçar as tomadas.", reference: REF },
  { a: "Tadalafila", b: "Nitroprusseto de sódio", severity: "HIGH", mechanism: "Vasodilatação por NO potencializada.", clinicalEffect: "Hipotensão grave.", recommendation: "Contraindicado.", reference: REF },

  // ===== ANTIDIABÉTICOS / GLICEMIA =====
  { a: "Prednisona", b: "Metformina", severity: "MEDIUM", mechanism: "Corticoide eleva a glicemia, antagonizando o antidiabético.", clinicalEffect: "Hiperglicemia.", recommendation: "Monitorar glicemia; ajustar tratamento.", reference: REF },
  { a: "Prednisona", b: "Glibenclamida", severity: "MEDIUM", mechanism: "Efeito hiperglicemiante do corticoide.", clinicalEffect: "Perda do controle glicêmico.", recommendation: "Monitorar glicemia.", reference: REF },
  { a: "Hidroclorotiazida", b: "Glibenclamida", severity: "LOW", mechanism: "Tiazídico pode elevar a glicemia.", clinicalEffect: "Redução do controle glicêmico.", recommendation: "Monitorar glicemia.", reference: REF },

  // ===== METOCLOPRAMIDA / DOPAMINÉRGICOS =====
  { a: "Metoclopramida", b: "Levodopa + carbidopa", severity: "MEDIUM", mechanism: "Antagonismo dopaminérgico central.", clinicalEffect: "Piora do parkinsonismo e ↓efeito da levodopa.", recommendation: "Evitar; usar domperidona se necessário.", reference: REF },
  { a: "Metoclopramida", b: "Haloperidol", severity: "MEDIUM", mechanism: "Bloqueio dopaminérgico aditivo.", clinicalEffect: "Sintomas extrapiramidais.", recommendation: "Evitar associação prolongada.", reference: REF },

  // ===== METOTREXATO / ANTIBIÓTICOS =====
  { a: "Metotrexato", b: "Amoxicilina", severity: "MEDIUM", mechanism: "Penicilinas reduzem a secreção tubular renal do MTX.", clinicalEffect: "↑MTX; toxicidade (altas doses).", recommendation: "Monitorar em ciclos de alta dose.", reference: REF },
  { a: "Metotrexato", b: "Ciprofloxacino", severity: "MEDIUM", mechanism: "Redução da eliminação renal do MTX.", clinicalEffect: "↑níveis de MTX.", recommendation: "Cautela; monitorar hemograma.", reference: REF },

  // ===== CLOPIDOGREL (novos) =====
  { a: "Clopidogrel", b: "Fluconazol", severity: "MEDIUM", mechanism: "Inibição de CYP2C19 reduz a ativação do clopidogrel.", clinicalEffect: "Menor efeito antiplaquetário.", recommendation: "Preferir antifúngico alternativo se possível.", reference: REF },
  { a: "Clopidogrel", b: "Fluoxetina", severity: "MEDIUM", mechanism: "Inibição de CYP2C19.", clinicalEffect: "↓ativação do clopidogrel.", recommendation: "Considerar antidepressivo alternativo.", reference: REF },
  { a: "Clopidogrel", b: "Naproxeno", severity: "MEDIUM", mechanism: "Antiagregação + lesão de mucosa.", clinicalEffect: "Sangramento GI.", recommendation: "Evitar AINE; gastroproteção.", reference: REF },

  // ===== IBP / ABSORÇÃO =====
  { a: "Omeprazol", b: "Itraconazol", severity: "MEDIUM", mechanism: "↓acidez reduz a absorção do itraconazol (cápsula).", clinicalEffect: "Falha antifúngica.", recommendation: "Usar solução oral ou alternativa.", reference: REF },
  { a: "Omeprazol", b: "Cetoconazol", severity: "MEDIUM", mechanism: "↓acidez reduz absorção.", clinicalEffect: "Falha antifúngica.", recommendation: "Evitar; alternativa antifúngica.", reference: REF },

  // ===== DEPRESSÃO DO SNC (novos) =====
  { a: "Diazepam", b: "Codeína", severity: "MEDIUM", mechanism: "Depressão aditiva do SNC.", clinicalEffect: "Sedação/depressão respiratória.", recommendation: "Cautela; evitar em idosos/DPOC.", reference: REF },
  { a: "Tramadol", b: "Fluoxetina", severity: "HIGH", mechanism: "(reforço) serotoninérgico + inibição de CYP2D6.", clinicalEffect: "Síndrome serotoninérgica; menor analgesia.", recommendation: "Evitar; analgésico alternativo.", reference: REF },
  { a: "Morfina", b: "Diazepam", severity: "HIGH", mechanism: "Depressão respiratória aditiva.", clinicalEffect: "Depressão respiratória.", recommendation: "Evitar; menor dose e monitorização.", reference: REF },
];
