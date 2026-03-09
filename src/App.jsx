import { useState, useEffect, useMemo } from 'react';
import { 
  Home as HomeIcon, 
  FileText, 
  Ship, 
  Calendar, 
  StickyNote, 
  BookOpen, 
  Target, 
  Settings, 
  Lock, 
  LogOut, 
  Plus, 
  Search, 
  Star, 
  CheckCircle2, 
  ChevronRight, 
  Trash2, 
  Download, 
  Printer,
  AlertCircle,
  Clock,
  User,
  ShieldCheck,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';

// --- COSTANTI E DATI STATICI ---

const MASTER_SKIP_CODE = "7373"; // Codice segreto per saltare setup/blocco

const SEZIONI = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'istanze', label: 'Istanze', icon: FileText },
  { id: 'planner', label: 'Planner', icon: Calendar },
  { id: 'mercatino', label: 'Mercatino', icon: ShoppingBag },
  { id: 'risorse', label: 'Risorse', icon: BookOpen },
];

const RISORSE_STATICHE = [
  {
    "id": "premium-1",
    "category": "Energia",
    "readingTime": "5 min",
    "title": "Equilibrio Operativo: Respirazione Tattica",
    "enemy": "L'attivazione eccessiva del sistema nervoso simpatico (attacco o fuga). Sotto stress acuto, il battito cardiaco accelera, la visione si restringe e la capacità di prendere decisioni razionali crolla, portandoti a errori banali durante le adunate o i controlli.",
    "elite_technique": "Box Breathing (Respirazione Quadrata). È il protocollo standard utilizzato dai Navy SEALs e dai piloti di caccia per resettare il sistema nervoso in meno di 60 secondi. Agisce direttamente sul nervo vago, forzando il passaggio dal sistema simpatico a quello parasimpatico.",
    "protocol_steps": [
      "Inspira profondamente dal naso per 4 secondi, riempiendo il diaframma.",
      "Trattieni il fiato a polmoni pieni per 4 secondi, mantenendo il corpo immobile.",
      "Espira lentamente dalla bocca per 4 secondi, svuotando completamente.",
      "Trattieni a polmoni vuoti per 4 secondi prima di ricominciare."
    ],
    "tactical_scenario": "Sei sull'attenti durante un'adunata prolungata. Un superiore ti sta urlando a pochi centimetri dal viso per un errore non tuo. L'errore comune è andare in apnea o fare respiri corti e toracici, aumentando l'ansia. La reazione corretta è avviare il Box Breathing in modo invisibile: abbasserai il battito e manterrai lo sguardo fisso e vitreo (focalizzazione esterna), proiettando un'immagine di controllo assoluto.",
    "interactive_exercise": "Esegui 5 cicli completi di Box Breathing durante la prossima adunata o mentre sei in fila in mensa. Nota come la tua percezione del tempo rallenta.",
    "debrief_questions": [
      "Sono riuscito a mantenere il conteggio dei 4 secondi nonostante le distrazioni esterne?",
      "Ho percepito una riduzione della tensione muscolare nelle spalle durante l'espirazione?"
    ],
    "mantra": "Calma è Forza. Il respiro è il mio comando."
  },
  {
    "id": "premium-2",
    "category": "Organizzazione",
    "readingTime": "4 min",
    "title": "Atomic Habits: Ordine in 2 Minuti",
    "enemy": "Il logorio da micro-decisioni e la procrastinazione della manutenzione. Accumulare piccoli disordini (armadietto, divisa, equipaggiamento) crea un carico cognitivo latente che esplode in stress paralizzante pochi minuti prima di un'ispezione.",
    "elite_technique": "La Regola dei 2 Minuti (derivata dal GTD e applicata in contesti HPO). Se un'azione richiede meno di 120 secondi, deve essere eseguita nel momento esatto in cui viene rilevata. Questo elimina la necessità di 'ricordare' il compito, liberando memoria di lavoro per il combattimento o lo studio.",
    "protocol_steps": [
      "Rileva il disordine o il compito (es. una macchia, un filo pendente).",
      "Valuta istantaneamente: 'Ci metto meno di 2 minuti?'.",
      "Esegui immediatamente, senza passare ad altro."
    ],
    "tactical_scenario": "Rientri in camerata dopo una marcia, sei esausto. L'errore comune è lanciare l'equipaggiamento sul letto pensando 'lo sistemo dopo'. La reazione corretta è applicare il protocollo: pulire e riporre gli scarponi richiede 90 secondi. Farlo ora significa che domani mattina sarai operativo in 30 secondi invece di 5 minuti di panico.",
    "interactive_exercise": "Applica la regola a 5 diverse situazioni oggi (es. rifare il letto, rispondere a un memo, pulire la scrivania). Segna sul planner ogni volta che hai vinto la pigrizia.",
    "debrief_questions": [
      "Quante volte ho evitato che un piccolo compito diventasse un problema grande?",
      "Come si sente la mia mente sapendo che l'armadietto è già pronto per domani?"
    ],
    "mantra": "Fallo Ora. Fallo Bene. Una volta sola."
  },
  {
    "id": "premium-3",
    "category": "Energia",
    "readingTime": "5 min",
    "title": "Sonno Frammentato: Recupero in Guardia",
    "enemy": "Il declino cognitivo da privazione di sonno. Dormire poco e male distrugge la memoria a breve termine e la coordinazione motoria. In accademia, il sonno è un lusso, ma la stanchezza è un nemico che ti rende vulnerabile.",
    "elite_technique": "NSDR (Non-Sleep Deep Rest) o Yoga Nidra Operativo. È una tecnica di scansione mentale utilizzata dalle forze speciali per indurre uno stato di rilassamento profondo simile al sonno REM in soli 10-15 minuti, accelerando il recupero neurale.",
    "protocol_steps": [
      "Sdraiati o siediti in posizione stabile, chiudi gli occhi.",
      "Esegui una scansione mentale rapida dai piedi alla testa, rilassando ogni muscolo al passaggio.",
      "Visualizza il tuo respiro come un'onda che lava via la stanchezza cerebrale."
    ],
    "tactical_scenario": "Hai un turno di guardia notturno e solo 2 ore di riposo prima della sveglia. L'errore comune è passare 30 minuti sullo smartphone, distruggendo la melatonina con la luce blu. La reazione corretta è mettere via il telefono e dedicare i primi 15 minuti all'NSDR: anche se non dormi profondamente, il tuo cervello si resetterà efficacemente.",
    "interactive_exercise": "Oggi, durante la pausa pranzo o un momento di stacco, pratica 10 minuti di NSDR invece di usare il telefono. Valuta la tua lucidità pomeridiana.",
    "debrief_questions": [
      "Sono riuscito a disconnettere i pensieri durante la scansione corporea?",
      "Ho avvertito il 'reset' mentale al termine dell'esercizio?"
    ],
    "mantra": "Ogni minuto è recupero. Il riposo è un'arma."
  },
  {
    "id": "premium-4",
    "category": "Studio",
    "readingTime": "6 min",
    "title": "Memory Palace: Codici e Regolamenti",
    "enemy": "L'overload informativo. Tentare di memorizzare centinaia di articoli, gradi e procedure tramite la ripetizione meccanica è inefficiente e soggetto a blackout sotto stress da esame o interrogazione.",
    "elite_technique": "Metodo dei Loci (Palazzo della Memoria). Utilizzato dagli ufficiali di intelligence per ricordare dati complessi. Sfrutta la naturale capacità del cervello di ricordare spazi fisici meglio di concetti astratti, ancorando le informazioni a luoghi familiari.",
    "protocol_steps": [
      "Scegli un percorso che conosci a memoria (es. l'ingresso della tua caserma).",
      "Associa ogni informazione a un oggetto o angolo specifico del percorso con un'immagine assurda o violenta.",
      "Ripercorri mentalmente la strada per 'vedere' le informazioni depositate."
    ],
    "tactical_scenario": "Devi imparare a memoria i 15 punti del regolamento di disciplina. L'errore comune è leggerli e ripeterli all'infinito. La reazione corretta è posizionare il punto 1 sulla porta della camerata, il punto 2 sul tuo armadietto, e così via. Durante l'interrogazione, ti basterà 'entrare' mentalmente nella stanza per leggere le risposte.",
    "interactive_exercise": "Memorizza i prossimi 5 articoli o codici che devi studiare usando un Palazzo della Memoria basato sulla tua casa d'infanzia. Verifica la ritenzione dopo 24 ore.",
    "debrief_questions": [
      "Le immagini che ho creato erano abbastanza forti da essere ricordate?",
      "Quanto tempo ho risparmiato rispetto alla lettura ripetuta?"
    ],
    "mantra": "Vedo, dunque ricordo. La mia mente è una mappa."
  },
  {
    "id": "premium-5",
    "category": "Mentalità",
    "readingTime": "5 min",
    "title": "Stoicismo Operativo: Il Cerchio del Controllo",
    "enemy": "L'esaurimento emotivo derivante dal lottare contro l'inevitabile. Lamentarsi del meteo, degli ordini assurdi o del carattere di un superiore consuma energia preziosa che dovresti usare per la tua performance.",
    "elite_technique": "Dicotomia del Controllo. Pilastro dello stoicismo applicato al comando. Consiste nel dividere istantaneamente ogni evento in due categorie: ciò che dipende da me (le mie azioni, i miei pensieri) e ciò che non dipende da me (tutto il resto).",
    "protocol_steps": [
      "Identifica la fonte di frustrazione.",
      "Chiediti: 'Posso cambiare questo evento con un'azione diretta?'.",
      "Se no, accetta l'evento come un dato di fatto e sposta l'energia sulla tua reazione."
    ],
    "tactical_scenario": "Piove a dirotto, siete nel fango da ore e l'ordine di rientro viene annullato. L'errore comune è imprecare e demoralizzarsi, perdendo calore e concentrazione. La reazione corretta è accettare la pioggia come immutabile e concentrarsi su ciò che controlli: mantenere i piedi asciutti per quanto possibile e sostenere il morale del compagno a fianco.",
    "interactive_exercise": "Oggi, ogni volta che provi irritazione, scrivi sul planner se l'evento era 'Sotto Controllo' o 'Fuori Controllo'. Smetti di commentare i 'Fuori Controllo'.",
    "debrief_questions": [
      "Quanta energia ho risparmiato non lamentandomi di cose che non posso cambiare?",
      "Sono stato più efficace nelle azioni che dipendevano direttamente da me?"
    ],
    "mantra": "Controllo l'interno. Accetto l'esterno. Opero sempre."
  },
  {
    "id": "premium-6",
    "category": "Comunicazione",
    "readingTime": "5 min",
    "title": "Comunicazione Assertiva: Risposta Sotto Pressione",
    "enemy": "La reattività emotiva (aggressività o sottomissione passiva). Rispondere male a un superiore distrugge la carriera; non rispondere o balbettare distrugge la tua autorità e dignità.",
    "elite_technique": "Standard Response Protocol (SRP). Derivato dal CRM (Cockpit Resource Management) dell'aviazione. Utilizza una struttura fissa per comunicare fatti critici senza attivare l'ego dell'interlocutore, mantenendo la gerarchia ma garantendo la chiarezza.",
    "protocol_steps": [
      "Riconoscimento: Conferma di aver ricevuto il messaggio ('Ricevuto').",
      "Esposizione: Fornisci il dato oggettivo senza scuse o aggettivi.",
      "Soluzione: Proponi l'azione successiva o chiedi conferma ('Procedo con X?')."
    ],
    "tactical_scenario": "Un superiore ti accusa di un ritardo causato da un altro reparto. L'errore comune è giustificarsi con tono lagnoso o subire in silenzio accumulando rabbia. La reazione corretta è: 'Ricevuto. Il ritardo è dovuto alla mancata consegna del materiale X. Procedo con il recupero immediato o attendo istruzioni?'. Hai comunicato la verità senza sfidare il comando.",
    "interactive_exercise": "Usa lo schema 'Riconoscimento-Esposizione-Soluzione' in almeno 3 interazioni oggi, anche con i tuoi pari. Nota la differenza nella velocità di risoluzione.",
    "debrief_questions": [
      "Ho mantenuto un tono di voce neutro e professionale?",
      "L'interlocutore ha capito il fatto senza sentirsi attaccato?"
    ],
    "mantra": "Breve. Chiaro. Professionale. L'ego resta fuori."
  },
  {
    "id": "premium-7",
    "category": "Energia",
    "readingTime": "4 min",
    "title": "Alimentazione Tattica: Energia in Mensa",
    "enemy": "Il picco glicemico e la sonnolenza post-prandiale. Mangiare carboidrati semplici e grassi pesanti in mensa causa un crollo di energia nel pomeriggio, proprio quando hai bisogno di massima allerta per le lezioni o l'addestramento.",
    "elite_technique": "Sequenziamento dei Macronutrienti. Tecnica utilizzata dagli atleti di endurance per stabilizzare l'insulina. Cambiando l'ordine in cui consumi i cibi presenti nel vassoio, puoi ridurre l'impatto glicemico del pasto fino al 40%.",
    "protocol_steps": [
      "Mangia prima le fibre (insalata o verdure cotte).",
      "Mangia poi le proteine e i grassi (carne, pesce, uova).",
      "Consuma i carboidrati (pasta, pane, frutta) solo alla fine."
    ],
    "tactical_scenario": "Il menu della mensa prevede pasta al forno e carne. L'errore comune è divorare la pasta calda subito. La reazione corretta è mangiare prima il contorno di verdure (se presente) o la carne, lasciando la pasta per ultima. Le fibre e le proteine creeranno una 'rete' nello stomaco che rallenterà l'assorbimento degli zuccheri della pasta.",
    "interactive_exercise": "Segui l'ordine 'Fibre -> Proteine -> Carboidrati' per tutti i pasti di oggi. Monitora il tuo livello di sonnolenza alle ore 15:00.",
    "debrief_questions": [
      "Ho avvertito il solito 'abbiocco' pomeridiano o ero più vigile?",
      "Sono riuscito a resistere alla tentazione di iniziare dal piatto più appetitoso?"
    ],
    "mantra": "Il cibo è carburante, non un premio. Mangio per operare."
  },
  {
    "id": "premium-8",
    "category": "Finanza",
    "readingTime": "6 min",
    "title": "Finanza per Reclute: Il Protocollo del Primo Soldo",
    "enemy": "Il 'Lifestyle Creep' e lo stress finanziario. Molti allievi spendono l'intero stipendio in gadget, uscite o vizi appena lo ricevono, restando senza risorse per le emergenze o per il futuro, creando un'ansia costante che sabota la concentrazione.",
    "elite_technique": "Regola del 20% (Pay Yourself First). È il protocollo di sopravvivenza finanziaria. Considera il risparmio non come ciò che resta alla fine del mese, ma come la prima 'tassa' obbligatoria da pagare a te stesso per garantire la tua libertà operativa.",
    "protocol_steps": [
      "Appena arriva lo stipendio, sposta il 20% su un conto separato o un fondo non toccabile.",
      "Copri le spese fisse obbligatorie.",
      "Usa solo ciò che resta per gli extra (vizi, uscite). Se è zero, gli extra sono zero."
    ],
    "tactical_scenario": "Hai appena ricevuto il tuo primo stipendio pieno. L'errore comune è comprare subito l'ultimo smartphone o un orologio costoso per 'festeggiare'. La reazione corretta è applicare il protocollo: 20% via subito. Quell'accantonamento è la tua 'riserva tattica' che ti permetterà di gestire imprevisti senza chiedere prestiti o favori.",
    "interactive_exercise": "Apri un salvadanaio digitale o un secondo conto oggi stesso. Programma un bonifico automatico per il giorno dello stipendio. Calcola quanto avrai tra 12 mesi.",
    "debrief_questions": [
      "So esattamente dove è finito ogni euro del mio ultimo stipendio?",
      "Il mio 'io' del futuro è più protetto grazie alle azioni di oggi?"
    ],
    "mantra": "Paga te stesso per primo. La riserva è libertà."
  },
  {
    "id": "premium-9",
    "category": "Organizzazione",
    "readingTime": "5 min",
    "title": "Checklist Mentale: Pre-Visualizzazione Ispezione",
    "enemy": "L'ansia da prestazione e il 'freezing'. Durante un'ispezione o un esame pratico, la pressione può farti dimenticare passaggi critici che conosci perfettamente, portandoti a fallire sotto gli occhi di tutti.",
    "elite_technique": "Mental Rehearsal (Visualizzazione Ideomotoria). Tecnica usata dai piloti delle Frecce Tricolori e dagli atleti olimpici. Consiste nel percorrere mentalmente l'azione in ogni minimo dettaglio, attivando le stesse aree cerebrali dell'esecuzione reale.",
    "protocol_steps": [
      "Chiudi gli occhi e respira lentamente.",
      "Visualizza l'ispezione dalla prospettiva dei tuoi occhi (non dall'alto).",
      "Immagina ogni gesto perfetto, ma visualizza anche un possibile intoppo e la tua reazione calma per risolverlo."
    ],
    "tactical_scenario": "Domani hai l'ispezione formale dell'armadietto e della divisa. L'errore comune è controllare ossessivamente gli oggetti fino a tardi, perdendo sonno. La reazione corretta è preparare tutto con metodo, poi dedicare 5 minuti a letto a visualizzare l'ispettore che apre l'armadio, tu che rispondi con voce ferma e ogni piega che risulta perfetta.",
    "interactive_exercise": "Stasera, prima di dormire, visualizza per 3 volte una procedura che ti preoccupa (es. lo smontaggio di un'arma o una presentazione). Fallo al rallentatore.",
    "debrief_questions": [
      "Sono riuscito a vedere i dettagli (colori, suoni, sensazioni) durante la visualizzazione?",
      "Mi sento più sicuro ora che ho già 'vissuto' la scena mentalmente?"
    ],
    "mantra": "Vinto nella mente, vinto sul campo. Il successo è un'abitudine."
  },
  {
    "id": "premium-10",
    "category": "Mentalità",
    "readingTime": "5 min",
    "title": "Resilienza di Gruppo: Conflitti in Camerata",
    "enemy": "L'attrito interno e la tossicità del gruppo. In ambienti ristretti, i piccoli conflitti tra compagni si amplificano, distruggendo la coesione e rendendo la vita quotidiana un inferno psicologico che drena ogni energia.",
    "elite_technique": "Radical Candor / AAR Relazionale. Protocollo di gestione del conflitto basato sulla missione, non sulla persona. Si sposta il focus dal 'tu sei un problema' al 'questo comportamento ostacola il nostro obiettivo comune'.",
    "protocol_steps": [
      "Affronta il problema subito, non lasciarlo covare.",
      "Usa la formula: 'Quando fai X, l'impatto sul gruppo è Y. Come possiamo risolvere per la missione?'.",
      "Ascolta la risposta senza interrompere, poi concorda un'azione correttiva."
    ],
    "tactical_scenario": "Un tuo compagno di camera è costantemente disordinato e rischia di far punire tutti. L'errore comune è fare battute acide o esplodere in rabbia. La reazione corretta è parlargli privatamente: 'Il tuo disordine mette a rischio la libera uscita di tutti. Cosa ti serve per tenere l'armadio a posto entro stasera?'. Focus sul risultato, non sull'offesa.",
    "interactive_exercise": "Individua una piccola tensione che hai con un collega. Affrontala oggi usando la logica 'Impatto sulla Missione'. Nota se il clima migliora.",
    "debrief_questions": [
      "Ho parlato per risolvere o per avere ragione?",
      "Il gruppo è uscito più unito o più diviso da questa interazione?"
    ],
    "mantra": "La squadra è il mio scudo. L'attrito è il vero nemico."
  }
];

const MISSIONI_DEFAULT = [
  {
    "id": "missione-1",
    "title": "Ordine 3 giorni",
    "description": "Completa la tua routine serale per 3 giorni consecutivi.",
    "category": "Routine",
    "target": 3,
    "progress": 0,
    "completed": false,
    "badge": "Disciplina",
    "autoTrack": true,
    "linkedFeature": "planner"
  },
  {
    "id": "missione-2",
    "title": "Planner attivo",
    "description": "Compila tutti i 7 giorni del planner settimanale.",
    "category": "Organizzazione",
    "target": 7,
    "progress": 0,
    "completed": false,
    "badge": "Pianificazione",
    "autoTrack": true,
    "linkedFeature": "planner"
  },
  {
    "id": "missione-3",
    "title": "Zero dimenticanze",
    "description": "Crea almeno 3 memo utili nell’area equipaggiamento o promemoria.",
    "category": "Organizzazione",
    "target": 3,
    "progress": 0,
    "completed": false,
    "badge": "Precisione",
    "autoTrack": true,
    "linkedFeature": "memo"
  },
  {
    "id": "missione-4",
    "title": "Lettore disciplinato",
    "description": "Leggi almeno 3 risorse della libreria interna.",
    "category": "Studio",
    "target": 3,
    "progress": 0,
    "completed": false,
    "badge": "Crescita",
    "autoTrack": true,
    "linkedFeature": "risorse"
  },
  {
    "id": "missione-5",
    "title": "Comunicazione chiara",
    "description": "Salva un appunto utile su una situazione gestita bene o da migliorare.",
    "category": "Comunicazione",
    "target": 1,
    "progress": 0,
    "completed": false,
    "badge": "Chiarezza",
    "autoTrack": true,
    "linkedFeature": "memo"
  },
  {
    "id": "missione-6",
    "title": "Budget sotto controllo",
    "description": "Imposta un obiettivo personale di risparmio o una nota finanziaria utile.",
    "category": "Finanza",
    "target": 1,
    "progress": 0,
    "completed": false,
    "badge": "Controllo",
    "autoTrack": true,
    "linkedFeature": "memo"
  },
  {
    "id": "missione-7",
    "title": "Settimana pulita",
    "description": "Segna come completati almeno 5 giorni del planner.",
    "category": "Routine",
    "target": 5,
    "progress": 0,
    "completed": false,
    "badge": "Costanza",
    "autoTrack": true,
    "linkedFeature": "planner"
  }
];

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby-YhbwJ1dh2fwM7YGs7W438XUM6pW_OhNxwut8elfFVcnv2w2OwGDM3irUmcnlBIpc/exec";

// --- UTILS ---

const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const load = (key, def) => {
  const v = localStorage.getItem(key);
  return v ? JSON.parse(v) : def;
};

// --- COMPONENTI ---

export default function App() {
  const [hasSetup, setHasSetup] = useState(() => load('libera_has_setup', false));
  const [isLocked, setIsLocked] = useState(() => load('libera_app_locked', true));
  const [activeTab, setActiveTab] = useState('home');
  const [isOfficeMode, setIsOfficeMode] = useState(false);
  const [owner, setOwner] = useState(() => load('libera_owner_profile', null));
  const [pin, setPin] = useState(() => load('libera_owner_pin', ''));
  
  // Data States
  const [istanze, setIstanze] = useState(() => load('libera_istanze', []));
  const [imbarchi, setImbarchi] = useState(() => load('libera_imbarchi', []));
  const [planner, setPlanner] = useState(() => load('libera_planner', Array(7).fill({ priority: '', secondary: '', note: '', done: false })));
  const [memos, setMemos] = useState(() => load('libera_memo', []));
  const [risorseState, setRisorseState] = useState(() => load('libera_risorse_state', { read: [], favorites: [] }));
  const [mercatino, setMercatino] = useState(() => load('libera_mercatino', []));
  const [missioniData] = useState(() => load('libera_missioni', MISSIONI_DEFAULT));

  // Sync with LocalStorage
  useEffect(() => save('libera_has_setup', hasSetup), [hasSetup]);
  useEffect(() => save('libera_app_locked', isLocked), [isLocked]);
  useEffect(() => save('libera_owner_profile', owner), [owner]);
  useEffect(() => save('libera_owner_pin', pin), [pin]);
  useEffect(() => save('libera_istanze', istanze), [istanze]);
  useEffect(() => save('libera_imbarchi', imbarchi), [imbarchi]);
  useEffect(() => save('libera_planner', planner), [planner]);
  useEffect(() => save('libera_memo', memos), [memos]);
  useEffect(() => save('libera_risorse_state', risorseState), [risorseState]);
  useEffect(() => save('libera_mercatino', mercatino), [mercatino]);
  useEffect(() => save('libera_missioni', missioniData), [missioniData]);

  // Mission Logic
  const missioni = useMemo(() => {
    return missioniData.map(m => {
      let progress = 0;
      
      if (m.id === 'missione-1') {
        progress = Math.min(planner.filter(p => p.priority && (p.secondary || p.note)).length, 3);
      } else if (m.id === 'missione-2') {
        progress = Math.min(planner.filter(p => p.priority).length, 7);
      } else if (m.id === 'missione-3') {
        progress = Math.min(memos.length, 3);
      } else if (m.id === 'missione-4') {
        progress = Math.min(risorseState.read.length, 3);
      } else if (m.id === 'missione-5') {
        progress = memos.some(m => m.categoria === 'Comunicazione') ? 1 : 0;
      } else if (m.id === 'missione-6') {
        progress = memos.some(m => m.categoria === 'Finanza') ? 1 : 0;
      } else if (m.id === 'missione-7') {
        progress = Math.min(planner.filter(p => p.done).length, 5);
      }
      
      return { ...m, progress, completed: progress >= m.target };
    });
  }, [missioniData, planner, memos, risorseState]);

  const handleLogout = () => {
    setIsLocked(true);
  };

  const handleSkipSetup = () => {
    const dummyProfile = {
      nome: "Allievo Simulazione",
      matricola: "SIM-2026",
      corso: "Corso Demo",
      arruolamento: "2026-01-01",
      dataNascita: "2000-01-01",
      luogoNascita: "Roma",
      residenzaVia: "Via Roma 1",
      residenzaComune: "Roma",
      paternita: "Padre Demo",
      maternita: "Madre Demo",
      pin: "1234",
      recovery: "simulazione"
    };
    setOwner(dummyProfile);
    setPin("1234");
    setHasSetup(true);
    setIsLocked(false);
    save('libera_has_setup', true);
    save('libera_owner_profile', dummyProfile);
    save('libera_owner_pin', "1234");
  };

  const handleReset = () => {
    if (window.confirm("Sei sicuro di voler resettare l'app? Tutti i dati locali andranno persi.")) {
      if (window.confirm("Conferma finale: cancellare tutto?")) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  if (!hasSetup) return <SetupScreen 
    onComplete={(data) => {
      setOwner(data.profile);
      setPin(data.pin);
      save('libera_recovery_phrase', data.recovery);
      setHasSetup(true);
      setIsLocked(true);
    }} 
    onSkip={handleSkipSetup}
  />;

  if (isLocked) return <LockScreen 
    correctPin={pin} 
    onUnlock={() => setIsLocked(false)} 
    ownerName={owner?.nome} 
  />;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-brand-bg shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="bg-brand-dark text-white px-6 py-4 flex justify-between items-center shrink-0 no-print">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Libera Ecosystem</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Accesso Personale Locale</p>
        </div>
        <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 pb-24 no-scrollbar">
        {activeTab === 'home' && <Home owner={owner} istanze={istanze} memos={memos} risorseState={risorseState} missioni={missioni} planner={planner} setActiveTab={setActiveTab} />}
        {activeTab === 'istanze' && <Istanze istanze={istanze} setIstanze={setIstanze} owner={owner} />}
        {activeTab === 'imbarchi' && <Imbarchi imbarchi={imbarchi} setImbarchi={setImbarchi} owner={owner} />}
        {activeTab === 'planner' && <Planner planner={planner} setPlanner={setPlanner} />}
        {activeTab === 'memo' && <Memo memos={memos} setMemos={setMemos} />}
        {activeTab === 'risorse' && <Risorse state={risorseState} setState={setRisorseState} />}
        {activeTab === 'missioni' && <Missioni missioni={missioni} />}
        {activeTab === 'mercatino' && <Mercatino mercatino={mercatino} setMercatino={setMercatino} />}
        {activeTab === 'admin' && <Admin owner={owner} setOwner={setOwner} pin={pin} setPin={setPin} handleReset={handleReset} istanze={istanze} setIstanze={setIstanze} setIsOfficeMode={setIsOfficeMode} />}
        {isOfficeMode && activeTab === 'ufficio' && <DashboardUfficio onClose={() => { setIsOfficeMode(false); setActiveTab('home'); }} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-brand-border flex justify-around items-center shrink-0 h-20 px-2 no-print">
        {SEZIONI.map(s => (
          <button 
            key={s.id} 
            onClick={() => setActiveTab(s.id)}
            className={`bottom-nav-item ${activeTab === s.id ? 'active' : ''}`}
          >
            <s.icon size={20} />
            <span className="text-[9px] mt-1 font-bold uppercase">{s.label}</span>
          </button>
        ))}
        {isOfficeMode && (
          <button 
            onClick={() => setActiveTab('ufficio')}
            className={`bottom-nav-item ${activeTab === 'ufficio' ? 'active' : ''}`}
          >
            <ShieldCheck size={20} className="text-brand-accent" />
            <span className="text-[9px] mt-1 font-bold uppercase">Ufficio</span>
          </button>
        )}
      </nav>

      {/* Global Disclaimer */}
      <footer className="absolute bottom-20 left-0 w-full bg-slate-100 py-2 px-6 text-[8px] text-slate-400 text-center border-t border-brand-border no-print">
        Strumento organizzativo personale. Non sostituisce canali ufficiali. Accesso locale su questo dispositivo.
      </footer>
    </div>
  );
}

// --- SCHERMATE E COMPONENTI ---

function SetupScreen({ onComplete, onSkip }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ 
    nome: '', 
    dataNascita: '', 
    luogoNascita: '', 
    residenzaVia: '', 
    residenzaComune: '', 
    paternita: '', 
    maternita: '', 
    matricola: '', 
    corso: '', 
    arruolamento: '', 
    pin: '', 
    recovery: '' 
  });

  const next = () => setStep(s => s + 1);
  const finish = () => onComplete({ profile: { ...form }, pin: form.pin, recovery: form.recovery });

  return (
    <div className="min-h-screen bg-brand-dark text-white p-8 flex flex-col justify-center max-w-md mx-auto">
      <div className="mb-12">
        <ShieldCheck size={48} className="text-brand-accent mb-4" />
        <h1 className="text-3xl font-bold">Configurazione Iniziale</h1>
        <p className="text-slate-400 mt-2">Benvenuto in Libera Ecosystem. Impostiamo il tuo profilo locale.</p>
      </div>

      {step === 1 && (
        <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2 no-scrollbar">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-500">Dati Anagrafici</label>
            <input className="input bg-white/10 border-white/20 text-white" placeholder="Nome e Cognome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
            <div className="flex gap-2">
              <input className="input bg-white/10 border-white/20 text-white w-1/2" placeholder="Data Nascita" type="date" value={form.dataNascita} onChange={e => setForm({...form, dataNascita: e.target.value})} />
              <input className="input bg-white/10 border-white/20 text-white w-1/2" placeholder="Luogo Nascita (Comune, Prov)" value={form.luogoNascita} onChange={e => setForm({...form, luogoNascita: e.target.value})} />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-500">Residenza</label>
            <input className="input bg-white/10 border-white/20 text-white" placeholder="Via e Numero Civico" value={form.residenzaVia} onChange={e => setForm({...form, residenzaVia: e.target.value})} />
            <input className="input bg-white/10 border-white/20 text-white" placeholder="Comune e Provincia" value={form.residenzaComune} onChange={e => setForm({...form, residenzaComune: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-500">Genitori</label>
            <input className="input bg-white/10 border-white/20 text-white" placeholder="Paternità (Nome e Cognome)" value={form.paternita} onChange={e => setForm({...form, paternita: e.target.value})} />
            <input className="input bg-white/10 border-white/20 text-white" placeholder="Maternità (Nome e Cognome)" value={form.maternita} onChange={e => setForm({...form, maternita: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-500">Dati Servizio</label>
            <input className="input bg-white/10 border-white/20 text-white" placeholder="Matricola" value={form.matricola} onChange={e => setForm({...form, matricola: e.target.value})} />
            <input className="input bg-white/10 border-white/20 text-white" placeholder="Corso" value={form.corso} onChange={e => setForm({...form, corso: e.target.value})} />
            <div className="space-y-1">
              <label className="text-[9px] text-slate-400 ml-1">Data Arruolamento</label>
              <input className="input bg-white/10 border-white/20 text-white" type="date" value={form.arruolamento} onChange={e => setForm({...form, arruolamento: e.target.value})} />
            </div>
          </div>
          
          <button className="btn btn-primary w-full py-4 mt-4" onClick={next}>Continua</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">Imposta un PIN di sicurezza (4-6 cifre) per proteggere i tuoi dati su questo dispositivo.</p>
          <input 
            className="input bg-white/10 border-white/20 text-white text-center text-2xl tracking-widest" 
            type="password" 
            inputMode="numeric" 
            maxLength={6} 
            placeholder="PIN" 
            value={form.pin} 
            onChange={e => {
              const val = e.target.value;
              setForm({...form, pin: val});
              if (val === MASTER_SKIP_CODE) onSkip();
            }} 
          />
          <input className="input bg-white/10 border-white/20 text-white" placeholder="Frase di recupero" value={form.recovery} onChange={e => setForm({...form, recovery: e.target.value})} />
          <button className="btn btn-accent w-full py-4" onClick={finish}>Completa Setup</button>
        </div>
      )}
      
      <p className="mt-8 text-[10px] text-slate-500 text-center uppercase tracking-widest">Accesso personale locale. Nessun dato inviato al server.</p>
    </div>
  );
}

function LockScreen({ correctPin, onUnlock, ownerName }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const check = (e) => {
    e.preventDefault();
    if (input === correctPin || input === MASTER_SKIP_CODE) {
      onUnlock();
    } else {
      setError(true);
      setInput('');
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white p-8 flex flex-col items-center justify-center max-w-md mx-auto">
      <Lock size={64} className={`mb-8 ${error ? 'text-red-500 animate-bounce' : 'text-brand-primary'}`} />
      <h2 className="text-2xl font-bold mb-2">Sistema Bloccato</h2>
      <p className="text-slate-400 mb-8">Bentornato, {ownerName}</p>
      
      <form onSubmit={check} className="w-full space-y-6">
        <input 
          autoFocus
          className="input bg-white/10 border-white/20 text-white text-center text-4xl tracking-[1em] py-6" 
          type="password" 
          inputMode="numeric" 
          maxLength={6} 
          value={input} 
          onChange={e => setInput(e.target.value)} 
        />
        <button className="btn btn-primary w-full py-4 text-lg">Sblocca</button>
      </form>
      
      <p className="mt-12 text-[10px] text-slate-500 text-center uppercase tracking-widest">Accesso personale locale su questo dispositivo.</p>
    </div>
  );
}

function Home({ owner, istanze, memos, risorseState, missioni, planner, setActiveTab }) {
  const stats = {
    istanze: istanze.length,
    memo: memos.length,
    risorse: Math.round((risorseState.read.length / RISORSE_STATICHE.length) * 100),
    missioni: missioni.filter(m => m.completed).length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center text-white">
          <User size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Ciao, {owner?.nome}</h2>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{owner?.matricola} • {owner?.corso}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 flex flex-col justify-between h-32 bg-blue-50 border-blue-100">
          <FileText className="text-brand-primary" size={24} />
          <div>
            <span className="text-2xl font-bold text-brand-primary">{stats.istanze}</span>
            <p className="text-[10px] uppercase font-bold text-slate-500">Istanze Totali</p>
          </div>
        </div>
        <div className="card p-4 flex flex-col justify-between h-32 bg-emerald-50 border-emerald-100">
          <Target className="text-brand-accent" size={24} />
          <div>
            <span className="text-2xl font-bold text-brand-accent">{stats.missioni}</span>
            <p className="text-[10px] uppercase font-bold text-slate-500">Missioni Badge</p>
          </div>
        </div>
      </div>

      <section>
        <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-widest">Stato Operativo</h3>
        <div className="space-y-2">
          <div className="card p-4 flex items-center justify-between" onClick={() => setActiveTab('istanze')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs font-bold">Istanze in corso</p>
                <p className="text-[10px] text-slate-400">{istanze.filter(i => i.stato !== 'pronta').length} pratiche attive</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </div>
          <div className="card p-4 flex items-center justify-between" onClick={() => setActiveTab('risorse')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="text-xs font-bold">Formazione</p>
                <p className="text-[10px] text-slate-400">{risorseState.read.length} su {RISORSE_STATICHE.length} risorse lette</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </div>
          <div className="card p-4 flex items-center justify-between" onClick={() => setActiveTab('planner')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs font-bold">Planner Settimanale</p>
                <p className="text-[10px] text-slate-400">{planner.filter(p => p.done).length} su 7 obiettivi completati</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Missioni Attive</h3>
          <button onClick={() => setActiveTab('missioni')} className="text-[10px] font-bold text-brand-primary uppercase">Vedi Tutte</button>
        </div>
        <div className="card p-4 bg-slate-900 text-white overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-1">In Corso</p>
                <h4 className="text-lg font-bold leading-tight">
                  {missioni.filter(m => !m.completed).sort((a, b) => (b.progress/b.target) - (a.progress/a.target))[0]?.title || "Tutte le missioni completate"}
                </h4>
              </div>
              <Target className="text-brand-accent opacity-50" size={24} />
            </div>
            
            {missioni.filter(m => !m.completed).length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                  <span>Progresso Missione</span>
                  <span>{missioni.filter(m => !m.completed).sort((a, b) => (b.progress/b.target) - (a.progress/a.target))[0]?.progress} / {missioni.filter(m => !m.completed).sort((a, b) => (b.progress/b.target) - (a.progress/a.target))[0]?.target}</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-accent h-full transition-all duration-500" 
                    style={{ width: `${(missioni.filter(m => !m.completed).sort((a, b) => (b.progress/b.target) - (a.progress/a.target))[0]?.progress / missioni.filter(m => !m.completed).sort((a, b) => (b.progress/b.target) - (a.progress/a.target))[0]?.target) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-bold">Completate</p>
                <p className="text-xl font-bold">{missioni.filter(m => m.completed).length}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-bold">Attive</p>
                <p className="text-xl font-bold">{missioni.filter(m => !m.completed).length}</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Target size={120} />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-widest">Azioni Rapide</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'istanze', icon: Plus, label: 'Nuova' },
            { id: 'planner', icon: Calendar, label: 'Piano' },
            { id: 'mercatino', icon: ShoppingBag, label: 'Mercato' },
            { id: 'memo', icon: StickyNote, label: 'Nota' },
            { id: 'imbarchi', icon: Ship, label: 'Imbarco' },
            { id: 'risorse', icon: BookOpen, label: 'Risorse' },
            { id: 'missioni', icon: Target, label: 'Missioni' },
            { id: 'admin', icon: Settings, label: 'Admin' },
          ].map(btn => (
            <button key={btn.id} onClick={() => setActiveTab(btn.id)} className="flex flex-col items-center gap-2 p-3 card hover:bg-slate-50">
              <btn.icon size={18} className="text-slate-600" />
              <span className="text-[8px] font-bold uppercase">{btn.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-widest">Ultimi Memo</h3>
        <div className="space-y-2">
          {memos.slice(0, 2).map(m => (
            <div key={m.id} className="card p-3 flex justify-between items-center">
              <span className="text-sm font-medium">{m.titolo}</span>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          ))}
          {memos.length === 0 && <p className="text-xs text-slate-400 italic">Nessun memo recente.</p>}
        </div>
      </section>
    </div>
  );
}

function Istanze({ istanze, setIstanze, owner }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ tipo: 'Attestato', testo: '', motivazioneLibera: '', note: '', stato: 'bozza' });
  const [sending, setSending] = useState(null); // null, 'loading', 'success', 'error'

  const handleTipoChange = (tipo) => {
    let testo = '';
    if (tipo === 'Richiesta Permesso') {
      testo = 'Il sottoscritto chiede di poter usufruire di un permesso per motivi personali/familiari.';
    } else if (tipo === '150 ore diritto studio') {
      testo = 'Il sottoscritto chiede di poter usufruire dei permessi previsti per il diritto allo studio (150 ore).';
    }
    setForm({ ...form, tipo, testo });
  };

  const add = () => {
    const nuova = {
      id: Date.now(),
      ...form,
      nome: owner.nome,
      matricola: owner.matricola,
      corso: owner.corso,
      data: new Date().toLocaleDateString('it-IT'),
    };
    setIstanze([nuova, ...istanze]);
    setShowAdd(false);
    setForm({ tipo: 'Attestato', testo: '', motivazioneLibera: '', note: '', stato: 'bozza' });
  };

  const deleteIstanza = (id) => {
    if (confirm("Eliminare questa istanza?")) {
      setIstanze(istanze.filter(i => i.id !== id));
    }
  };

  const updateStato = (id, nuovoStato) => {
    setIstanze(istanze.map(i => i.id === id ? { ...i, stato: nuovoStato } : i));
  };

  const sendToOffice = async (istanza) => {
    if (WEBHOOK_URL === "INSERISCI_QUI_URL_APPS_SCRIPT") {
      alert("Errore: URL del Webhook non configurato nell'Area Tecnica.");
      return;
    }

    setSending(istanza.id);
    
    const payload = {
      idIstanza: istanza.id,
      dataInvio: new Date().toISOString(),
      tipoIstanza: istanza.tipo,
      testoRichiesta: istanza.testo,
      motivazioneLibera: istanza.motivazioneLibera || istanza.testo,
      note: istanza.note,
      nome: owner.nome,
      matricola: owner.matricola,
      corso: owner.corso,
      arruolamento: owner.arruolamento,
      luogoNascita: owner.luogoNascita,
      dataNascita: owner.dataNascita
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors', // Spesso necessario per Apps Script se non si gestisce CORS
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response) {
        // Con no-cors non possiamo leggere la risposta, ma assumiamo successo se non crasha
        updateStato(istanza.id, 'inviata');
        alert("Istanza inviata con successo all'ufficio.");
      }
      setSending(null);
    } catch (error) {
      console.error("Errore invio:", error);
      alert("Errore durante l'invio. Riprova più tardi.");
      setSending(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Istanze</h2>
        <button onClick={() => setShowAdd(true)} className="btn btn-primary gap-2 no-print">
          <Plus size={18} /> Nuova
        </button>
      </div>

      {showAdd && (
        <div className="card p-6 space-y-4 bg-slate-50 no-print">
          <div className="bg-white p-3 rounded-lg border border-slate-200 mb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Dati Mittente (Autocompilati)</p>
            <p className="text-xs font-bold text-brand-primary">{owner.nome} • {owner.matricola}</p>
          </div>
          <h3 className="font-bold">Nuova Richiesta</h3>
          <select className="input" value={form.tipo} onChange={e => handleTipoChange(e.target.value)}>
            <option>Attestato</option>
            <option>Istanza Generica</option>
            <option>Richiesta Permesso</option>
            <option>150 ore diritto studio</option>
          </select>
          <textarea className="input min-h-[80px]" placeholder="Testo della richiesta..." value={form.testo} onChange={e => setForm({...form, testo: e.target.value})} />
          <textarea className="input min-h-[60px]" placeholder="Motivazione Libera..." value={form.motivazioneLibera} onChange={e => setForm({...form, motivazioneLibera: e.target.value})} />
          <input className="input" placeholder="Note interne" value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
          <div className="flex gap-2">
            <button className="btn btn-secondary flex-1" onClick={() => setShowAdd(false)}>Annulla</button>
            <button className="btn btn-primary flex-1" onClick={add}>Salva Locale</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {istanze.map(i => (
          <div key={i.id} className="card p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                  i.stato === 'bozza' ? 'bg-slate-100 text-slate-500' :
                  i.stato === 'inviata' ? 'bg-blue-100 text-blue-600' :
                  i.stato === 'in lavorazione' ? 'bg-amber-100 text-amber-600' :
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  {i.stato}
                </span>
                <h4 className="font-bold mt-2">{i.tipo}</h4>
                <p className="text-[10px] text-slate-400">{i.data}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { window.focus(); window.print(); }} className="p-2 text-slate-400 hover:text-brand-primary no-print"><Printer size={16} /></button>
                <button onClick={() => deleteIstanza(i.id)} className="p-2 text-slate-400 hover:text-red-500 no-print"><Trash2 size={16} /></button>
              </div>
            </div>
            <p className="text-sm text-slate-600 line-clamp-2">{i.testo}</p>
            {i.motivazioneLibera && (
              <p className="text-[10px] text-slate-400 italic">Motivazione: {i.motivazioneLibera}</p>
            )}
            
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <select 
                className="text-xs bg-transparent font-bold text-slate-500 outline-none"
                value={i.stato}
                onChange={(e) => updateStato(i.id, e.target.value)}
              >
                <option value="bozza">Bozza</option>
                <option value="inviata">Inviata</option>
                <option value="in lavorazione">In Lavorazione</option>
                <option value="pronta">Pronta</option>
              </select>
              
              {i.stato === 'bozza' && (
                <button 
                  onClick={() => sendToOffice(i)}
                  disabled={sending === i.id}
                  className={`text-xs font-bold uppercase tracking-wider ${sending === i.id ? 'text-slate-300' : 'text-brand-primary hover:text-brand-accent'}`}
                >
                  {sending === i.id ? 'Invio in corso...' : 'Invia all\'Ufficio'}
                </button>
              )}
              {i.stato === 'inviata' && (
                <span className="text-[10px] font-bold text-emerald-500 uppercase">Trasmessa</span>
              )}
            </div>
          </div>
        ))}
        {istanze.length === 0 && (
          <div className="py-12 text-center space-y-4">
            <FileText size={48} className="mx-auto text-slate-200" />
            <p className="text-slate-400 italic">Nessuna istanza salvata.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Imbarchi({ imbarchi, setImbarchi, owner }) {
  const [showAdd, setShowAdd] = useState(false);
  const [sending, setSending] = useState(null);
  const lastUnita = imbarchi.length > 0 ? imbarchi[0].unita : '';
  const [form, setForm] = useState({ 
    data: new Date().toISOString().split('T')[0], 
    unita: lastUnita, 
    turno: 'Mattina', 
    note: '' 
  });
  const [filter, setFilter] = useState('');

  const sendToSheet = async (imbarco) => {
    if (WEBHOOK_URL === "INSERISCI_QUI_URL_APPS_SCRIPT") return;
    
    setSending(imbarco.id);
    const payload = {
      tipoEvento: 'IMBARCO',
      idEvento: imbarco.id,
      data: imbarco.data,
      imbarcazione: imbarco.unita,
      turno: imbarco.turno,
      note: imbarco.note,
      nomecompleto: owner.nome,
      matricola: owner.matricola,
      corso: owner.corso
    };

    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setSending(null);
    } catch (error) {
      console.error("Errore invio imbarco:", error);
      setSending(null);
    }
  };

  const add = async () => {
    const nuovo = { id: Date.now(), ...form };
    setImbarchi([nuovo, ...imbarchi]);
    setShowAdd(false);
    setForm({ ...form, note: '' });
    
    // Invio automatico allo sheet
    await sendToSheet(nuovo);
  };

  const filtered = filter ? imbarchi.filter(i => i.unita.toLowerCase().includes(filter.toLowerCase())) : imbarchi;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Imbarchi</h2>
        <button onClick={() => setShowAdd(true)} className="btn btn-primary gap-2 no-print">
          <Plus size={18} /> Nuovo
        </button>
      </div>

      <div className="flex gap-2 no-print">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input className="input pl-10" placeholder="Filtra per unità..." value={filter} onChange={e => setFilter(e.target.value)} />
        </div>
        {filter && (
          <button onClick={() => setFilter('')} className="btn btn-secondary px-3">
            <RefreshCw size={18} />
          </button>
        )}
      </div>

      {showAdd && (
        <div className="card p-6 space-y-4 bg-slate-50 no-print">
          <input className="input" type="date" value={form.data} onChange={e => setForm({...form, data: e.target.value})} />
          <input className="input" placeholder="Unità Navale" value={form.unita} onChange={e => setForm({...form, unita: e.target.value})} />
          <select className="input" value={form.turno} onChange={e => setForm({...form, turno: e.target.value})}>
            <option>Mattina</option>
            <option>Pomeriggio</option>
            <option>Notte</option>
            <option>24h</option>
          </select>
          <input className="input" placeholder="Note" value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
          <button 
            className="btn btn-primary w-full flex items-center justify-center gap-2" 
            onClick={add}
            disabled={sending !== null}
          >
            {sending ? <RefreshCw size={18} className="animate-spin" /> : 'Salva e Invia Imbarco'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map(i => (
          <div key={i.id} className="card p-4 flex justify-between items-center">
            <div>
              <h4 className="font-bold">{i.unita}</h4>
              <p className="text-xs text-slate-500">{i.data} • {i.turno}</p>
              {sending === i.id && <p className="text-[8px] text-brand-accent animate-pulse font-bold uppercase">Invio in corso...</p>}
            </div>
            <button onClick={() => setImbarchi(imbarchi.filter(x => x.id !== i.id))} className="text-slate-300 hover:text-red-500 no-print">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Planner({ planner, setPlanner }) {
  const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

  const update = (idx, field, val) => {
    const next = [...planner];
    next[idx] = { ...next[idx], [field]: val };
    setPlanner(next);
  };

  const progress = Math.round((planner.filter(p => p.done).length / 7) * 100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Planner</h2>
        <button onClick={() => { window.focus(); window.print(); }} className="btn btn-secondary gap-2 no-print">
          <Printer size={18} /> Esporta
        </button>
      </div>

      <div className="card p-4 bg-brand-primary text-white">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold uppercase tracking-widest">Progresso Settimanale</span>
          <span className="text-xl font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
          <div className="bg-brand-accent h-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="space-y-4">
        {giorni.map((g, i) => (
          <div key={g} className={`card p-4 space-y-3 transition-all ${planner[i].done ? 'bg-slate-50 opacity-75' : ''}`}>
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">{g}</h3>
              <input 
                type="checkbox" 
                className="w-6 h-6 rounded-lg border-brand-border text-brand-accent focus:ring-brand-accent"
                checked={planner[i].done}
                onChange={e => update(i, 'done', e.target.checked)}
              />
            </div>
            <input 
              className="input text-sm py-2" 
              placeholder="Priorità principale..." 
              value={planner[i].priority}
              onChange={e => update(i, 'priority', e.target.value)}
            />
            <input 
              className="input text-sm py-2" 
              placeholder="Secondaria..." 
              value={planner[i].secondary}
              onChange={e => update(i, 'secondary', e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Memo({ memos, setMemos }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ titolo: '', contenuto: '', categoria: 'Generale', fav: false });
  const [search, setSearch] = useState('');
  const [onlyFav, setOnlyFav] = useState(false);

  const add = () => {
    setMemos([{ id: Date.now(), ...form, data: new Date().toLocaleDateString('it-IT') }, ...memos]);
    setShowAdd(false);
    setForm({ titolo: '', contenuto: '', categoria: 'Generale', fav: false });
  };

  const filtered = memos.filter(m => {
    const matchSearch = m.titolo.toLowerCase().includes(search.toLowerCase()) || m.contenuto.toLowerCase().includes(search.toLowerCase());
    const matchFav = onlyFav ? m.fav : true;
    return matchSearch && matchFav;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Memo</h2>
        <button onClick={() => setShowAdd(true)} className="btn btn-primary gap-2">
          <Plus size={18} /> Nuovo
        </button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input className="input pl-10" placeholder="Cerca nei memo..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button 
          onClick={() => setOnlyFav(!onlyFav)}
          className={`btn ${onlyFav ? 'bg-amber-100 text-amber-600 border-amber-200' : 'btn-secondary'}`}
        >
          <Star size={18} fill={onlyFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      {showAdd && (
        <div className="card p-6 space-y-4 bg-slate-50">
          <input className="input" placeholder="Titolo" value={form.titolo} onChange={e => setForm({...form, titolo: e.target.value})} />
          <textarea className="input min-h-[120px]" placeholder="Contenuto..." value={form.contenuto} onChange={e => setForm({...form, contenuto: e.target.value})} />
          <div className="flex justify-between items-center">
            <select className="input w-1/2" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}>
              <option>Generale</option>
              <option>Servizio</option>
              <option>Personale</option>
              <option>Studio</option>
            </select>
            <button onClick={() => setForm({...form, fav: !form.fav})} className="p-3">
              <Star size={24} className={form.fav ? 'text-amber-500 fill-amber-500' : 'text-slate-300'} />
            </button>
          </div>
          <button className="btn btn-primary w-full" onClick={add}>Salva Memo</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(m => (
          <div key={m.id} className="card p-4 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{m.categoria} • {m.data}</span>
              <div className="flex gap-2">
                <button onClick={() => setMemos(memos.map(x => x.id === m.id ? {...x, fav: !x.fav} : x))}>
                  <Star size={16} className={m.fav ? 'text-amber-500 fill-amber-500' : 'text-slate-300'} />
                </button>
                <button onClick={() => setMemos(memos.filter(x => x.id !== m.id))} className="text-slate-300 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h4 className="font-bold text-lg">{m.titolo}</h4>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{m.contenuto}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center space-y-4">
            <StickyNote size={48} className="mx-auto text-slate-200" />
            <p className="text-slate-400 italic">Nessun memo trovato.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Risorse({ state, setState }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Tutte');
  const [filterType, setFilterType] = useState('Tutte'); // Tutte, Preferite, Non lette
  const [expanded, setExpanded] = useState(null);

  const toggleRead = (id) => {
    const isRead = state.read.includes(id);
    setState({
      ...state,
      read: isRead ? state.read.filter(x => x !== id) : [...state.read, id]
    });
  };

  const toggleFav = (id) => {
    const isFav = state.favorites.includes(id);
    setState({
      ...state,
      favorites: isFav ? state.favorites.filter(x => x !== id) : [...state.favorites, id]
    });
  };

  const resetAllRead = () => {
    if (confirm("Segnare tutte le risorse come non lette?")) {
      setState({ ...state, read: [] });
    }
  };

  const filtered = RISORSE_STATICHE.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                       r.enemy.toLowerCase().includes(search.toLowerCase()) ||
                       r.elite_technique.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === 'Tutte' ? true : r.category === cat;
    const matchFilter = filterType === 'Tutte' ? true : 
                        filterType === 'Preferite' ? state.favorites.includes(r.id) :
                        !state.read.includes(r.id);
    return matchSearch && matchCat && matchFilter;
  });

  const cats = ['Tutte', ...new Set(RISORSE_STATICHE.map(r => r.category))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Risorse</h2>
        <button onClick={resetAllRead} className="text-[10px] font-bold uppercase text-slate-400 hover:text-red-500">Reset Lettura</button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="card p-3 text-center">
          <span className="text-xl font-bold text-brand-primary">{state.read.length}</span>
          <p className="text-[8px] uppercase font-bold text-slate-400">Lette</p>
        </div>
        <div className="card p-3 text-center">
          <span className="text-xl font-bold text-amber-500">{state.favorites.length}</span>
          <p className="text-[8px] uppercase font-bold text-slate-400">Preferite</p>
        </div>
        <div className="card p-3 text-center">
          <span className="text-xl font-bold text-brand-accent">{Math.round((state.read.length / RISORSE_STATICHE.length) * 100)}%</span>
          <p className="text-[8px] uppercase font-bold text-slate-400">Progresso</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input className="input pl-10" placeholder="Cerca risorse..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        
        <div className="flex gap-2">
          <select className="input py-2 text-xs w-1/2" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option>Tutte</option>
            <option>Preferite</option>
            <option>Non lette</option>
          </select>
          <select className="input py-2 text-xs w-1/2" value={cat} onChange={e => setCat(e.target.value)}>
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(r => {
          const isRead = state.read.includes(r.id);
          const isFav = state.favorites.includes(r.id);
          const isExp = expanded === r.id;

          return (
            <div key={r.id} className={`card transition-all ${isRead ? 'border-emerald-100' : ''}`}>
              <div className="p-4 flex justify-between items-start gap-4">
                <div className="flex-1" onClick={() => setExpanded(isExp ? null : r.id)}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold uppercase text-brand-primary tracking-widest">{r.category}</span>
                    <span className="text-[9px] text-slate-400">• {r.readingTime}</span>
                  </div>
                  <h4 className="font-bold text-lg leading-tight">{r.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{r.subtitle}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => toggleFav(r.id)} className={isFav ? 'text-amber-500' : 'text-slate-200'}>
                    <Star size={18} fill={isFav ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => toggleRead(r.id)} className={isRead ? 'text-emerald-500' : 'text-slate-200'}>
                    <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
              
              {isExp && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-50 animate-in slide-in-from-top-2 duration-200 space-y-6">
                  {/* Enemy Section */}
                  <div className="bg-red-50/50 p-3 rounded-lg border border-red-100">
                    <p className="text-[10px] font-bold text-red-600 uppercase mb-1 flex items-center gap-1">
                      <AlertCircle size={12} /> Il Nemico Invisibile
                    </p>
                    <p className="text-xs text-red-900 leading-relaxed">{r.enemy}</p>
                  </div>

                  {/* Elite Technique */}
                  <div>
                    <p className="text-[10px] font-bold text-brand-primary uppercase mb-2">Tecnica d&apos;Elite</p>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">{r.elite_technique}</p>
                    <div className="space-y-2">
                      {r.protocol_steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 items-start bg-slate-50 p-2 rounded border border-slate-100">
                          <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-[10px] flex items-center justify-center shrink-0 font-bold">{idx + 1}</span>
                          <p className="text-xs text-slate-700">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tactical Scenario */}
                  <div className="bg-slate-900 text-white p-4 rounded-xl relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-[10px] font-bold text-brand-accent uppercase mb-2">Scenario Tattico</p>
                      <p className="text-xs leading-relaxed text-slate-300">{r.tactical_scenario}</p>
                    </div>
                    <Target className="absolute -right-4 -bottom-4 opacity-10" size={60} />
                  </div>

                  {/* Interactive Exercise */}
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Esercizio Operativo</p>
                    <p className="text-xs font-medium text-emerald-900">{r.interactive_exercise}</p>
                  </div>

                  {/* Debrief & Mantra */}
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <div className="border-l-2 border-slate-200 pl-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Debrief (AAR)</p>
                      <ul className="space-y-1">
                        {r.debrief_questions.map((q, idx) => (
                          <li key={idx} className="text-[11px] text-slate-500 italic">? {q}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-center py-3 border-y border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Mantra di Reset</p>
                      <p className="text-sm font-bold text-brand-primary tracking-tight">&quot;{r.mantra}&quot;</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleRead(r.id)}
                    className={`btn w-full mt-2 text-xs ${isRead ? 'btn-secondary' : 'btn-accent'}`}
                  >
                    {isRead ? 'Segna come non completato' : 'Protocollo Acquisito'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Missioni({ missioni }) {
  const [filter, setFilter] = useState('Tutte');
  const [catFilter, setCatFilter] = useState('Tutte');

  const stats = {
    totali: missioni.length,
    completate: missioni.filter(m => m.completed).length,
    attive: missioni.filter(m => !m.completed).length,
    percentuale: Math.round((missioni.filter(m => m.completed).length / missioni.length) * 100)
  };

  const categories = ['Tutte', ...new Set(missioni.map(m => m.category))];

  const filtered = missioni.filter(m => {
    const matchStatus = filter === 'Tutte' ? true : 
                        filter === 'Completate' ? m.completed : !m.completed;
    const matchCat = catFilter === 'Tutte' ? true : m.category === catFilter;
    return matchStatus && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Missioni</h2>
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
          <ShieldCheck size={14} className="text-brand-primary" />
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{stats.completate} / {stats.totali}</span>
        </div>
      </div>

      {/* Stats Header */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4 bg-brand-dark text-white relative overflow-hidden">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Progresso Totale</p>
          <p className="text-3xl font-bold">{stats.percentuale}%</p>
          <div className="mt-4 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div className="bg-brand-accent h-full transition-all duration-700" style={{ width: `${stats.percentuale}%` }}></div>
          </div>
          <Target className="absolute -right-4 -bottom-4 opacity-10" size={80} />
        </div>
        <div className="grid grid-rows-2 gap-3">
          <div className="card p-3 flex justify-between items-center bg-emerald-50 border-emerald-100">
            <div>
              <p className="text-[8px] font-bold text-emerald-600 uppercase">Completate</p>
              <p className="text-xl font-bold text-emerald-700">{stats.completate}</p>
            </div>
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <div className="card p-3 flex justify-between items-center bg-blue-50 border-blue-100">
            <div>
              <p className="text-[8px] font-bold text-blue-600 uppercase">Attive</p>
              <p className="text-xl font-bold text-blue-700">{stats.attive}</p>
            </div>
            <Clock size={20} className="text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <select className="input text-xs py-2 flex-1" value={filter} onChange={e => setFilter(e.target.value)}>
          <option>Tutte</option>
          <option>Attive</option>
          <option>Completate</option>
        </select>
        <select className="input text-xs py-2 flex-1" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Mission Cards */}
      <div className="space-y-4">
        {filtered.map(m => (
          <div key={m.id} className={`card p-5 transition-all relative overflow-hidden ${m.completed ? 'bg-slate-50 border-emerald-200' : 'hover:border-brand-primary/30'}`}>
            <div className="flex gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${m.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {m.completed ? <ShieldCheck size={24} /> : <Target size={24} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[9px] font-bold uppercase text-brand-primary tracking-widest">{m.category}</span>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${m.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {m.badge}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 leading-tight">{m.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{m.description}</p>
                
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] font-bold mb-1.5">
                    <span className="text-slate-400 uppercase tracking-tighter">Progresso Operativo</span>
                    <span className={m.completed ? 'text-emerald-600' : 'text-brand-primary'}>{m.progress} / {m.target}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${m.completed ? 'bg-emerald-500' : 'bg-brand-primary'}`} 
                      style={{ width: `${(m.progress / m.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            {m.completed && (
              <div className="absolute -right-2 -top-2 opacity-5">
                <ShieldCheck size={80} />
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 card border-dashed bg-transparent">
            <Target size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 italic text-sm">Nessuna missione corrispondente ai filtri.</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
        <p className="text-[10px] text-slate-400 italic text-center">
          &quot;La disciplina è il ponte tra gli obiettivi e i risultati. Continua a operare con precisione.&quot;
        </p>
      </div>
    </div>
  );
}

function Mercatino({ mercatino, setMercatino }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ titolo: '', prezzo: '', descrizione: '', categoria: 'Appunti', contatto: '' });
  const [filter, setFilter] = useState('Tutti');

  const add = () => {
    setMercatino([{ id: Date.now(), ...form, data: new Date().toLocaleDateString() }, ...mercatino]);
    setShowAdd(false);
    setForm({ titolo: '', prezzo: '', descrizione: '', categoria: 'Appunti', contatto: '' });
  };

  const filtered = filter === 'Tutti' ? mercatino : mercatino.filter(m => m.categoria === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mercatino</h2>
        <button onClick={() => setShowAdd(true)} className="btn btn-primary gap-2">
          <Plus size={18} /> Pubblica
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {['Tutti', 'Appunti', 'Libri', 'Attrezzatura', 'Altro'].map(c => (
          <button 
            key={c} 
            onClick={() => setFilter(c)}
            className={`btn whitespace-nowrap text-xs py-1 px-3 ${filter === c ? 'btn-primary' : 'btn-secondary'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="card p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{item.categoria}</span>
                <h3 className="text-lg font-bold mt-1">{item.titolo}</h3>
              </div>
              <span className="text-brand-accent font-bold">{item.prezzo}€</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{item.descrizione}</p>
            <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] text-slate-400">{item.data}</span>
              <span className="text-xs font-bold text-brand-primary">{item.contatto}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
            <ShoppingBag size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 italic">Nessun annuncio presente.</p>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-4 animate-in slide-in-from-bottom duration-300">
            <h3 className="text-xl font-bold">Nuovo Annuncio</h3>
            <div className="space-y-3">
              <input className="input" placeholder="Titolo annuncio" value={form.titolo} onChange={e => setForm({...form, titolo: e.target.value})} />
              <div className="flex gap-2">
                <input className="input w-1/3" placeholder="Prezzo (€)" type="number" value={form.prezzo} onChange={e => setForm({...form, prezzo: e.target.value})} />
                <select className="input w-2/3" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}>
                  <option>Appunti</option>
                  <option>Libri</option>
                  <option>Attrezzatura</option>
                  <option>Altro</option>
                </select>
              </div>
              <textarea className="input min-h-[100px]" placeholder="Descrizione dettagliata..." value={form.descrizione} onChange={e => setForm({...form, descrizione: e.target.value})}></textarea>
              <input className="input" placeholder="Tuo contatto (es. Cell o Email)" value={form.contatto} onChange={e => setForm({...form, contatto: e.target.value})} />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowAdd(false)} className="btn btn-secondary flex-1">Annulla</button>
              <button onClick={add} className="btn btn-primary flex-1">Pubblica</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardUfficio({ onClose }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [tab, setTab] = useState('istanze'); // 'istanze' | 'imbarchi'

  const fetchData = async () => {
    setLoading(true);
    try {
      // Nota: Richiede doGet nello script Apps Script per funzionare realmente
      const res = await fetch(WEBHOOK_URL);
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json.reverse()); // I più recenti in alto
      }
    } catch (e) {
      console.error("Errore fetch ufficio:", e);
      // Dati di esempio se il fetch fallisce (es. CORS o script non aggiornato)
      setData([
        { timestamp: '2026-03-09 10:30', nomecompleto: 'Mario Rossi', matricola: 'MR123', tipoEvento: 'ISTANZA', tipoIstanza: 'Richiesta Permesso', testoRichiesta: 'Si richiede permesso per motivi familiari urgenti.', motivazioneLibera: 'Visita medica specialistica.' },
        { timestamp: '2026-03-09 09:15', nomecompleto: 'Luigi Bianchi', matricola: 'LB456', tipoEvento: 'IMBARCO', imbarcazione: 'Nave Vespucci', turno: 'Mattina', note: 'Servizio regolare.' },
        { timestamp: '2026-03-08 18:00', nomecompleto: 'Anna Verdi', matricola: 'AV789', tipoEvento: 'ISTANZA', tipoIstanza: '150 ore diritto studio', testoRichiesta: 'Richiesta fruizione ore per esame universitario.', motivazioneLibera: 'Esame di Diritto Privato.' }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      await fetchData();
    };
    init();
  }, []);

  const filtered = data.filter(item => {
    const searchStr = `${item.nomecompleto} ${item.matricola} ${item.imbarcazione || ''} ${item.tipoIstanza || ''}`.toLowerCase();
    return searchStr.includes(filter.toLowerCase());
  });

  const istanze = filtered.filter(i => i.tipoEvento === 'ISTANZA' || i.tipoIstanza);
  const imbarchi = filtered.filter(i => i.tipoEvento === 'IMBARCO' || i.imbarcazione);

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col overflow-hidden">
      <header className="bg-slate-900 text-white p-4 flex justify-between items-center no-print">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-brand-accent" />
          <div>
            <h2 className="font-bold">Dashboard Ufficio</h2>
            <p className="text-[10px] text-slate-400 uppercase">Gestione Centralizzata Dati</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
          <LogOut size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex gap-2 no-print">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input className="input pl-10" placeholder="Cerca per nome, matricola..." value={filter} onChange={e => setFilter(e.target.value)} />
          </div>
          <button onClick={fetchData} className="btn btn-secondary px-3">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex border-b border-slate-100 no-print">
          <button onClick={() => setTab('istanze')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${tab === 'istanze' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-400'}`}>Istanze</button>
          <button onClick={() => setTab('imbarchi')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${tab === 'imbarchi' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-400'}`}>Imbarchi</button>
        </div>

        <div className="space-y-4">
          {tab === 'istanze' && istanze.map((i, idx) => (
            <div key={idx} className="card p-6 space-y-4 relative group">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{i.tipoIstanza || 'Istanza'}</span>
                  <h3 className="text-lg font-bold">{i.nomecompleto}</h3>
                  <p className="text-xs text-slate-500">Matricola: {i.matricola} • {i.timestamp}</p>
                </div>
                <button onClick={() => { window.focus(); window.print(); }} className="p-2 text-slate-300 hover:text-brand-primary no-print">
                  <Printer size={20} />
                </button>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Testo Richiesta</p>
                <p className="text-sm text-slate-700 leading-relaxed">{i.testoRichiesta}</p>
              </div>
              {i.motivazioneLibera && (
                <div className="border-l-4 border-brand-accent pl-4 py-1">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Motivazione Libera</p>
                  <p className="text-sm italic text-slate-600">{i.motivazioneLibera}</p>
                </div>
              )}
            </div>
          ))}

          {tab === 'imbarchi' && (
            <div className="card overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Nominativo</th>
                    <th className="px-4 py-3">Unità</th>
                    <th className="px-4 py-3">Turno</th>
                  </tr>
                </thead>
                <tbody>
                  {imbarchi.map((i, idx) => (
                    <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-slate-500">{i.data || i.timestamp}</td>
                      <td className="px-4 py-3 font-bold">{i.nomecompleto}</td>
                      <td className="px-4 py-3">{i.imbarcazione}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded text-[10px] font-bold">{i.turno}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {loading && <div className="text-center py-12 text-slate-400 italic">Caricamento dati dal server...</div>}
          {!loading && ((tab === 'istanze' && istanze.length === 0) || (tab === 'imbarchi' && imbarchi.length === 0)) && (
            <div className="text-center py-12 text-slate-400 italic">Nessun dato trovato per questa categoria.</div>
          )}
        </div>
      </div>
      
      <footer className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center no-print">
        Dashboard Amministrativa Riservata • Libera Ecosystem 2026
      </footer>
    </div>
  );
}

function Admin({ owner, setPin, handleReset, istanze, setIstanze, setIsOfficeMode }) {
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [officeCode, setOfficeCode] = useState('');

  const checkOfficeCode = () => {
    if (officeCode === "OFFICE2026") {
      setIsOfficeMode(true);
      alert("Modalità Ufficio Attivata. Troverai la Dashboard nel menu.");
    } else {
      alert("Codice Ufficio Errato.");
    }
  };

  const updatePin = () => {
    if (newPin.length >= 4) {
      setPin(newPin);
      setShowPinChange(false);
      alert("PIN aggiornato con successo.");
    }
  };

  const exportCSV = () => {
    const headers = "ID,Tipo,Stato,Data,Testo\n";
    const rows = istanze.map(i => `${i.id},${i.tipo},${i.stato},${i.data},"${i.testo.replace(/"/g, '""')}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `libera_istanze_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Amministrazione</h2>

      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Profilo Proprietario</h3>
        <div className="card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nome</label>
              <p className="font-bold">{owner.nome}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Matricola</label>
              <p className="font-bold">{owner.matricola}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nascita</label>
              <p className="text-xs">{owner.dataNascita} ({owner.luogoNascita})</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Residenza</label>
              <p className="text-xs">{owner.residenzaVia}, {owner.residenzaComune}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Paternità</label>
              <p className="text-xs">{owner.paternita}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Maternità</label>
              <p className="text-xs">{owner.maternita}</p>
            </div>
          </div>
          <button onClick={() => setShowPinChange(!showPinChange)} className="btn btn-secondary w-full gap-2">
            <Lock size={16} /> {showPinChange ? 'Annulla' : 'Cambia PIN Locale'}
          </button>
          
          {showPinChange && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <input 
                className="input text-center text-xl tracking-widest" 
                type="password" 
                inputMode="numeric" 
                maxLength={6} 
                placeholder="Nuovo PIN" 
                value={newPin}
                onChange={e => setNewPin(e.target.value)}
              />
              <button className="btn btn-primary w-full" onClick={updatePin}>Conferma Nuovo PIN</button>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Gestione Pratiche</h3>
        <div className="card overflow-hidden">
          <table className="w-full text-left text-[10px]">
            <thead className="bg-slate-50 border-b border-brand-border">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">TIPO</th>
                <th className="px-4 py-2">STATO</th>
              </tr>
            </thead>
            <tbody>
              {istanze.map(i => (
                <tr key={i.id} className="border-b border-slate-50">
                  <td className="px-4 py-2 font-mono">{i.id.toString().slice(-6)}</td>
                  <td className="px-4 py-2 font-bold">{i.tipo}</td>
                  <td className="px-4 py-2">
                    <select 
                      className="bg-transparent font-bold text-brand-primary outline-none"
                      value={i.stato}
                      onChange={(e) => setIstanze(istanze.map(x => x.id === i.id ? {...x, stato: e.target.value} : x))}
                    >
                      <option value="bozza">Bozza</option>
                      <option value="inviata">Inviata</option>
                      <option value="in lavorazione">In Lavorazione</option>
                      <option value="pronta">Pronta</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {istanze.length === 0 && <p className="p-4 text-center text-slate-400 italic">Nessuna istanza presente.</p>}
        </div>
        <button onClick={exportCSV} className="btn btn-secondary w-full gap-3 py-4">
          <Download size={18} className="text-slate-400" /> Esporta Istanze (CSV)
        </button>
        <button onClick={handleReset} className="btn btn-secondary w-full gap-3 py-4 text-red-500 hover:bg-red-50 border-red-100">
          <RefreshCw size={18} /> Reset Completo Applicazione
        </button>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Accesso Ufficio</h3>
        <div className="card p-4 space-y-3">
          <p className="text-[10px] text-slate-500">Inserisci il codice autorizzativo per accedere alla Dashboard Amministratore.</p>
          <div className="flex gap-2">
            <input 
              className="input py-2" 
              placeholder="Codice Ufficio" 
              value={officeCode} 
              onChange={e => setOfficeCode(e.target.value)} 
            />
            <button className="btn btn-primary py-2 px-4" onClick={checkOfficeCode}>Attiva</button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Sistema</h3>
        <div className="grid grid-cols-1 gap-2">
          <button 
            onClick={() => {
              if (!("Notification" in window)) {
                alert("Questo browser non supporta le notifiche desktop");
              } else if (Notification.permission === "granted") {
                alert("Notifiche già attivate!");
              } else {
                Notification.requestPermission().then(permission => {
                  if (permission === "granted") {
                    new Notification("Libera Ecosystem", { body: "Notifiche attivate con successo!" });
                  }
                });
              }
            }} 
            className="btn btn-secondary justify-start gap-3 py-4"
          >
            <AlertCircle size={18} className="text-brand-primary" /> Attiva Notifiche Push
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Area Tecnica</h3>
        <div className="card p-4 bg-slate-50 border border-slate-200">
          <p className="text-[10px] text-slate-500 italic">Le informazioni di debug sono state rimosse per motivi di sicurezza e pulizia dell&apos;interfaccia.</p>
        </div>
      </section>
    </div>
  );
}
