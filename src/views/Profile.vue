<script setup>
/**
 * ===========================================
 * PROFILE VIEW
 * Trang hồ sơ cá nhân
 * ===========================================
 */
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const authStore = useAuthStore()

const form = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  bio: authStore.user?.bio || ''
})

const isEditing = ref(false)
const isLoading = ref(false)
const message = ref({ type: '', text: '' })

const handleSave = async () => {
  isLoading.value = true
  message.value = { type: '', text: '' }

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    authStore.updateProfile(form.value)
    message.value = { type: 'success', text: 'Cập nhật hồ sơ thành công!' }
    isEditing.value = false
  } catch (error) {
    message.value = { type: 'error', text: 'Có lỗi xảy ra!' }
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  form.value = {
    name: authStore.user?.name || '',
    email: authStore.user?.email || '',
    bio: authStore.user?.bio || ''
  }
  isEditing.value = false
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold text-slate-800 mb-8">Hồ sơ cá nhân</h1>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <!-- Header -->
      <div class="relative h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div class="absolute -bottom-12 left-8">
          <div class="relative">
            <img 
              :src="authStore.userAvatar" 
              :alt="authStore.userName"
              class="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover"
            />
            <button class="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow hover:bg-indigo-700 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="pt-16 p-8">
        <BaseAlert v-if="message.text" :type="message.type" class="mb-6">
          {{ message.text }}
        </BaseAlert>

        <form @submit.prevent="handleSave" class="space-y-6">
          <BaseInput
            v-model="form.name"
            label="Họ và tên"
            placeholder="Nhập họ và tên"
            :disabled="!isEditing"
          />

          <BaseInput
            v-model="form.email"
            type="email"
            label="Email"
            placeholder="Nhập email"
            disabled
          />

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Giới thiệu</label>
            <textarea
              v-model="form.bio"
              rows="4"
              :disabled="!isEditing"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none disabled:bg-slate-50 disabled:text-slate-500"
              placeholder="Viết vài dòng giới thiệu về bản thân..."
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-4 pt-4">
            <template v-if="isEditing">
              <BaseButton type="submit" :loading="isLoading">
                Lưu thay đổi
              </BaseButton>
              <BaseButton type="button" variant="outline" @click="handleCancel">
                Hủy
              </BaseButton>
            </template>
            <template v-else>
              <BaseButton type="button" @click="isEditing = true">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Chỉnh sửa
              </BaseButton>
            </template>
          </div>
        </form>
      </div>
    </div>

    <!-- Account Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <div class="bg-white rounded-2xl p-6 border border-slate-100">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-800">12</p>
            <p class="text-slate-500 text-sm">Bài viết</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 border border-slate-100">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-800">2.5K</p>
            <p class="text-slate-500 text-sm">Lượt xem</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 border border-slate-100">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-800">156</p>
            <p class="text-slate-500 text-sm">Yêu thích</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
