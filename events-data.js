// =============================================
// WHIMSY WORKS - Events Data
// =============================================
//
// This is the ONLY file you need to touch to manage the event calendar.
// Every event in this list is automatically shown under "Upcoming Events"
// or "Past Events" on events.html, and sorted, based on its `date` —
// nothing needs to be moved by hand when an event happens.
//
// TO ADD AN EVENT: copy one of the objects below, paste it anywhere in the
// EVENTS list, and fill in your details. Order in this file doesn't matter.
//
// Fields:
//   date        (required) "YYYY-MM-DD" — the day of the event.
//   title       (required) Event name.
//   badge       (optional) Short label shown as a pill. Use "Fundraiser",
//               "Community", or "Charity" to get the matching color; any
//               other text still works but won't be color-coded.
//   location    (optional) Where it's happening. Include your own emoji,
//               e.g. "📍 123 Main St, Toronto, ON".
//   time        (optional) Shown only while the event is upcoming.
//               e.g. "🕙 10:00 AM – 1:00 PM".
//   charity     (optional) A sentence about the cause/partner. HTML like
//               <strong> is allowed.
//   description (optional) Short blurb about the event.
//   link        (optional) Shown only while upcoming.
//               { url: "https://...", text: "Learn More →" }
//
// Once an event's date is in the past, its `time` and `link` are simply not
// shown (a past event doesn't need "come find us at 10am" or a signup link)
// — you don't need to remove those fields, just leave the event in place.

const EVENTS = [

    {
        date: "2026-11-07",
        title: "Starlight Trick or Suite",
        badge: "Charity",
        description: "Whimsy Works returned to Starlight Children's Foundation's accessible Halloween event, filling decorated hotel suites with characters, from a comic-book room full of superheroes to a lantern-lit Tangled room with Rapunzel and Flynn Rider."
    },

    {
        date: "2026-09-12",
        title: "Superhero Stomp",
        badge: "Fundraiser",
        charity: "Fundraiser by Candlelighters Simcoe, an organization of families facing childhood cancer.",
        location: "📍 Southshore Community Centre, Lakeshore Drive, Barrie",
        description: "Elsa, Spider-Man, Superman, and Batgirl joined Candlelighters Simcoe for their superhero 5K, posing for photos, meeting families, and cheering on every runner."
    },

    {
        date: "2026-05-31",
        title: "Toronto Walk to Make Cystic Fibrosis History",
        badge: "Fundraiser",
        charity: "Supporting <strong>CF Canada</strong> — raising funds for cystic fibrosis research and support programs across Canada.",
        location: "📍 Thomson Memorial Park, 1005 Brimley Rd, Scarborough, ON",
        description: "Whimsy Works joined CF Canada with wandering characters, meeting families for photos and autographs all along the walk."
    },

    {
        date: "2026-06-07",
        title: "Toronto Breakthrough T1D Walk",
        badge: "Fundraiser",
        charity: "Supporting <strong>Breakthrough T1D</strong> — raising funds for type 1 diabetes research and a cure.",
        location: "📍 E.T. Seton Park, Toronto, ON",
        description: "Whimsy Works characters joined Breakthrough T1D for their annual walk, stopping for photos and autographs with families along the way."
    },

    {
        date: "2026-06-20",
        title: "Toronto Brain Tumour Walk",
        badge: "Fundraiser",
        charity: "Supporting <strong>Brain Tumour Foundation of Canada</strong> — honouring those affected and funding vital research.",
        location: "📍 JC Saddington Park, Mississauga, ON",
        description: "Whimsy Works joined the Brain Tumour Foundation of Canada with wandering characters, meeting families for photos and autographs."
    },

    {
        date: "2026-07-01",
        title: "Canada Day Treats for Childhood Cancer",
        badge: "Fundraiser",
        charity: "A fundraiser by <strong>Donate4Kids</strong> for kids facing childhood cancer.",
        location: "📍 Hamilton, ON",
        description: "Rapunzel, Elsa, and Belle joined Donate4Kids for their annual Canada Day fundraiser, sharing stories, music, and some magical face paint with new friends."
    },

    {
        date: "2026-07-27",
        title: "St. James Town Kids' Market",
        badge: "Community",
        charity: "In partnership with <strong>The Children's Book Bank</strong>, celebrating reading and literacy with kids across Toronto.",
        location: "📍 545 Sherbourne St, Toronto, ON",
        description: "Belle, Cinderella, and Rapunzel hosted little princess and superhero story times throughout the Children's Book Bank's St. James Town Kids' Market."
    },

    {
        date: "2026-08-08",
        title: "Super Storytime at Jane & Finch",
        badge: "Community",
        charity: "In partnership with <strong>The Children's Book Bank</strong>, celebrating reading and literacy with kids across Toronto.",
        location: "📍 Yorkgate Mall, Toronto, ON",
        description: "Superman and Supergirl brought a superhero story time to the Children's Book Bank's Jane/Finch location, reading with kids and posing for photos."
    },

    {
        date: "2026-08-15",
        title: "Pixie Hollow Fairy Storytime",
        badge: "Community",
        charity: "In partnership with <strong>The Children's Book Bank</strong>, celebrating reading and literacy with kids across Toronto.",
        location: "📍 Regent Park & Sherbourne, Toronto, ON",
        description: "Tinker Bell, Rosetta, and Fawn brought a Pixie Hollow fairy story time to the Children's Book Bank's Regent Park and Sherbourne locations."
    },

    {
        date: "2026-08-22",
        title: "A Day in Holland with Super Sandro",
        badge: "Community",
        location: "📍 Oak Ridges Community Centre, Lake Wilcox Trail",
        description: "Whimsy Works joined Sandro's family for a family-friendly event raising awareness for Pallister-Killian Syndrome, meeting everyone for photos and autographs."
    },

    {
        date: "2026-08-26",
        title: "Children's Book Bank Summer Reading Parties",
        badge: "Community",
        charity: "In partnership with <strong>The Children's Book Bank</strong>, celebrating reading and literacy with kids across Toronto.",
        location: "📍 Sherbourne, Morningside, Regent Park & Jane/Finch, Toronto, ON",
        description: "Whimsy Works characters joined the Children's Book Bank's end-of-summer reading parties across their Toronto locations, wrapping up a summer of reading with stories, photos, and autographs."
    },

    {
        date: "2025-10-31",
        title: "Starlight Trick or Suite",
        badge: "Charity",
        description: "Twenty Whimsy Works characters joined Starlight Children's Foundation for their annual accessible Halloween event, bringing joy to children and families."
    },

    {
        date: "2025-09-18",
        title: "Kian's Skate",
        badge: "Fundraiser",
        location: "📍 Drayton, ON",
        description: "Whimsy Works princesses and superheroes joined Kian and his family at their annual ice skating fundraiser for cancer research, skating with families and sharing magic at this amazing community event."
    },

    {
        date: "2025-05-25",
        title: "Walk to Change Cystic Fibrosis History — CF Canada",
        badge: "Fundraiser",
        location: "📍 Toronto, ON",
        description: "Elsa, Anna, and Tinker Bell brought fairytale magic to the annual CF Canada walk in support of cystic fibrosis research."
    },

];
