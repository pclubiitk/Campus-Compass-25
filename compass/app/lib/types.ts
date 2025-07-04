
export interface TableRowModel {
  id: string | number;
  description: DescriptionDetails;
  actions: Actions[]
}


export interface DescriptionDetails {
  user: string;
  date: string; 
  body: string;
}

//maximum 3 actions which can be optional
interface Actions{      
  icon: string;
  text: string;
  function?: ()=>void;
}

export interface User {
  ID: number;
  user_id: string;
  name: string;
  email: string;
  password: string;
  is_verified: boolean;
  Role: 'admin' | 'bot' | 'user';
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  ContributedLocations: unknown;  // use Location[] if you have that type
  ContributedReview: unknown;     // use Review[] if you have that type
}


export interface Notice {
  ID: number;
  notice_id: string;
  title: string;
  preview: string;
  description: string; // contains HTML string
  card_description: string;
  contributedBy: string; // foreign key (user_id)
  locationInfo: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  User: User;
}
