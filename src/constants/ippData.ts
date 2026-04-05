export interface EligibilityCategory {
  code: string;
  name: string;
  criteria: string;
  assessment: string;
  typicalChallenges: string;
  symptoms: string;
}

export const ELIGIBILITY_CATEGORIES: EligibilityCategory[] = [
  {
    code: "51",
    name: "Intellectual Disability (Mild)",
    criteria: "Deficits in intellectual functioning (reasoning, problem solving, academic learning) and adaptive behavior skills in the mild range.",
    assessment: "Diagnosis by a qualified professional; adaptive behavior scale; indicates impact on participation and learning.",
    typicalChallenges: "Delays in most academic subjects and social behaviors compared to same-age peers.",
    symptoms: "Deficits in reasoning, problem solving, planning, abstract thinking, judgment, academic learning, and learning from experience."
  },
  {
    code: "52",
    name: "Intellectual Disability (Moderate)",
    criteria: "Deficits in intellectual functioning and adaptive behavior skills in the moderate range.",
    assessment: "Diagnosis by a qualified professional; adaptive behavior scale; documentation of required significant modifications.",
    typicalChallenges: "Requires significant modifications to basic curriculum in literacy, numeracy, and living/vocational skills.",
    symptoms: "Significant deficits in reasoning, problem solving, planning, abstract thinking, and learning from experience."
  },
  {
    code: "53",
    name: "Emotional/Behavioural Disability",
    criteria: "Chronic and pervasive behaviors that interfere with learning and safety (e.g., inability to maintain relationships, moodiness, physical destructiveness).",
    assessment: "Diagnosis by a qualified professional; school staff documentation of quality, nature, frequency, and severity.",
    typicalChallenges: "Chronic and pervasive behaviours that interfere with learning and safety of self and others; difficulty in coping with learning situations.",
    symptoms: "Unhappiness, irritability, withdrawal, temper outbursts, physical violence, destructiveness, or inability to maintain relationships."
  },
  {
    code: "54",
    name: "Learning Disability (Specific Learning Disorder)",
    criteria: "Disorders affecting acquisition, organization, or use of verbal/nonverbal information; results in difficulties in oral language, reading, or math.",
    assessment: "Assessment and diagnosis by a professional; DSM-5 specific learning disorder terminology used.",
    typicalChallenges: "Difficulties in oral language, reading (decoding/comprehension), written language (spelling), and mathematics.",
    symptoms: "Listening or speaking difficulties, phonetic knowledge gaps, word recognition issues, and computation struggles."
  },
  {
    code: "55",
    name: "Hearing Disability",
    criteria: "Hearing condition affecting speech/language; mild loss (26-40 dB) or moderate loss (41-70 dB) unaided in better ear.",
    assessment: "Diagnosis by a qualified professional (Audiologist); clinical or functional assessment of learning impact.",
    typicalChallenges: "Hearing condition that affects speech/language development and interferes with the ability to learn.",
    symptoms: "Difficulty following oral instructions and delays in language acquisition."
  },
  {
    code: "56",
    name: "Visual Disability",
    criteria: "Limited vision interfering with learning; visual acuity less than 20/70 (6/21 metric) in better eye after correction.",
    assessment: "Diagnosis by a qualified professional; measurement of visual acuity and/or field of vision.",
    typicalChallenges: "Vision so limited it interferes with the ability to learn and requires environment modification.",
    symptoms: "Inability to see the board clearly or read standard-sized print."
  },
  {
    code: "57",
    name: "Communication Disorder/Delay",
    criteria: "Mild to moderate disorder/delay in expressive/receptive language, articulation, phonology, voice, fluency, or social communication.",
    assessment: "Diagnosis by a qualified professional (e.g., Speech-Language Pathologist); education-based assessments (testing level B or C).",
    typicalChallenges: "Ineffective communication with peers and adults; difficulty with social use of verbal/nonverbal communication.",
    symptoms: "Stuttering, articulation issues, phonology errors, and resonance quality problems."
  },
  {
    code: "58",
    name: "Physical or Medical Disability",
    criteria: "Diagnosis of a physical, neurological, or medical condition by a qualified professional.",
    assessment: "Diagnosis of a physical, neurological, or medical condition by a qualified professional.",
    typicalChallenges: "Condition interferes significantly with the ability to learn and requires adjustments to the learning environment.",
    symptoms: "Physical limitations, neurological symptoms, or medical instability affecting classroom participation."
  },
  {
    code: "80",
    name: "Gifted and Talented",
    criteria: "Exceptional potential and/or performance in general intellect, academia, creativity, social, music, art, or kinesthesia.",
    assessment: "Process established by school authority; requires documentation; screening tools alone are insufficient.",
    typicalChallenges: "Requires modified programming to address exceptional abilities in intellect, creativity, or specific academia.",
    symptoms: "Exceptional performance in music, art, kinesthesia, social leadership, or general intellect."
  },
  {
    code: "41",
    name: "Intellectual Disability (Severe)",
    criteria: "Severe delays in most areas of daily living; adaptive behavior skills in severe or profound range.",
    assessment: "Diagnosis by a qualified professional; severe range is 2nd percentile and below.",
    typicalChallenges: "Dependent on others for all aspects of daily living; functioning at the 2nd percentile or below.",
    symptoms: "Severe deficits in reasoning, problem solving, planning, and academic learning."
  },
  {
    code: "42",
    name: "Severe Emotional/Behavioural Disability",
    criteria: "Chronic, extreme, and pervasive behaviors; requires close/constant adult supervision; dangerously aggressive or destructive behaviors.",
    assessment: "Diagnosis by psychiatrist, psychologist, or developmental pediatrician; or Statement of Impact/Alternative Documentation.",
    typicalChallenges: "Dangerously aggressive, destructive, or extremely withdrawn; requires close and constant adult supervision.",
    symptoms: "Violence, delusions, paranoia, or extreme compulsiveness."
  },
  {
    code: "44",
    name: "Severe Physical or Medical Disability",
    criteria: "Medical diagnosis of neurological or physical condition (e.g., Autism, FASD, Cerebral Palsy) that severely impacts functioning.",
    assessment: "Clinical diagnosis by a medical professional or registered psychologist; extensive school documentation of impact.",
    typicalChallenges: "Condition severely impacts ability to function and learn; requires extensive adult assistance.",
    symptoms: "Impacts from conditions like ASD, Cerebral Palsy, or Brain Injury."
  },
  {
    code: "45",
    name: "Deafness",
    criteria: "Hearing loss of 71 dB or more unaided in better ear; interferes with oral language as primary communication.",
    assessment: "Diagnosis by clinical or educational audiologist; audiogram within the past three years required for grant approvals.",
    typicalChallenges: "Hearing loss of 71 dB or more unaided in better ear; interferes with oral language as primary communication.",
    symptoms: "Hearing loss of 71 dB or more unaided in better ear; interferes with oral language as primary communication."
  },
  {
    code: "46",
    name: "Blindness",
    criteria: "Visual acuity of 6/60 (20/200) or less after correction, or field of vision reduced to 20 degrees or less.",
    assessment: "Medical assessment or functional vision assessment by a qualified specialist (if standardized assessment is precluded).",
    typicalChallenges: "Visual acuity of 6/60 (20/200) or less after correction, or field of vision reduced to 20 degrees or less.",
    symptoms: "Visual acuity of 6/60 (20/200) or less after correction, or field of vision reduced to 20 degrees or less."
  },
  {
    code: "47",
    name: "Severe Language Delay (ECS)",
    criteria: "Expressive, receptive, or total language profile below 1st or 2nd percentile.",
    assessment: "Diagnosis by a speech-language pathologist; interpretive report based on standardized and informal tests.",
    typicalChallenges: "Expressive, receptive, or total language profile below 1st or 2nd percentile.",
    symptoms: "Expressive, receptive, or total language profile below 1st or 2nd percentile."
  }
];

export interface Strategy {
  code: string;
  strategies: string[];
  equipment: string[];
  software: string[];
}

export const STRATEGIES_AND_ACCOMMODATIONS: Strategy[] = [
  {
    code: "51",
    strategies: ["Memory aids", "Visual cues (color coding)", "One instruction at a time", "Regularly scheduled reviews", "Social behavior interventions"],
    equipment: ["Desktop number lines", "Alphabet charts", "Manipulatives", "Slant boards"],
    software: ["Word processing with spell checkers", "Graphics", "Organizers"]
  },
  {
    code: "52",
    strategies: ["Multisensory approaches", "Break instruction into short steps", "Simplify instructions", "Immediate positive reinforcement"],
    equipment: ["Manipulatives (counting objects)", "Picture prompts", "Daily schedule visual summaries"],
    software: ["Simplified computer programs", "Assistive technology for basic skill practice"]
  },
  {
    code: "53",
    strategies: ["Nonverbal reminders to stay on task", "Self-monitoring systems", "Peer partners", "Quiet spots/carrels"],
    equipment: ["Study carrels", "Noise buffers (headphones)", "Specialized desk placement"],
    software: []
  },
  {
    code: "54",
    strategies: ["Specific skill instruction", "Compensatory strategies", "Self-advocacy training", "Providing copies of notes"],
    equipment: ["Pencil/pen grips", "Different paper types (grid/raised lines)", "Audio versions of textbooks"],
    software: ["Optical character recognition", "Screen readers", "Text-to-speech software", "Portable word processors"]
  },
  {
    code: "55",
    strategies: ["Pair written instructions with oral ones", "Visual cues", "Repeat/paraphrase directions"],
    equipment: ["FM systems to amplify sound", "Noise buffers"],
    software: []
  },
  {
    code: "56",
    strategies: ["Enlarge reading materials", "Increase print size in photocopying", "High-contrast materials (chalk/pens)"],
    equipment: ["Desktop easels", "Slant boards", "Large-spaced paper"],
    software: ["Screen readers", "Large-print format materials"]
  },
  {
    code: "57",
    strategies: ["Allow oral exams", "Picture prompts", "Additional repetition", "Peer-assisted reading"],
    equipment: ["Voice recordings", "Audio resources"],
    software: []
  },
  {
    code: "58",
    strategies: ["Modify seating plan", "Allow student to stand rather than sit", "Reduce requirements for written work"],
    equipment: ["Adapted scissors", "Specialized keyboards", "Adaptive devices for mobility"],
    software: ["Alternative keyboards", "Portable word processors"]
  },
  {
    code: "80",
    strategies: ["Provide extension activities", "Allow for independent study", "Use advanced organizers"],
    equipment: [],
    software: ["Access to advanced databases", "Specialized software for creative projects"]
  },
  {
    code: "41",
    strategies: ["Constant adult assistance", "High levels of structure", "Dependent care interventions"],
    equipment: ["Extensive adaptive daily living equipment"],
    software: ["Highly specialized assistive technology for communication and basic interaction"]
  },
  {
    code: "42",
    strategies: ["Ongoing crisis/safety management plans", "Behavior tracking", "High levels of structure"],
    equipment: ["Isolation/distraction-free spaces", "Noise buffers"],
    software: []
  },
  {
    code: "44",
    strategies: ["Extensive modifications to educational environment", "Personalized IPP/ISP strategies", "Simplified instructions"],
    equipment: ["FM systems", "Specialized seating", "Physical therapy tools"],
    software: ["Word processors", "Text-to-speech", "Specialized communication devices"]
  }
];
