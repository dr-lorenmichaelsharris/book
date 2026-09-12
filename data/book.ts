export type VerificationStatus = "verified" | "author-story" | "verify-before-publish";

export const siteConfig = {
  canonicalUrl: "https://fromsplinteredtocentered.com",
  primaryCta: { label: "Join the Book Community", href: "#join" },
  preorderUrl: "",
  contactUrl: "mailto:hello@fromsplinteredtocentered.com",
  soulLibraryEnabled: true,
  crisisResourceCopy: "",
  images: {
    cover: "/images/book-cover.jpg",
    sanjiv: "/images/sanjiv-chopra.jpg",
    loren: "https://lorenmichaelsharris.com/wp-content/uploads/2025/11/DrL1-min-scaled.jpg"
  },
  authors: {
    sanjiv: { name: "Dr. Sanjiv Chopra", descriptor: "Physician. Teacher. Seeker.", videoUrl: "", posterImage: "" },
    loren: { name: "Dr. Loren Michaels Harris", descriptor: "Storyteller. Survivor. Seeker.", videoUrl: "", posterImage: "https://lorenmichaelsharris.com/wp-content/uploads/2025/11/DrL1-min-scaled.jpg" }
  }
};

export const dimensions = [
  ["01", "Awareness", "Notice what has gone quiet.", "Become aware of the inner life beneath reaction, speed, habit, and distraction."],
  ["02", "Alignment", "Bring intention and action together.", "Explore what happens when your values, choices, and purpose begin pointing in the same direction."],
  ["03", "Integration", "Bring the pieces home.", "Stop treating earlier versions of yourself as enemies and integrate what your journey has taught you."],
  ["04", "Conversation", "Learn to listen as well as speak.", "Move from broadcasting toward inner dialogue, discernment, and reflection."],
  ["05", "Contribution", "Ask what your life is here to give.", "Explore dharma, service, calling, leadership, generosity, and purpose."],
  ["06", "Nourishment", "Feed what makes you more alive.", "Friendship, forgiveness, gratitude, beauty, meditation, love, meaningful experiences, and service."],
  ["07", "Legacy", "Plant what can outlive you.", "Move beyond recognition toward impact, wisdom, service, and what others carry forward."]
] as const;

export const recognition = ["accomplishing more but feeling less fulfilled", "surrounded by people but experiencing loneliness", "entering a new chapter and wondering what comes next", "recovering from loss, disappointment, or change", "questioning the difference between success and meaning", "searching for deeper purpose", "wondering what you want your life to leave behind", "spiritually curious but uncomfortable with rigid doctrine"];

export const questions = ["Is this the life I actually meant to build?", "Why can I have so much and still feel something is missing?", "What happens after I achieve the goal?", "How do I hear myself again?", "Is there purpose inside what I survived?", "How do I know what deserves my yes?", "What am I planting in the people around me?", "What will remain after I am gone?"];

export const claims: Record<string, VerificationStatus> = { sanjivChildhoodStory: "author-story", lorenBirthStory: "author-story", trueWealthQuote: "verify-before-publish" };
