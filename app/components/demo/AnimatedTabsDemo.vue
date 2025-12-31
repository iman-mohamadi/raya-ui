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
  <div class="flex flex-col justify-center items-center px-5 overflow-hidden">
    <div class="w-full h-fit">
      <AnimatedTabs :items="manyItems" :content="false" />
    </div>
  </div>
</template>