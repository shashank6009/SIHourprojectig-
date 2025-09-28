/**
 * Privacy Vault Service
 * Handles encrypted storage and retrieval of PII data
 */

import { supabaseServer } from './supabase-server';
import { encryptJSON, decryptJSON, EncryptedData } from './crypto';

export interface VaultItem {
  id: string;
  kind: string;
  data: any;
}

/**
 * Store encrypted data in the PII vault
 */
export async function vaultStore(
  userId: string,
  kind: string,
  data: any
): Promise<string> {
  const encrypted = encryptJSON(data);
  
  const { data: result, error } = await supabaseServer
    .from('pii_vault')
    .insert({
      user_id: userId,
      kind,
      data_key_encrypted: encrypted.dataKeyEnc,
      iv: encrypted.iv,
      tag: encrypted.tag,
      ciphertext: encrypted.ciphertext,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to store in vault: ${error.message}`);
  }

  return result.id;
}

/**
 * Fetch and decrypt data from the PII vault
 */
export async function vaultFetch(
  userId: string,
  kind?: string
): Promise<VaultItem[]> {
  let query = supabaseServer
    .from('pii_vault')
    .select('id, kind, data_key_encrypted, iv, tag, ciphertext')
    .eq('user_id', userId);

  if (kind) {
    query = query.eq('kind', kind);
  }

  const { data: rows, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch from vault: ${error.message}`);
  }

  if (!rows || rows.length === 0) {
    return [];
  }

  // Decrypt each item
  const items: VaultItem[] = [];
  for (const row of rows) {
    try {
      const encrypted: EncryptedData = {
        dataKeyEnc: row.data_key_encrypted,
        iv: row.iv,
        tag: row.tag,
        ciphertext: row.ciphertext,
      };

      const data = decryptJSON(encrypted);
      items.push({
        id: row.id,
        kind: row.kind,
        data,
      });
    } catch (decryptError) {
      console.error(`Failed to decrypt vault item ${row.id}:`, decryptError);
      // Continue with other items
    }
  }

  return items;
}

/**
 * Delete a specific item from the vault
 */
export async function vaultDeleteItem(itemId: string): Promise<void> {
  const { error } = await supabaseServer
    .from('pii_vault')
    .delete()
    .eq('id', itemId);

  if (error) {
    throw new Error(`Failed to delete vault item: ${error.message}`);
  }
}

/**
 * Delete all vault data for a user
 */
export async function vaultDeleteUser(userId: string): Promise<number> {
  const { data, error } = await supabaseServer
    .from('pii_vault')
    .delete()
    .eq('user_id', userId)
    .select('id');

  if (error) {
    throw new Error(`Failed to delete user vault: ${error.message}`);
  }

  return data?.length || 0;
}

/**
 * Update encrypted data in the vault
 */
export async function vaultUpdate(
  itemId: string,
  data: any
): Promise<void> {
  const encrypted = encryptJSON(data);
  
  const { error } = await supabaseServer
    .from('pii_vault')
    .update({
      data_key_encrypted: encrypted.dataKeyEnc,
      iv: encrypted.iv,
      tag: encrypted.tag,
      ciphertext: encrypted.ciphertext,
      updated_at: new Date().toISOString(),
    })
    .eq('id', itemId);

  if (error) {
    throw new Error(`Failed to update vault item: ${error.message}`);
  }
}
