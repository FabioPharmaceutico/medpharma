// Base de interações medicamentosas — REDIGIDA a partir de fatos farmacológicos
// consolidados e fontes ABERTAS/oficiais (bulas FDA/DailyMed, bulário Anvisa,
// dados abertos DrugBank/DDInter, literatura). NÃO reproduz conteúdo proprietário
// (ex.: Micromedex/Stockley). Os fatos farmacológicos não são protegidos por
// direito autoral; ainda assim, cada item DEVE ser validado por farmacêutico
// contra a fonte oficial antes de uso assistencial (campo reviewed/aviso do app).
//
// Os nomes em `a`/`b` devem casar com o princípio ativo do catálogo (DCB).

export type InteractionSeedItem = {
  a: string;
  b: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  mechanism: string;
  clinicalEffect: string;
  recommendation: string;
  reference?: string;
};

const REF = "Fatos consolidados; validar em bula (Anvisa/FDA-DailyMed) e referência clínica.";

export const INTERACTIONS_BASE: InteractionSeedItem[] = [
  // ================= ANTICOAGULANTES / ANTIPLAQUETÁRIOS =================
  { a: "Varfarina", b: "Fluconazol", severity: "HIGH", mechanism: "Fluconazol inibe CYP2C9, reduzindo o metabolismo da varfarina.", clinicalEffect: "Aumento do INR e risco de sangramento.", recommendation: "Monitorar INR; reduzir dose da varfarina; considerar antifúngico alternativo.", reference: REF },
  { a: "Varfarina", b: "Sulfametoxazol + trimetoprima", severity: "HIGH", mechanism: "Inibição do CYP2C9 e deslocamento da ligação proteica.", clinicalEffect: "Elevação acentuada do INR; sangramento.", recommendation: "Evitar; se necessário, monitorar INR de perto e ajustar dose.", reference: REF },
  { a: "Varfarina", b: "Metronidazol", severity: "HIGH", mechanism: "Inibição do metabolismo (CYP2C9) da varfarina.", clinicalEffect: "Aumento do INR e risco hemorrágico.", recommendation: "Monitorar INR; reduzir dose conforme necessário.", reference: REF },
  { a: "Varfarina", b: "Levofloxacino", severity: "MEDIUM", mechanism: "Alteração da flora intestinal e possível inibição metabólica.", clinicalEffect: "Possível aumento do INR.", recommendation: "Monitorar INR durante e após o antibiótico.", reference: REF },
  { a: "Varfarina", b: "Ibuprofeno", severity: "HIGH", mechanism: "Efeito antiplaquetário e lesão de mucosa gástrica somados à anticoagulação.", clinicalEffect: "Risco elevado de sangramento gastrointestinal.", recommendation: "Evitar AINEs; preferir paracetamol; gastroproteção se inevitável.", reference: REF },
  { a: "Varfarina", b: "Diclofenaco", severity: "HIGH", mechanism: "AINE: efeito antiplaquetário + irritação gástrica.", clinicalEffect: "Maior risco de hemorragia digestiva.", recommendation: "Evitar; usar analgésico alternativo.", reference: REF },
  { a: "Varfarina", b: "Amiodarona", severity: "HIGH", mechanism: "Amiodarona inibe CYP2C9/3A4 (efeito prolongado).", clinicalEffect: "Aumento do INR por semanas.", recommendation: "Reduzir varfarina ~30-50% e monitorar INR.", reference: REF },
  { a: "Varfarina", b: "Miconazol", severity: "HIGH", mechanism: "Inibição potente do CYP2C9 (mesmo gel oral/tópico com absorção).", clinicalEffect: "Elevação importante do INR.", recommendation: "Evitar; monitorar INR.", reference: REF },
  { a: "Rivaroxabana", b: "Cetoconazol", severity: "HIGH", mechanism: "Inibição de CYP3A4 e P-glicoproteína aumenta a exposição à rivaroxabana.", clinicalEffect: "Maior risco de sangramento.", recommendation: "Evitar uso concomitante com azólicos sistêmicos potentes.", reference: REF },
  { a: "Rivaroxabana", b: "Itraconazol", severity: "HIGH", mechanism: "Inibição de CYP3A4/P-gp.", clinicalEffect: "Aumento do efeito anticoagulante e sangramento.", recommendation: "Evitar a associação.", reference: REF },
  { a: "Rivaroxabana", b: "Claritromicina", severity: "MEDIUM", mechanism: "Inibição de CYP3A4/P-gp.", clinicalEffect: "Possível aumento da exposição à rivaroxabana.", recommendation: "Cautela; preferir azitromicina.", reference: REF },
  { a: "Apixabana", b: "Itraconazol", severity: "HIGH", mechanism: "Inibição de CYP3A4/P-gp aumenta a apixabana.", clinicalEffect: "Risco de sangramento.", recommendation: "Evitar; ajustar/contraindicar conforme bula.", reference: REF },
  { a: "Dabigatrana", b: "Claritromicina", severity: "MEDIUM", mechanism: "Inibição da P-glicoproteína.", clinicalEffect: "Aumento dos níveis de dabigatrana.", recommendation: "Cautela; monitorar sinais de sangramento.", reference: REF },
  { a: "Dabigatrana", b: "Rivaroxabana", severity: "HIGH", mechanism: "Dois anticoagulantes orais somados.", clinicalEffect: "Risco hemorrágico aditivo.", recommendation: "Não associar (exceto transição planejada).", reference: REF },
  { a: "Varfarina", b: "Rivaroxabana", severity: "HIGH", mechanism: "Anticoagulação aditiva.", clinicalEffect: "Sangramento grave.", recommendation: "Não usar juntos, salvo transição controlada.", reference: REF },
  { a: "Clopidogrel", b: "Omeprazol", severity: "MEDIUM", mechanism: "Omeprazol inibe CYP2C19, reduzindo a ativação do clopidogrel.", clinicalEffect: "Redução do efeito antiplaquetário.", recommendation: "Preferir pantoprazol.", reference: REF },
  { a: "Clopidogrel", b: "Esomeprazol", severity: "MEDIUM", mechanism: "Inibição de CYP2C19.", clinicalEffect: "Menor ativação do clopidogrel.", recommendation: "Preferir pantoprazol.", reference: REF },
  { a: "Ácido acetilsalicílico", b: "Ibuprofeno", severity: "MEDIUM", mechanism: "Ibuprofeno compete pela COX-1 e reduz o efeito cardioprotetor do AAS.", clinicalEffect: "Perda da antiagregação do AAS.", recommendation: "Tomar AAS 2h antes do ibuprofeno; evitar uso crônico conjunto.", reference: REF },
  { a: "Ácido acetilsalicílico", b: "Enoxaparina", severity: "HIGH", mechanism: "Antiagregação + anticoagulação.", clinicalEffect: "Risco de sangramento.", recommendation: "Associar apenas com indicação; monitorar.", reference: REF },
  { a: "Heparina", b: "Ácido acetilsalicílico", severity: "HIGH", mechanism: "Efeitos hemostáticos somados.", clinicalEffect: "Sangramento.", recommendation: "Monitorar; usar menor dose eficaz.", reference: REF },

  // ================= PROLONGAMENTO DE QT =================
  { a: "Amiodarona", b: "Claritromicina", severity: "HIGH", mechanism: "Prolongamento aditivo do intervalo QT + inibição de CYP3A4.", clinicalEffect: "Torsades de pointes.", recommendation: "Evitar; monitorar ECG, K+ e Mg2+.", reference: REF },
  { a: "Amiodarona", b: "Azitromicina", severity: "HIGH", mechanism: "Prolongamento aditivo do QT.", clinicalEffect: "Arritmia ventricular.", recommendation: "Evitar; monitorar ECG.", reference: REF },
  { a: "Amiodarona", b: "Levofloxacino", severity: "HIGH", mechanism: "QT aditivo (antiarrítmico + fluoroquinolona).", clinicalEffect: "Torsades de pointes.", recommendation: "Evitar; corrigir eletrólitos.", reference: REF },
  { a: "Amiodarona", b: "Ciprofloxacino", severity: "HIGH", mechanism: "QT aditivo.", clinicalEffect: "Arritmia ventricular.", recommendation: "Evitar; monitorar ECG.", reference: REF },
  { a: "Amiodarona", b: "Haloperidol", severity: "HIGH", mechanism: "QT aditivo.", clinicalEffect: "Torsades de pointes.", recommendation: "Evitar; monitorar ECG.", reference: REF },
  { a: "Amiodarona", b: "Ondansetrona", severity: "HIGH", mechanism: "QT aditivo.", clinicalEffect: "Arritmia ventricular.", recommendation: "Cautela; monitorar ECG, sobretudo IV.", reference: REF },
  { a: "Citalopram", b: "Amiodarona", severity: "HIGH", mechanism: "QT aditivo (citalopram é dose-dependente para QT).", clinicalEffect: "Torsades de pointes.", recommendation: "Evitar; respeitar dose máxima do citalopram.", reference: REF },
  { a: "Claritromicina", b: "Haloperidol", severity: "MEDIUM", mechanism: "QT aditivo + inibição de CYP3A4.", clinicalEffect: "Prolongamento do QT.", recommendation: "Monitorar ECG.", reference: REF },
  { a: "Ondansetrona", b: "Citalopram", severity: "MEDIUM", mechanism: "QT aditivo.", clinicalEffect: "Prolongamento do QT.", recommendation: "Cautela; monitorar em pacientes de risco.", reference: REF },
  { a: "Metadona", b: "Amiodarona", severity: "HIGH", mechanism: "QT aditivo.", clinicalEffect: "Torsades de pointes.", recommendation: "Evitar; monitorar ECG.", reference: REF },

  // ================= SEROTONINÉRGICOS =================
  { a: "Fluoxetina", b: "Tramadol", severity: "HIGH", mechanism: "Efeito serotoninérgico aditivo + ↓limiar convulsivo; inibição de CYP2D6.", clinicalEffect: "Síndrome serotoninérgica; convulsões.", recommendation: "Evitar; se usar, vigiar sinais e usar menor dose.", reference: REF },
  { a: "Sertralina", b: "Tramadol", severity: "HIGH", mechanism: "Serotoninérgico aditivo.", clinicalEffect: "Síndrome serotoninérgica.", recommendation: "Evitar ou monitorar rigorosamente.", reference: REF },
  { a: "Paroxetina", b: "Tramadol", severity: "HIGH", mechanism: "Serotoninérgico + inibição de CYP2D6 (↓analgesia do tramadol).", clinicalEffect: "Síndrome serotoninérgica e menor efeito analgésico.", recommendation: "Evitar; escolher analgésico alternativo.", reference: REF },
  { a: "Fluoxetina", b: "Ondansetrona", severity: "MEDIUM", mechanism: "Serotoninérgico aditivo.", clinicalEffect: "Risco de síndrome serotoninérgica.", recommendation: "Cautela em uso prolongado/altas doses.", reference: REF },
  { a: "Sertralina", b: "Fluoxetina", severity: "MEDIUM", mechanism: "Dois ISRS somados.", clinicalEffect: "Duplicidade serotoninérgica.", recommendation: "Não associar; risco de síndrome serotoninérgica.", reference: REF },
  { a: "Fluoxetina", b: "Lítio", severity: "MEDIUM", mechanism: "Aumento do efeito serotoninérgico e possível ↑litemia.", clinicalEffect: "Neurotoxicidade / síndrome serotoninérgica.", recommendation: "Monitorar litemia e sinais neurológicos.", reference: REF },
  { a: "Tramadol", b: "Venlafaxina", severity: "HIGH", mechanism: "Serotoninérgico aditivo + ↓limiar convulsivo.", clinicalEffect: "Síndrome serotoninérgica; convulsões.", recommendation: "Evitar.", reference: REF },
  { a: "Sertralina", b: "Ácido acetilsalicílico", severity: "MEDIUM", mechanism: "ISRS reduzem agregação plaquetária, somando ao AAS.", clinicalEffect: "Maior risco de sangramento (especialmente GI).", recommendation: "Cautela; considerar gastroproteção.", reference: REF },

  // ================= ESTATINAS =================
  { a: "Sinvastatina", b: "Claritromicina", severity: "HIGH", mechanism: "Inibição potente de CYP3A4.", clinicalEffect: "Rabdomiólise.", recommendation: "Suspender a sinvastatina durante o macrolídeo ou usar azitromicina.", reference: REF },
  { a: "Sinvastatina", b: "Itraconazol", severity: "HIGH", mechanism: "Inibição potente de CYP3A4.", clinicalEffect: "Rabdomiólise.", recommendation: "Contraindicado; suspender estatina durante o antifúngico.", reference: REF },
  { a: "Sinvastatina", b: "Cetoconazol", severity: "HIGH", mechanism: "Inibição de CYP3A4.", clinicalEffect: "Miopatia/rabdomiólise.", recommendation: "Evitar; suspender a estatina.", reference: REF },
  { a: "Sinvastatina", b: "Amiodarona", severity: "HIGH", mechanism: "Amiodarona inibe CYP3A4.", clinicalEffect: "Miopatia/rabdomiólise.", recommendation: "Limitar sinvastatina a 20 mg/dia ou trocar por pravastatina/rosuvastatina.", reference: REF },
  { a: "Sinvastatina", b: "Diltiazem", severity: "MEDIUM", mechanism: "Diltiazem inibe CYP3A4.", clinicalEffect: "Aumento do risco de miopatia.", recommendation: "Limitar dose da sinvastatina; monitorar sintomas musculares.", reference: REF },
  { a: "Sinvastatina", b: "Verapamil", severity: "MEDIUM", mechanism: "Inibição de CYP3A4.", clinicalEffect: "Maior risco de miopatia.", recommendation: "Limitar dose da sinvastatina.", reference: REF },
  { a: "Atorvastatina", b: "Claritromicina", severity: "MEDIUM", mechanism: "Inibição de CYP3A4.", clinicalEffect: "Maior exposição à atorvastatina; miopatia.", recommendation: "Reduzir dose/monitorar; preferir azitromicina.", reference: REF },
  { a: "Atorvastatina", b: "Itraconazol", severity: "MEDIUM", mechanism: "Inibição de CYP3A4.", clinicalEffect: "Risco de miopatia.", recommendation: "Reduzir dose; monitorar CK se sintomas.", reference: REF },
  { a: "Sinvastatina", b: "Fenofibrato", severity: "MEDIUM", mechanism: "Efeito miotóxico aditivo (menor que com genfibrozila).", clinicalEffect: "Risco de miopatia.", recommendation: "Preferível a genfibrozila; monitorar sintomas musculares.", reference: REF },
  { a: "Sinvastatina", b: "Genfibrozila", severity: "HIGH", mechanism: "Genfibrozila inibe glucuronidação da estatina.", clinicalEffect: "Rabdomiólise.", recommendation: "Associação contraindicada.", reference: REF },

  // ================= IECA/BRA + POTÁSSIO + AINE + LÍTIO =================
  { a: "Enalapril", b: "Espironolactona", severity: "MEDIUM", mechanism: "Retenção de potássio aditiva.", clinicalEffect: "Hipercalemia (grave em DRC/diabético/idoso).", recommendation: "Monitorar K+ e creatinina; evitar sal com potássio.", reference: REF },
  { a: "Captopril", b: "Espironolactona", severity: "MEDIUM", mechanism: "Retenção de potássio aditiva.", clinicalEffect: "Hipercalemia.", recommendation: "Monitorar K+/creatinina.", reference: REF },
  { a: "Losartana", b: "Espironolactona", severity: "MEDIUM", mechanism: "Retenção de potássio aditiva.", clinicalEffect: "Hipercalemia.", recommendation: "Monitorar K+/creatinina.", reference: REF },
  { a: "Enalapril", b: "Losartana", severity: "MEDIUM", mechanism: "Duplo bloqueio do SRAA.", clinicalEffect: "Hipercalemia, hipotensão, lesão renal.", recommendation: "Evitar bloqueio duplo de rotina.", reference: REF },
  { a: "Enalapril", b: "Amilorida", severity: "HIGH", mechanism: "Poupador de potássio + IECA.", clinicalEffect: "Hipercalemia importante.", recommendation: "Evitar; monitorar K+.", reference: REF },
  { a: "Enalapril", b: "Ibuprofeno", severity: "MEDIUM", mechanism: "AINE reduz prostaglandinas renais (tríplice com diurético = 'triple whammy').", clinicalEffect: "Piora da função renal e da PA.", recommendation: "Evitar AINE; monitorar creatinina.", reference: REF },
  { a: "Losartana", b: "Ibuprofeno", severity: "MEDIUM", mechanism: "AINE reduz efeito anti-hipertensivo e prostaglandinas renais.", clinicalEffect: "↓controle pressórico; risco renal.", recommendation: "Evitar uso crônico; monitorar.", reference: REF },
  { a: "Enalapril", b: "Lítio", severity: "HIGH", mechanism: "IECA reduz a excreção renal de lítio.", clinicalEffect: "Intoxicação por lítio.", recommendation: "Monitorar litemia; ajustar dose.", reference: REF },
  { a: "Losartana", b: "Lítio", severity: "HIGH", mechanism: "BRA reduz excreção de lítio.", clinicalEffect: "↑litemia; toxicidade.", recommendation: "Monitorar litemia.", reference: REF },
  { a: "Hidroclorotiazida", b: "Lítio", severity: "HIGH", mechanism: "Tiazídico reduz excreção renal de lítio.", clinicalEffect: "Intoxicação por lítio.", recommendation: "Evitar ou monitorar litemia de perto.", reference: REF },
  { a: "Ibuprofeno", b: "Lítio", severity: "MEDIUM", mechanism: "AINE reduz excreção renal de lítio.", clinicalEffect: "↑litemia.", recommendation: "Evitar AINE; monitorar litemia.", reference: REF },
  { a: "Espironolactona", b: "Cloreto de potássio", severity: "HIGH", mechanism: "Poupador de potássio + reposição de potássio.", clinicalEffect: "Hipercalemia grave.", recommendation: "Evitar; monitorar K+.", reference: REF },

  // ================= DIGOXINA =================
  { a: "Digoxina", b: "Amiodarona", severity: "HIGH", mechanism: "Amiodarona inibe P-gp e reduz clearance da digoxina.", clinicalEffect: "Intoxicação digitálica.", recommendation: "Reduzir digoxina ~50%; monitorar nível e ECG.", reference: REF },
  { a: "Digoxina", b: "Claritromicina", severity: "HIGH", mechanism: "Inibição da P-gp.", clinicalEffect: "↑digoxina; intoxicação.", recommendation: "Monitorar digoxinemia; considerar reduzir dose.", reference: REF },
  { a: "Digoxina", b: "Verapamil", severity: "HIGH", mechanism: "Inibição da P-gp e redução do clearance.", clinicalEffect: "↑níveis de digoxina; bradicardia.", recommendation: "Reduzir digoxina; monitorar.", reference: REF },
  { a: "Digoxina", b: "Espironolactona", severity: "MEDIUM", mechanism: "Redução do clearance + interferência em imunoensaio.", clinicalEffect: "↑digoxina; risco de toxicidade.", recommendation: "Monitorar digoxinemia e potássio.", reference: REF },
  { a: "Digoxina", b: "Furosemida", severity: "MEDIUM", mechanism: "Hipocalemia/hipomagnesemia induzida pelo diurético potencializa a toxicidade digitálica.", clinicalEffect: "Arritmias por intoxicação digitálica.", recommendation: "Monitorar e repor K+/Mg2+.", reference: REF },
  { a: "Digoxina", b: "Hidroclorotiazida", severity: "MEDIUM", mechanism: "Hipocalemia potencializa toxicidade.", clinicalEffect: "Arritmias.", recommendation: "Monitorar potássio.", reference: REF },

  // ================= METOTREXATO / IMUNOSSUPRESSORES =================
  { a: "Metotrexato", b: "Ácido acetilsalicílico", severity: "HIGH", mechanism: "AINE/salicilato reduz a excreção renal do MTX.", clinicalEffect: "Toxicidade do MTX (mielo/renal).", recommendation: "Evitar AINE em dose analgésica; monitorar hemograma.", reference: REF },
  { a: "Metotrexato", b: "Ibuprofeno", severity: "HIGH", mechanism: "Redução da excreção renal do MTX.", clinicalEffect: "Toxicidade do MTX.", recommendation: "Evitar; especialmente em altas doses de MTX.", reference: REF },
  { a: "Metotrexato", b: "Sulfametoxazol + trimetoprima", severity: "HIGH", mechanism: "Antifolato aditivo + deslocamento do MTX.", clinicalEffect: "Mielossupressão grave.", recommendation: "Evitar a associação.", reference: REF },
  { a: "Metotrexato", b: "Omeprazol", severity: "MEDIUM", mechanism: "IBP pode reduzir a eliminação renal do MTX (altas doses).", clinicalEffect: "↑níveis de MTX.", recommendation: "Suspender IBP em ciclos de MTX de alta dose.", reference: REF },
  { a: "Alopurinol", b: "Azatioprina", severity: "HIGH", mechanism: "Alopurinol inibe a xantina oxidase, bloqueando a inativação da 6-mercaptopurina.", clinicalEffect: "Mielotoxicidade grave.", recommendation: "Evitar; se essencial, reduzir azatioprina 66-75%.", reference: REF },
  { a: "Febuxostate", b: "Azatioprina", severity: "HIGH", mechanism: "Inibição da xantina oxidase.", clinicalEffect: "Acúmulo tóxico de mercaptopurina.", recommendation: "Contraindicado.", reference: REF },
  { a: "Ciclosporina", b: "Sinvastatina", severity: "HIGH", mechanism: "Ciclosporina inibe CYP3A4/OATP1B1.", clinicalEffect: "Rabdomiólise.", recommendation: "Evitar; usar menor dose de estatina compatível.", reference: REF },
  { a: "Tacrolimo", b: "Fluconazol", severity: "HIGH", mechanism: "Inibição de CYP3A4 aumenta o tacrolimo.", clinicalEffect: "Nefrotoxicidade/neurotoxicidade.", recommendation: "Monitorar nível de tacrolimo; ajustar dose.", reference: REF },
  { a: "Ciclosporina", b: "Cetoconazol", severity: "HIGH", mechanism: "Inibição de CYP3A4.", clinicalEffect: "↑ciclosporina; nefrotoxicidade.", recommendation: "Monitorar nível e função renal.", reference: REF },

  // ================= NITRATOS + PDE5 =================
  { a: "Sildenafila", b: "Isossorbida, mononitrato", severity: "HIGH", mechanism: "Potencialização do efeito vasodilatador (via NO/GMPc).", clinicalEffect: "Hipotensão grave.", recommendation: "Contraindicado o uso concomitante.", reference: REF },
  { a: "Tadalafila", b: "Isossorbida, mononitrato", severity: "HIGH", mechanism: "Vasodilatação potencializada.", clinicalEffect: "Hipotensão grave/síncope.", recommendation: "Contraindicado.", reference: REF },
  { a: "Sildenafila", b: "Nitroprusseto de sódio", severity: "HIGH", mechanism: "Vasodilatação aditiva por NO.", clinicalEffect: "Hipotensão grave.", recommendation: "Evitar.", reference: REF },

  // ================= SNC / DEPRESSORES / CONVULSÕES =================
  { a: "Tramadol", b: "Bupropiona", severity: "HIGH", mechanism: "Redução aditiva do limiar convulsivo.", clinicalEffect: "Convulsões.", recommendation: "Evitar a associação.", reference: REF },
  { a: "Tramadol", b: "Carbamazepina", severity: "MEDIUM", mechanism: "Carbamazepina induz o metabolismo do tramadol.", clinicalEffect: "Redução da analgesia.", recommendation: "Ajustar dose; considerar alternativa.", reference: REF },
  { a: "Diazepam", b: "Morfina", severity: "HIGH", mechanism: "Depressão aditiva do SNC/respiratória.", clinicalEffect: "Sedação e depressão respiratória.", recommendation: "Evitar; se necessário, reduzir doses e monitorar.", reference: REF },
  { a: "Clonazepam", b: "Morfina", severity: "HIGH", mechanism: "Depressão do SNC aditiva.", clinicalEffect: "Depressão respiratória.", recommendation: "Cautela máxima; menor dose.", reference: REF },
  { a: "Diazepam", b: "Codeína", severity: "MEDIUM", mechanism: "Depressão do SNC aditiva.", clinicalEffect: "Sedação/depressão respiratória.", recommendation: "Evitar em idosos/DPOC.", reference: REF },
  { a: "Haloperidol", b: "Levodopa + carbidopa", severity: "MEDIUM", mechanism: "Antagonismo dopaminérgico do haloperidol reduz o efeito da levodopa.", clinicalEffect: "Piora do parkinsonismo.", recommendation: "Evitar antipsicóticos típicos no Parkinson.", reference: REF },
  { a: "Fenitoína", b: "Fluoxetina", severity: "MEDIUM", mechanism: "Fluoxetina inibe CYP2C9/2C19 (cinética saturável da fenitoína).", clinicalEffect: "↑nível de fenitoína; toxicidade.", recommendation: "Monitorar nível sérico; ajustar dose.", reference: REF },
  { a: "Carbamazepina", b: "Claritromicina", severity: "HIGH", mechanism: "Inibição de CYP3A4.", clinicalEffect: "Toxicidade por carbamazepina (ataxia, sedação).", recommendation: "Evitar; preferir azitromicina; monitorar nível.", reference: REF },
  { a: "Ácido valproico", b: "Lamotrigina", severity: "HIGH", mechanism: "Valproato inibe a glucuronidação da lamotrigina.", clinicalEffect: "↑lamotrigina; risco de rash grave (SJS).", recommendation: "Titular lamotrigina em doses menores e mais lentas.", reference: REF },
  { a: "Ácido valproico", b: "Carbapenêmicos", severity: "HIGH", mechanism: "Carbapenêmicos reduzem drasticamente o nível de valproato.", clinicalEffect: "Perda de controle de crises.", recommendation: "Evitar; usar antibiótico alternativo.", reference: REF },

  // ================= INDUTORES ENZIMÁTICOS =================
  { a: "Carbamazepina", b: "Etinilestradiol + levonorgestrel", severity: "HIGH", mechanism: "Indução enzimática (CYP3A4) reduz o contraceptivo.", clinicalEffect: "Falha contraceptiva.", recommendation: "Usar método adicional/alternativo.", reference: REF },
  { a: "Fenitoína", b: "Etinilestradiol + levonorgestrel", severity: "HIGH", mechanism: "Indução enzimática.", clinicalEffect: "Falha contraceptiva.", recommendation: "Método adicional/alternativo.", reference: REF },
  { a: "Fenobarbital", b: "Varfarina", severity: "MEDIUM", mechanism: "Indução enzimática reduz efeito da varfarina.", clinicalEffect: "↓INR (e ↑ao suspender).", recommendation: "Monitorar INR ao iniciar/suspender.", reference: REF },
  { a: "Rifampicina", b: "Varfarina", severity: "HIGH", mechanism: "Indução potente de CYP2C9/3A4.", clinicalEffect: "Grande redução do efeito anticoagulante.", recommendation: "Monitorar INR; ajustar dose.", reference: REF },
  { a: "Rifampicina", b: "Etinilestradiol + levonorgestrel", severity: "HIGH", mechanism: "Indução enzimática potente.", clinicalEffect: "Falha contraceptiva.", recommendation: "Método não hormonal.", reference: REF },
  { a: "Rifampicina", b: "Tacrolimo", severity: "HIGH", mechanism: "Indução de CYP3A4.", clinicalEffect: "Subterapêutico; rejeição de enxerto.", recommendation: "Monitorar nível; ajustar dose.", reference: REF },

  // ================= DIABETES =================
  { a: "Metformina", b: "Meio de contraste iodado", severity: "HIGH", mechanism: "Risco de lesão renal aguda pelo contraste com acúmulo de metformina.", clinicalEffect: "Acidose láctica.", recommendation: "Suspender metformina no dia do exame conforme função renal.", reference: REF },
  { a: "Glibenclamida", b: "Sulfametoxazol + trimetoprima", severity: "MEDIUM", mechanism: "Deslocamento proteico/inibição do metabolismo da sulfonilureia.", clinicalEffect: "Hipoglicemia.", recommendation: "Monitorar glicemia.", reference: REF },
  { a: "Glibenclamida", b: "Fluconazol", severity: "MEDIUM", mechanism: "Inibição de CYP2C9.", clinicalEffect: "Hipoglicemia.", recommendation: "Monitorar glicemia; ajustar dose.", reference: REF },
  { a: "Insulina humana regular", b: "Propranolol", severity: "MEDIUM", mechanism: "Betabloqueador não seletivo mascara sinais de hipoglicemia e prejudica recuperação.", clinicalEffect: "Hipoglicemia despercebida.", recommendation: "Preferir betabloqueador cardiosseletivo; orientar paciente.", reference: REF },

  // ================= OUTROS RELEVANTES =================
  { a: "Espironolactona", b: "Ácido acetilsalicílico", severity: "LOW", mechanism: "AAS pode reduzir levemente o efeito diurético/natriurético.", clinicalEffect: "Menor resposta diurética.", recommendation: "Relevância geralmente baixa; monitorar em IC.", reference: REF },
  { a: "Ciprofloxacino", b: "Sulfato ferroso", severity: "MEDIUM", mechanism: "Cátions (ferro) quelam a fluoroquinolona no TGI.", clinicalEffect: "Redução da absorção do antibiótico.", recommendation: "Separar as tomadas em 2-6 h.", reference: REF },
  { a: "Ciprofloxacino", b: "Carbonato de cálcio", severity: "MEDIUM", mechanism: "Quelação por cálcio.", clinicalEffect: "↓absorção do ciprofloxacino.", recommendation: "Separar as tomadas.", reference: REF },
  { a: "Levotiroxina sódica", b: "Sulfato ferroso", severity: "MEDIUM", mechanism: "Ferro reduz a absorção da levotiroxina.", clinicalEffect: "Hipotireoidismo subtratado.", recommendation: "Separar as tomadas em ≥4 h.", reference: REF },
  { a: "Levotiroxina sódica", b: "Carbonato de cálcio", severity: "MEDIUM", mechanism: "Cálcio reduz absorção da levotiroxina.", clinicalEffect: "↓efeito da levotiroxina.", recommendation: "Separar ≥4 h.", reference: REF },
  { a: "Levotiroxina sódica", b: "Omeprazol", severity: "LOW", mechanism: "Redução da acidez pode diminuir a absorção.", clinicalEffect: "Possível ↓absorção.", recommendation: "Monitorar TSH; espaçar tomadas.", reference: REF },
  { a: "Ciprofloxacino", b: "Tizanidina", severity: "HIGH", mechanism: "Ciprofloxacino inibe potentemente CYP1A2.", clinicalEffect: "Hipotensão e sedação intensas.", recommendation: "Associação contraindicada.", reference: REF },
  { a: "Claritromicina", b: "Colchicina", severity: "HIGH", mechanism: "Inibição de CYP3A4/P-gp aumenta a colchicina.", clinicalEffect: "Toxicidade grave por colchicina.", recommendation: "Evitar; reduzir muito a colchicina se inevitável.", reference: REF },
  { a: "Alopurinol", b: "Amoxicilina", severity: "LOW", mechanism: "Maior incidência de exantema quando associados.", clinicalEffect: "Rash cutâneo.", recommendation: "Atenção a reações cutâneas.", reference: REF },
  { a: "Prednisona", b: "Ibuprofeno", severity: "MEDIUM", mechanism: "Corticoide + AINE: lesão de mucosa gástrica aditiva.", clinicalEffect: "Úlcera/sangramento GI.", recommendation: "Evitar associação; gastroproteção se necessária.", reference: REF },
  { a: "Prednisona", b: "Ácido acetilsalicílico", severity: "MEDIUM", mechanism: "Lesão gástrica aditiva.", clinicalEffect: "Risco de sangramento GI.", recommendation: "Cautela; gastroproteção.", reference: REF },
  { a: "Furosemida", b: "Gentamicina", severity: "HIGH", mechanism: "Ototoxicidade e nefrotoxicidade aditivas.", clinicalEffect: "Perda auditiva e lesão renal.", recommendation: "Evitar; monitorar função renal e auditiva.", reference: REF },
  { a: "Furosemida", b: "Vancomicina", severity: "MEDIUM", mechanism: "Nefrotoxicidade aditiva.", clinicalEffect: "Lesão renal.", recommendation: "Monitorar função renal e nível de vancomicina.", reference: REF },
  { a: "Espironolactona", b: "Enalapril", severity: "MEDIUM", mechanism: "(ver hipercalemia) — retenção de potássio aditiva.", clinicalEffect: "Hipercalemia.", recommendation: "Monitorar K+.", reference: REF },
  { a: "Omeprazol", b: "Itraconazol", severity: "MEDIUM", mechanism: "Redução da acidez diminui a absorção do itraconazol (cápsula).", clinicalEffect: "Falha antifúngica.", recommendation: "Evitar; usar solução oral ou antifúngico alternativo.", reference: REF },
  { a: "Digoxina", b: "Sinvastatina", severity: "LOW", mechanism: "Leve interação via P-gp.", clinicalEffect: "Pequeno ↑digoxina.", recommendation: "Relevância baixa; monitorar se sintomas.", reference: REF },
  { a: "Amiodarona", b: "Varfarina", severity: "HIGH", mechanism: "(ver Varfarina + Amiodarona).", clinicalEffect: "↑INR.", recommendation: "Reduzir varfarina; monitorar INR.", reference: REF },
];
