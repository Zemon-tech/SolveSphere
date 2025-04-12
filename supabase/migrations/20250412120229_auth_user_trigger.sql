/* 
 * Migration: 20250412120229_auth_user_trigger.sql
 * Purpose: Create trigger to automatically add new auth users to public.users table
 */

-- Function that will be triggered when a new auth user is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (
    id,
    display_name,
    email,
    avatar_url
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger that executes the function after a new auth user is inserted
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Comment on the function for documentation
comment on function public.handle_new_user() is 'Automatically creates a public.users record when a new auth user signs up'; 