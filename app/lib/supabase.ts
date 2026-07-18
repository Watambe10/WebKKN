const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: string;
  body?: unknown;
};

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const getHeaders = () => {
  if (!supabaseAnonKey) {
    throw new Error("Supabase anon key is not configured.");
  }

  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
};

export async function supabaseRequest<T>(
  table: string,
  { method = "GET", query = "", body }: RequestOptions = {},
) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}${query}`, {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
    ...(method === "GET"
      ? (process.env.NODE_ENV === "development" ? { cache: "no-store" } : { next: { revalidate: 1 } })
      : { cache: "no-store" }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request failed with ${response.status}.`);
  }

  if (method === "DELETE") {
    return [] as T;
  }

  return (await response.json()) as T;
}

export async function getSupabaseRows<T>(table: string, orderBy: string) {
  return supabaseRequest<T[]>(table, {
    query: `?select=*&order=${orderBy}.desc`,
  });
}
