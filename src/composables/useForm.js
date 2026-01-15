/**
 * ===========================================
 * USE FORM COMPOSABLE
 * Custom hook cho form handling
 * ===========================================
 */

import { ref, reactive, computed } from 'vue'

export function useForm(initialValues = {}, validationRules = {}) {
  // Form data
  const form = reactive({ ...initialValues })
  
  // Form state
  const errors = ref({})
  const touched = ref({})
  const isSubmitting = ref(false)
  const isValidating = ref(false)

  // Computed
  const isDirty = computed(() => {
    return Object.keys(initialValues).some(key => form[key] !== initialValues[key])
  })

  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })

  const hasErrors = computed(() => {
    return Object.keys(errors.value).length > 0
  })

  // Validation functions
  const validators = {
    required: (value, message = 'Trường này là bắt buộc') => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return message
      }
      return null
    },
    
    email: (value, message = 'Email không hợp lệ') => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value && !emailRegex.test(value)) {
        return message
      }
      return null
    },
    
    minLength: (value, min, message) => {
      if (value && value.length < min) {
        return message || `Tối thiểu ${min} ký tự`
      }
      return null
    },
    
    maxLength: (value, max, message) => {
      if (value && value.length > max) {
        return message || `Tối đa ${max} ký tự`
      }
      return null
    },
    
    match: (value, targetValue, message = 'Giá trị không khớp') => {
      if (value !== targetValue) {
        return message
      }
      return null
    },
    
    pattern: (value, regex, message = 'Định dạng không hợp lệ') => {
      if (value && !regex.test(value)) {
        return message
      }
      return null
    }
  }

  // Validate single field
  const validateField = (field) => {
    const rules = validationRules[field]
    if (!rules) return null

    for (const rule of rules) {
      let error = null
      
      if (typeof rule === 'string') {
        // Simple rule: 'required', 'email'
        error = validators[rule]?.(form[field])
      } else if (typeof rule === 'object') {
        // Rule with options: { type: 'minLength', value: 6, message: 'Custom message' }
        const { type, value, message, target } = rule
        if (type === 'match') {
          error = validators.match(form[field], form[target], message)
        } else if (validators[type]) {
          error = validators[type](form[field], value, message)
        }
      } else if (typeof rule === 'function') {
        // Custom validator function
        error = rule(form[field], form)
      }

      if (error) {
        return error
      }
    }

    return null
  }

  // Validate all fields
  const validate = () => {
    isValidating.value = true
    const newErrors = {}

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field)
      if (error) {
        newErrors[field] = error
      }
    })

    errors.value = newErrors
    isValidating.value = false

    return Object.keys(newErrors).length === 0
  }

  // Set field value
  const setFieldValue = (field, value) => {
    form[field] = value
    touched.value[field] = true
    
    // Validate on change
    const error = validateField(field)
    if (error) {
      errors.value[field] = error
    } else {
      delete errors.value[field]
    }
  }

  // Set field error
  const setFieldError = (field, error) => {
    if (error) {
      errors.value[field] = error
    } else {
      delete errors.value[field]
    }
  }

  // Set multiple errors
  const setErrors = (fieldErrors) => {
    errors.value = { ...errors.value, ...fieldErrors }
  }

  // Clear errors
  const clearErrors = () => {
    errors.value = {}
  }

  // Reset form
  const reset = () => {
    Object.keys(initialValues).forEach(key => {
      form[key] = initialValues[key]
    })
    errors.value = {}
    touched.value = {}
    isSubmitting.value = false
  }

  // Handle submit
  const handleSubmit = async (submitFn) => {
    if (!validate()) {
      return { success: false, errors: errors.value }
    }

    isSubmitting.value = true
    
    try {
      const result = await submitFn(form)
      return result
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors)
      }
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    // Form data
    form,
    // State
    errors,
    touched,
    isSubmitting,
    isValidating,
    isDirty,
    isValid,
    hasErrors,
    // Methods
    validate,
    validateField,
    setFieldValue,
    setFieldError,
    setErrors,
    clearErrors,
    reset,
    handleSubmit,
    // Validators
    validators
  }
}

export default useForm
