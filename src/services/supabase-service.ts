import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nmijjbrgxttaatvjvegj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5taWpqYnJneHR0YWF0dmp2ZWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEwMjU4NjIsImV4cCI6MjAyNjYwMTg2Mn0.uSz4jgMEZ8P0ngtKEGbm5gjU9hgWBH3ALBdrUufBRYc";

export const supabase = createClient(supabaseUrl, supabaseKey);