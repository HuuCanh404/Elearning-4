<script setup>
/**
 * ===========================================
 * REGISTER VIEW
 * Trang đăng ký
 * ===========================================
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const errors = ref({})
const showPassword = ref(false)
const errorMessage = ref('')

const isValid = computed(() => {
  return form.value.name && 
         form.value.email && 
         form.value.password && 
         form.value.password_confirmation &&
         form.value.password === form.value.password_confirmation
})

const handleSubmit = async () => {
  errors.value = {}
  errorMessage.value = ''

  if (form.value.password !== form.value.password_confirmation) {
    errors.value.password_confirmation = ['Mật khẩu không khớp']
    return
  }

  const result = await authStore.register(form.value)

  if (result.success) {
    router.push('/')
  } else {
    errorMessage.value = result.message
    errors.value = result.errors || {}
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-white text-center mb-2">Đăng ký</h2>
    <p class="text-white/60 text-center mb-8">Tạo tài khoản mới để bắt đầu</p>

    <BaseAlert v-if="errorMessage" type="error" class="mb-6">
      {{ errorMessage }}
    </BaseAlert>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <BaseInput
        v-model="form.name"
        type="text"
        label="Họ và tên"
        placeholder="Nguyễn Văn A"
        :error="errors.name"
        icon="user"
        dark
      />

      <BaseInput
        v-model="form.email"
        type="email"
        label="Email"
        placeholder="example@email.com"
        :error="errors.email"
        icon="email"
        dark
      />

      <BaseInput
        v-model="form.password"
        :type="showPassword ? 'text' : 'password'"
        label="Mật khẩu"
        placeholder="••••••••"
        :error="errors.password"
        icon="lock"
        dark
      >
        <template #suffix>
          <button 
            type="button"
            @click="showPassword = !showPassword"
            class="text-white/50 hover:text-white transition-colors"
          >
            <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </template>
      </BaseInput>

      <BaseInput
        v-model="form.password_confirmation"
        :type="showPassword ? 'text' : 'password'"
        label="Xác nhận mật khẩu"
        placeholder="••••••••"
        :error="errors.password_confirmation"
        icon="lock"
        dark
      />

      <BaseButton
        type="submit"
        :loading="authStore.isLoading"
        :disabled="!isValid"
        class="w-full"
        size="lg"
      >
        Đăng ký
      </BaseButton>
    </form>

    <div class="mt-8 text-center">
      <span class="text-white/60">Đã có tài khoản? </span>
      <router-link to="/auth/login" class="text-indigo-300 hover:text-indigo-200 font-medium transition-colors">
        Đăng nhập
      </router-link>
    </div>
  </div>
</template>
