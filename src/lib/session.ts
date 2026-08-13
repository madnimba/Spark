"use client";

import { useSyncExternalStore, useCallback } from "react";

/**
 * Prototype session. There is no server and no auth — a phone number in
 * localStorage stands in for a signed-in user so the dashboard can be reached
 * and reasoned about. Nothing here is a security boundary.
 */

const KEY = "spark:session";

export type Session = { phone: string; since: string } | null;

const listeners = new Set<() => void>();

/** Cached so getSnapshot returns a stable reference between renders. */
let cache: { raw: string | null; value: Session } = { raw: null, value: null };

function read(): Session {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return null;
  }
  if (raw === cache.raw) return cache.value;
  let value: Session = null;
  try {
    value = raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    value = null;
  }
  cache = { raw, value };
  return value;
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  // Keep other tabs in step.
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function signIn(phone: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ phone, since: new Date().toISOString() }));
  } catch {
    /* private mode — the session simply won't persist */
  }
  emit();
}

export function signOut() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  emit();
}

/**
 * `null` while the client hasn't hydrated yet, so the server and first client
 * paint agree. Callers distinguish "signed out" from "not yet known" with the
 * `ready` flag.
 */
export function useSession(): { session: Session; ready: boolean } {
  const session = useSyncExternalStore(subscribe, read, () => null);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  return { session, ready };
}

export function useSignOut() {
  return useCallback(() => signOut(), []);
}

/**
 * 01712 345678 → +880 1712 345678.
 * Numbers of any other length are still shown with the country code rather
 * than falling back to the raw input — nothing here enforces a length.
 */
export function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "").replace(/^880/, "").replace(/^0/, "");
  if (!d) return "";
  if (d.length === 10) return `+880 ${d.slice(0, 4)} ${d.slice(4)}`;
  return `+880 ${d}`;
}
