import { env } from '../config/env';
import { supabase } from '../lib/supabaseClient';
import { ApiBookingRepository } from './booking/ApiBookingRepository';
import type { BookingRepository } from './booking/BookingRepository';
import { FetchHttpClient } from './http/FetchHttpClient';
import type { HttpClient } from './http/HttpClient';
import { SupabaseStorageRepository } from './storage/SupabaseStorageRepository';
import type { StorageRepository } from './storage/StorageRepository';

/**
 * Composition root: the only place concrete implementations are wired to
 * their interfaces. Everything else (hooks, components) imports the
 * interface type and receives one of these instances — swapping an
 * implementation (e.g. for tests, or a future backend) means editing only
 * this file.
 */
export const httpClient: HttpClient = new FetchHttpClient(env.apiBaseUrl);
export const bookingRepository: BookingRepository = new ApiBookingRepository(httpClient);
export const storageRepository: StorageRepository = new SupabaseStorageRepository(supabase);
