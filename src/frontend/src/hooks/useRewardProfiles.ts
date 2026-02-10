import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { RewardPoints, RedemptionOption } from '@/backend';
import { toast } from 'sonner';

export function useRewardProfiles() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RewardPoints[]>({
    queryKey: ['rewardProfiles'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRewardProfiles();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddRewardProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ balance, options }: { balance: bigint; options: RedemptionOption[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addRewardProfile(balance, options);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardProfiles'] });
      toast.success('Reward program added successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to add reward program: ' + error.message);
    },
  });
}

export function useAddRedemptionOption() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rewardId, option }: { rewardId: bigint; option: RedemptionOption }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addRedemptionOption(rewardId, option);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardProfiles'] });
      toast.success('Redemption option added successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to add redemption option: ' + error.message);
    },
  });
}
