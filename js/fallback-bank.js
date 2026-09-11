/**
 * Oru Average Malayali — Fallback Response Bank
 * Contains 20 curated satirical verdicts for offline resilience (NFR3).
 * Guarantees that even with no internet / API timeout, the demo produces
 * an instant, hilarious verdict in under 500ms.
 */

const FALLBACK_BANK = [
  {
    id: "artist_painter",
    keywords: ["art", "paint", "drawing", "sketch", "design", "creative", "sculpt", "visual", "styling", "movie critiques", "architectural", "showcases"],
    career_verdict: "MBBS & Super-Specialty Micro-Vascular Surgery",
    stream_badge: "DOCTOR PATHWAY",
    malayali_subheading: "Brilliant Pala Repeat Batch 2026 Guaranteed Seat",
    relative_logic: [
      "You mentioned fine-motor dexterity and patience for canvas painting. Exactly the same neuromuscular control required to clamp a bleeding aorta during 8-hour bypass surgery.",
      "Mona Lisa cannot pay 50 lakhs dowry or buy a 3BHK flat in Kakkanad. Dr. Soman's son in Calicut bought a Land Cruiser within 4 years of finishing MD.",
      "Your free-text ambition of 'touching human souls' will be officially fulfilled at Kozhikode Medical College casualty ward at 3:00 AM."
    ],
    ammavan_quote: "Art okke oru hobby aayi vechaal mathi mole. Adhyam oru MBBS kettu, pinne enthina painting venamenkil clinicinte wallil cheyyaam!",
    expected_salary: "₹45,000/month during CRRI duty + infinite blessings from aunties",
    relative_approval_rating: "99.8% (Subject to clearing NEET PG in first 4 attempts)"
  },
  {
    id: "indie_gamer",
    keywords: ["game", "gamer", "gaming", "playstation", "steam", "fps", "esports", "unity", "unreal", "strategy games", "analyzing patterns", "spreadsheets", "data", "bottleneck", "puzzle", "tech deep-dives"],
    career_verdict: "B.Tech Computer Science Engineering",
    stream_badge: "ENGINEER PATHWAY",
    malayali_subheading: "Technopark Phase 3 Cubicle Resident (TCS / Infosys)",
    relative_logic: [
      "Sitting in front of a blue screen for 14 hours without blinking? That is not 'gaming addiction', that is an ideal 12-hour sprint cycle in Cognizant Infopark!",
      "Fast reflex in Valorant directly correlates to typing `git commit -m 'fixed bug'` 2 seconds before the Friday midnight release deadline.",
      "Why build imaginary fantasy worlds when you can build enterprise Java microservices for an insurance client based in Ohio?"
    ],
    ammavan_quote: "Gaming-il ninnu enthu kittum mone? Computeril thanne irikkuvallae, athu nere TCS-il poyi irunnaal maasam maasam salary accountil varum!",
    expected_salary: "₹24,500/month (CTC: ₹3.6 LPA including health insurance & gym coupons)",
    relative_approval_rating: "94.2% (Ammavan will brag that you are 'working in Software Cyber')"
  },
  {
    id: "standup_comedy",
    keywords: ["comedy", "humor", "standup", "jokes", "entertain", "talk", "speaking", "podcasting"],
    career_verdict: "B.Tech Mechanical Engineering -> IT Scrum Master",
    stream_badge: "ENGINEER PATHWAY",
    malayali_subheading: "Palakkad NSS College of Engineering (Backpaper Division)",
    relative_logic: [
      "You claim to love talking non-stop to groups of people without feeling shame or stage fright. This is the exact job description of a Certified Scrum Master conducting 15-minute daily standup meetings.",
      "Jokes do not get home loan pre-approvals from Federal Bank. An engineering degree with 4 supply papers still carries more respect in Aluva parish council.",
      "If you make people laugh in an auditorium, you get claps. If you make clients sign sprint deliverables, Amma gets a 10-sovereign gold necklace."
    ],
    ammavan_quote: "Vayithoni thirichu vaa mone. Mimicry okke college day-kku cheythaal mathi. Adhyam oru B.Tech pass aavu!",
    expected_salary: "₹28,000/month + 10% performance bonus paid in Sodexo meal passes",
    relative_approval_rating: "89.5% (High after you cut your hair and wear formal sky-blue shirts)"
  },
  {
    id: "sleep_lazy",
    keywords: ["sleep", "nap", "lazy", "rest", "chilling", "doing nothing", "bed", "relax", "sloth"],
    career_verdict: "B.Sc Nursing -> NHS UK Night-Shift Specialist",
    stream_badge: "NURSING ABROAD PATHWAY",
    malayali_subheading: "Manchester Royal Infirmary — Band 5 Staff Nurse",
    relative_logic: [
      "You desire a profession that accommodates prolonged horizontal resting. The UK National Health Service offers three 12-hour night shifts followed by four consecutive days of total uninterrupted hibernation.",
      "While sleeping during day hours in Leeds, you convert British Pounds into Indian Rupees. 1 GBP = ₹115. Your slumber literally out-earns your uncle's government pension.",
      "Free health service, cool rainy weather identical to Idukki monsoon, and zero relatives dropping by unannounced on Sunday afternoons."
    ],
    ammavan_quote: "Urangaan aano aagrahom? Birmingham-il night shift cheythaal nalla thണുppu kaalathu urangaam, aduthu varshom veedinte muttathu Innova nikum!",
    expected_salary: "£2,450/month (Clean take-home after council tax and Tesco baked beans)",
    relative_approval_rating: "100% (The entire village will attend your send-off at Nedumbassery airport)"
  },
  {
    id: "musician_guitar",
    keywords: ["music", "guitar", "song", "singing", "band", "flute", "piano", "dj", "sound"],
    career_verdict: "B.Sc Nursing -> Dublin Intensive Care Unit (ICU)",
    stream_badge: "NURSING ABROAD PATHWAY",
    malayali_subheading: "St. James's Hospital Dublin (IELTS 7.5 Academic Qualified)",
    relative_logic: [
      "You have an ear for delicate acoustic melodies and tempo shifts. This makes you uniquely qualified to decipher multi-parameter cardiac monitor alarms and ventilator beeps at 4:00 AM in Dublin.",
      "AR Rahman had talent, but what guarantee is there that you won't end up singing devotional karaoke at Thrissur church festivals for ₹1,500 per evening?",
      "In Ireland, you can play your acoustic guitar in your rented 2-bedroom semi-detached suburban cottage while sending ₹75,000 home every first of the month."
    ],
    ammavan_quote: "Guitar vayichu nadannal kalyanam nadakilla mone! IELTS coaching-nu 25,000 rupa adachittund. Naale thottu classinu ponam.",
    expected_salary: "€2,850/month (Excluding Sunday double-pay shift allowances)",
    relative_approval_rating: "98.7% (Parish priest has already blessed your European migration file)"
  },
  {
    id: "philosopher_thinker",
    keywords: ["philosophy", "think", "existential", "deep", "mind", "meaning", "universe", "ponder", "soul"],
    career_verdict: "B.Tech Mechanical Engineering (Thermodynamics Spec)",
    stream_badge: "ENGINEER PATHWAY",
    malayali_subheading: "Kothamangalam MA College Alumni Network",
    relative_logic: [
      "You spend endless hours questioning why human beings exist in an indifferent cosmos. Four years of Engineering Mechanics and Fluid Dynamics will cure this existential confusion through sheer panic.",
      "Socrates and Plato died penniless. Shaji's son who studied Mechanical in Mar Athanasius is currently drawing Gulf tax-free salary in Qatar Petroleum.",
      "The Second Law of Thermodynamics states that entropy always increases. You can contemplate this universal decay while debugging hydraulic pump blueprints."
    ],
    ammavan_quote: "Chinthichu chinthichu thala pukaathae! Entropy-um philosophical meaning-um Mechanical Engineering pass aayittu aalochikkaam.",
    expected_salary: "₹21,000/month (Site Engineer, boots and safety helmet provided by company)",
    relative_approval_rating: "91.0% (Grandmother will offer 101 kadum payasam at temple for clearance)"
  },
  {
    id: "chef_foodie",
    keywords: ["cook", "chef", "food", "baking", "eat", "cafe", "restaurant", "culinary", "recipe"],
    career_verdict: "MBBS & Gastroenterology Super-Specialist",
    stream_badge: "DOCTOR PATHWAY",
    malayali_subheading: "Aster Medcity Digestive Health Institute",
    relative_logic: [
      "Your passionate obsession with spices, oil, and saturated fats gives you firsthand pathological insight into fatty liver disease and acid reflux epidemics across central Travancore.",
      "Running a quirky hipster cafe in Panampilly Nagar means dealing with food safety inspectors and ₹80,000 monthly commercial rent. Being a Gastroenterologist means charging ₹800 per 4-minute consultation to tell patients to stop eating beef fry.",
      "You do not make the food. You treat the consequences of other people eating the food. The profit margin is 600% higher."
    ],
    ammavan_quote: "Cooking okke veetil cheythaal mathi. Hotel managemnt padichaal aalkkaar chodhikkum porotta adikkaano padichathennu! Doctor aavu!",
    expected_salary: "₹1,20,000/month + consultation cut on endoscopy procedures",
    relative_approval_rating: "99.4% (Aunties will queue up at family functions to show you their ultrasound reports)"
  },
  {
    id: "traveler_nomad",
    keywords: ["travel", "wanderlust", "nomad", "mountains", "beach", "explore", "backpack", "himalayas"],
    career_verdict: "B.Sc Nursing -> Canadian Arctic Remote Nurse Practitioner",
    stream_badge: "NURSING ABROAD PATHWAY",
    malayali_subheading: "Yellowknife Health Authority (Northwest Territories, Canada)",
    relative_logic: [
      "You claimed your ideal lifestyle involves pristine isolated landscapes and zero social distractions. Winter temperatures in Nunavut reach minus 40°C — you will see nothing but white snow for 9 straight months.",
      "Digital nomad influencers live off cold Maggi noodles in Himachal hostels with unstable 2G WiFi. Canadian remote healthcare practitioners receive free heated housing and flight allowances.",
      "In Canada, you will earn permanent residency within 18 months, which is the primary spiritual goal of every living human born in Kottayam district."
    ],
    ammavan_quote: "Himalayathil poyi sanyasi aavenda. Canada-il poyaal PR-um kittum, snow-um kaanaam, muttathoru Jeep Cherokee-um ideda!",
    expected_salary: "CAD $6,200/month (Remote northern hardship bonus included)",
    relative_approval_rating: "100% (Eligible for matrimonial ads in Malayala Manorama under 'Boy Abroad')"
  },
  {
    id: "writer_poet",
    keywords: ["write", "writer", "poem", "poetry", "novel", "literature", "author", "story", "screenplay"],
    career_verdict: "B.Tech Computer Science -> Technical Documentation Lead",
    stream_badge: "ENGINEER PATHWAY",
    malayali_subheading: "Wipro Sarjapur Campus (Agile Documentation Unit)",
    relative_logic: [
      "You love writing imaginative literary fiction that touches upon the melancholy of existence. Writing 400-page Software Architecture Technical Requirements Documents for legacy COBOL banking systems requires the exact same stamina.",
      "Publishing a Malayalam poetry collection will result in 14 copies sold (12 bought by your mother). Writing API specifications guarantees bi-weekly direct deposit into HDFC account.",
      "You can write short stories in your private Google Docs tab while pretending to debug Jenkins build failures during client retrospectives."
    ],
    ammavan_quote: "Kavitha ezhuthi aaraada jeevichittullathu? Thoolika maatti keyboard edukkada, Infosys-il nalla open openings undu!",
    expected_salary: "₹31,000/month (Annual appraisal: 4.2% subject to company EBITDA)",
    relative_approval_rating: "92.6% (Family will introduce you as 'He is basically writing English software')"
  },
  {
    id: "rebel_anarchist",
    keywords: ["rebel", "anarchy", "anti-work", "capitalism", "freedom", "system", "revolution", "smash"],
    career_verdict: "MBBS Entrance Crash Course at Brilliant Pala",
    stream_badge: "DOCTOR PATHWAY",
    malayali_subheading: "Residential Hostel Batch (Strict 5:30 AM Awakening Routine)",
    relative_logic: [
      "You express an intense urge to overthrow social hierarchy and bourgeois authority. Two semesters of Brilliant Pala residential coaching with 14 hours of daily organic chemistry drills will systematically channel that fiery energy into solving multiple-choice physics problems.",
      "The best way to subvert oppressive institutions is to infiltrate them from the top with an MS Orthopedics degree and an exorbitant hospital consultation fee.",
      "Your rebellion will be fully accommodated between 9:45 PM and 10:00 PM lights-out in the boys' hostel study dormitory."
    ],
    ammavan_quote: "Vidhyabhyasam illaatha oru revolution-um ivide nadannittilla! Naale muttathu Brilliant-inte van varum. Bag pack cheythu ready aayiko.",
    expected_salary: "₹0 during coaching; priceless moral restructuring by Pala wardens",
    relative_approval_rating: "97.1% (Father will weep with relief and distribute laddus to neighbors)"
  },
  {
    id: "nature_farmer",
    keywords: ["nature", "farm", "farming", "plants", "agriculture", "forest", "animals", "environment", "green"],
    career_verdict: "B.Sc Nursing -> Rural New Zealand Community Nurse",
    stream_badge: "NURSING ABROAD PATHWAY",
    malayali_subheading: "Waikato District Health Board (Pastoral Health Division)",
    relative_logic: [
      "You feel drawn to organic vegetation, peaceful dairy animals, and rolling green hills. Rural New Zealand has 5 sheep for every 1 human inhabitant.",
      "Organic farming in Wayanad involves wild boar destroying your tapioca crops and bank seizure notices on your Kisan Credit Card. In New Zealand, you drive an automatic Subaru wagon across emerald pastures to check diabetic blood sugars.",
      "You can maintain a tomato patch in your Auckland backyard on weekends while earning 55 New Zealand dollars per hour."
    ],
    ammavan_quote: "Nammude naattil krishi cheythaal panni kondupokum! New Zealand-il poyi nurse aavu, avide nalla pashu-vum undu, nalla shambhalam-um undu!",
    expected_salary: "NZD $4,800/month + subsidized kiwi fruit crate every Christmas",
    relative_approval_rating: "99.0% (Ammavan has already spoken to a migration agency in Angamaly)"
  },
  {
    id: "fitness_gym",
    keywords: ["gym", "workout", "fitness", "bodybuilding", "trainer", "athletics", "sports", "running"],
    career_verdict: "MBBS & Sports Medicine / Orthopedic Joint Replacement",
    stream_badge: "DOCTOR PATHWAY",
    malayali_subheading: "Amrita Institute of Medical Sciences (Kochi)",
    relative_logic: [
      "Your obsession with pectoral hypertrophy, knee extension mechanics, and protein synthesis is literally human gross anatomy chapters 4 through 12.",
      "Personal gym trainers make ₹12,000 per month and argue with middle-aged uncles who refuse to do cardio. An Orthopedic Surgeon replaces titanium knee joints for ₹2,50,000 per surgical table sitting.",
      "You can deadlift 180kg in the morning and then hammer orthopedic bone screws into femoral stems in the afternoon."
    ],
    ammavan_quote: "Bodybuilding okke oru fashion alle mone? MBBS pass aayi orthopedics eduthaal ninte muscle kaanan aalkkaar fee koduthu varum!",
    expected_salary: "₹1,80,000/month + commission from Stryker titanium knee implants",
    relative_approval_rating: "98.5% (Even the strictest church elders admire strong orthopedic hands)"
  },
  {
    id: "fashion_influencer",
    keywords: ["fashion", "model", "influencer", "instagram", "reels", "tiktok", "makeup", "beauty", "aesthetic"],
    career_verdict: "MBBS & Dermatology / Cosmetic Hair Transplant Specialist",
    stream_badge: "DOCTOR PATHWAY",
    malayali_subheading: "Cutis Aesthetic Clinic Panampilly Nagar",
    relative_logic: [
      "Your critical eye for lighting, skin tones, and anti-aging aesthetic perfection is the fundamental foundation of Clinical Dermatology.",
      "Instagram algorithms can shadow-ban your fashion reel at any moment, destroying your brand sponsorship income. Premature male pattern baldness among 24-year-old IT professionals in Kakkanad is a recession-proof billion-rupee market.",
      "Charging ₹45,000 for platelet-rich plasma scalp injections will fund your Paris fashion week vacations 10 times over."
    ],
    ammavan_quote: "Reels cheythu kaalam kalayaathe! Dermatology clinic thudangiyaal Gulf-il ninnu varunna ammavanmaarude thalapukachil maatti lakshangal undaakkaam!",
    expected_salary: "₹2,10,000/month (Cash transactions preferred for tax optimization)",
    relative_approval_rating: "99.2% (Mother will bring all her kittie-party friends for discount chemical peels)"
  },
  {
    id: "drone_cinema",
    keywords: ["cinema", "film", "movie", "director", "drone", "camera", "photography", "cinematography", "actor"],
    career_verdict: "B.Tech Electrical & Electronics Engineering (EEE)",
    stream_badge: "ENGINEER PATHWAY",
    malayali_subheading: "TKM College of Engineering Kollam (Substation Lab)",
    relative_logic: [
      "You are fascinated by visual lighting equipment, high-voltage film studio fixtures, and three-phase cinema generators. This is precisely the syllabus of AC/DC Transmission Line Engineering.",
      "For every one Malayalam cinema director who wins an award at IFFK, 4,000 assistant directors are currently borrowing ₹500 from their roommates for petrol and cigarette expenses.",
      "Take EEE. If the film bug does not leave you in 4 years, you can at least safely rewire the studio generator when the circuit breaker trips."
    ],
    ammavan_quote: "Cinemayil aarum nannavilla! Adhyam TKM-il ninnu oru EEE edukkada, pinne venamenkil kalyanam videography hobby aayi cheyyaam!",
    expected_salary: "₹22,000/month (KSEB Assistant Engineer Contract or Tech Mahindra QA)",
    relative_approval_rating: "93.8% (Father will announce you are 'studying power distribution')"
  },
  {
    id: "entrepreneur_startup",
    keywords: ["startup", "founder", "ceo", "business", "crypto", "venture", "pitch", "equity", "disrupt", "closing a sale", "pitching a big idea", "negotiating", "grew organizations", "led massive teams", "market-wide strategies"],
    career_verdict: "B.Tech Computer Science -> Onsite IT Contractor in New Jersey",
    stream_badge: "ENGINEER PATHWAY",
    malayali_subheading: "LTIMindtree US Onsite Deputation (H-1B Lottery Hopeful)",
    relative_logic: [
      "You dream of raising Series A venture capital and disrupting legacy industries. Burning ₹40 lakhs of angel investors' money over 18 months only produces heartburn and insolvency proceedings.",
      "The true Malayali venture startup is the H-1B visa lottery. You get flown to Edison, New Jersey, bill $85/hour to a retail pharmacy client, and purchase a 4-bedroom colonial house with a 2-car garage.",
      "Real valuation is measured in how many acres of rubber estate you purchase along the MC Road, not your company's pre-money convertible notes."
    ],
    ammavan_quote: "Startup-um equity-um poyi paranjal kalyanathinu pennu tharilla! Edison New Jersey-il onsite povaan nokkeda mone!",
    expected_salary: "$92,000/year (Includes Thanksgiving turkey voucher and dental plan)",
    relative_approval_rating: "99.9% (Absolute pinnacle of middle-class Malayali social prestige)"
  },
  {
    id: "social_work",
    keywords: ["charity", "ngo", "help", "social work", "kindness", "humanity", "empathy", "community", "service", "helping a friend", "team morale", "changed someone's life", "mentored individuals", "human well-being", "communities"],
    career_verdict: "B.Sc Nursing -> Palliative Care Oncology Sister / Brother",
    stream_badge: "NURSING ABROAD PATHWAY",
    malayali_subheading: "NHS Royal Marsden Hospital London",
    relative_logic: [
      "Your genuine heart of gold and profound desire to relieve human suffering should not be squandered on unpaid NGO internships in Delhi.",
      "The NHS Oncology wards in South London need empathetic individuals with iron constitutions to administer chemo infusions and comfort grieving families.",
      "You perform literal saintly human service daily while sending tax-free British Pounds directly to your home branch of South Indian Bank in Pala."
    ],
    ammavan_quote: "Sevanam cheyyan aano thalparyam? London-il poyi nursing cheythaal deivathinte anugrahom-um kittum, maasathil 2 laksham roopa veetilum ayakkaam!",
    expected_salary: "£2,650/month (Plus standard NHS pension index-linked for retirement)",
    relative_approval_rating: "100% (Mother Teresa status achieved within extended family circle)"
  },
  {
    id: "investigator_detective",
    keywords: ["detective", "cbi", "crime", "investigate", "spy", "mystery", "police", "forensic", "true crime", "behavioral psychology", "finding logical bottleneck"],
    career_verdict: "B.Tech IT -> Cyber Security / SOC L1 Analyst",
    stream_badge: "ENGINEER PATHWAY",
    malayali_subheading: "Infopark Kochi Cyber Security Operations Center",
    relative_logic: [
      "Watching Sethurama Iyer CBI movies on Asianet has corrupted your career perceptions. Real CBI officers spend their lives filling RTI forms and waiting for court hearings in Ernakulam district court.",
      "A Cyber Security SOC Analyst does the exact same forensic detective work: analyzing whether John in Accounts accidentally clicked a phishing link for free Lulu Hypermarket coupons.",
      "You sit in an air-conditioned room with 4 ultra-wide monitors, rotating 24/7 shifts, catching rogue IP packets from Belarus while sipping canteen tea."
    ],
    ammavan_quote: "Oru CBI aavan nadannaal adi kittum! Cyber Security padichu Infopark-il keriyaal AC roomil irunnu investigation nadathaam!",
    expected_salary: "₹26,000/month (Night-shift cab allowance and complimentary Nescafe)",
    relative_approval_rating: "95.3% (Family will tell neighbors that you work directly for Interpol)"
  },
  {
    id: "history_archaeology",
    keywords: ["history", "past", "ancient", "museum", "archaeology", "heritage", "monuments", "culture", "optimized structures", "buildings", "books", "outlast me", "fixing a physical object", "gardening", "building things"],
    career_verdict: "B.Tech Civil Engineering -> Historic PWD Contractor Associate",
    stream_badge: "ENGINEER PATHWAY",
    malayali_subheading: "Kerala Public Works Department (PWD) Roads & Bridges",
    relative_logic: [
      "Your reverence for ancient stone monuments and crumbling relics is beautifully applicable to inspecting the 45-year-old PWD bridges and potholed roads of Kottayam district.",
      "Archaeologists dig up broken pottery pieces for zero financial compensation. A Civil Engineer inspecting government road re-tarring works earns fixed contractor kickbacks and guaranteed lifetime job security.",
      "You will become part of Kerala's living history every time a newly asphalted road gets dug up by Kerala Water Authority 48 hours after completion."
    ],
    ammavan_quote: "Pazhanchollum charithravum kettu jeevitham kalayenda! PWD Civil Engineer aayittu retirement vare paalam paniyeda!",
    expected_salary: "₹38,000/month basic + unlimited tea & banana fritters at PWD rest houses",
    relative_approval_rating: "96.4% (Grandfathers cherish government PWD engineers above all deities)"
  },
  {
    id: "empty_or_gibberish",
    keywords: ["asdf", "qwerty", "idk", "nothing", "dunno", "na", "blank", "whatever", "none"],
    career_verdict: "B.Tech Computer Science Engineering (General Batch)",
    stream_badge: "ENGINEER PATHWAY",
    malayali_subheading: "Default All-India Engineering Entrance Quota",
    relative_logic: [
      "Your absolute lack of opinion, zero discernible preferences, and total indifference to your future is the most quintessential qualifying criteria for standard Indian engineering admissions.",
      "78% of all graduating Indian software developers also had no idea why they chose Computer Science or what an operating system kernel does.",
      "Simply sit in the chair, let the four years wash over you like a mild fever, and collect your TCS campus placement appointment letter upon departure."
    ],
    ammavan_quote: "Onnum ariyillengil enthaada? Oru B.Tech cheythu vekku! Pinne enth venamenkilum aalochikkaam, aadyam degree kaiyyil venam!",
    expected_salary: "₹21,500/month (Bench period for first 8 months with daily swipe-in)",
    relative_approval_rating: "94.0% (Standard default parental setting across Kerala)"
  },
  {
    id: "wildcard_universal",
    keywords: [],
    career_verdict: "B.Tech Mechanical Engineering (Universal Safety Net)",
    stream_badge: "ENGINEER PATHWAY",
    malayali_subheading: "Universal Malayali Baseline Qualification (Since 1982)",
    relative_logic: [
      "No matter what you wrote, Indian family jurisprudence dictates that all unclassifiable human ambitions automatically default to Mechanical Engineering.",
      "With a Mechanical degree, you can legitimately pivot to becoming an IT coder, a bank probationary officer, a real estate broker, or a Dubai spare parts logistics supervisor.",
      "You will study thermodynamics, workshop carpentry, and machine drawing, none of which will be used in your subsequent 35-year career as a Jira ticket manager."
    ],
    ammavan_quote: "Mechanical eduthaal oru vishamavum illa mone! Mechanical aaraayaalum enthaayaalum oru vazhi kaanum. Vishwasikku Ammavane!",
    expected_salary: "₹19,000/month (Initial training period in Coimbatore industrial belt)",
    relative_approval_rating: "96.8% (Unanimously ratified by all maternal uncles at family wedding)"
  }
];

/**
 * Intelligent Fallback Matcher
 * Finds the most comical and relevant pre-written verdict for given user answers.
 */
function getFallbackVerdict(answers) {
  if (!answers) return FALLBACK_BANK[FALLBACK_BANK.length - 1];

  // Aggregate user answer texts into a single normalized search string
  const textBlob = Object.values(answers)
    .filter(val => typeof val === "string")
    .join(" ")
    .toLowerCase();

  // Score each fallback option based on keyword hits
  let bestMatch = null;
  let highestScore = 0;

  for (const item of FALLBACK_BANK) {
    if (!item.keywords || item.keywords.length === 0) continue;
    let score = 0;
    for (const kw of item.keywords) {
      if (textBlob.includes(kw.toLowerCase())) {
        score += 1;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // If match found with score > 0, return it
  if (bestMatch && highestScore > 0) {
    return bestMatch;
  }

  // Check if answer is suspiciously short / empty
  if (textBlob.trim().length < 5) {
    return FALLBACK_BANK.find(item => item.id === "empty_or_gibberish");
  }

  // Deterministic rotation based on string hash if no keyword matches
  let hash = 0;
  for (let i = 0; i < textBlob.length; i++) {
    hash = (hash << 5) - hash + textBlob.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % (FALLBACK_BANK.length - 2); // Avoid last fallback
  return FALLBACK_BANK[index];
}

// Export for Node and browser
if (typeof module !== "undefined" && module.exports) {
  module.exports = { FALLBACK_BANK, getFallbackVerdict };
}
