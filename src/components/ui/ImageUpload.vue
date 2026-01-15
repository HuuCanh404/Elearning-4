<script setup>
/**
 * ===========================================
 * IMAGE UPLOAD COMPONENT
 * Component upload ảnh
 * ===========================================
 */
import { ref, computed } from 'vue'
import { useBlogStore } from '@/store/blog'
import { UPLOAD_CONFIG } from '@/config/env'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'uploaded'])

const blogStore = useBlogStore()
const isDragging = ref(false)
const errorMessage = ref('')

const previewUrl = computed(() => props.modelValue)

const validateFile = (file) => {
  // Check file type
  if (!UPLOAD_CONFIG.allowedFileTypes.includes(file.type)) {
    return 'Chỉ hỗ trợ định dạng: JPG, PNG, GIF, WebP'
  }
  
  // Check file size
  if (file.size > UPLOAD_CONFIG.maxFileSize) {
    const maxSizeMB = UPLOAD_CONFIG.maxFileSize / (1024 * 1024)
    return `Kích thước file tối đa ${maxSizeMB}MB`
  }
  
  return null
}

const handleFile = async (file) => {
  errorMessage.value = ''
  
  const error = validateFile(file)
  if (error) {
    errorMessage.value = error
    return
  }
  
  // Upload file
  const result = await blogStore.uploadImage(file)
  
  if (result.success) {
    emit('update:modelValue', result.data.url)
    emit('uploaded', result.data.url)
  } else {
    errorMessage.value = result.message || 'Upload thất bại'
  }
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) handleFile(file)
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) handleFile(file)
}

const removeImage = () => {
  emit('update:modelValue', '')
}
</script>

<template>
  <div>
    <!-- Preview -->
    <div v-if="previewUrl" class="relative w-full h-48 rounded-xl overflow-hidden group">
      <img :src="previewUrl" alt="Preview" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button 
          type="button"
          @click="removeImage"
          class="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
        >
          <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Xóa ảnh
        </button>
      </div>
    </div>

    <!-- Upload Area -->
    <div 
      v-else
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'relative w-full h-48 rounded-xl border-2 border-dashed transition-all cursor-pointer',
        isDragging 
          ? 'border-indigo-500 bg-indigo-50' 
          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
      ]"
    >
      <input 
        type="file" 
        accept="image/*"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        @change="handleFileSelect"
      />
      
      <div class="flex flex-col items-center justify-center h-full">
        <!-- Loading -->
        <div v-if="blogStore.isUploading" class="text-center">
          <svg class="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p class="text-sm text-slate-600">Đang tải lên... {{ blogStore.uploadProgress }}%</p>
        </div>
        
        <!-- Default -->
        <template v-else>
          <svg class="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-sm text-slate-600 mb-1">
            <span class="text-indigo-600 font-medium">Nhấp để tải lên</span> hoặc kéo thả
          </p>
          <p class="text-xs text-slate-400">PNG, JPG, GIF, WebP (tối đa 5MB)</p>
        </template>
      </div>
    </div>

    <!-- Error -->
    <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
  </div>
</template>
