// ========== TIPOS ==========

export type ValidationRule<T = string> = {
  validate: (value: T, ...args: unknown[]) => boolean;
  message: string | ((value: T, ...args: unknown[]) => string);
};

export type ValidationResult = {
  isValid: boolean;
  error: string;
};

export type FieldValidators = {
  [key: string]: ValidationRule[];
};

// ========== CONSTANTES ==========

export const VALIDATION_MESSAGES = {
  required: "Este campo es obligatorio",
  email: {
    invalid: "El correo electrónico no es válido",
    required: "Introduce tu correo electrónico",
  },
  password: {
    minLength: (min: number) =>
      `La contraseña debe tener al menos ${min} caracteres`,
    required: "Introduce tu contraseña",
    mismatch: "Las contraseñas no coinciden",
    weak: "La contraseña es demasiado débil",
  },
  name: {
    minLength: (min: number) =>
      `El nombre debe tener al menos ${min} caracteres`,
    required: "Introduce tu nombre",
    invalid: "El nombre solo puede contener letras y espacios",
  },
} as const;

// ========== EXPRESIONES REGULARES ==========

export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  nameAlpha: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
} as const;

// ========== VALIDADORES BASE ==========

// Valida que un campo no esté vacío
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Valida formato de correo electrónico
export const isValidEmail = (email: string): boolean => {
  return REGEX.email.test(email.trim());
};

// Valida longitud mínima de contraseña
export const isValidPassword = (password: string, minLength = 6): boolean => {
  return password.length >= minLength;
};

// Valida que la contraseña sea fuerte (mayúscula, minúscula, número, 8+ caracteres)
export const isStrongPassword = (password: string): boolean => {
  return REGEX.strongPassword.test(password);
};

// Valida que dos contraseñas coincidan
export const doPasswordsMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  // Ambas deben tener contenido y ser iguales
  return (
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword
  );
};

// Valida nombre con longitud mínima
export const isValidName = (name: string, minLength = 3): boolean => {
  const trimmed = name.trim();
  return trimmed.length >= minLength && REGEX.nameAlpha.test(trimmed);
};

// Valida longitud mínima de un string
export const hasMinLength = (value: string, min: number): boolean => {
  return value.trim().length >= min;
};

// Valida longitud máxima de un string
export const hasMaxLength = (value: string, max: number): boolean => {
  return value.trim().length <= max;
};

// ========== VALIDADORES DE FORMULARIO ==========

// Valida un campo con múltiples reglas y retorna el primer error encontrado
export const validateField = (
  value: string,
  rules: ValidationRule[]
): ValidationResult => {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return {
        isValid: false,
        error:
          typeof rule.message === "function"
            ? rule.message(value)
            : rule.message,
      };
    }
  }
  return { isValid: true, error: "" };
};

// Valida todos los campos de un formulario
export const validateForm = <T extends Record<string, string>>(
  formData: T,
  validators: FieldValidators
): Record<keyof T, string> => {
  const errors = {} as Record<keyof T, string>;

  for (const [field, rules] of Object.entries(validators)) {
    const value = formData[field as keyof T];
    const result = validateField(value, rules);
    if (!result.isValid) {
      errors[field as keyof T] = result.error;
    }
  }

  return errors;
};

// ========== REGLAS DE VALIDACIÓN PREDEFINIDAS ==========

export const VALIDATION_RULES = {
  email: [
    {
      validate: isRequired,
      message: VALIDATION_MESSAGES.email.required,
    },
    {
      validate: isValidEmail,
      message: VALIDATION_MESSAGES.email.invalid,
    },
  ] as ValidationRule[],

  password: (minLength = 6): ValidationRule[] => [
    {
      validate: isRequired,
      message: VALIDATION_MESSAGES.password.required,
    },
    {
      validate: (value: string) => isValidPassword(value, minLength),
      message: VALIDATION_MESSAGES.password.minLength(minLength),
    },
  ],

  confirmPassword: (originalPassword: string): ValidationRule[] => [
    {
      validate: isRequired,
      message: "Confirma tu contraseña",
    },
    {
      validate: (value: string) => {
        // Si el campo está vacío, lo maneja isRequired
        if (!value) return false;
        // Validar que coincida con la contraseña original
        return doPasswordsMatch(originalPassword, value);
      },
      message: VALIDATION_MESSAGES.password.mismatch,
    },
  ],

  name: (minLength = 3): ValidationRule[] => [
    {
      validate: isRequired,
      message: VALIDATION_MESSAGES.name.required,
    },
    {
      validate: (value: string) => hasMinLength(value, minLength),
      message: VALIDATION_MESSAGES.name.minLength(minLength),
    },
    {
      validate: (value: string) => REGEX.nameAlpha.test(value.trim()),
      message: VALIDATION_MESSAGES.name.invalid,
    },
  ],
};

// ========== HELPERS ==========

// Limpia y normaliza un email
export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

// Limpia y normaliza el nombre
export const sanitizeName = (name: string): string => {
  return name.trim().replace(/\s+/g, " ");
};
