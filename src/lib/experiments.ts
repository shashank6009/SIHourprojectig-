import { supabaseServer } from './supabase-server';
import { hashUserId } from './privacy';

export type ExperimentVariant = 'A' | 'B' | 'C';

export interface Experiment {
  id: string;
  key: string;
  variant: ExperimentVariant;
  trafficSplit: number;
  status: 'active' | 'paused' | 'completed';
  targetMetric: string;
}

/**
 * Assign a user to an experiment variant
 * Uses weighted random selection based on traffic split
 */
export async function assignVariant(userHash: string, experimentKey: string): Promise<ExperimentVariant> {
  try {
    // Check if user already has an assignment
    const { data: existingAssignment } = await supabaseServer
      .from('resume_experiment_assignments')
      .select('variant')
      .eq('user_hash', userHash)
      .eq('experiment_id', experimentKey)
      .single();

    if (existingAssignment) {
      return existingAssignment.variant as ExperimentVariant;
    }

    // Get active experiment
    const { data: experiment, error: experimentError } = await supabaseServer
      .from('resume_experiments')
      .select('*')
      .eq('key', experimentKey)
      .eq('status', 'active')
      .single();

    if (experimentError || !experiment) {
      // No active experiment, return default variant
      return 'A';
    }

    // Weighted random selection
    const random = Math.random();
    let cumulativeWeight = 0;
    let selectedVariant: ExperimentVariant = 'A';

    // Get all variants for this experiment
    const { data: variants } = await supabaseServer
      .from('resume_experiments')
      .select('*')
      .eq('key', experimentKey)
      .eq('status', 'active')
      .order('variant');

    if (variants && variants.length > 0) {
      for (const variant of variants) {
        cumulativeWeight += variant.traffic_split;
        if (random <= cumulativeWeight) {
          selectedVariant = variant.variant as ExperimentVariant;
          break;
        }
      }
    }

    // Record assignment
    await supabaseServer
      .from('resume_experiment_assignments')
      .insert({
        experiment_id: experiment.id,
        user_hash: userHash,
        variant: selectedVariant,
      });

    return selectedVariant;

  } catch (error) {
    console.error('Experiment assignment error:', error);
    return 'A'; // Default fallback
  }
}

/**
 * Get user's experiment assignment
 */
export async function getUserVariant(userHash: string, experimentKey: string): Promise<ExperimentVariant | null> {
  try {
    const { data: assignment } = await supabaseServer
      .from('resume_experiment_assignments')
      .select('variant')
      .eq('user_hash', userHash)
      .eq('experiment_id', experimentKey)
      .single();

    return assignment?.variant as ExperimentVariant || null;
  } catch (error) {
    console.error('Error getting user variant:', error);
    return null;
  }
}

/**
 * Create a new experiment
 */
export async function createExperiment(args: {
  key: string;
  variants: Array<{ variant: ExperimentVariant; trafficSplit: number }>;
  targetMetric: string;
}): Promise<boolean> {
  try {
    const { key, variants, targetMetric } = args;

    // Validate traffic splits sum to 1
    const totalSplit = variants.reduce((sum, v) => sum + v.trafficSplit, 0);
    if (Math.abs(totalSplit - 1) > 0.01) {
      throw new Error('Traffic splits must sum to 1');
    }

    // Create experiment records for each variant
    for (const variant of variants) {
      const { error } = await supabaseServer
        .from('resume_experiments')
        .insert({
          key,
          variant: variant.variant,
          traffic_split: variant.trafficSplit,
          target_metric: targetMetric,
          status: 'active',
        });

      if (error) {
        throw error;
      }
    }

    return true;
  } catch (error) {
    console.error('Error creating experiment:', error);
    return false;
  }
}

/**
 * Get experiment results
 */
export async function getExperimentResults(experimentKey: string): Promise<any[]> {
  try {
    const { data: results, error } = await supabaseServer
      .from('resume_experiments')
      .select(`
        *,
        resume_experiment_assignments(count)
      `)
      .eq('key', experimentKey);

    if (error) {
      throw error;
    }

    return results || [];
  } catch (error) {
    console.error('Error getting experiment results:', error);
    return [];
  }
}

/**
 * Wrapper function to run code with experiment context
 */
export async function withExperiment<T>(
  userId: string,
  experimentKey: string,
  variants: {
    A: () => Promise<T>;
    B: () => Promise<T>;
    C: () => Promise<T>;
  }
): Promise<{ result: T; variant: ExperimentVariant; experimentKey: string }> {
  const userHash = hashUserId(userId);
  const variant = await assignVariant(userHash, experimentKey);
  
  let result: T;
  switch (variant) {
    case 'B':
      result = await variants.B();
      break;
    case 'C':
      result = await variants.C();
      break;
    case 'A':
    default:
      result = await variants.A();
      break;
  }

  return {
    result,
    variant,
    experimentKey,
  };
}
