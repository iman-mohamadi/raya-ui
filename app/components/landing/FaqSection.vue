<script setup lang="ts">
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

const faqs = [
  {
    question: "What is Raya UI?",
    answer: "Raya UI is a collection of re-usable components built using Vue 3 and Tailwind CSS. It is not a component library you install via npm, but rather a set of components you can copy and paste into your own projects."
  },
  {
    question: "Is it free to use?",
    answer: "Yes, Raya UI is completely free and open source. You can use it in both personal and commercial projects."
  },
  {
    question: "Do I need to install it as a dependency?",
    answer: "No. The philosophy is 'copy and paste'. This gives you full control over the code. You simply copy the component file into your project and customize it as needed."
  },
  {
    question: "Which framework does it support?",
    answer: "It is designed for Vue 3. It works perfectly with Nuxt 3 as well."
  },
  {
    question: "Does it support Dark Mode?",
    answer: "Yes! All components are styled with Tailwind CSS and support dark mode out of the box using standard Tailwind utility classes."
  }
]

// Generate JSON-LD Schema for Google Rich Snippets
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
}

// Inject schema into <head>
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(jsonLd)
    }
  ]
})
</script>

<template>
  <section class="container mx-auto px-4 py-24 max-w-3xl">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Frequently Asked Questions
      </h2>
      <p class="mt-4 text-lg text-muted-foreground">
        Everything you need to know about Raya UI.
      </p>
    </div>

    <Accordion type="single" collapsible class="w-full">
      <AccordionItem v-for="(item, index) in faqs" :key="index" :value="`item-${index}`">
        <AccordionTrigger class="text-left text-base">
          {{ item.question }}
        </AccordionTrigger>
        <AccordionContent class="text-base leading-relaxed">
          {{ item.answer }}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </section>
</template>