export interface Information {
  title: string;
  place: string;
  date: string;
  participants: string[];
}

export interface Notice {
  id: number;
  content: string;
}

export interface SettlementItem {
  id: number;
  place: string;
  price: number;
}

export interface Settlement {
  items: SettlementItem[];
  numberOfPeople: number;
  accountNumber: string;
  bank: string;
  depositor: string;
}

export interface GalleryItem {
  id: number;
  photo: string;
  uploader: string;
}

export interface detailTypes {
  id: number;
  information: Information;
  notice: Notice[];
  settlement: Settlement;
  gallery: GalleryItem[];
}
