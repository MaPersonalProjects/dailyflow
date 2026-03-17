export const PRIORITIES = {
  high: { label: 'High', color: 'red' },
  medium: { label: 'Medium', color: 'yellow' },
  low: { label: 'Low', color: 'green' },
}

export const CATEGORIES = [
  'Work',
  'Personal',
  'Health',
  'Learning',
  'Finance',
  'Social',
  'Home',
  'Other',
]

export const REPEAT_OPTIONS = [
  { value: 'none', label: 'No repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

export const DAYS_OF_WEEK = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
]

export const EVENT_COLORS = [
  { key: 'blue',   label: 'Blue',   bg: 'bg-blue-500',   light: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-300',   hex: '#3b82f6' },
  { key: 'green',  label: 'Green',  bg: 'bg-green-500',  light: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-300',  hex: '#22c55e' },
  { key: 'red',    label: 'Red',    bg: 'bg-red-500',    light: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-300',    hex: '#ef4444' },
  { key: 'yellow', label: 'Yellow', bg: 'bg-yellow-500', light: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300', hex: '#eab308' },
  { key: 'purple', label: 'Purple', bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', hex: '#a855f7' },
  { key: 'pink',   label: 'Pink',   bg: 'bg-pink-500',   light: 'bg-pink-100',   text: 'text-pink-700',   border: 'border-pink-300',   hex: '#ec4899' },
  { key: 'indigo', label: 'Indigo', bg: 'bg-indigo-500', light: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300', hex: '#6366f1' },
  { key: 'teal',   label: 'Teal',   bg: 'bg-teal-500',   light: 'bg-teal-100',   text: 'text-teal-700',   border: 'border-teal-300',   hex: '#14b8a6' },
]

export const CATEGORY_COLORS = {
  Work:     { bg: 'bg-blue-100',    text: 'text-blue-700',    hex: '#3b82f6' },
  Personal: { bg: 'bg-purple-100',  text: 'text-purple-700',  hex: '#a855f7' },
  Health:   { bg: 'bg-green-100',   text: 'text-green-700',   hex: '#22c55e' },
  Learning: { bg: 'bg-yellow-100',  text: 'text-yellow-700',  hex: '#eab308' },
  Finance:  { bg: 'bg-emerald-100', text: 'text-emerald-700', hex: '#10b981' },
  Social:   { bg: 'bg-pink-100',    text: 'text-pink-700',    hex: '#ec4899' },
  Home:     { bg: 'bg-orange-100',  text: 'text-orange-700',  hex: '#f97316' },
  Other:    { bg: 'bg-gray-100',    text: 'text-gray-700',    hex: '#6b7280' },
}

export const HABIT_COLORS = [
  { key: 'red', label: 'Red', bg: 'bg-red-500', light: 'bg-red-100' },
  { key: 'orange', label: 'Orange', bg: 'bg-orange-500', light: 'bg-orange-100' },
  { key: 'yellow', label: 'Yellow', bg: 'bg-yellow-500', light: 'bg-yellow-100' },
  { key: 'green', label: 'Green', bg: 'bg-green-500', light: 'bg-green-100' },
  { key: 'teal', label: 'Teal', bg: 'bg-teal-500', light: 'bg-teal-100' },
  { key: 'blue', label: 'Blue', bg: 'bg-blue-500', light: 'bg-blue-100' },
  { key: 'indigo', label: 'Indigo', bg: 'bg-indigo-500', light: 'bg-indigo-100' },
  { key: 'purple', label: 'Purple', bg: 'bg-purple-500', light: 'bg-purple-100' },
  { key: 'pink', label: 'Pink', bg: 'bg-pink-500', light: 'bg-pink-100' },
]

export const TASK_RECURRENCE = [
  { key: 'none',           label: 'Once',              description: 'No repeat' },
  { key: 'daily',          label: 'Every day',         description: 'Repeats daily' },
  { key: 'every-other-day', label: 'Every other day',  description: 'Repeats every 2 days' },
  { key: 'weekdays',       label: 'Weekdays',          description: 'Mon – Fri' },
  { key: 'weekly',         label: 'Every week',        description: 'Same day each week' },
  { key: 'monthly',        label: 'Every month',       description: 'Same date each month' },
  { key: 'custom',         label: 'Custom days',       description: 'Choose specific days' },
]

// Tiny Habits — Anchor Menu
export const ANCHOR_CATEGORIES = ['morning', 'work', 'evening', 'custom']

export const ANCHOR_MENU = {
  morning: [
    'pour my morning coffee',
    'brush my teeth',
    'finish my shower',
    'sit down for breakfast',
    'turn off my alarm',
    'put on my shoes',
  ],
  work: [
    'open my laptop',
    'sit down at my desk',
    'finish a meeting',
    'send my first email of the day',
    'take a break from the screen',
    'close a browser tab',
  ],
  evening: [
    'eat dinner',
    'sit on the couch',
    'plug in my phone to charge',
    'turn off the lights',
    'get into bed',
    'wash the dishes',
  ],
}

// Tiny Habits — Behavior Sizes
export const BEHAVIOR_SIZES = [
  {
    key: 'too-big',
    label: 'Too Big',
    description: 'This will take real effort. Shrink it.',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: '😓',
  },
  {
    key: 'getting-smaller',
    label: 'Getting Smaller',
    description: "Closer! Can you make it even tinier?",
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: '🤏',
  },
  {
    key: 'tiny',
    label: 'Tiny ✓',
    description: "Perfect. Takes less than 30 seconds.",
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: '✨',
  },
]

// Tiny Habits — Celebration Types
export const CELEBRATION_TYPES = [
  { key: 'fist-pump', label: 'Fist Pump', emoji: '✊', description: 'Pump your fist in the air' },
  { key: 'say-awesome', label: 'Say Awesome!', emoji: '🗣️', description: 'Say "I am awesome!" out loud' },
  { key: 'victory-dance', label: 'Victory Dance', emoji: '🕺', description: 'Do a quick happy dance' },
  { key: 'smile-big', label: 'Smile Big', emoji: '😁', description: 'Give yourself a big genuine smile' },
  { key: 'custom', label: 'Custom', emoji: '⭐', description: 'Define your own celebration' },
]

// Tiny Habits — Habit Phases (wins-based, garden metaphor)
export const HABIT_PHASES = [
  {
    key: 'seed',
    label: 'Seed',
    minWins: 0,
    maxWins: 0,
    icon: '🌱',
    description: 'Just planted. Your habit journey begins.',
    color: 'text-gray-500',
    bg: 'bg-gray-50',
  },
  {
    key: 'sprout',
    label: 'Sprout',
    minWins: 1,
    maxWins: 7,
    icon: '🌿',
    description: "You're getting started!",
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    key: 'growing',
    label: 'Growing',
    minWins: 8,
    maxWins: 20,
    icon: '🌸',
    description: "This habit is taking root.",
    color: 'text-pink-600',
    bg: 'bg-pink-50',
  },
  {
    key: 'thriving',
    label: 'Thriving',
    minWins: 21,
    maxWins: Infinity,
    icon: '🌻',
    description: "A flourishing part of your life.",
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
]

// Tiny Habits — MAP diagnostic fix suggestions
export const MAP_FIX_SUGGESTIONS = {
  motivation: [
    'Remind yourself why this habit matters to you',
    'Imagine how you will feel after doing it',
    'Link it to a personal value you hold',
    'Tell someone you trust about your intention',
  ],
  ability: [
    'Make the behavior even tinier — can it take 5 seconds?',
    'Remove any obstacle between you and the behavior',
    'Prepare materials ahead of time',
    'Start with just the very first step',
  ],
  prompt: [
    'Choose a stronger, more reliable anchor',
    'Set a phone reminder at the anchor time',
    'Place a visual cue where you will see it',
    'Pair it with an anchor you do without thinking',
  ],
}
