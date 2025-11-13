import './PasswordStrength.css';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

interface PasswordStrengthProps {
  password: string;
  show?: boolean;
}

const requirements: PasswordRequirement[] = [
  { label: 'Al menos 6 caracteres', test: (pwd) => pwd.length >= 6 },
  { label: 'Contiene una letra mayúscula', test: (pwd) => /[A-Z]/.test(pwd) },
  { label: 'Contiene una letra minúscula', test: (pwd) => /[a-z]/.test(pwd) },
  { label: 'Contiene un número', test: (pwd) => /\d/.test(pwd) },
];

export default function PasswordStrength({ password, show = true }: PasswordStrengthProps) {
  if (!show || !password) return null;

  const metRequirements = requirements.filter(req => req.test(password));
  const strength = (metRequirements.length / requirements.length) * 100;

  return (
    <div className="password-strength">
      <div className="strength-bar-container">
        <div
          className={`strength-bar ${strength < 50 ? 'weak' : strength < 75 ? 'medium' : 'strong'
            }`}
          style={{ width: `${strength}%` }}
        />
      </div>
      <div className="requirements-list">
        {requirements.map((req, index) => (
          <div
            key={index}
            className={`requirement-item ${req.test(password) ? 'met' : ''}`}
          >
            {req.label}
          </div>
        ))}
      </div>
    </div>
  );
}
