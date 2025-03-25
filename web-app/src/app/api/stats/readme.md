# Supabase Aggregated Stats Function Setup

This guide walks you through creating the `get_aggregated_stats` function in Supabase. This function is used to compute aggregated statistics for log data stored in the `log_stats` table.

---

## ✅ Prerequisites

- You must have a Supabase project with a `log_stats` table containing:
  - `stats` (JSONB): keyword count map
  - `ip_addresses` (JSONB): list of IPs
  - `errors` (JSONB): list of error objects
  - `job_id`, `file_id`, `created_at` fields

---

## 🧭 Step-by-Step Instructions

### 1. Open SQL Editor in Supabase

1. Go to [https://supabase.com](https://supabase.com) and log into your account.
2. Open your project.
3. In the sidebar, click **SQL Editor**.
4. Click **+ New query**.

### 2. Paste the SQL Function

Paste the following SQL query into the editor:

```sql
create or replace function get_aggregated_stats()
returns json
language sql
as $$
  select json_build_object(
    'totalJobs', (select count(*) from log_stats),
    'keywordTotals', (
      select jsonb_object_agg(k, v_sum)
      from (
        select key as k, sum((value)::int) as v_sum
        from log_stats, jsonb_each_text(stats)
        group by key
      ) t
    ),
    'uniqueIPCount', (
      select count(distinct ip)
      from (
        select jsonb_array_elements_text(ip_addresses) as ip
        from log_stats
      ) t
    ),
    'totalErrors', (
      select sum(jsonb_array_length(errors)) from log_stats
    ),
    'recentJobs', (
      select json_agg(t)
      from (
        select job_id, file_id, created_at
        from log_stats
        order by created_at desc
        limit 10
      ) t
    )
  );
$$;
```

### 3. Run the Query

- Click the **Run** or **Execute** button (▶️ icon in the bottom right).
- You should see a success message like `CREATE FUNCTION`.

---

## ✅ How to Test

You can test it directly in the SQL editor:

```sql
select get_aggregated_stats();
```

Or call it from your backend using Supabase client:

```ts
const { data, error } = await supabase.rpc("get_aggregated_stats");
```

---

## 📦 Output Example

```json
{
  "totalJobs": 5,
  "keywordTotals": { "ERROR": 10, "INFO": 7 },
  "uniqueIPCount": 3,
  "totalErrors": 4,
  "recentJobs": [
    {
      "job_id": "abc123",
      "file_id": "file1",
      "created_at": "2025-03-26T14:00:00Z"
    }
  ]
}
```

---

## 🛠 Notes

- This function uses `jsonb_each_text` to unpack and aggregate keyword stats.
- You can modify it to add filters (e.g., by date or user ID) later.
- Make sure your API route calls it using Supabase's `.rpc()` method.

---

You now have a fully working aggregated stats function powered by Postgres 🚀
