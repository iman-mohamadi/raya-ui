<script setup lang="ts">
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import {Archive, Bell, Calendar, Lock, Mail, MessageCircle, Settings, Star, Trash, User} from "lucide-vue-next";

const manyItems = [
  { label: 'Account', icon: User },
  { label: 'Password', icon: Lock },
  { label: 'Notifications', icon: Bell },
  { label: 'Settings', icon: Settings },
  { label: 'Messages', icon: MessageCircle },
  { label: 'Inbox', icon: Mail },
  { label: 'Calendar', icon: Calendar },
  { label: 'Favorites', icon: Star },
  { label: 'Archive', icon: Archive },
  { label: 'Trash', icon: Trash }
]
</script>

<template>
  <div class="flex flex-col justify-center items-center px-2 sm:px-5 w-full h-full overflow-hidden">
    <div class="w-full max-w-full overflow-x-auto no-scrollbar">
      <div class="min-w-max">
        <AnimatedTabs :items="manyItems" :content="false" />
      </div>
    </div>
  </div>
</template>