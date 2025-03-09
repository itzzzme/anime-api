const FILTER_LANGUAGE_MAP = {
  ALL: '',
  SUB: '1',
  DUB: '2',
  SUB_DUB: '3'
};

const GENRE_MAP = {
    ACTION: '1',
    ADVENTURE: '2',
    CARS: '3',
    COMEDY: '4',
    DEMENTIA: '5',
    DEMOS: '6',
    DRAMA: '8',
    ECCHI: '9',
    FANTASY: '10',
    GAME: '11',
    HAREM: '35',
    HISTORICAL: '13',
    HORROR: '14',
    ISEKAI: '44',
    JOSEI: '43',
    KIDS: '15',
    MAGIC: '16',
    MARTIAL_ARTS: '17',
    MECHA: '18',
    MILITARY: '38',
    MUSIC: '19',
    MYSTERY: '7',
    PARODY: '20',
    POLICE: '39',
    PSYCHOLOGICAL: '40',
    ROMANCE: '22',
    SAMURAI: '21',
    SCHOOL: '23',
    SCI_FI: '24',
    SEINEN: '42',
    SHOUJO: '25',
    SHOUJO_AI: '26',
    SHOUNEN: '27',
    SHOUNEN_AI: '28',
    SLICE_OF_LIFE: '36',
    SPACE: '29',
    SPORTS: '30',
    SUPER_POWER: '31',
    SUPERNATURAL: '37',
    THRILLER: '41',
    VAMPIRE: '32'
    
};

const FILTER_TYPES = {
  ALL: '',
  MOVIE: '1',
  TV: '2',
  OVA: '3',
  ONA: '4',
  SPECIAL: '5',
  MUSIC: '6'
};

const FILTER_STATUS = {
  ALL: '',
  FINISHED: '1',
  CURRENTLY_AIRING: '2',
  NOT_YET_AIRED: '3'
};

const FILTER_RATED = {
  ALL: '',
  G: '1',
  PG: '2',
  PG_13: '3',
  R: '4',
  R_PLUS: '5',
  RX: '6'
};

const FILTER_SCORE = {
  ALL: '',
  APPALLING: '1',
  HORRIBLE: '2',
  VERY_BAD: '3',
  BAD: '4',
  AVERAGE: '5',
  FINE: '6',
  GOOD: '7',
  VERY_GOOD: '8',
  GREAT: '9',
  MASTERPIECE: '10'
};

const FILTER_SEASON = {
  ALL: '',
  SPRING: '1',
  SUMMER: '2',
  FALL: '3',
  WINTER: '4'
};

const FILTER_LANGUAGE = {
  ALL: '',
  SUB: '1',
  DUB: '2',
  SUB_DUB: '3'
};

const FILTER_SORT = {
  DEFAULT: 'default',
  RECENTLY_ADDED: 'recently_added',
  RECENTLY_UPDATED: 'recently_updated',
  SCORE: 'score',
  NAME_AZ: 'name_az',
  RELEASED_DATE: 'released_date',
  MOST_WATCHED: 'most_watched'
};

export { 
    FILTER_LANGUAGE_MAP, 
    GENRE_MAP, 
    FILTER_TYPES, 
    FILTER_STATUS, 
    FILTER_RATED, 
    FILTER_SCORE, 
    FILTER_SEASON, 
    FILTER_LANGUAGE, 
    FILTER_SORT 
};
