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
        date: "2026-09-12",
        title: "Superhero Stomp",
        badge: "Fundraiser",
        charity: "Fundraiser by Candlelighters Simcoe, an organization of families facing childhood cancer.",
        location: "📍 Southshore Community Center, Lakeshore Drive, Barrie",
        time: "🕚 11:00 AM – 1:00 PM",
        description: "Some people dream of being a Superhero. But for kids fighting cancer, there is no choice. They must become a Superhero as they fight the evil villain known as Cancer!",
        link: { url: "https://raceroster.com/events/2026/138813/superhero-stomp-2026", text: "Learn More →" }
    },

    {
        date: "2026-05-31",
        title: "Toronto Walk to Make Cystic Fibrosis History",
        badge: "Fundraiser",
        charity: "Supporting <strong>CF Canada</strong> — raising funds for cystic fibrosis research and support programs across Canada.",
        location: "📍 Thomson Memorial Park, 1005 Brimley Rd, Scarborough, ON",
        time: "🕙 10:00 AM – 1:00 PM",
        description: "Whimsy Works will be joining CF Canada, with wandering characters. Find us for photos and autographs!",
        link: { url: "https://walk-cysticfibrosiscanada.crowdchange.ca/128201", text: "Learn More →" }
    },

    {
        date: "2026-06-07",
        title: "Toronto Breakthrough T1D Walk",
        badge: "Fundraiser",
        charity: "Supporting <strong>Breakthrough T1D</strong> — raising funds for type 1 diabetes research and a cure.",
        location: "📍 E.T. Seton Park, Toronto, ON",
        time: "🕘 9:00 AM – 11:00 AM",
        description: "Whimsy Works will be joining Breakthrough T1D, with wandering characters. Find us for photos and autographs!",
        link: { url: "https://breakthrought1d.ca/breakthrough-t1d-walk-2026/", text: "Learn More →" }
    },

    {
        date: "2026-06-20",
        title: "Toronto Brain Tumour Walk",
        badge: "Fundraiser",
        charity: "Supporting <strong>Brain Tumour Foundation of Canada</strong> — honouring those affected and funding vital research.",
        location: "📍 JC Saddington Park, Mississauga, ON",
        time: "🕘 9:00 AM – 12:00 PM",
        description: "Whimsy Works will be joining the Brain Tumour Foundation of Canada, with wandering characters. Find us for photos and autographs!",
        link: { url: "https://www.braintumour.ca/event/toronto-gta-community-brain-tumour-walk/", text: "Learn More →" }
    },

    {
        date: "2026-08-22",
        title: "A Day in Holland with Super Sandro",
        badge: "Community",
        location: "📍 Oak Ridges Community Center, Lake Wilcox Trail",
        time: "🕘 4:30 PM – 6:00 PM",
        description: "Whimsy Works will be joining Sandro's family in an event dedicated to raising awareness for Pallister-Killian Syndrome. Everyone is invited to this family friendly event! Find us for photos and autographs.",
        link: { url: "https://www.gofundme.com/f/pks-awareness-day-december-4th", text: "Learn More →" }
    },

    {
        date: "2025-10-31",
        title: "Trick or Suite — Starlight Children's Foundation",
        badge: "Charity",
        location: "📍 Aurora, ON",
        description: "Twenty Whimsy Works characters joined Starlight Children's Foundation for their annual accessible Halloween event, bringing joy to children and families."
    },

    {
        date: "2025-09-18",
        title: "Kian's Skate",
        badge: "Fundraiser",
        location: "📍 Drayton, ON",
        description: "Whimsy Works princesses and superheros joined Kian and his family at their annual ice skating fundraiser for cancer research, skating with families and sharing magic at this amazing community event."
    },

    {
        date: "2025-05-25",
        title: "Walk to Change Cystic Fibrosis History — CF Canada",
        badge: "Fundraiser",
        location: "📍 Toronto, ON",
        description: "Elsa, Anna, and Tinkerbelle brought fairytale magic to the annual CF Canada walk in support of cystic fibrosis research."
    },

];
