<script setup lang="ts">
import { PartitionBar, PartitionBarSegment, PartitionBarSegmentTitle, PartitionBarSegmentValue } from '@/components/ui/partition-bar'
</script>

<template>
  <div class="flex items-center justify-center min-h-[200px] w-full px-4 py-10">
    <div class="w-full max-w-lg">
      <PartitionBar>
        <PartitionBarSegment :num="30">
          <PartitionBarSegmentTitle>Docs</PartitionBarSegmentTitle>
          <PartitionBarSegmentValue>30%</PartitionBarSegmentValue>
        </PartitionBarSegment>
        <PartitionBarSegment :num="15" variant="secondary">
          <PartitionBarSegmentTitle>Images</PartitionBarSegmentTitle>
          <PartitionBarSegmentValue>15%</PartitionBarSegmentValue>
        </PartitionBarSegment>
        <PartitionBarSegment :num="55" variant="muted">
          <PartitionBarSegmentTitle>Other</PartitionBarSegmentTitle>
          <PartitionBarSegmentValue>55%</PartitionBarSegmentValue>
        </PartitionBarSegment>
      </PartitionBar>
    </div>
  </div>
</template>