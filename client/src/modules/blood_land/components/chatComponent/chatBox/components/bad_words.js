const bad_words = [
    "cặc",
    "lồn",
    "đụ",
    "địt",
    "đĩ",
    "nứng",
    "chim",
    "đũy",
    "mẹ mày",
    "여보세요",
    'fuck',
    'FUCK',
    'Fuck',
    "beeyotch",
    "biatch",
    "bitch",
    "chinaman",
    "chinamen",
    "chink",
    "crazie",
    "crazy",
    "crip",
    "cunt",
    "dago",
    "daygo",
    "dego",
    "dick",
    "dumb",
    "douchebag",
    "dyke",
    "fag",
    "fatass",
    "fatso",
    "gash",
    "gimp",
    "golliwog",
    "gook",
    "gyp",
    "halfbreed",
    "half-breed",
    "homo",
    "hooker",
    "idiot",
    "insane",
    "insanitie",
    "insanity",
    "jap",
    "kike",
    "kraut",
    "lame",
    "lardass",
    "lesbo",
    "lunatic",
    "negro",
    "nigga",
    "nigger",
    "nigguh",
    "paki",
    "pickaninnie",
    "pickaninny",
    "pussie",
    "pussy",
    "raghead",
    "retard",
    "shemale",
    "skank",
    "slut",
    "spade",
    "spic",
    "spook",
    "tard",
    "tits",
    "titt",
    "trannie",
    "tranny",
    "twat",
    "wetback",
    "whore",
    "wop"
];

export default (sourceStr) => {
    var regex = new RegExp(bad_words.join("|"), 'gi');
    return sourceStr.replace(regex, function (match) { return match.replace(/./g, '*'); });
}