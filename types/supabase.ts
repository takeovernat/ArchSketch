// types/supabase.ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      user_credits: {
        Row: {
          id: string;
          user_id: string;
          credits_used: number;
          has_pro: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          credits_used?: number;
          has_pro?: boolean;
        };
      };
    };
  };
}