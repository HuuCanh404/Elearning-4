<script setup>
/**
 * ===========================================
 * BASE INPUT COMPONENT
 * Component input dùng chung
 * ===========================================
 */
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: [String, Array],
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: null
  },
  dark: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const errorMessage = computed(() => {
  if (Array.isArray(props.error)) return props.error[0]
  return props.error
})

const inputClasses = computed(() => {
  const base = 'w-full px-4 py-3 rounded-xl border outline-none transition-all'
  const padding = props.icon ? 'pl-10' : ''
  
  if (props.dark) {
    return `${base} ${padding} bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 disabled:opacity-50`
  }
  
  return `${base} ${padding} border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-500`
})

const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <div>
    <label v-if="label" :class="['block text-sm font-medium mb-2', dark ? 'text-white/80' : 'text-slate-700']">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <!-- Icon -->
      <div v-if="icon" :class="['absolute left-3 top-1/2 -translate-y-1/2', dark ? 'text-white/40' : 'text-slate-400']">
        <!-- Email Icon -->
        <svg v-if="icon === 'email'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <!-- Lock Icon -->
        <svg v-else-if="icon === 'lock'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <!-- User Icon -->
        <svg v-else-if="icon === 'user'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <!-- Search Icon -->
        <svg v-else-if="icon === 'search'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
      />

      <!-- Suffix Slot -->
      <div v-if="$slots.suffix" class="absolute right-3 top-1/2 -translate-y-1/2">
        <slot name="suffix" />
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" class="text-red-500 text-sm mt-1">
      {{ errorMessage }}
    </p>
  </div>
</template>
