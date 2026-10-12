import { TouchGrassMission } from '../types';

export const INITIAL_MISSIONS: TouchGrassMission[] = [
  {
    id: 'mission-leaves-5',
    title: 'The Five-Leaf Exploration',
    instructions: [
      'Step outside into a garden, park, or courtyard.',
      'Find five distinctly shaped leaves (either on living plants or fallen on the ground).',
      'Examine the vein patterns, edge serrations, and shades of green on each.',
      'Gently touch the surface to compare waxy, fuzzy, and smooth textures.',
      'Leave them in their natural place with gratitude.'
    ],
    durationMinutes: 5,
    location: 'garden',
    mood: 'stressed',
    activityType: 'observation',
    difficulty: 'gentle',
    benefit: 'Visual sensory grounding shifts attention away from racing thoughts, rapidly lowering cortisol and activating the parasympathetic rest response.',
    checklist: [
      { id: 'c1', text: 'Step outside away from digital screens', done: false },
      { id: 'c2', text: 'Locate 5 distinct leaf species or shapes', done: false },
      { id: 'c3', text: 'Feel the leaf texture between your thumb and index finger', done: false },
      { id: 'c4', text: 'Notice the intricate geometric vein branching', done: false }
    ],
    isAiGenerated: false,
    aiProvider: 'curated'
  },
  {
    id: 'mission-unplugged-10',
    title: 'Mindful Ten-Minute Unplugged Walk',
    instructions: [
      'Place your phone inside a pocket or bag on silent mode.',
      'Walk at an unhurried, measured pace along a tree-lined street or park path.',
      'Synchronize your footfalls with steady, deep breaths: 4 paces inhaling, 4 paces exhaling.',
      'Keep your gaze soft on the middle distance rather than looking down.',
      'Notice the shifting temperature of the air as you pass through sunlit patches and tree shade.'
    ],
    durationMinutes: 10,
    location: 'park',
    mood: 'tired',
    activityType: 'walking',
    difficulty: 'gentle',
    benefit: 'Bilateral rhythmic walking combined with natural visual optic flow calms the amygdala and restores executive brain function after prolonged screen work.',
    checklist: [
      { id: 'c1', text: 'Silence all notifications and pocket phone', done: false },
      { id: 'c2', text: 'Breathe rhythmically with each step', done: false },
      { id: 'c3', text: 'Observe where shadows fall across your path', done: false },
      { id: 'c4', text: 'Take a final deep breath before returning indoors', done: false }
    ],
    isAiGenerated: false,
    aiProvider: 'curated'
  },
  {
    id: 'mission-birds-10',
    title: 'Birdsong Frequency Isolation',
    instructions: [
      'Find a bench, balcony rail, or open patch of grass.',
      'Close your eyes or fix your gaze on the horizon for 10 minutes.',
      'Disregard human engine hum and isolate bird calls in the canopy.',
      'Try to count how many distinct bird species or vocal rhythms are conversing.',
      'Notice the direction and distance of each chirp without turning your head.'
    ],
    durationMinutes: 10,
    location: 'balcony',
    mood: 'bored',
    activityType: 'mindfulness',
    difficulty: 'gentle',
    benefit: 'Acoustic immersion in natural soundscapes stimulates theta brainwaves, reducing mental fatigue and subjective anxiety by over 30%.',
    checklist: [
      { id: 'c1', text: 'Find a comfortable resting posture outdoors', done: false },
      { id: 'c2', text: 'Close eyes or soften gaze', done: false },
      { id: 'c3', text: 'Identify at least two separate bird vocalizations', done: false },
      { id: 'c4', text: 'Sense the acoustic spatial boundary of your surroundings', done: false }
    ],
    isAiGenerated: false,
    aiProvider: 'curated'
  },
  {
    id: 'mission-clouds-5',
    title: 'Cloud Velocity & Sky Survey',
    instructions: [
      'Look up at the open sky from your balcony, porch, or courtyard.',
      'Locate a distinct cloud formation or edge.',
      'Track its movement across a reference point like a rooftop or treetop.',
      'Observe the layering of light and subtle gradients of blue, silver, or pearl.',
      'Reflect on the impermanence of clouds and thoughts alike.'
    ],
    durationMinutes: 5,
    location: 'balcony',
    mood: 'peaceful',
    activityType: 'observation',
    difficulty: 'gentle',
    benefit: 'Gazing upward at open horizons relieves optical convergence strain from close-up monitors and triggers a state of micro-awe.',
    checklist: [
      { id: 'c1', text: 'Look toward the furthest visible sky horizon', done: false },
      { id: 'c2', text: 'Track a single cloud boundary for 60 seconds', done: false },
      { id: 'c3', text: 'Notice how rapidly the formation dissolves and transforms', done: false }
    ],
    isAiGenerated: false,
    aiProvider: 'curated'
  },
  {
    id: 'mission-plant-water-5',
    title: 'Root Thirst & Soil Communion',
    instructions: [
      'Approach an outdoor plant, tree base, or potted greenery on a balcony.',
      'Press your finger 1 inch into the soil to test moisture and temperature.',
      'Slowly pour fresh water at the base, observing how the dry loam drinks and darkens.',
      'Gently brush yellowed leaves away and inspect new sprouting buds.',
      'Acknowledge the quiet patience of root networks.'
    ],
    durationMinutes: 5,
    location: 'garden',
    mood: 'curious',
    activityType: 'mindfulness',
    difficulty: 'gentle',
    benefit: 'Direct tactile contact with soil releases beneficial negative ions and Mycobacterium vaccae aromas, natural neuro-stimulants associated with mood elevation.',
    checklist: [
      { id: 'c1', text: 'Touch the soil surface with your bare hands', done: false },
      { id: 'c2', text: 'Mindfully water the base without rushing', done: false },
      { id: 'c3', text: 'Observe any fresh green shoots or nascent buds', done: false }
    ],
    isAiGenerated: false,
    aiProvider: 'curated'
  },
  {
    id: 'mission-litter-15',
    title: 'Neighborhood Stewardship Sweep',
    instructions: [
      'Bring gloves or tongs and a small paper bag.',
      'Walk a single outdoor block or trail stretch safely where permitted.',
      'Pick up discarded plastics or litter, restoring the soil to clean earth.',
      'Notice any plants or wild flora that reclaim urban pavement cracks.',
      'Dispose of the items responsibly in recycling or waste bins.'
    ],
    durationMinutes: 20,
    location: 'street',
    mood: 'motivated',
    activityType: 'eco-friendly action',
    difficulty: 'moderate',
    benefit: 'Tangible altruistic stewardship delivers an immediate sense of purpose and agency, reinforcing mutual reciprocity with our living habitats.',
    checklist: [
      { id: 'c1', text: 'Equip gloves and collection bag safely', done: false },
      { id: 'c2', text: 'Clean a 50-meter perimeter of stray litter', done: false },
      { id: 'c3', text: 'Separate recyclable items where facilities exist', done: false },
      { id: 'c4', text: 'Wash hands and celebrate leaving the earth cleaner', done: false }
    ],
    isAiGenerated: false,
    aiProvider: 'curated'
  },
  {
    id: 'mission-bark-10',
    title: 'Elder Tree Tactile Mapping',
    instructions: [
      'Locate a mature tree in your local park, garden, or quiet street.',
      'Place your palms flat against the trunk bark.',
      'Close your eyes and breathe the subtle aroma of wood, moss, and rain.',
      'Feel the deep grooves, cracks, and ridges carved by decades of seasons.',
      'Imagine the massive root system mirroring the branches deep underground.'
    ],
    durationMinutes: 10,
    location: 'park',
    mood: 'stressed',
    activityType: 'mindfulness',
    difficulty: 'gentle',
    benefit: 'Shinrin-yoku (forest bathing) research demonstrates that close tactile contact with mature trees reduces pulse rate, systolic blood pressure, and anxiety.',
    checklist: [
      { id: 'c1', text: 'Stand beside a mature tree trunk', done: false },
      { id: 'c2', text: 'Rest both palms against the bark surface', done: false },
      { id: 'c3', text: 'Take 5 slow breaths feeling the stillness of the wood', done: false },
      { id: 'c4', text: 'Offer a silent thank-you for the oxygen it breathes into the air', done: false }
    ],
    isAiGenerated: false,
    aiProvider: 'curated'
  },
  {
    id: 'mission-photo-20',
    title: 'Microscopic Perspective Photography',
    instructions: [
      'Step outside with your camera or phone lens.',
      'Do not take panoramic landscapes; instead, get within 4 inches of the earth.',
      'Capture textures: dew on spider silk, lichen on a stone, moss growing on brick, or ant trails.',
      'Look for the invisible world existing right beneath human foot traffic.',
      'Reflect on how much complex life thrives without our constant attention.'
    ],
    durationMinutes: 20,
    location: 'nearby outdoor space',
    mood: 'curious',
    activityType: 'photography',
    difficulty: 'exploratory',
    benefit: 'Macrophotographic observation shifts cognitive framing from macro-worries to micro-wonder, instilling genuine fascination and curiosity.',
    checklist: [
      { id: 'c1', text: 'Crouch down close to the soil or stones', done: false },
      { id: 'c2', text: 'Find an organism or texture smaller than a coin', done: false },
      { id: 'c3', text: 'Observe how light illuminates its surface', done: false },
      { id: 'c4', text: 'Appreciate the hidden miniature forest beneath you', done: false }
    ],
    isAiGenerated: false,
    aiProvider: 'curated'
  }
];

export const DAILY_TOUCH_GRASS_CHALLENGES = [
  {
    day: 'Monday',
    title: 'Barefoot Earth Connection',
    desc: 'If safe and comfortable, step with bare soles on clean lawn grass or soil for 3 minutes. Feel the cooling moisture and electrical grounding.'
  },
  {
    day: 'Tuesday',
    title: 'Look Up, Not Down',
    desc: 'On your walks today, keep your chin parallel to the earth and look up at tree canopies rather than down at your smartphone.'
  },
  {
    day: 'Wednesday',
    title: 'Aroma of the Wild',
    desc: 'Crush a fallen pine needle, rosemary sprig, or sage leaf between your fingers and inhale the restorative phytoncide scent.'
  },
  {
    day: 'Thursday',
    title: 'Shadow Movement',
    desc: 'Notice the angle of tree shadows in the morning versus late afternoon. Reconnect with the solar clock.'
  },
  {
    day: 'Friday',
    title: 'Water Reverence',
    desc: 'Observe natural water today—whether morning dew, a river current, raindrops on glass, or ocean tides.'
  },
  {
    day: 'Saturday',
    title: 'The 30-Minute Deep Trail',
    desc: 'Visit a park or trail with zero headphones or screens. Let nature occupy your full field of consciousness.'
  },
  {
    day: 'Sunday',
    title: 'Wild Neighbor Recognition',
    desc: 'Identify at least one non-human living neighbor (a squirrel, crow, dragonfly, or bee) and observe its foraging work for 5 minutes.'
  }
];
